import { test, expect } from "@playwright/test";

test("event menu is noindex and not linked from the shop", async ({
  page,
  request,
}) => {
  const response = await page.goto("/event");
  expect(response?.ok()).toBeTruthy();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Order a drink",
  );
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("content") ?? ""),
    );
  expect(robots.some((content) => /noindex/i.test(content))).toBeTruthy();
  expect(robots.some((content) => /nofollow/i.test(content))).toBeTruthy();
  const html = await page.content();
  expect(html).not.toMatch(/free shipping/i);
  expect(html).not.toMatch(/\borganic\b/i);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/event");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.goto("/");
  await expect(page.locator('a[href="/event"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/event/"]')).toHaveCount(0);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  expect(xml).not.toContain("/event</loc>");
  expect(xml).not.toContain("/event/");

  const robotsTxt = await request.get("/robots.txt");
  expect(robotsTxt.ok()).toBeTruthy();
  expect(await robotsTxt.text()).toMatch(/Disallow:\s*\/event/);
});

test("event APIs reject incomplete requests", async ({ request }) => {
  const checkout = await request.post("/api/event/checkout", { data: {} });
  expect(checkout.ok()).toBeFalsy();
  expect(checkout.status()).toBe(400);

  const status = await request.get("/api/event/order?ref=nope");
  expect(status.status()).toBe(400);

  const board = await request.get("/api/event/board/orders");
  expect(board.ok()).toBeFalsy();
  expect([401, 503]).toContain(board.status());
});

test("event board asks for the passcode and does not list orders", async ({
  page,
}) => {
  const response = await page.goto("/event/board");
  expect(response?.ok()).toBeTruthy();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Event board",
  );
  await expect(page.getByLabel("Passcode")).toBeVisible();
  await expect(page.getByText(/#\d+/)).toHaveCount(0);
  await page.getByLabel("Passcode").fill("not-the-code");
  await page.getByRole("button", { name: "Open the board" }).click();
  await expect(page.locator(".bal-event-error")).toContainText(/passcode/i);
  await expect(page.getByRole("list")).toHaveCount(0);
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("content") ?? "").join(" "),
    );
  expect(robots).toMatch(/noindex/i);
  expect(robots).toMatch(/nofollow/i);
});
