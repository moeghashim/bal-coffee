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
    "A naturally caffeine-free coffee alternative roasted from 100% date seeds. Acid-free, no additives, three 12 oz bags. Shipped from Houston, TX.",
  );
  expect(description?.length ?? 999).toBeLessThanOrEqual(155);
  await expect(page.locator("h1")).toContainText(
    "Roasted date seed coffee, naturally caffeine-free",
  );
  await expect(
    page.getByRole("link", { name: "Shop the bags" }),
  ).toHaveAttribute("href", "#shop");
  await expect(
    page.getByRole("link", { name: "Try a 20g sample" }).first(),
  ).toHaveAttribute("href", "#sample");
  await expect(page.locator("body")).toContainText(
    "$9.99 for one bag, $12.99 for 2 or more",
  );
  await expect(
    page.getByRole("heading", { level: 2, name: "Same seeds. Three grinds." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Try a 20g sample first" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "The perfect end to your day",
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "What is date seed coffee?" }).first(),
  ).toHaveAttribute("href", "/date-seed-coffee");
  await expect(page.getByRole("link", { name: "Shop" }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Try a sample" }).first(),
  ).toHaveAttribute("href", "/#sample");
  await expect(page.getByText(/\borganic\b/i)).toHaveCount(0);
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
