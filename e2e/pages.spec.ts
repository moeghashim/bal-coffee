import { test, expect } from "@playwright/test";

const pages = [
  ["/about", "Rooted in heritage"],
  ["/faq", "BAL Coffee FAQ"],
  ["/shipping", "Shipping & delivery"],
  ["/returns", "Returns & exchanges"],
  ["/contact", "Say hello"],
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Service"],
] as const;

for (const [path, heading] of pages) {
  test(`${path} renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      heading,
    );
  });
}

test("footer points at real pages and hides unknown socials", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Privacy Policy" }),
  ).toHaveAttribute("href", "/privacy");
  await expect(
    page.getByRole("link", { name: "Terms of Service" }),
  ).toHaveAttribute("href", "/terms");
  await expect(page.getByRole("link", { name: "FAQ" })).toHaveAttribute(
    "href",
    "/faq",
  );
  await expect(
    page.getByRole("link", { name: "Shipping & Delivery" }),
  ).toHaveAttribute("href", "/shipping");
  await expect(
    page.getByRole("link", { name: "Returns & Exchanges" }),
  ).toHaveAttribute("href", "/returns");
  await expect(page.getByRole("link", { name: "Contact Us" })).toHaveAttribute(
    "href",
    "/contact",
  );
  await expect(
    page.getByRole("link", { name: "Our Story", exact: true }),
  ).toHaveAttribute("href", "/about");
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:judy@balcoffee.com",
  );
  await expect(page.getByRole("link", { name: "Instagram" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "TikTok" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Facebook" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Drinks" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Café drinks" })).toHaveCount(0);
  await expect(page.getByText(/© \d{4} BAL Coffee/)).toBeVisible();
  await expect(page.getByText("© 2024")).toHaveCount(0);
  await expect(page.getByText(/15% off/i)).toHaveCount(0);
  await expect(page.getByText(/subscribe and save/i)).toHaveCount(0);
});

const freeShippingRoutes = [
  "/",
  "/products",
  "/date-seed-coffee",
  "/products/datespresso",
  "/products/groundate",
  "/products/eastern-brew",
  "/faq",
  "/shipping",
  "/returns",
  "/about",
  "/contact",
  "/cart",
  "/journal",
] as const;

test("no page claims free shipping", async ({ page }) => {
  for (const route of freeShippingRoutes) {
    const response = await page.goto(route);
    expect(response?.ok(), route).toBeTruthy();
    const html = await page.content();
    expect(html, route).not.toMatch(/free shipping/i);
    expect(html, route).not.toMatch(/unlocked free/i);
    expect(html, route).not.toMatch(/shipping over \$50/i);
  }
});

test("date seed coffee landing page is indexable", async ({
  page,
  request,
}) => {
  const response = await page.goto("/date-seed-coffee");
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(
    "Date Seed Coffee: Caffeine-Free Brew from Date Pits | BAL",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Date seed coffee is brewed from roasted date seeds, also called date pits. Naturally caffeine-free and acid-free, with no coffee beans. Find your brew.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/date-seed-coffee$/,
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Date seed coffee: a caffeine-free cup roasted from date seeds",
  );
  await expect(
    page.getByRole("link", { name: "DateSpresso, for espresso" }).first(),
  ).toHaveAttribute("href", "/products/datespresso");
  await expect(
    page
      .getByRole("link", { name: "GrounDate, for drip and French press" })
      .first(),
  ).toHaveAttribute("href", "/products/groundate");
  await expect(
    page
      .getByRole("link", { name: "Eastern Brew, for a Turkish-style cup" })
      .first(),
  ).toHaveAttribute("href", "/products/eastern-brew");
  await expect(page.getByText("18 to 20 grams for two shots")).toBeVisible();
  await expect(page.getByText(/what our customers say/i)).toHaveCount(0);
  await expect(page.getByText(/\borganic\b/i)).toHaveCount(0);
  await expect(page.getByText(/best seller/i)).toHaveCount(0);
  await expect(page.getByText(/free shipping/i)).toHaveCount(0);
  const jsonLd = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join("\n");
  expect(jsonLd).toContain('"@type":"WebPage"');
  expect(jsonLd).toContain('"@type":"BreadcrumbList"');
  expect(jsonLd).toContain('"@type":"ItemList"');
  expect(jsonLd).toContain('"@type":"FAQPage"');
  expect(jsonLd).toContain("/date-seed-coffee#webpage");
  expect(jsonLd).toContain("/products/datespresso");
  expect(jsonLd).toContain("/products/groundate");
  expect(jsonLd).toContain("/products/eastern-brew");
  expect(jsonLd).not.toContain('"@type":"Product"');
  expect(jsonLd).not.toContain("aggregateRating");
  expect(jsonLd).not.toContain("AggregateRating");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("/date-seed-coffee");
});

test("café drinks stay hidden", async ({ page }) => {
  const response = await page.goto("/drinks");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Page not found",
  );
  await expect(page.getByRole("link", { name: "Drinks" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Café drinks" })).toHaveCount(0);
});

test("product page does not offer a fake subscription", async ({ page }) => {
  await page.goto("/products/datespresso");
  await expect(page.getByText(/subscribe & save/i)).toHaveCount(0);
  await expect(page.getByText(/free shipping/i)).toHaveCount(0);
  await expect(
    page.getByText(/shipping is calculated at checkout/i).first(),
  ).toBeVisible();
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", /\/products\/datespresso$/);
  const jsonLd = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join("\n");
  expect(jsonLd).toContain('"@type":"Product"');
  expect(jsonLd).toContain('"@type":"Organization"');
  expect(jsonLd).not.toContain("aggregateRating");
  expect(jsonLd).not.toContain("842");
  await expect(page.getByText("842")).toHaveCount(0);
  await expect(page.getByText("Sarah M.")).toHaveCount(0);
  await expect(page.getByText("James L.")).toHaveCount(0);
  await expect(page.getByText("Priya K.")).toHaveCount(0);
  await expect(page.getByText(/what our customers say/i)).toHaveCount(0);
  await expect(page.getByText(/prebiotic/i)).toHaveCount(0);
  await expect(page.getByText(/gut health/i)).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Ingredients" }),
  ).toBeVisible();
  const image = page.locator("img[alt*='DateSpresso']").first();
  const width = Number(await image.getAttribute("width"));
  expect(width).toBeGreaterThan(0);
  expect(width).toBeLessThan(2000);
});
