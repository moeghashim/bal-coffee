import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  JSONLD_REVIEW_LIMIT,
  VISIBLE_REVIEW_LIMIT,
  judgeMeConfigFromEnv,
  mapPublishedProductReviews,
  normalizeShopDomain,
  parseJudgeMeAggregate,
  parseJudgeMeReviewList,
  resolveProductReviewSummary,
  withProductReviewJsonLd,
} from "./judgeme.ts";

const datespresso = {
  productId: "gid://shopify/Product/1001",
  shopifyHandle: "datespresso",
  slug: "datespresso",
};

const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "DateSpresso",
  description: "Roasted date seeds.",
  sku: "DS-12",
  offers: {
    "@type": "Offer",
    price: "27.00",
    priceCurrency: "USD",
  },
};

function rawReview(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    title: "Smooth cup",
    body: "Roasted date seeds, brewed like drip.",
    rating: 5,
    product_external_id: 1001,
    product_handle: "datespresso",
    reviewer: {
      name: "Mina H.",
      email: "mina@example.com",
    },
    curated: "ok",
    hidden: false,
    published: true,
    created_at: "2024-05-02T15:04:05.000Z",
    ...overrides,
  };
}

function summaryFor(
  records: unknown[],
  product = datespresso,
  aggregates: { averageRating: number; reviewCount: number }[] = [],
) {
  return resolveProductReviewSummary(
    mapPublishedProductReviews(records, product),
    aggregates,
  );
}

test("shop domain falls back and a missing token disables reviews", () => {
  assert.equal(
    normalizeShopDomain("https://BalCoffee-Store.myshopify.com/admin"),
    "balcoffee-store.myshopify.com",
  );
  assert.equal(
    normalizeShopDomain("  BAL-COFFEE.myshopify.com. "),
    "bal-coffee.myshopify.com",
  );
  assert.equal(
    judgeMeConfigFromEnv({
      SHOPIFY_STORE_DOMAIN: "balcoffee-store.myshopify.com",
    }),
    null,
  );
  assert.equal(
    judgeMeConfigFromEnv({
      JUDGEME_API_TOKEN: "   ",
      PUBLIC_STORE_DOMAIN: "balcoffee-store.myshopify.com",
    }),
    null,
  );
  assert.equal(judgeMeConfigFromEnv({ JUDGEME_API_TOKEN: "test-token" }), null);
  assert.deepEqual(
    judgeMeConfigFromEnv({
      JUDGEME_API_TOKEN: "test-token",
      JUDGEME_SHOP_DOMAIN: "https://override.myshopify.com",
      PUBLIC_STORE_DOMAIN: "public.myshopify.com",
      SHOPIFY_STORE_DOMAIN: "legacy.myshopify.com",
    }),
    { token: "test-token", shopDomain: "override.myshopify.com" },
  );
  assert.deepEqual(
    judgeMeConfigFromEnv({
      JUDGEME_API_TOKEN: "test-token",
      PUBLIC_STORE_DOMAIN: "public.myshopify.com",
      SHOPIFY_STORE_DOMAIN: "legacy.myshopify.com",
    }),
    { token: "test-token", shopDomain: "public.myshopify.com" },
  );
  assert.deepEqual(
    judgeMeConfigFromEnv({
      JUDGEME_API_TOKEN: "test-token",
      SHOPIFY_STORE_DOMAIN: "legacy.myshopify.com",
    }),
    { token: "test-token", shopDomain: "legacy.myshopify.com" },
  );
});

test("published reviews match a product by Shopify id or handle", () => {
  const reviews = mapPublishedProductReviews(
    [
      rawReview(),
      rawReview({
        id: 2,
        product_external_id: 9999,
        product_handle: "other-bag",
        reviewer: { name: "Other Person", email: "other@example.com" },
      }),
      rawReview({
        id: 3,
        product_external_id: null,
        product_handle: "",
        reviewer: { name: "Shop Reviewer" },
      }),
      rawReview({
        id: 4,
        product_external_id: null,
        product_handle: "Eastern-Brew",
        created_at: "2024-06-01T00:00:00.000Z",
        reviewer: { name: "Nora P." },
      }),
    ],
    datespresso,
  );
  assert.deepEqual(
    reviews.map((review) => review.id),
    ["1"],
  );

  const eastern = mapPublishedProductReviews(
    [
      rawReview({
        id: 4,
        product_external_id: null,
        product_handle: "Eastern-Brew",
        reviewer: { name: "Nora P." },
      }),
      rawReview({
        id: 5,
        product_external_id: "gid://shopify/Product/2002",
        product_handle: "not-the-handle",
        created_at: "2024-08-01T00:00:00.000Z",
        reviewer: { name: "Id Match" },
      }),
    ],
    {
      productId: "gid://shopify/Product/2002",
      shopifyHandle: "arabica",
      slug: "eastern-brew",
    },
  );
  assert.deepEqual(
    eastern.map((review) => review.reviewerName),
    ["Id Match", "Nora P."],
  );
});

