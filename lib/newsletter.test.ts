import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  NEWSLETTER_ERROR_MESSAGE,
  NEWSLETTER_INVALID_EMAIL_MESSAGE,
  NEWSLETTER_RATE_LIMIT_MESSAGE,
  NEWSLETTER_SUCCESS_MESSAGE,
  createRateLimiter,
  handleNewsletterRequest,
  isAdminConfigured,
  isHoneypotFilled,
  normalizeEmail,
  subscribeEmail,
} from "./newsletter.ts";

const footerSource = readFileSync(
  new URL("../components/bal/footer.tsx", import.meta.url),
  "utf8",
);
const formSource = readFileSync(
  new URL("../components/bal/newsletter-form.tsx", import.meta.url),
  "utf8",
);

test("normalizeEmail trims, lowercases, and rejects bad values", () => {
  assert.equal(normalizeEmail("  moe@example.com "), "moe@example.com");
  assert.equal(normalizeEmail("Moe@Example.COM"), "moe@example.com");
  assert.equal(normalizeEmail(""), null);
  assert.equal(normalizeEmail("not-an-email"), null);
  assert.equal(normalizeEmail("a@b"), null);
  assert.equal(normalizeEmail("a@b."), null);
  assert.equal(normalizeEmail("   "), null);
  assert.equal(normalizeEmail(null), null);
  assert.equal(normalizeEmail("x".repeat(255) + "@x.com"), null);
});

test("honeypot is filled only when the hidden field has text", () => {
  assert.equal(isHoneypotFilled(""), false);
  assert.equal(isHoneypotFilled("   "), false);
  assert.equal(isHoneypotFilled(undefined), false);
  assert.equal(isHoneypotFilled("http://spam.example"), true);
});

test("rate limiter allows a burst and then blocks within the window", () => {
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
  const start = 1_000_000;
  assert.equal(limiter.allow("ip:1", start), true);
  assert.equal(limiter.allow("ip:1", start + 1), true);
  assert.equal(limiter.allow("ip:1", start + 2), false);
  assert.equal(limiter.allow("ip:2", start + 2), true);
  assert.equal(limiter.allow("ip:1", start + 1001), true);
});

test("isAdminConfigured requires a shop domain and admin token", () => {
  assert.equal(isAdminConfigured({}), false);
  assert.equal(
    isAdminConfigured({
      SHOPIFY_STORE_DOMAIN: "balcoffee-store.myshopify.com",
    }),
    false,
  );
  assert.equal(
    isAdminConfigured({
      SHOPIFY_STORE_DOMAIN: "balcoffee-store.myshopify.com",
      SHOPIFY_ADMIN_ACCESS_TOKEN: "   ",
    }),
    false,
  );
  assert.equal(
    isAdminConfigured({
      PUBLIC_STORE_DOMAIN: "balcoffee-store.myshopify.com",
      SHOPIFY_ADMIN_ACCESS_TOKEN: "token",
    }),
    true,
  );
});

test("handleNewsletterRequest rejects invalid email and filled honeypots", async () => {
  const calls: unknown[] = [];
  const admin = async () => {
    calls.push("called");
    throw new Error("should not be called");
  };

  const invalid = await handleNewsletterRequest(
    { email: "nope" },
    { ip: "1.1.1.1", admin, limiter: createRateLimiter() },
  );
  assert.equal(invalid.ok, false);
  assert.equal(invalid.status, 400);
  assert.equal(invalid.message, NEWSLETTER_INVALID_EMAIL_MESSAGE);

  const bot = await handleNewsletterRequest(
    { email: "person@example.com", website: "https://bot" },
    { ip: "1.1.1.2", admin, limiter: createRateLimiter() },
  );
  assert.equal(bot.ok, true);
  assert.equal(bot.status, 200);
  assert.equal(bot.message, NEWSLETTER_SUCCESS_MESSAGE);
  assert.equal(calls.length, 0);
});

test("handleNewsletterRequest rate-limits repeat posts from one IP", async () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
  const admin = async () => ({
    customerCreate: {
      customer: { id: "gid://shopify/Customer/1" },
      userErrors: [],
    },
  });

  const first = await handleNewsletterRequest(
    { email: "one@example.com" },
    { ip: "9.9.9.9", admin, limiter, now: 1 },
  );
  const second = await handleNewsletterRequest(
    { email: "two@example.com" },
    { ip: "9.9.9.9", admin, limiter, now: 2 },
  );

  assert.equal(first.ok, true);
  assert.equal(second.ok, false);
  assert.equal(second.status, 429);
  assert.equal(second.message, NEWSLETTER_RATE_LIMIT_MESSAGE);
});

