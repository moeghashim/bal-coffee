import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isAllowedCheckoutUrl } from "./event/checkout-url.ts";
import { EVENT_DRINK_COPY, presentEventDrink } from "./event/copy.ts";
import {
  formatEventCartLine,
  formatEventDrinkLine,
  mergePaidOrder,
  parseShopifyPaidOrder,
  readySmsBody,
  type EventOrderDraft,
} from "./event/orders.ts";
import { lineAttributes } from "./event/temperature.ts";
import { formatUsPhone, normalizeFirstName, toUsE164 } from "./event/phone.ts";
import { MemoryEventStore } from "./event/store-memory.ts";

const draft: EventOrderDraft = {
  id: "1001",
  number: "1042",
  name: "Ada",
  phone: "+17135551212",
  consent: true,
  drinks: [{ title: "Caramel Glow", variant: "Oat", quantity: 2 }],
  ref: "evt_abcdefghijklmnopqrstuv",
  createdAt: "2026-11-14T18:00:00.000Z",
};

test("US phones normalize to E.164", () => {
  assert.equal(toUsE164("(713) 555-1212"), "+17135551212");
  assert.equal(toUsE164("713-555-1212"), "+17135551212");
  assert.equal(toUsE164("1 713 555 1212"), "+17135551212");
  assert.equal(toUsE164("+1 713 555 1212"), "+17135551212");
  assert.equal(toUsE164("555-1212"), null);
  assert.equal(toUsE164("0135551212"), null);
  assert.equal(toUsE164("+447911123456"), null);
  assert.equal(formatUsPhone("+17135551212"), "+1 (713) 555-1212");
});

test("first names stay short and human", () => {
  assert.equal(normalizeFirstName("  Ada  "), "Ada");
  assert.equal(normalizeFirstName("Mary Ann"), "Mary Ann");
  assert.equal(normalizeFirstName("O'Brien"), "O'Brien");
  assert.equal(normalizeFirstName(""), null);
  assert.equal(normalizeFirstName("Ada1"), null);
});

test("ready text matches the pickup template", () => {
  assert.equal(
    readySmsBody("Ada", "1042"),
    "Hi Ada, your BAL Coffee order #1042 is ready for pickup!",
  );
  const sanitized = readySmsBody("Ada\nhttp://evil.test", "#1042");
  assert.equal(sanitized.includes("\n"), false);
  assert.match(
    sanitized,
    /^Hi Ada httpevil\.test, your BAL Coffee order #1042 is ready for pickup!$/,
  );
});

test("paid webhook keeps event orders and drops the rest", () => {
  const paid = parseShopifyPaidOrder({
    id: 1001,
    name: "#1042",
    order_number: 1042,
    financial_status: "paid",
    created_at: "2026-11-14T18:00:00.000Z",
    note_attributes: [
      { name: "order_source", value: "event" },
      { name: "customer_name", value: "Ada" },
      { name: "customer_phone", value: "(713) 555-1212" },
      { name: "sms_consent", value: "yes" },
      { name: "event_ref", value: "evt_abcdefghijklmnopqrstuv" },
    ],
    line_items: [{ title: "Caramel Glow", quantity: 2, variant_title: "Oat" }],
  });
  assert.equal(paid?.phone, "+17135551212");
  assert.equal(paid?.consent, true);
  assert.equal(paid?.number, "1042");
  assert.equal(paid?.drinks[0]?.variant, "Oat");
  assert.equal(paid?.drinks[0]?.temperature, undefined);

  assert.equal(
    parseShopifyPaidOrder({
      id: 1002,
      name: "#1043",
      financial_status: "paid",
      line_items: [{ title: "DateSpresso", quantity: 1 }],
    }),
    null,
  );
  assert.equal(
    parseShopifyPaidOrder({
      id: 1003,
      name: "#1044",
      financial_status: "refunded",
      note_attributes: [{ name: "order_source", value: "event" }],
    }),
    null,
  );
});

