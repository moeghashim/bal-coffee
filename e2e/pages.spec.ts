import { test, expect } from "@playwright/test";

const pages = [
  ["/about", "Rooted in heritage"],
  ["/faq", "Frequently asked questions"],
  ["/shipping", "Shipping & delivery"],
  ["/returns", "Returns & exchanges"],
  ["/contact", "Say hello"],
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Service"],
  ["/drinks", "Café drinks"],
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
  await expect(page.getByRole("link", { name: "Our Story" })).toHaveAttribute(
    "href",
    "/about",
  );
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:judy@balcoffee.com",
  );
  await expect(page.getByRole("link", { name: "Instagram" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "TikTok" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Facebook" })).toHaveCount(0);
  await expect(page.getByText(/© \d{4} BAL Coffee/)).toBeVisible();
  await expect(page.getByText("© 2024")).toHaveCount(0);
  await expect(page.getByText(/15% off/i)).toHaveCount(0);
  await expect(page.getByText(/subscribe and save/i)).toHaveCount(0);
});

test("product page does not offer a fake subscription", async ({ page }) => {
  await page.goto("/products/datespresso");
  await expect(page.getByText(/subscribe & save/i)).toHaveCount(0);
  await expect(
    page.getByText(/free shipping on orders over \$50/i),
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
  const image = page.locator("img[alt*='DateSpresso']").first();
  const width = Number(await image.getAttribute("width"));
  expect(width).toBeGreaterThan(0);
  expect(width).toBeLessThan(2000);
});