test("only published, non-hidden reviews are mapped", () => {
  const records = [
    rawReview({
      id: 10,
      rating: 5,
      created_at: "2024-01-01T00:00:00.000Z",
    }),
    rawReview({
      id: 11,
      hidden: true,
      rating: 1,
      reviewer: { name: "Hidden Person", email: "hidden@example.com" },
    }),
    rawReview({
      id: 12,
      curated: "spam",
      published: false,
      rating: 1,
      reviewer: { name: "Spam Person" },
    }),
    rawReview({
      id: 13,
      curated: "not-yet",
      reviewer: { name: "Pending Person" },
    }),
    rawReview({
      id: 14,
      curated: undefined,
      published: false,
      hidden: false,
      reviewer: { name: "Unpublished Person" },
    }),
    rawReview({
      id: 15,
      curated: undefined,
      published: true,
      rating: "4",
      title: " <b>Plain</b> ",
      body: "Before <script>alert(1)</script> after &amp; more",
      reviewer: { name: "  Rae <em>S.</em> ", email: "rae@example.com" },
      created_at: "2024-07-04T12:00:00.000Z",
    }),
    rawReview({
      id: 16,
      reviewer: { name: "mina@example.com", email: "mina@example.com" },
    }),
    rawReview({ id: 10, title: "Duplicate" }),
  ];

  const reviews = mapPublishedProductReviews(records, datespresso);
  assert.deepEqual(
    reviews.map((review) => review.id),
    ["15", "10"],
  );
  const newest = reviews[0];
  assert.ok(newest);
  assert.equal(newest.rating, 4);
  assert.equal(newest.title, "Plain");
  assert.equal(newest.body, "Before after & more");
  assert.equal(newest.reviewerName, "Rae S.");
  assert.equal(newest.publishedAt, "2024-07-04T12:00:00.000Z");
  assert.equal(JSON.stringify(reviews).includes("example.com"), false);
  assert.equal(JSON.stringify(reviews).includes("alert"), false);
});

test("aggregate markup is omitted when a product has zero published reviews", () => {
  assert.equal(summaryFor([]), null);
  assert.equal(summaryFor([rawReview({ hidden: true })]), null);
  assert.equal(
    summaryFor([rawReview({ curated: "spam", published: false })]),
    null,
  );

  const untouched = withProductReviewJsonLd(productLd, null);
  assert.equal(untouched, productLd);
  assert.equal(
    withProductReviewJsonLd(
      productLd,
      summaryFor([rawReview({ hidden: true })]),
    ),
    productLd,
  );
  assert.equal(
    withProductReviewJsonLd(productLd, {
      ratingValue: 5,
      reviewCount: 0,
      reviews: [],
    }),
    productLd,
  );
  assert.equal(JSON.stringify(untouched).includes("aggregateRating"), false);
  assert.equal(JSON.stringify(untouched).includes('"@type":"Review"'), false);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BAL Coffee",
  };
  const published = summaryFor([rawReview()]);
  assert.ok(published);
  assert.equal(withProductReviewJsonLd(organization, published), organization);
  assert.equal(
    JSON.stringify(withProductReviewJsonLd(organization, published)).includes(
      "aggregateRating",
    ),
    false,
  );
});

