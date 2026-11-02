import { expect, test, type Page } from "@playwright/test";

/**
 * Default dev server forces NEXT_PUBLIC_GA_MEASUREMENT_ID empty. The GA4 tag
 * and ecommerce queue must be absent so merging without the env var is a no-op.
 */

async function expectNoGa(page: Page) {
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);
  await expect(page.locator('script[id="_next-ga"]')).toHaveCount(0);
  await expect(page.locator('script[id="_next-ga-init"]')).toHaveCount(0);
  const queued = await page.evaluate(() => {
    const layer = window.dataLayer ?? [];
    return layer.some((entry) => {
      const command = entry as { 0?: unknown };
      return command[0] === "event";
    });
  });
  expect(queued).toBe(false);
}

test("GA4 is not loaded when the measurement id is unset", async ({ page }) => {
  const home = await page.goto("/");
  expect(home?.ok()).toBeTruthy();
  await expectNoGa(page);

  const privacy = await page.goto("/privacy");
  expect(privacy?.ok()).toBeTruthy();
  await expectNoGa(page);
  const shopifyPolicy = page.getByText(/through the use of cookies/i);
  if ((await shopifyPolicy.count()) > 0) {
    await expect(
      page.getByRole("heading", { name: "Analytics and cookies" }),
    ).toHaveCount(0);
  }

  const product = await page.goto("/products/datespresso");
  expect(product?.ok()).toBeTruthy();
  await expectNoGa(page);
});
