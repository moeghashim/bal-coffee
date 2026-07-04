import { test, expect } from "@playwright/test";

/**
 * The Shopify webhook receiver must reject unsigned requests. Locally (no
 * SHOPIFY_WEBHOOK_SECRET) it returns 500; in prod (secret set, missing HMAC) it
 * returns 401. Either way it must NOT accept the request. This guards the
 * revalidation path the migration keeps.
 */

test("webhook route rejects unsigned requests", async ({ request }) => {
  const response = await request.post("/api/shopify/webhooks", {
    data: { test: true },
    headers: { "content-type": "application/json" },
  });
  expect(response.ok()).toBeFalsy();
  expect([401, 500]).toContain(response.status());
});
