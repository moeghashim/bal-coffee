import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page, type Request } from "@playwright/test";

/**
 * Regression: view_item used to be pushed onto dataLayer before gtag('js') and
 * gtag('config'), and gtag.js then never sent it to /g/collect.
 */

const GA_ID = "G-5DJRRRRNKC";
const PRODUCT_PATH = "/products/datespresso";

type CollectHit = {
  method: string;
  url: string;
  postData: string;
};

type ParsedItem = {
  item_id?: string;
  item_name?: string;
  price?: string;
  currency?: string;
};

type ParsedEvent = {
  en: string;
  tid: string;
  currency?: string;
  item?: ParsedItem;
};

const collects: CollectHit[] = [];

const ITEM_PREFIXES: { field: keyof ParsedItem | string; prefix: string }[] = [
  { field: "item_category5", prefix: "c5" },
  { field: "item_category4", prefix: "c4" },
  { field: "item_category3", prefix: "c3" },
  { field: "item_category2", prefix: "c2" },
  { field: "item_list_name", prefix: "ln" },
  { field: "item_list_id", prefix: "li" },
  { field: "item_category", prefix: "ca" },
  { field: "item_variant", prefix: "va" },
  { field: "item_brand", prefix: "br" },
  { field: "item_name", prefix: "nm" },
  { field: "item_id", prefix: "id" },
  { field: "promotion_name", prefix: "pn" },
  { field: "promotion_id", prefix: "pi" },
  { field: "creative_name", prefix: "cn" },
  { field: "creative_slot", prefix: "cs" },
  { field: "location_id", prefix: "lo" },
  { field: "affiliation", prefix: "af" },
  { field: "discount", prefix: "ds" },
  { field: "quantity", prefix: "qt" },
  { field: "coupon", prefix: "cp" },
  { field: "currency", prefix: "cu" },
  { field: "price", prefix: "pr" },
  { field: "index", prefix: "lp" },
].sort((a, b) => b.prefix.length - a.prefix.length);

function parseProduct(raw: string): ParsedItem {
  const item: ParsedItem = {};
  for (const part of raw.split("~")) {
    const match = ITEM_PREFIXES.find((entry) => part.startsWith(entry.prefix));
    if (!match) continue;
    const value = part.slice(match.prefix.length);
    if (
      match.field === "item_id" ||
      match.field === "item_name" ||
      match.field === "price" ||
      match.field === "currency"
    ) {
      item[match.field] = value;
    }
  }
  return item;
}

function paramLists(hit: CollectHit): URLSearchParams[] {
  const lists = [new URL(hit.url).searchParams];
  if (hit.postData) lists.push(new URLSearchParams(hit.postData));
  return lists;
}

function valuesFor(hit: CollectHit, key: string): string[] {
  const values: string[] = [];
  for (const params of paramLists(hit)) {
    values.push(...params.getAll(key));
  }
  return values;
}

function parseHit(hit: CollectHit): ParsedEvent[] {
  const ens = valuesFor(hit, "en");
  const tids = valuesFor(hit, "tid");
  const currencies = valuesFor(hit, "cu");
  const products = valuesFor(hit, "pr1");
  return ens.map((en, index) => ({
    en,
    tid: tids[0] ?? "",
    currency: currencies[index] ?? currencies[0],
    item: products[index]
      ? parseProduct(products[index])
      : products.length === 1
        ? parseProduct(products[0] ?? "")
        : undefined,
  }));
}

function viewItemEvents(hits: CollectHit[]) {
  const events: { hit: CollectHit; event: ParsedEvent }[] = [];
  for (const hit of hits) {
    for (const event of parseHit(hit)) {
      if (event.en === "view_item") events.push({ hit, event });
    }
  }
  return events;
}

function recordCollect(request: Request) {
  const url = request.url();
  if (!url.includes("/g/collect")) return;
  collects.push({
    method: request.method(),
    url,
    postData: request.postData() ?? "",
  });
}

async function dataLayerSnapshot(page: Page) {
  return page.evaluate(() => {
    const layer = window.dataLayer ?? [];
    return layer.map((entry) => {
      const command = entry as { 0?: unknown; 1?: unknown; 2?: unknown };
      const name = command[1];
      return {
        command: command[0] ?? null,
        name:
          name instanceof Date
            ? "Date"
            : typeof name === "string" || typeof name === "number"
              ? name
              : null,
        params: command[0] === "event" ? (command[2] ?? null) : null,
      };
    });
  });
}