test("handleNewsletterRequest returns a generic error when the admin token is missing", async () => {
  const result = await handleNewsletterRequest(
    { email: "person@example.com" },
    { ip: "2.2.2.2", admin: null, limiter: createRateLimiter() },
  );
  assert.equal(result.ok, false);
  assert.equal(result.status, 503);
  assert.equal(result.message, NEWSLETTER_ERROR_MESSAGE);
});

test("subscribeEmail creates a new subscribed customer", async () => {
  const calls: { query: string; variables?: Record<string, unknown> }[] = [];
  const admin = async <T>(
    query: string,
    variables?: Record<string, unknown>,
  ) => {
    calls.push({ query, variables });
    return {
      customerCreate: {
        customer: {
          id: "gid://shopify/Customer/11",
          defaultEmailAddress: { marketingState: "SUBSCRIBED" },
        },
        userErrors: [],
      },
    } as T;
  };

  await subscribeEmail(
    "new@example.com",
    admin,
    new Date("2026-11-27T03:00:00Z"),
  );

  assert.equal(calls.length, 1);
  assert.match(calls[0]!.query, /customerCreate/);
  assert.deepEqual(calls[0]!.variables, {
    input: {
      email: "new@example.com",
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
        consentUpdatedAt: "2026-11-27T03:00:00.000Z",
      },
      tags: ["newsletter"],
    },
  });
});

test("subscribeEmail updates consent when the email already exists", async () => {
  const calls: { query: string; variables?: Record<string, unknown> }[] = [];
  const admin = async <T>(
    query: string,
    variables?: Record<string, unknown>,
  ) => {
    calls.push({ query, variables });
    if (query.includes("customerCreate")) {
      return {
        customerCreate: {
          customer: null,
          userErrors: [
            { field: ["email"], message: "Email has already been taken" },
          ],
        },
      } as T;
    }
    if (query.includes("NewsletterCustomer")) {
      return {
        customers: {
          nodes: [
            {
              id: "gid://shopify/Customer/22",
              defaultEmailAddress: { marketingState: "UNSUBSCRIBED" },
            },
          ],
        },
      } as T;
    }
    return {
      customerEmailMarketingConsentUpdate: {
        customer: { id: "gid://shopify/Customer/22" },
        userErrors: [],
      },
    } as T;
  };

  await subscribeEmail(
    "old@example.com",
    admin,
    new Date("2026-11-27T03:00:00Z"),
  );

  assert.equal(calls.length, 3);
  assert.match(calls[1]!.query, /customers/);
  assert.equal(calls[1]!.variables?.query, 'email:"old@example.com"');
  assert.deepEqual(calls[2]!.variables, {
    input: {
      customerId: "gid://shopify/Customer/22",
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
        consentUpdatedAt: "2026-11-27T03:00:00.000Z",
      },
    },
  });
});

test("subscribeEmail is a no-op when the existing customer is already subscribed", async () => {
  const calls: string[] = [];
  const admin = async <T>(query: string) => {
    calls.push(query);
    if (query.includes("customerCreate")) {
      return {
        customerCreate: {
          customer: null,
          userErrors: [{ message: "Email has already been taken" }],
        },
      } as T;
    }
    return {
      customers: {
        nodes: [
          {
            id: "gid://shopify/Customer/33",
            defaultEmailAddress: { marketingState: "SUBSCRIBED" },
          },
        ],
      },
    } as T;
  };

  await subscribeEmail("already@example.com", admin);
  assert.equal(calls.length, 2);
  assert.equal(
    calls.some((query) => query.includes("ConsentUpdate")),
    false,
  );
});

test("handleNewsletterRequest hides Shopify failures from the visitor", async () => {
  const admin = async () => {
    throw new Error("Shopify Admin API returned 401");
  };
  const result = await handleNewsletterRequest(
    { email: "person@example.com" },
    { ip: "3.3.3.3", admin, limiter: createRateLimiter() },
  );
  assert.equal(result.ok, false);
  assert.equal(result.status, 502);
  assert.equal(result.message, NEWSLETTER_ERROR_MESSAGE);
});

test("footer form no longer promises exclusive offers and posts to the API", () => {
  assert.equal(footerSource.includes("exclusive offers"), false);
  assert.match(footerSource, /Get brewing tips and new roast news/);
  assert.match(footerSource, /NewsletterForm/);
  assert.match(formSource, /\/api\/newsletter/);
  assert.match(formSource, /htmlFor="newsletter-email"/);
  assert.match(formSource, /name="website"/);
  assert.equal(formSource.includes("sign_up"), false);
  assert.equal(formSource.includes("generate_lead"), false);
  assert.equal(formSource.includes("trackEcommerce"), false);
});
