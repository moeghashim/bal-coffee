import { test, expect } from "@playwright/test";

/**
 * Static / editorial render coverage. These pages must keep rendering
 * identically through the Hydrogen migration (they don't depend on the
 * commerce data layer, so a regression here means something structural broke).
 */

test("homepage renders with nav and hero", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/Bal/);
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