test("a replay does not rewind a ready order", () => {
  const ready = mergePaidOrder(
    {
      ...draft,
      status: "ready",
      smsSent: true,
      smsSid: "SM123",
      updatedAt: draft.createdAt,
    },
    { ...draft, consent: false, name: "Ada" },
    "2026-11-14T18:05:00.000Z",
  );
  assert.equal(ready.status, "ready");
  assert.equal(ready.smsSent, true);
  assert.equal(ready.consent, true);
});

test("ready sends once", async () => {
  const store = new MemoryEventStore();
  await store.savePaid(draft);
  const first = await store.claimSms(draft.id);
  assert.equal(first.state, "send");
  const second = await store.claimSms(draft.id);
  assert.equal(second.state, "busy");
  await store.completeSms(draft.id, "SM123");
  const third = await store.claimSms(draft.id);
  assert.equal(third.state, "done");
  const order = await store.getById(draft.id);
  assert.equal(order?.status, "ready");
  assert.equal(order?.smsSent, true);

  await store.failSms("missing", "nope");
  const failed = new MemoryEventStore();
  await failed.savePaid(draft);
  await failed.claimSms(draft.id);
  await failed.failSms(draft.id, "Twilio is not configured");
  const retry = await failed.claimSms(draft.id);
  assert.equal(retry.state, "send");
});

test("making does not override ready, and no-consent ready does not text", async () => {
  const store = new MemoryEventStore();
  await store.savePaid({ ...draft, consent: false });
  await store.markMaking(draft.id);
  const done = await store.markReadyWithoutSms(draft.id, "no_consent");
  assert.equal(done?.smsSent, false);
  assert.equal(done?.status, "ready");
  const making = await store.markMaking(draft.id);
  assert.equal(making?.status, "ready");
  const listed = await store.list();
  assert.deepEqual(
    listed.map((order) => order.number),
    ["1042"],
  );
});

test("event drink copy and customizations stay on the order", () => {
  const honey = presentEventDrink({
    name: "Honey Iced lattee",
    shopifyHandle: "honey-iced-lattee",
    description: "Shopify description",
  });
  assert.equal(honey.name, "Honey Iced Latte");
  assert.equal(
    honey.description,
    EVENT_DRINK_COPY["honey-iced-lattee"].description,
  );
  assert.equal(honey.imageSrc, "/event/honey-iced-lattee.jpg");

  const unknown = presentEventDrink({
    name: "Hot Latte",
    shopifyHandle: "hot-latte",
    description: "  From the counter.  ",
  });
  assert.equal(unknown.name, "Hot Latte");
  assert.equal(unknown.description, "From the counter.");
  assert.equal(unknown.imageSrc, undefined);
  assert.doesNotMatch(
    readFileSync(new URL("./event/menu.ts", import.meta.url), "utf8"),
    /product\.images|imageUrl/,
  );
  assert.equal(
    presentEventDrink({
      name: "Pistachio",
      shopifyHandle: "pistachio",
      description: "unused",
    }).name,
    "Pistachio Caramel",
  );

  assert.equal(
    formatEventCartLine({
      quantity: 1,
      title: "Brown Sugar",
      milk: "Oat milk",
      temperature: "Iced",
      ice: "Less ice",
      sweetness: "Regular",
    }),
    "1 × Brown Sugar — Oat milk · Iced · Less ice",
  );
  assert.equal(
    formatEventDrinkLine({
      title: "Brown Sugar",
      variant: "Oat milk",
      temperature: "Iced",
      ice: "Regular ice",
      sweetness: "Regular",
      quantity: 1,
    }),
    "1 × Brown Sugar · Oat milk · Iced",
  );
  assert.equal(
    formatEventDrinkLine({
      title: "Brown Sugar",
      variant: "Oat milk",
      temperature: "Iced",
      ice: "Less ice",
      sweetness: "More sweet",
      quantity: 1,
    }),
    "1 × Brown Sugar · Oat milk · Iced · Less ice · More sweet",
  );
  assert.equal(
    formatEventDrinkLine({
      title: "Pistachio Caramel",
      variant: "Oat milk",
      temperature: "Hot",
      sweetness: "Less sweet",
      quantity: 2,
    }),
    "2 × Pistachio Caramel · Oat milk · Hot · Less sweet",
  );

  const paid = parseShopifyPaidOrder({
    id: 1003,
    name: "#1044",
    financial_status: "paid",
    note_attributes: [{ name: "order_source", value: "event" }],
    line_items: [
      {
        title: "Brown Sugar",
        quantity: 1,
        variant_title: "Oat milk",
        properties: [
          { name: "Temperature", value: "Iced" },
          { name: "Ice", value: "Less ice" },
          { name: "Sweetness", value: "More sweet" },
        ],
      },
      {
        title: "Pistachio Caramel",
        quantity: 1,
        variant_title: "Oat milk",
        properties: [
          { name: "Temperature", value: "Hot" },
          { name: "Ice", value: "Less ice" },
          { name: "Sweetness", value: "Regular" },
        ],
      },
    ],
  });
  assert.equal(
    paid ? formatEventDrinkLine(paid.drinks[0]) : "",
    "1 × Brown Sugar · Oat milk · Iced · Less ice · More sweet",
  );
  assert.equal(paid?.drinks[1]?.ice, undefined);
  assert.equal(paid?.drinks[1]?.sweetness, "Regular");
  assert.equal(
    paid ? formatEventDrinkLine(paid.drinks[1]) : "",
    "1 × Pistachio Caramel · Oat milk · Hot",
  );

  assert.deepEqual(
    lineAttributes({
      temperature: "Iced",
      ice: "Less ice",
      sweetness: "More sweet",
    }),
    [
      { key: "Temperature", value: "Iced" },
      { key: "Ice", value: "Less ice" },
      { key: "Sweetness", value: "More sweet" },
    ],
  );
  assert.deepEqual(
    lineAttributes({ temperature: "Hot", sweetness: "Regular" }).map(
      (attribute) => attribute.key,
    ),
    ["Temperature", "Sweetness"],
  );
});