function writeEvidence(dir: string, extra: Record<string, unknown>) {
  fs.mkdirSync(dir, { recursive: true });
  const events = viewItemEvents(collects);
  const lines = collects.map((hit, index) => {
    const parsed = parseHit(hit)
      .map((event) => `${event.en} tid=${event.tid} cu=${event.currency ?? ""}`)
      .join(", ");
    return [
      `#${index + 1} ${hit.method}`,
      hit.url,
      hit.postData ? `body: ${hit.postData}` : "body: (empty)",
      `parsed: ${parsed || "(no en)"}`,
    ].join("\n");
  });
  fs.writeFileSync(
    path.join(dir, "g-collect.txt"),
    lines.join("\n\n") || "(no g/collect requests)\n",
  );
  fs.writeFileSync(
    path.join(dir, "g-collect.json"),
    JSON.stringify(
      { collects, viewItem: events.map((entry) => entry.event) },
      null,
      2,
    ),
  );
  const har = {
    log: {
      version: "1.2",
      creator: { name: "bal-coffee-view-item-regression", version: "1" },
      entries: collects.map((hit) => ({
        startedDateTime: new Date().toISOString(),
        request: {
          method: hit.method,
          url: hit.url,
          httpVersion: "HTTP/1.1",
          headers: [],
          queryString: [...new URL(hit.url).searchParams.entries()].map(
            ([name, value]) => ({ name, value }),
          ),
          postData: hit.postData
            ? { mimeType: "text/plain", text: hit.postData }
            : undefined,
          headersSize: -1,
          bodySize: hit.postData.length,
        },
        response: {
          status: 204,
          statusText: "No Content",
          httpVersion: "HTTP/1.1",
          headers: [],
          content: { size: 0, mimeType: "text/plain" },
          redirectURL: "",
          headersSize: -1,
          bodySize: 0,
        },
        cache: {},
        timings: { wait: 0, receive: 0 },
      })),
    },
  };
  fs.writeFileSync(
    path.join(dir, "g-collect.har"),
    JSON.stringify(har, null, 2),
  );
  fs.writeFileSync(
    path.join(dir, "summary.json"),
    JSON.stringify(
      {
        measurementId: GA_ID,
        collectCount: collects.length,
        viewItemCount: events.length,
        viewItem: events.map((entry) => entry.event),
        ...extra,
      },
      null,
      2,
    ),
  );
}

test.beforeEach(() => {
  collects.length = 0;
});

test.afterEach(async ({ page }) => {
  const dir = process.env.GA_EVIDENCE_DIR;
  if (!dir) return;
  let layer: unknown = null;
  try {
    layer = await dataLayerSnapshot(page);
  } catch {
    layer = null;
  }
  writeEvidence(dir, { dataLayer: layer });
});

test("product page sends exactly one view_item g/collect hit", async ({
  page,
}) => {
  await page.route(/\/g\/collect/i, (route) =>
    route.fulfill({ status: 204, body: "" }),
  );
  page.on("request", recordCollect);

  const response = await page.goto(PRODUCT_PATH);
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("h1")).toBeVisible();

  // The header nav also has spans (cart count). The breadcrumb in the product
  // section is the name sent as item_name.
  const productName = (
    await page
      .locator(".bal-product-detail-section nav span")
      .last()
      .innerText()
  ).trim();
  const priceText = (await page.locator("h1 + p").innerText()).trim();
  const price = Number(priceText.replace(/[^0-9.]/g, ""));
  expect(productName.length).toBeGreaterThan(0);
  expect(price).toBeGreaterThan(0);
  await expect(page.locator("h1")).toContainText(productName);

  // Related-product cards lower on the page have their own merchandise inputs.
  const itemId = page
    .locator(".bal-product-detail-section")
    .locator('input[name="merchandiseId"]');
  await expect(itemId).toHaveCount(1);
  await expect(itemId).not.toHaveValue("");
  const expectedItemId = await itemId.inputValue();
  expect(expectedItemId).toMatch(/^gid:\/\/shopify\/ProductVariant\//);

  await expect
    .poll(() => viewItemEvents(collects).length, { timeout: 20_000 })
    .toBe(1);
  // A second effect tick or a late duplicate must not add another hit.
  await page.waitForTimeout(1_000);
  const viewed = viewItemEvents(collects);
  expect(viewed).toHaveLength(1);

  const event = viewed[0]?.event;
  const hitUrl = viewed[0]?.hit.url ?? "";
  expect(hitUrl).toMatch(
    /^https:\/\/(?:www\.google-analytics\.com|analytics\.google\.com|region\d+\.(?:google-analytics|analytics\.google)\.com)\/g\/collect\?/,
  );
  expect(event?.en).toBe("view_item");
  expect(event?.tid).toBe(GA_ID);
  expect(event?.currency).toBe("USD");
  expect(event?.item?.item_id).toBe(expectedItemId);
  expect(event?.item?.item_name).toBe(productName);
  expect(Number(event?.item?.price)).toBe(price);
});
