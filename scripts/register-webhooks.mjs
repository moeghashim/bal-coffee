// Register the Shopify webhook subscriptions the storefront's receiver handles
// (app/api/shopify/webhooks/route.ts) via the Admin GraphQL API. Idempotent —
// skips topics already pointing at the callback URL.
//
//   SHOPIFY_STORE_DOMAIN=balcoffee-store.myshopify.com \
//   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx \
//   WEBHOOK_CALLBACK_URL=https://www.balcoffee.com/api/shopify/webhooks \
//   node scripts/register-webhooks.mjs
//
// IMPORTANT — HMAC secret: webhooks created with an Admin API token are signed
// with the API secret key of the app that owns that token. The receiver
// validates with SHOPIFY_WEBHOOK_SECRET, so that Vercel env var must equal the
// same app's API secret key, or every delivery 401s. (If you register via the
// Shopify admin UI instead, use the signing secret shown there.)

const DOMAIN = (process.env.SHOPIFY_STORE_DOMAIN || "").replace(
  /^https?:\/\//,
  "",
);
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const CALLBACK_URL =
  process.env.WEBHOOK_CALLBACK_URL ||
  "https://www.balcoffee.com/api/shopify/webhooks";
const API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2025-10";

// Keep in sync with HANDLED_TOPICS in app/api/shopify/webhooks/route.ts.
const TOPICS = [
  "PRODUCTS_CREATE",
  "PRODUCTS_UPDATE",
  "ORDERS_CREATE",
  "ORDERS_UPDATED",
  "ORDERS_PAID",
  "CUSTOMERS_CREATE",
];

if (!DOMAIN || !TOKEN) {
  console.error(
    "Missing env. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN.",
  );
  process.exit(1);
}

const endpoint = `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

async function admin(query, variables) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (!res.ok || body.errors) {
    throw new Error(
      `Admin API ${res.status}: ${JSON.stringify(body.errors || body)}`,
    );
  }
  return body.data;
}

async function existingTopics() {
  const data = await admin(`
    {
      webhookSubscriptions(first: 100) {
        edges {
          node {
            topic
            endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } }
          }
        }
      }
    }
  `);
  const set = new Set();
  for (const { node } of data.webhookSubscriptions.edges) {
    if (node.endpoint?.callbackUrl === CALLBACK_URL) set.add(node.topic);
  }
  return set;
}

const CREATE = `
  mutation Create($topic: WebhookSubscriptionTopic!, $url: URL!) {
    webhookSubscriptionCreate(
      topic: $topic
      webhookSubscription: { callbackUrl: $url, format: JSON }
    ) {
      webhookSubscription { id }
      userErrors { field message }
    }
  }
`;

console.log(`\nRegistering webhooks -> ${CALLBACK_URL}\n`);

const already = await existingTopics();
let created = 0;
let failed = 0;

for (const topic of TOPICS) {
  if (already.has(topic)) {
    console.log(`= ${topic} already registered`);
    continue;
  }
  try {
    const data = await admin(CREATE, { topic, url: CALLBACK_URL });
    const errs = data.webhookSubscriptionCreate.userErrors;
    if (errs.length) {
      console.error(`✗ ${topic}: ${errs.map((e) => e.message).join("; ")}`);
      failed++;
    } else {
      console.log(`✓ ${topic} registered`);
      created++;
    }
  } catch (error) {
    console.error(`✗ ${topic}: ${error.message}`);
    failed++;
  }
}

console.log(
  `\n${created} created, ${already.size} already present, ${failed} failed.`,
);
if (failed) process.exit(1);
