import assert from "node:assert/strict";
import vm from "node:vm";
import { afterEach, test } from "node:test";
import {
  cartLinesToGaItems,
  ecommerceParams,
  gaMeasurementId,
  GTAG_LOAD_TIMEOUT_MS,
  gtagBootstrapSource,
  gtagDeferredLoaderSource,
  shouldShowAnalyticsNote,
  textMentionsAnalyticsOrCookies,
  toGaItem,
  trackCheckoutClick,
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
        transport_type?: string;
        event_callback?: unknown;
      },
    };
  });
}

function ecommerceEvents() {
  return queuedEvents().filter((event) => event.command === "event");
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
  assert.equal(trackCheckoutClick([item]), false);
  assert.deepEqual(queuedEvents(), []);
});

test("events queue on dataLayer when the measurement id is set", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = MEASUREMENT_ID;
  installWindow();

  assert.equal(trackEcommerce("view_item", [item]), true);
  assert.equal(trackEcommerce("add_to_cart", [item]), true);
  assert.equal(trackEcommerce("view_cart", []), true);
  assert.equal(trackEcommerce("checkout_click", []), false);
  assert.equal(trackCheckoutClick([]), false);

  const events = ecommerceEvents();
  assert.deepEqual(
    events.map((event) => event.name),
    ["view_item", "add_to_cart", "view_cart"],
  );
  for (const event of events) {
    assert.equal(event.command, "event");
    assert.equal(event.params.currency, "USD");
    assert.equal(JSON.stringify(event.params).includes("@"), false);
    assert.equal("transport_type" in event.params, false);
  }
  assert.equal(events[2]?.params.items?.length, 0);

  const queued = queuedEvents();
  assert.deepEqual(
    queued.map((event) => event.command),
    ["js", "config", "event", "event", "event"],
  );
  assert.ok(queued[0]?.name instanceof Date);
  assert.equal(queued[1]?.name, MEASUREMENT_ID);
  assert.equal(queued.filter((event) => event.command === "config").length, 1);
});

test("checkout_click queues beacon params and does not navigate", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = MEASUREMENT_ID;
  const win = installWindow() as {
    location?: { href?: string; assign?: (url: string) => void };
  };
  let assigned = 0;
  win.location = {
    href: "https://www.balcoffee.com/cart",
    assign: () => {
      assigned += 1;
    },
  };

  assert.equal(trackCheckoutClick([item]), true);
  assert.equal(assigned, 0);
  assert.equal(win.location.href, "https://www.balcoffee.com/cart");

  const event = ecommerceEvents().find(
    (queued) => queued.name === "checkout_click",
  );
  assert.equal(event?.command, "event");
  assert.equal(event?.name, "checkout_click");
  assert.equal(event?.params.currency, "USD");
  assert.equal(event?.params.value, 27);
  assert.equal(event?.params.transport_type, "beacon");
  assert.equal(event?.params.event_callback, undefined);
  assert.deepEqual(event?.params.items, [item]);
  assert.equal(JSON.stringify(event?.params).includes("@"), false);
  const names = queuedEvents().map((queued) => queued.name);
  assert.equal(names.includes("begin_checkout"), false);
  assert.equal(names.includes("purchase"), false);
  assert.ok(
    queuedEvents().findIndex((queued) => queued.command === "config") <
      queuedEvents().findIndex((queued) => queued.name === "checkout_click"),
  );
});

test("bootstrap config is not repeated when an event is queued", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = MEASUREMENT_ID;
  const win = installWindow();
  vm.runInNewContext(gtagBootstrapSource(MEASUREMENT_ID), { window: win });
  assert.equal(trackEcommerce("view_item", [item]), true);
  assert.equal(trackEcommerce("add_to_cart", [item]), true);
  assert.equal(trackCheckoutClick([item]), true);

  const queued = queuedEvents();
  assert.deepEqual(
    queued.map((event) => event.command),
    ["js", "config", "event", "event", "event"],
  );
  assert.equal(queued[1]?.name, MEASUREMENT_ID);
  assert.deepEqual(
    ecommerceEvents().map((event) => event.name),
    ["view_item", "add_to_cart", "checkout_click"],
  );
  const checkout = ecommerceEvents().find(
    (event) => event.name === "checkout_click",
  );
  assert.equal(checkout?.params.transport_type, "beacon");
  assert.equal(checkout?.params.currency, "USD");
  assert.equal(
    queued.some(
      (event) => event.name === "begin_checkout" || event.name === "purchase",
    ),
    false,
  );
});

