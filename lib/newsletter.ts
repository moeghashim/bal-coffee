/**
 * Footer newsletter signup. The form posts to /api/newsletter, which creates
 * or updates a Shopify customer with email marketing consent set to
 * SUBSCRIBED (single opt-in).
 *
 * This needs a server-only Admin API token (SHOPIFY_ADMIN_ACCESS_TOKEN) with
 * read_customers and write_customers. The public Storefront token cannot set
 * marketing consent without creating a password-protected customer account.
 */

export const NEWSLETTER_SUCCESS_MESSAGE = "Thanks — you're subscribed.";
export const NEWSLETTER_INVALID_EMAIL_MESSAGE =
  "Please enter a valid email address.";
export const NEWSLETTER_ERROR_MESSAGE =
  "Something went wrong. Please try again.";
export const NEWSLETTER_RATE_LIMIT_MESSAGE =
  "Please wait a moment and try again.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_TAKEN = /already (been )?taken|email.+taken/i;

const CUSTOMER_CREATE = /* GraphQL */ `
  mutation NewsletterCustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        defaultEmailAddress {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_SEARCH = /* GraphQL */ `
  query NewsletterCustomer($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        id
        defaultEmailAddress {
          marketingState
        }
      }
    }
  }
`;

const CONSENT_UPDATE = /* GraphQL */ `
  mutation NewsletterConsentUpdate(
    $input: CustomerEmailMarketingConsentUpdateInput!
  ) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        defaultEmailAddress {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export type NewsletterResult = {
  ok: boolean;
  status: number;
  message: string;
};

export type NewsletterInput = {
  email?: unknown;
  website?: unknown;
};

export type AdminGraphql = <T>(
  query: string,
  variables?: Record<string, unknown>,
) => Promise<T>;

type MarketingState =
  | "INVALID"
  | "NOT_SUBSCRIBED"
  | "PENDING"
  | "REDACTED"
  | "SUBSCRIBED"
  | "UNSUBSCRIBED";

type CustomerNode = {
  id?: string | null;
  defaultEmailAddress?: { marketingState?: MarketingState | null } | null;
};

type CustomerCreateData = {
  customerCreate?: {
    customer?: CustomerNode | null;
    userErrors?: { field?: string[] | null; message: string }[];
  };
};

type CustomerSearchData = {
  customers?: { nodes?: CustomerNode[] };
};

type ConsentUpdateData = {
  customerEmailMarketingConsentUpdate?: {
    customer?: CustomerNode | null;
    userErrors?: { field?: string[] | null; message: string }[];
  };
};

type ShopifyEnvelope<T> = {
  data?: T;
  errors?: { message?: string }[];
};

export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase();
  if (email.length < 3 || email.length > MAX_EMAIL_LENGTH) return null;
  if (!EMAIL_RE.test(email)) return null;
  return email;
}

export function isHoneypotFilled(website: unknown): boolean {
  return typeof website === "string" && website.trim().length > 0;
}

