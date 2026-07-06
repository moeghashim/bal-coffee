// Production smoke test for the Bal Coffee storefront.
//
// Run against any host to confirm the storefront is healthy — especially right
// after the balcoffee.com DNS cutover (Phase 5 in shopify_checklist.md).
//
//   BASE_URL=https://bal-coffee.vercel.app node scripts/smoke.mjs
//   BASE_URL=https://balcoffee.com          node scripts/smoke.mjs   # after cutover
//
// Storefront-token checks (checkout host) run only when SHOPIFY_STORE_DOMAIN +
// SHOPIFY_STOREFRONT_ACCESS_TOKEN are in the environment.

const BASE = (process.env.BASE_URL || "https://bal-coffee.vercel.app").replace(
  /\/$/,
  "",
);
const A_PRODUCT = process.env.SMOKE_PRODUCT || "datespresso";

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const mark = ok ? "✓" : "✗";
  console.log(`${mark} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function status(path) {
  try {
    const res = await fetch(BASE + path, { redirect: "manual" });
    return res.status;
  } catch (error) {
    return `ERR ${error.message}`;
  }
}

async function check(name, path, wanted) {
  const code = await status(path);
  const ok = typeof wanted === "function" ? wanted(code) : code === wanted;
  record(name, ok, `${path} -> ${code}`);
}

async function checkoutHostCheck() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "");
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const variantId = process.env.SMOKE_VARIANT_ID;
  if (!domain || !token || !variantId) {
    record(
      "checkout host",
      true,
      "skipped (set SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, SMOKE_VARIANT_ID)",
    );
    return;
  }
  try {
    const res = await fetch(`https://${domain}/api/2025-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: `mutation { cartCreate(input: { lines: [{ merchandiseId: "${variantId}", quantity: 1 }] }) { cart { checkoutUrl } } }`,
      }),
    });
    const body = await res.json();
    const url = body?.data?.cartCreate?.cart?.checkoutUrl;
    const host = url ? new URL(url).host : null;
    // After cutover, checkout must live on a Shopify-served host — NOT the apex
    // that now points at Vercel.
    const ok = Boolean(host) && host !== new URL(BASE).host;
    record(
      "checkout host",
      ok,
      `${host} (must not equal ${new URL(BASE).host})`,
    );
  } catch (error) {
    record("checkout host", false, error.message);
  }
}

console.log(`\nSmoke test against ${BASE}\n`);

await check("homepage", "/", 200);
await check("products listing", "/products", 200);
await check(`PDP /products/${A_PRODUCT}`, `/products/${A_PRODUCT}`, 200);
await check("cart page", "/cart", 200);
await check("sitemap", "/sitemap.xml", 200);
await check("robots", "/robots.txt", 200);
await check("removed /pos is gone", "/pos", 404);
await check("Hydrogen cart route", "/api/cart", 200);
await check(
  "webhook rejects unsigned",
  "/api/shopify/webhooks",
  (c) => c === 401 || c === 405 || c === 500,
);
await checkoutHostCheck();

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed.`,
);
if (failed.length) {
  console.error(`FAILED: ${failed.map((r) => r.name).join(", ")}`);
  process.exit(1);
}
