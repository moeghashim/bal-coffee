import { test, expect } from "@playwright/test";

/**
 * Static / editorial render coverage. These pages must keep rendering
 * identically through the Hydrogen migration (they don't depend on the
 * commerce data layer, so a regression here means something structural broke).
 */

test("homepage renders with nav and hero", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(
    "BAL Coffee | Caffeine-Free Coffee Alternative from Houston",
  );
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description).toBe(
    "BAL Coffee roasts date seeds into a naturally caffeine-free coffee alternative. Three brew styles in 12 oz bags, shipped from Houston across the US.",
  );
  expect(description?.length ?? 999).toBeLessThanOrEqual(155);
  await expect(page.locator("h1")).toContainText(
    "Roasted date seed coffee, naturally caffeine-free",
  );
  const evening = page.getByRole("heading", {
    level: 2,
    name: "The perfect end to your day",
  });
  await expect(evening).toBeVisible();
  expect(await evening.evaluate((el) => el.textContent ?? "")).toContain(
    "perfect end",
  );
  await expect(
    page.getByRole("link", { name: "What is date seed coffee?" }).first(),
  ).toHaveAttribute("href", "/date-seed-coffee");
  // Primary nav shop link is present
  await expect(page.getByRole("link", { name: "Shop" }).first()).toBeVisible();
});

const editorialRoutes = ["/journal", "/privacy", "/terms"];

for (const route of editorialRoutes) {
  test(`editorial route ${route} returns 200 and renders main`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
  });
}
