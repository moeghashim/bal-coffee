import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isAllowedCheckoutUrl } from "./event/checkout-url.ts";
import {
  mergePaidOrder,
  parseShopifyPaidOrder,
  readySmsBody,
  type EventOrderDraft,
} from "./event/orders.ts";
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
  ];
  const copy = files
    .map((file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8"))
    .join("\n");
  assert.doesNotMatch(
    copy,
    /\borganic\b|free shipping|best seller|prebiotic|digestion|\bgut\b|pregnan|blood sugar|antioxidant|\bvegan\b|weight loss|cholesterol/i,
  );
  assert.match(copy, /Text me when my order is ready/);
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