test("checkout_click is a no-op before the document exists", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = MEASUREMENT_ID;
  delete (globalThis as { window?: unknown }).window;
  assert.equal(trackCheckoutClick([item]), false);
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

type FakeScript = { id: string; async: boolean; src: string };

function installLoaderWindow(existingScriptId?: string) {
  const scripts: FakeScript[] = existingScriptId
    ? [
        {
          id: existingScriptId,
          async: true,
          src: "https://example.com/existing.js",
        },
      ]
    : [];
  const listeners: Record<string, Array<() => void>> = {};
  const timers: Array<{ fn: () => void; ms: number }> = [];
  const head = {
    appendChild(el: FakeScript) {
      scripts.push(el);
      return el;
    },
  };
  const win = {
    __balGaLoaderScheduled: undefined as true | undefined,
    setTimeout(fn: () => void, ms: number) {
      timers.push({ fn, ms });
      return timers.length;
    },
    addEventListener(type: string, fn: () => void) {
      (listeners[type] ??= []).push(fn);
    },
    document: {
      getElementById(id: string) {
        return scripts.find((script) => script.id === id) ?? null;
      },
      createElement(tag: string) {
        if (tag !== "script") throw new Error(`unexpected tag ${tag}`);
        return { id: "", async: false, src: "" } as FakeScript;
      },
      head,
      documentElement: head,
    },
  };
  return { win, scripts, listeners, timers };
}

function runLoader(
  win: ReturnType<typeof installLoaderWindow>["win"],
  id = MEASUREMENT_ID,
) {
  vm.runInNewContext(gtagDeferredLoaderSource(id), {
    window: win,
    document: win.document,
  });
}

test("deferred loader does not fetch gtag.js until interaction or timeout", () => {
  const { win, scripts, listeners, timers } = installLoaderWindow();
  runLoader(win);
  assert.equal(scripts.length, 0);
  assert.equal(timers.length, 1);
  assert.equal(timers[0]?.ms, GTAG_LOAD_TIMEOUT_MS);
  assert.equal(GTAG_LOAD_TIMEOUT_MS, 3000);
  for (const type of ["pointerdown", "keydown", "touchstart", "scroll"]) {
    assert.equal(listeners[type]?.length, 1);
  }
});

test("deferred loader injects gtag.js once on first interaction", () => {
  const { win, scripts, listeners, timers } = installLoaderWindow();
  runLoader(win);
  listeners.pointerdown?.[0]?.();
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0]?.id, "_next-ga");
  assert.equal(scripts[0]?.async, true);
  assert.equal(
    scripts[0]?.src,
    `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`,
  );
  listeners.keydown?.[0]?.();
  timers[0]?.fn();
  assert.equal(scripts.length, 1);
});

test("deferred loader injects gtag.js once when the timeout fires", () => {
  const { win, scripts, timers } = installLoaderWindow();
  runLoader(win);
  timers[0]?.fn();
  timers[0]?.fn();
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0]?.id, "_next-ga");
});

test("deferred loader is a no-op when gtag.js is already in the document", () => {
  const { win, scripts, timers } = installLoaderWindow("_next-ga");
  runLoader(win);
  timers[0]?.fn();
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0]?.src, "https://example.com/existing.js");
});

test("deferred loader can be included twice without a second fetch", () => {
  const { win, scripts, timers } = installLoaderWindow();
  runLoader(win);
  runLoader(win);
  assert.equal(timers.length, 1);
  timers[0]?.fn();
  assert.equal(scripts.length, 1);
});

test("deferred loader rejects an invalid measurement id", () => {
  assert.throws(() => gtagDeferredLoaderSource("GTM-ABC123"));
});

test("events still queue after bootstrap when the library has not loaded", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = MEASUREMENT_ID;
  const { win } = installLoaderWindow();
  const dataLayer: unknown[] = [];
  Object.assign(win, { dataLayer });
  (globalThis as { window?: unknown }).window = win;
  vm.runInNewContext(gtagBootstrapSource(MEASUREMENT_ID), { window: win });
  runLoader(win);
  assert.equal(trackEcommerce("add_to_cart", [item]), true);
  const queued = queuedEvents();
  assert.deepEqual(
    queued.map((event) => event.command),
    ["js", "config", "event"],
  );
  assert.equal(queued[2]?.name, "add_to_cart");
});
