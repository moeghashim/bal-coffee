import { expect, test, type Page } from "@playwright/test";

const GA_ID = "G-TESTBAL01";

type GaItem = {
  item_id?: string;
  item_name?: string;
  price?: number;
  quantity?: number;
  currency?: string;
};

type GaParams = {
  currency?: string;
  value?: number;
  items?: GaItem[];
};

async function gaEvents(page: Page) {
  return page.evaluate(() => {
    const layer = window.dataLayer ?? [];
    const events: { name: string; params: GaParams }[] = [];
    for (const entry of layer) {
      const command = entry as { 0?: unknown; 1?: unknown; 2?: GaParams };
      if (command[0] === "event" && typeof command[1] === "string") {
        events.push({ name: command[1], params: command[2] ?? {} });
      }
    }
    return events;
  });
}

async function waitForGaEvent(page: Page, name: string) {
  await expect
    .poll(async () =>
      (await gaEvents(page)).some((event) => event.name === name),
    )
    .toBe(true);
  const match = (await gaEvents(page)).find((event) => event.name === name);
  expect(match).toBeTruthy();
  return match?.params ?? {};
}

function expectItem(item: GaItem | undefined) {
  expect(item?.item_id).toBeTruthy();
  expect(item?.item_name).toBeTruthy();
  expect(item?.price).toBeGreaterThan(0);
  expect(item?.quantity).toBeGreaterThan(0);
  expect(item?.currency).toBe("USD");
}

test("GA4 loads and ecommerce events fire with the measurement id", async ({
  page,
}) => {
  const response = await page.goto("/products/datespresso");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.locator(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`),
  ).toHaveCount(1);

  const viewed = await waitForGaEvent(page, "view_item");
  expect(viewed.currency).toBe("USD");
  expectItem(viewed.items?.[0]);
  expect(JSON.stringify(viewed)).not.toMatch(/@/);
  const viewedId = viewed.items?.[0]?.item_id;

  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page
    .getByRole("button", { name: /add to cart/i })
    .first()
    .click();
  await expect(page.getByText(/added to cart/i)).toBeVisible();

  const added = await waitForGaEvent(page, "add_to_cart");
  expect(added.currency).toBe("USD");
  expect(added.items?.[0]?.item_id).toBe(viewedId);
  expect(added.items?.[0]?.quantity).toBe(2);
  expect(added.items?.[0]?.currency).toBe("USD");
  expect(JSON.stringify(added)).not.toMatch(/@/);

  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: /your cart/i, level: 1 }),
  ).toBeVisible();
  const cart = await waitForGaEvent(page, "view_cart");
  expect(cart.currency).toBe("USD");
  expect(cart.items?.length).toBeGreaterThan(0);
  expect(cart.items?.[0]?.item_id).toBe(viewedId);
  expect(cart.items?.[0]?.quantity).toBe(2);
  expect(JSON.stringify(cart)).not.toMatch(/@/);

  const checkout = page.getByRole("link", { name: /proceed to checkout/i });
  await expect(checkout).toBeVisible();
  const href = await checkout.getAttribute("href");
  expect(href).toBeTruthy();
  // Actionability check waits for hydration; the click itself stays in the
  // page so we can read dataLayer before the deferred checkout navigation.
  await checkout.click({ trial: true });

  const begin = await page.evaluate(() => {
    const link = [...document.querySelectorAll("a")].find((anchor) =>
      /proceed to checkout/i.test(anchor.textContent ?? ""),
    );
    link?.click();
    const layer = window.dataLayer ?? [];
    for (const entry of layer) {
      const command = entry as { 0?: unknown; 1?: unknown; 2?: GaParams };
      if (command[0] === "event" && command[1] === "begin_checkout") {
        return command[2] ?? {};
      }
    }
    return null;
  });
  expect(begin?.currency).toBe("USD");
  expect(begin?.items?.[0]?.item_id).toBe(viewedId);
  expect(begin?.items?.[0]?.quantity).toBe(2);
  expect(JSON.stringify(begin?.items ?? [])).not.toMatch(/@/);
});