test("published reviews add aggregateRating and a few review entries", () => {
  const records = [
    rawReview({ id: 1, rating: 5, created_at: "2024-05-02T00:00:00.000Z" }),
    rawReview({
      id: 2,
      rating: 4,
      title: "Second cup",
      body: "Fine for drip.",
      created_at: "2024-04-02T00:00:00.000Z",
      reviewer: { name: "Len C.", email: "len@example.com" },
    }),
  ];
  const summary = summaryFor(records, datespresso, [
    { averageRating: 4.8, reviewCount: 9 },
  ]);
  assert.ok(summary);
  assert.equal(summary.ratingValue, 4.8);
  assert.equal(summary.reviewCount, 9);
  assert.equal(summary.reviews.length, 2);

  const withReviews = withProductReviewJsonLd(productLd, summary);
  const { aggregateRating, review, ...rest } =
    withReviews as typeof productLd & {
      aggregateRating: {
        ratingValue: string;
        reviewCount: number;
      };
      review: { author: { name: string }; reviewBody?: string }[];
    };
  assert.deepEqual(rest, productLd);
  assert.equal(aggregateRating.ratingValue, "4.8");
  assert.equal(aggregateRating.reviewCount, 9);
  assert.equal(review.length, 2);
  assert.equal(review[0]?.author.name, "Mina H.");
  assert.equal(JSON.stringify(withReviews).includes("example.com"), false);

  const withoutBadge = summaryFor(records);
  assert.ok(withoutBadge);
  assert.equal(withoutBadge.ratingValue, 4.5);
  assert.equal(withoutBadge.reviewCount, 2);

  const many = Array.from({ length: VISIBLE_REVIEW_LIMIT + 2 }, (_, index) =>
    rawReview({
      id: index + 1,
      created_at: `2024-01-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
    }),
  );
  const longSummary = summaryFor(many);
  assert.ok(longSummary);
  assert.equal(longSummary.reviews.length, VISIBLE_REVIEW_LIMIT);
  assert.equal(longSummary.reviewCount, many.length);
  const longLd = withProductReviewJsonLd(productLd, longSummary);
  const entries = (longLd as { review?: unknown[] }).review;
  assert.ok(entries);
  assert.equal(entries.length, JSONLD_REVIEW_LIMIT);
  assert.ok(JSONLD_REVIEW_LIMIT <= 5);
  assert.equal(
    (longLd as { aggregateRating?: { reviewCount: number } }).aggregateRating
      ?.reviewCount,
    many.length,
  );
});

test("preview badge and product widget HTML supply the aggregate", () => {
  const badge = parseJudgeMeAggregate({
    badge:
      "<div class='jdgm-prev-badge' data-average-rating='4.80' data-number-of-reviews='12'></div>",
  });
  assert.deepEqual(badge, { averageRating: 4.8, reviewCount: 12 });

  const widget = parseJudgeMeAggregate({
    widget:
      '<div class="jdgm-rev-widg" data-number-of-reviews="0" data-average-rating="0.00"></div>',
  });
  assert.deepEqual(widget, { averageRating: 0, reviewCount: 0 });
  assert.equal(parseJudgeMeAggregate({ widget: "<div></div>" }), null);
  assert.equal(parseJudgeMeReviewList({ reviews: [] })?.length, 0);
  assert.equal(parseJudgeMeReviewList({ error: "nope" }), null);

  const summary = summaryFor([rawReview({ rating: 5 })], datespresso, [
    widget ?? { averageRating: 0, reviewCount: 0 },
    { averageRating: 4.8, reviewCount: 12 },
  ]);
  assert.ok(summary);
  assert.equal(summary.reviewCount, 12);
  assert.equal(summary.ratingValue, 4.8);
});

test("the server client keeps the private token off the client", () => {
  const source = readFileSync(
    new URL("./judgeme-api.ts", import.meta.url),
    "utf8",
  );
  const mapping = readFileSync(
    new URL("./judgeme.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /https:\/\/judge\.me\/api\/v1\/reviews\b/);
  assert.match(source, /https:\/\/judge\.me\/api\/v1\/widgets\/product_review/);
  assert.match(source, /https:\/\/judge\.me\/api\/v1\/widgets\/preview_badge/);
  assert.match(source, /revalidate:\s*REVALIDATE_SECONDS/);
  assert.match(source, /server-only/);
  assert.match(mapping, /JUDGEME_API_TOKEN/);
  assert.match(mapping, /JUDGEME_SHOP_DOMAIN/);
  assert.match(mapping, /PUBLIC_STORE_DOMAIN/);
  assert.match(mapping, /SHOPIFY_STORE_DOMAIN/);
  assert.doesNotMatch(`${source}\n${mapping}`, /NEXT_PUBLIC_JUDGEME/);

  const productPage = readFileSync(
    new URL("../app/products/[slug]/page.tsx", import.meta.url),
    "utf8",
  );
  const home = readFileSync(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );
  const listing = readFileSync(
    new URL("../app/products/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(productPage, /withProductReviewJsonLd/);
  assert.match(productPage, /getProductReviews/);
  assert.doesNotMatch(
    home,
    /withProductReviewJsonLd|getProductReviews|aggregateRating/,
  );
  assert.doesNotMatch(
    listing,
    /withProductReviewJsonLd|getProductReviews|aggregateRating/,
  );
});
