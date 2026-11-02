import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import {
  cartLinesToGaItems,
  ecommerceParams,
  gaMeasurementId,
  shouldShowAnalyticsNote,
  textMentionsAnalyticsOrCookies,
  toGaItem,
  trackBeginCheckout,
  trackEcommerce,
  type GaItem,
} from "./ga.ts";

const MEASUREMENT_ID = "G-TESTBAL01";

const item: GaItem = {
  item_id: "gid://shopify/ProductVariant/1",
  item_name: "DateSpresso",
  price: 27,
  quantity: 1,
  currency: "USD",
};

afterEach(() => {
  delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  delete (globalThis as { window?: unknown }).window;
  mock.timers.reset();
});

function installWindow() {
  const dataLayer: unknown[] = [];
  const win = {
    dataLayer,
    setTimeout: globalThis.setTimeout.bind(globalThis),
  };
  (globalThis as { window?: unknown }).window = win;
  return win;
}

function queuedEvents() {
  const dataLayer = (globalThis as { window?: { dataLayer?: unknown[] } })
    .window?.dataLayer;
  return (dataLayer ?? []).map((entry) => {
    const command = entry as { 0?: unknown; 1?: unknown; 2?: unknown };
    return {
      command: command[0],
      name: command[1],
      params: command[2] as {
        currency?: string;
        value?: number;
        items?: GaItem[];
      },
    };
  });
}

test("measurement id is absent unless the env var is a GA4 id", () => {
  delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  assert.equal(gaMeasurementId(), undefined);

  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "   ";
  assert.equal(gaMeasurementId(), undefined);

  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "GTM-ABC123";
  assert.equal(gaMeasurementId(), undefined);

  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-BAD ID";
  assert.equal(gaMeasurementId(), undefined);

  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = `  ${MEASUREMENT_ID}  `;
  assert.equal(gaMeasurementId(), MEASUREMENT_ID);
});

test("ecommerce items carry id, name, price, quantity, and USD", () => {
  assert.equal(toGaItem({ itemName: "DateSpresso", price: 27 }), null);
  assert.deepEqual(
    toGaItem({
      itemId: "variant-1",
      itemName: "DateSpresso",
      price: "27.005",
      quantity: 2,
    }),
    {
      item_id: "variant-1",
      item_name: "DateSpresso",
      price: 27.01,
      quantity: 2,
      currency: "USD",
    },
  );

  const params = ecommerceParams([
    {
      item_id: "variant-1",
      item_name: "DateSpresso",
      price: 27,
      quantity: 2,
      currency: "USD",
    },
  ]);
  assert.equal(params.currency, "USD");
  assert.equal(params.value, 54);
  assert.deepEqual(Object.keys(params).sort(), ["currency", "items", "value"]);
  assert.deepEqual(Object.keys(params.items[0] ?? {}).sort(), [
    "currency",
    "item_id",
    "item_name",
    "price",
    "quantity",
  ]);
});

test("cart lines map to items without customer fields", () => {
  const items = cartLinesToGaItems([
    {
      quantity: 2,
      merchandise: {
        id: "gid://shopify/ProductVariant/9",
        title: "Default Title",
        product: { id: "gid://shopify/Product/3", title: "GrounDate" },
      },
      cost: { amountPerQuantity: { amount: "24.00" } },
    },
    { quantity: 1, merchandise: { title: "Missing id" } },
  ]);
  assert.equal(items.length, 1);
  assert.equal(items[0]?.item_id, "gid://shopify/ProductVariant/9");
  assert.equal(items[0]?.item_name, "GrounDate");
  assert.equal(items[0]?.price, 24);
  assert.equal(items[0]?.quantity, 2);
  assert.equal(JSON.stringify(items).includes("@"), false);
});

test("events do not touch dataLayer when the measurement id is unset", () => {
  installWindow();
  assert.equal(trackEcommerce("view_item", [item]), false);
  assert.equal(trackEcommerce("add_to_cart", [item]), false);
  assert.equal(trackEcommerce("view_cart", []), false);
  let navigated = 0;
  assert.equal(
    trackBeginCheckout([item], () => {
      navigated += 1;
    }),
    false,
  );
  assert.equal(navigated, 0);
  assert.deepEqual(queuedEvents(), []);
});

test("events queue on dataLayer when the measurement id is set", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = MEASUREMENT_ID;
  installWindow();

  assert.equal(trackEcommerce("view_item", [item]), true);
  assert.equal(trackEcommerce("add_to_cart", [item]), true);
  assert.equal(trackEcommerce("view_cart", []), true);
  assert.equal(trackEcommerce("begin_checkout", []), false);

  const events = queuedEvents();
  assert.deepEqual(
    events.map((event) => event.name),
    ["view_item", "add_to_cart", "view_cart"],
  );
  for (const event of events) {
    assert.equal(event.command, "event");
    assert.equal(event.params.currency, "USD");
    assert.equal(JSON.stringify(event.params).includes("@"), false);
  }
  assert.equal(events[2]?.params.items?.length, 0);
});

test("begin_checkout still navigates if gtag.js never calls back", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = MEASUREMENT_ID;
  mock.timers.enable({ apis: ["setTimeout"] });
  installWindow();
  let navigated = 0;
  assert.equal(
    trackBeginCheckout([item], () => {
      navigated += 1;
    }),
    true,
  );
  assert.equal(navigated, 0);
  assert.equal(queuedEvents()[0]?.name, "begin_checkout");
  mock.timers.tick(549);
  assert.equal(navigated, 0);
  mock.timers.tick(1);
  assert.equal(navigated, 1);
  mock.timers.tick(1000);
  assert.equal(navigated, 1);
});

test("analytics note is added only when the policy never mentions it", () => {
  assert.equal(shouldShowAnalyticsNote(null), true);
  assert.equal(shouldShowAnalyticsNote("<p>How we handle an order.</p>"), true);
  assert.equal(
    textMentionsAnalyticsOrCookies(
      "through the use of cookies and similar technologies",
    ),
    true,
  );
  assert.equal(
    textMentionsAnalyticsOrCookies("payment processing, data analytics"),
    true,
  );
  assert.equal(
    shouldShowAnalyticsNote(
      "<p>through the use of cookies and similar technologies</p>",
    ),
    false,
  );
});
