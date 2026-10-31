import { test, expect, type Page } from "@playwright/test";

/**
 * Prepared café drinks are event/POS only. They must not be reachable, linked,
 * listed, or indexed on the public storefront. Bagged coffee and checkout stay.
 */

const drinkPaths = [
  "/products/caramel-glow",
  "/products/pistachio",
  "/products/brown-sugar",
  "/products/honey-iced-lattee",
] as const;

const drinkTitles = [
  "Caramel Glow",
  "Pistachio Caramel",
  "Brown Sugar",
  "Honey Iced lattee",
] as const;

async function expectNoDrinkLinks(page: Page) {
  await expect(page.locator('a[href="/drinks"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/drinks"]')).toHaveCount(0);
  for (const path of drinkPaths) {
    await expect(page.locator(`a[href="${path}"]`)).toHaveCount(0);
  }
  await expect(
    page.getByRole("link", { name: "Drinks", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Café drinks", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator("#drinks")).toHaveCount(0);
}

test("/drinks returns 404", async ({ page }) => {
  const response = await page.goto("/drinks");
  expect(response?.status()).toBe(404);
});

for (const path of drinkPaths) {
  test(`${path} returns 404 without product JSON-LD`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    const jsonLd = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).join("\n");
    expect(jsonLd).not.toContain('"@type":"Product"');
    expect(jsonLd).not.toContain('"@type": "Product"');
    for (const title of drinkTitles) {
      expect(jsonLd).not.toContain(title);
    }
  });
}

test("nav and footer have no drinks links", async ({ page }) => {
  for (const path of ["/", "/products", "/cart"]) {
    await page.goto(path);
    await expectNoDrinkLinks(page);
    const jsonLd = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).join("\n");
    for (const title of drinkTitles) {
      expect(jsonLd).not.toContain(title);
      await expect(page.getByText(title, { exact: true })).toHaveCount(0);
    }
    await expect(
      page.getByRole("heading", { name: "Café drinks" }),
    ).toHaveCount(0);
  }
});

test("sitemap has no drink URLs and still lists coffee", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  expect(xml).not.toMatch(/\/drinks(?:<|\/)/);
  for (const path of drinkPaths) {
    expect(xml).not.toContain(path);
  }
  for (const title of drinkTitles) {
    expect(xml).not.toContain(title);
  }
  expect(xml).toContain("/products/datespresso");
  expect(xml).toContain("/products/groundate");
  expect(xml).toContain("/products/eastern-brew");
});

test("coffee products still render", async ({ page }) => {
  const listing = await page.goto("/products");
  expect(listing?.ok()).toBeTruthy();
  await expect(
    page.getByRole("heading", { name: "Shop date seed coffee", level: 1 }),
  ).toBeVisible();
  for (const name of ["DateSpresso", "GrounDate", "Eastern Brew"]) {
    await expect(page.getByText(name, { exact: false }).first()).toBeVisible();
  }

  const pdp = await page.goto("/products/datespresso");
  expect(pdp?.ok()).toBeTruthy();
  await expect(page.locator("h1")).toContainText("DateSpresso");
  await expect(
    page.getByRole("button", { name: /add to cart/i }).first(),
  ).toBeVisible();
  await expect(page.getByText("(842 reviews)")).toHaveCount(0);
});
