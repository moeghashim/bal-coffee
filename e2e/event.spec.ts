import { test, expect } from "@playwright/test";

test("event menu is noindex and not linked from the shop", async ({
  page,
  request,
}) => {
  const response = await page.goto("/event");
  expect(response?.ok()).toBeTruthy();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "BAL Coffee",
  );
  await expect(
    page.getByText(
      "Coffee-style drinks made from roasted date seeds instead of coffee beans. Naturally caffeine-free, roasted in Houston.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Order a drink" }),
  ).toBeVisible();
  await expect(
    page.getByText("We recommend iced. Hot is available too."),
  ).toBeVisible();

  const drinks = [
    {
      name: "Brown Sugar",
      handle: "brown-sugar",
      description:
        "A DateSpresso shot with brown sugar syrup and your choice of milk. Served iced, or hot if you prefer.",
    },
    {
      name: "Caramel Glow",
      handle: "caramel-glow",
      description:
        "A DateSpresso shot with salted caramel and milk, finished with a caramel drizzle. Served iced, or hot if you prefer.",
    },
    {
      name: "Honey Iced Latte",
      handle: "honey-iced-lattee",
      description:
        "A DateSpresso shot with organic honey and organic milk. Served iced, or hot if you prefer.",
    },
    {
      name: "Pistachio Caramel",
      handle: "pistachio",
      description:
        "A DateSpresso shot with pistachio syrup, pistachio cream and milk, finished with a caramel drizzle. Served iced, or hot if you prefer.",
    },
  ];
  let seen = 0;
  for (const drink of drinks) {
    const heading = page.getByRole("heading", {
      level: 2,
      name: drink.name,
      exact: true,
    });
    if ((await heading.count()) === 0) continue;
    seen += 1;
    const card = page.locator("article.bal-event-drink").filter({
      has: heading,
    });
    await expect(card.getByText(drink.description)).toBeVisible();
    const image = card.getByRole("img", { name: drink.name, exact: true });
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute("src", new RegExp(drink.handle));
    await expect(
      card.getByRole("radio", { name: "Iced (recommended)" }),
    ).toBeChecked();
    await expect(
      card.getByRole("radio", { name: "Regular ice" }),
    ).toBeChecked();
    await expect(
      card.getByRole("radio", { name: "Regular", exact: true }),
    ).toBeChecked();
    await card.getByRole("radio", { name: "Hot", exact: true }).check();
    await expect(card.getByRole("radio", { name: "Less ice" })).toHaveCount(0);
    await card.getByRole("radio", { name: "Iced (recommended)" }).check();
    await expect(card.getByRole("radio", { name: "Less ice" })).toBeVisible();
  }
  if (seen > 0) {
    expect(seen).toBe(drinks.length);
    const heading = page.getByRole("heading", {
      level: 2,
      name: "Brown Sugar",
      exact: true,
    });
    const card = page.locator("article.bal-event-drink").filter({
      has: heading,
    });
    const milk = card.getByRole("group", { name: "Milk" }).getByRole("radio");
    await milk.first().click();
    await milk.first().click();
    await expect(card.getByText(/\d+ in your order/)).toHaveCount(0);
    const order = page.getByRole("region", { name: "Your order" });
    await expect(order.getByText(/× Brown Sugar/)).toHaveCount(0);

    await card.getByRole("button", { name: /Add to order · / }).click();
    await expect(card.getByText("Added ✓")).toBeVisible();
    await expect(card.getByText("1 in your order")).toBeVisible();
    await expect(order.getByText(/1 × Brown Sugar —/)).toBeVisible();
    await expect(order.getByText(/· Iced/)).toBeVisible();

    await order.getByRole("button", { name: "Add one Brown Sugar" }).click();
    await expect(order.getByText(/2 × Brown Sugar —/)).toBeVisible();
    await expect(card.getByText("2 in your order")).toBeVisible();

    await order.getByRole("button", { name: "Remove one Brown Sugar" }).click();
    await expect(order.getByText(/1 × Brown Sugar —/)).toBeVisible();
    await expect(card.getByText("1 in your order")).toBeVisible();
  }

  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("content") ?? ""),
    );
  expect(robots.some((content) => /noindex/i.test(content))).toBeTruthy();
  expect(robots.some((content) => /nofollow/i.test(content))).toBeTruthy();
  const html = await page.content();
  const honey =
    "A DateSpresso shot with organic honey and organic milk. Served iced, or hot if you prefer.";
  const withoutHoney = html.replaceAll(honey, "");
  expect(withoutHoney).not.toMatch(/free shipping/i);
  expect(withoutHoney).not.toMatch(/\borganic\b/i);

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
