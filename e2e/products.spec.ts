import { test, expect } from "@playwright/test";

/**
 * Product listing + PDP render with LIVE Shopify Storefront data.
 * Products only render when Shopify returns imagery (see isStorefrontProduct in
 * lib/products.ts), so these assertions also prove the Storefront API path works
 * end-to-end — the exact path the migration swaps to Hydrogen's typed client.
 */

const productSlugs = ["datespresso", "groundate", "eastern-brew"] as const;
const productNames = ["DateSpresso", "GrounDate", "Eastern Brew"] as const;

test("the Shopify handle arabica resolves to the Eastern Brew URL", async ({
  page,
  request,
}) => {
  const redirect = await request.get("/products/arabica", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location ?? "").toMatch(
    /\/products\/eastern-brew$/,
  );
  const response = await page.goto("/products/arabica");
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/products\/eastern-brew$/);
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", /\/products\/eastern-brew$/);
});

test("products page lists the live catalog", async ({ page }) => {
  const response = await page.goto("/products");
  expect(response?.ok()).toBeTruthy();
  await expect(
    page.getByRole("heading", { name: "Shop date seed coffee", level: 1 }),
  ).toBeVisible();
  for (const name of productNames) {
    await expect(page.getByText(name, { exact: false }).first()).toBeVisible();
  }
});

for (const slug of productSlugs) {
  test(`PDP /products/${slug} renders name, price and add-to-cart`, async ({
    page,
  }) => {
    const response = await page.goto(`/products/${slug}`);
    expect(response?.ok()).toBeTruthy();
    // Name in the H1
    await expect(page.locator("h1")).toBeVisible();
    // A formatted price is present somewhere on the page
    await expect(page.getByText(/\$\d/).first()).toBeVisible();
    // Add-to-cart control is present
    await expect(
      page.getByRole("button", { name: /add to cart/i }).first(),
    ).toBeVisible();
  });
}