test("checkout urls stay on Shopify hosts", () => {
  assert.equal(
    isAllowedCheckoutUrl(
      "https://balcoffee-store.myshopify.com/cart/c/abc?key=def",
    ),
    true,
  );
  assert.equal(
    isAllowedCheckoutUrl("https://checkout.balcoffee.com/cart/c/abc"),
    true,
  );
  assert.equal(isAllowedCheckoutUrl("https://evil.example/cart"), false);
  assert.equal(isAllowedCheckoutUrl("http://balcoffee.com/cart/c/abc"), false);
});

test("event pages make no health, organic, or free-shipping claims", () => {
  const files = [
    "app/event/page.tsx",
    "app/event/order/page.tsx",
    "app/event/board/page.tsx",
    "components/event/menu.tsx",
    "components/event/order-status.tsx",
    "components/event/board.tsx",
    "components/event/event-frame.tsx",
    "lib/event/copy.ts",
  ];
  const copy = files
    .map((file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8"))
    .join("\n");
  const honey =
    "A DateSpresso shot with organic honey and organic milk. Served iced, or hot if you prefer.";
  assert.equal(copy.includes(honey), true);
  assert.doesNotMatch(
    copy.replaceAll(honey, ""),
    /\borganic\b|free shipping|best seller|prebiotic|digestion|\bgut\b|pregnan|blood sugar|antioxidant|\bvegan\b|weight loss|cholesterol/i,
  );
  assert.match(copy, /Text me when my order is ready/);
  assert.match(copy, /href="\/terms"/);
  assert.match(copy, /href="\/privacy"/);
  assert.match(copy, /Naturally caffeine-free, roasted in Houston/);
  assert.match(copy, /You can add a tip at checkout/);
  assert.match(copy, /We recommend iced\. Hot is available too\./);
  assert.match(
    readFileSync(new URL("../components/bal/nav.tsx", import.meta.url), "utf8"),
    /\/products/,
  );
  assert.doesNotMatch(
    readFileSync(new URL("../components/bal/nav.tsx", import.meta.url), "utf8"),
    /\/event/,
  );
  assert.doesNotMatch(
    readFileSync(
      new URL("../components/bal/footer.tsx", import.meta.url),
      "utf8",
    ),
    /\/event/,
  );
});
