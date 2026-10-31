import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";

/**
 * Guest shipping-rate check on Shopify checkout. Enters a US address and reads
 * the rates. Does not enter payment and does not place an order.
 */
test("checkout shows a non-zero USPS rate for a Houston address", async ({
  page,
}) => {
  test.setTimeout(150_000);

  await page.goto("/products/datespresso");
  await page
    .getByRole("button", { name: /add to cart/i })
    .first()
    .click();
  await expect(page.getByText(/added to cart/i)).toBeVisible();
  await page.goto("/cart");

  const checkout = page.getByRole("link", { name: /proceed to checkout/i });
  const href = await checkout.getAttribute("href");
  expect(href, "checkout href").toBeTruthy();
  await page.goto(href!);
  await expect(page).toHaveURL(
    /checkout\.balcoffee\.com|shopify\.com|myshopify\.com/,
  );

  const email = page
    .locator(
      'input[name="email"], input[autocomplete="shipping email"], input[autocomplete="email"]',
    )
    .first();
  await email.waitFor({ state: "visible", timeout: 30_000 });
  await email.fill("test-buyer@example.com");

  const country = page
    .locator(
      'select[name="countryCode"], select[autocomplete="shipping country"]',
    )
    .first();
  if ((await country.count()) > 0 && (await country.isVisible())) {
    await country
      .selectOption({ label: "United States" })
      .catch(async () => country.selectOption("US"));
  }

  async function fill(selector: string, value: string) {
    const field = page.locator(selector).first();
    await field.waitFor({ state: "visible", timeout: 20_000 });
    await field.fill(value);
    await field.blur();
  }

  await fill(
    'input[name="firstName"], input[autocomplete="shipping given-name"]',
    "Test",
  );
  await fill(
    'input[name="lastName"], input[autocomplete="shipping family-name"]',
    "Buyer",
  );
  await fill(
    'input[name="address1"], input[autocomplete="shipping address-line1"]',
    "500 Dallas Street",
  );
  await page.keyboard.press("Escape");
  await fill(
    'input[name="city"], input[autocomplete="shipping address-level2"]',
    "Houston",
  );

  const zone = page
    .locator(
      'select[name="zone"], select[autocomplete="shipping address-level1"]',
    )
    .first();
  if ((await zone.count()) > 0 && (await zone.isVisible())) {
    await zone
      .selectOption({ label: "Texas" })
      .catch(async () => zone.selectOption("TX"));
  } else {
    await fill(
      'input[name="zone"], input[autocomplete="shipping address-level1"]',
      "TX",
    );
  }

  await fill(
    'input[name="postalCode"], input[autocomplete="shipping postal-code"]',
    "77002",
  );

  const phone = page
    .locator('input[name="phone"], input[autocomplete="shipping tel"]')
    .first();
  if ((await phone.count()) > 0 && (await phone.isVisible())) {
    await phone.fill("7135550100");
    await phone.blur();
  }

  const continueButton = page.getByRole("button", { name: /^continue/i });
  if (
    (await continueButton.count()) > 0 &&
    (await continueButton.first().isVisible())
  ) {
    const label = (await continueButton.first().innerText()).trim();
    if (!/pay|place order|complete/i.test(label)) {
      await continueButton.first().click();
    }
  }

  await expect(page.getByText(/USPS/i).first()).toBeVisible({
    timeout: 45_000,
  });

  const body = await page.locator("body").innerText();
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const rateLines: string[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (
      !/usps|priority mail|ground advantage|shipping method/i.test(lines[index])
    ) {
      continue;
    }
    const window = lines.slice(index, index + 6);
    const money = window.find((line) => /^\$\d+(?:\.\d{2})?$/.test(line));
    if (!money) continue;
    const detail = window
      .slice(1, window.indexOf(money))
      .filter((line) => !/^\$/.test(line))
      .join(", ");
    rateLines.push(
      detail
        ? `${lines[index]} — ${detail} — ${money}`
        : `${lines[index]} — ${money}`,
    );
  }
  const summaryIndex = lines.findIndex(
    (line, index) =>
      /^shipping$/i.test(line) &&
      index > 0 &&
      /^\$\d+(?:\.\d{2})?$/.test(lines[index + 1] ?? ""),
  );
  const summary =
    summaryIndex >= 0
      ? `Order summary shipping — ${lines[summaryIndex + 1]}`
      : "";
  writeFileSync(
    "/tmp/checkout-shipping-rates.txt",
    `${[...rateLines, summary].filter(Boolean).join("\n")}\n\n----- page text -----\n${body}\n`,
  );

  const uspsRates = rateLines.filter((line) => /usps/i.test(line));
  expect(uspsRates.length, lines.join("\n").slice(0, 2500)).toBeGreaterThan(0);
  const amounts = [...uspsRates.join(" ").matchAll(/\$(\d+(?:\.\d{2})?)/g)];
  expect(amounts.length).toBeGreaterThan(0);
  expect(
    amounts.some((match) => Number(match[1]) > 0),
    `expected a non-zero USPS rate in: ${uspsRates.join(" | ")}`,
  ).toBeTruthy();

  const pay = page.getByRole("button", {
    name: /pay now|place order|complete order/i,
  });
  if ((await pay.count()) > 0) {
    await expect(pay.first()).toBeVisible();
  }
});
