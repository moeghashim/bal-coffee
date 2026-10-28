import { test, expect } from "@playwright/test";

/**
 * The critical revenue path: add-to-cart -> cart page -> Shopify-hosted checkout.
 * The migration MUST preserve every assertion here, especially that checkout
 * stays on a Shopify-owned host (we never build a custom checkout).
 */

test("empty cart shows the empty state", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByText(/your cart is empty/i)).toBeVisible();
});

test("add to cart succeeds and checkout points to Shopify", async ({
  page,
}) => {
  await page.goto("/products/datespresso");

  await page
    .getByRole("button", { name: /add to cart/i })
    .first()
    .click();

  // Server action confirms the line was added (aria-live message).
  await expect(page.getByText(/added to cart/i)).toBeVisible();

  await page.goto("/cart");

  // The line item is present and the cart is no longer empty.
  await expect(page.getByText(/your cart is empty/i)).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: /your cart/i, level: 1 }),
  ).toBeVisible();

  // Checkout link exists and targets a Shopify-hosted checkout host.
  const checkout = page.getByRole("link", { name: /proceed to checkout/i });
  await expect(checkout).toBeVisible();
  const href = await checkout.getAttribute("href");
  expect(href, "checkout href should exist").toBeTruthy();
  const checkoutUrl = new URL(href || "http://invalid");
  const shopifyHost =
    checkoutUrl.hostname === "checkout.balcoffee.com" ||
    checkoutUrl.hostname.endsWith(".myshopify.com") ||
    checkoutUrl.hostname.endsWith("shopify.com") ||
    checkoutUrl.hostname.endsWith("shop.app");
  expect(
    shopifyHost,
    `checkout host should be Shopify-owned, got ${checkoutUrl.hostname}`,
  ).toBeTruthy();
  expect(checkoutUrl.hostname).not.toBe("balcoffee.com");
  expect(checkoutUrl.hostname).not.toBe("www.balcoffee.com");

  const response = await page.request.get(href!, { maxRedirects: 5 });
  const finalHost = new URL(response.url()).hostname;
  expect(
    response.status(),
    `checkout response ${response.status()} from ${finalHost}`,
  ).toBeLessThan(400);
  expect(
    /checkout\.balcoffee\.com|shopify\.com|myshopify\.com|shop\.app/.test(
      finalHost,
    ),
    `checkout did not reach Shopify, final host ${finalHost}`,
  ).toBeTruthy();
});