export function createRateLimiter(
  options: { limit?: number; windowMs?: number } = {},
) {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 10 * 60 * 1000;
  const hits = new Map<string, number[]>();

  return {
    allow(key: string, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter(
        (time) => now - time < windowMs,
      );
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
  };
}

const defaultLimiter = createRateLimiter();

export function isAdminConfigured(
  env: NodeJS.Dict<string | undefined> = process.env,
): boolean {
  const domain = shopDomain(env);
  const token = env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  return Boolean(domain && token);
}

export function createAdminGraphql(
  env: NodeJS.Dict<string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): AdminGraphql {
  const domain = shopDomain(env);
  const token = env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  const version = env.SHOPIFY_ADMIN_API_VERSION?.trim() || "2025-10";

  if (!domain || !token) {
    throw new Error("Shopify Admin API is not configured");
  }

  const endpoint = `https://${domain}/admin/api/${version}/graphql.json`;

  return async function adminGraphql<T>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify Admin API returned ${response.status}`);
    }

    const payload = (await response.json()) as ShopifyEnvelope<T>;
    if (payload.errors?.length) {
      throw new Error("Shopify Admin API GraphQL error");
    }
    if (!payload.data) {
      throw new Error("Shopify Admin API returned no data");
    }
    return payload.data;
  };
}

export async function subscribeEmail(
  email: string,
  admin: AdminGraphql,
  now = new Date(),
): Promise<void> {
  const consent = {
    marketingState: "SUBSCRIBED" as const,
    marketingOptInLevel: "SINGLE_OPT_IN" as const,
    consentUpdatedAt: now.toISOString(),
  };

  const created = await admin<CustomerCreateData>(CUSTOMER_CREATE, {
    input: {
      email,
      emailMarketingConsent: consent,
      tags: ["newsletter"],
    },
  });

  const createResult = created.customerCreate;
  const createErrors = createResult?.userErrors ?? [];
  if (createResult?.customer?.id && createErrors.length === 0) {
    return;
  }

  if (!createErrors.some((error) => EMAIL_TAKEN.test(error.message))) {
    throw new Error("Shopify customerCreate failed");
  }

  const existing = await findCustomerByEmail(admin, email);
  if (!existing?.id) {
    throw new Error("Shopify customer exists but could not be loaded");
  }

  if (existing.defaultEmailAddress?.marketingState === "SUBSCRIBED") {
    return;
  }

  const updated = await admin<ConsentUpdateData>(CONSENT_UPDATE, {
    input: {
      customerId: existing.id,
      emailMarketingConsent: consent,
    },
  });

  const updateErrors =
    updated.customerEmailMarketingConsentUpdate?.userErrors ?? [];
  if (
    updateErrors.length > 0 ||
    !updated.customerEmailMarketingConsentUpdate?.customer?.id
  ) {
    throw new Error("Shopify customerEmailMarketingConsentUpdate failed");
  }
}

export async function handleNewsletterRequest(
  input: NewsletterInput,
  options: {
    ip?: string;
    now?: number;
    admin?: AdminGraphql | null;
    limiter?: ReturnType<typeof createRateLimiter>;
    env?: NodeJS.Dict<string | undefined>;
  } = {},
): Promise<NewsletterResult> {
  const now = options.now ?? Date.now();
  const limiter = options.limiter ?? defaultLimiter;
  const ip = options.ip?.trim() || "unknown";

  if (!limiter.allow(`ip:${ip}`, now)) {
    return {
      ok: false,
      status: 429,
      message: NEWSLETTER_RATE_LIMIT_MESSAGE,
    };
  }

  if (isHoneypotFilled(input.website)) {
    return { ok: true, status: 200, message: NEWSLETTER_SUCCESS_MESSAGE };
  }

  const email = normalizeEmail(input.email);
  if (!email) {
    return {
      ok: false,
      status: 400,
      message: NEWSLETTER_INVALID_EMAIL_MESSAGE,
    };
  }

  if (!limiter.allow(`email:${email}`, now)) {
    return {
      ok: false,
      status: 429,
      message: NEWSLETTER_RATE_LIMIT_MESSAGE,
    };
  }

  const admin =
    options.admin === undefined
      ? isAdminConfigured(options.env)
        ? createAdminGraphql(options.env)
        : null
      : options.admin;

  if (!admin) {
    console.error(
      "newsletter signup is not configured: SHOPIFY_ADMIN_ACCESS_TOKEN is missing",
    );
    return { ok: false, status: 503, message: NEWSLETTER_ERROR_MESSAGE };
  }

  try {
    await subscribeEmail(email, admin, new Date(now));
    return { ok: true, status: 200, message: NEWSLETTER_SUCCESS_MESSAGE };
  } catch (error) {
    console.error(
      "newsletter signup failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return { ok: false, status: 502, message: NEWSLETTER_ERROR_MESSAGE };
  }
}

function shopDomain(env: NodeJS.Dict<string | undefined>): string | undefined {
  const raw = env.SHOPIFY_STORE_DOMAIN ?? env.PUBLIC_STORE_DOMAIN;
  const domain = raw
    ?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  return domain || undefined;
}

function escapeSearchValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function findCustomerByEmail(
  admin: AdminGraphql,
  email: string,
): Promise<CustomerNode | null> {
  const data = await admin<CustomerSearchData>(CUSTOMER_SEARCH, {
    query: `email:"${escapeSearchValue(email)}"`,
  });
  return data.customers?.nodes?.[0] ?? null;
}
