/**
 * Pure Judge.me mapping. No network and no token reads, so unit tests and
 * the product page can share it. Unpublished, hidden, and unmatched reviews
 * are dropped. Zero published reviews produce no rating object and no
 * schema.org markup.
 */

export const JSONLD_REVIEW_LIMIT = 5;
export const VISIBLE_REVIEW_LIMIT = 10;

export type ProductReviewTarget = {
  productId?: string;
  shopifyHandle?: string;
  slug?: string;
};

export type PublishedProductReview = {
  id: string;
  rating: number;
  title: string;
  body: string;
  reviewerName: string;
  publishedAt: string;
};

export type ProductReviewSummary = {
  ratingValue: number;
  reviewCount: number;
  reviews: PublishedProductReview[];
};

export type JudgeMeAggregate = {
  averageRating: number;
  reviewCount: number;
};

export type JudgeMeConfig = {
  token: string;
  shopDomain: string;
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function normalizeShopDomain(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "")
    .trim()
    .toLowerCase();
}

/** Missing token or shop domain disables reviews. Callers must not throw. */
export function judgeMeConfigFromEnv(
  env: Record<string, string | undefined>,
): JudgeMeConfig | null {
  const token = env.JUDGEME_API_TOKEN?.trim() ?? "";
  const shopDomain = normalizeShopDomain(
    env.JUDGEME_SHOP_DOMAIN ||
      env.PUBLIC_STORE_DOMAIN ||
      env.SHOPIFY_STORE_DOMAIN,
  );
  if (!token || !shopDomain) return null;
  return { token, shopDomain };
}

export function shopifyNumericId(productId: string | undefined): string | null {
  return numericId(productId);
}

export function plainReviewText(value: string): string {
  let text = value;
  for (let pass = 0; pass < 2; pass += 1) {
    text = decodeEntities(text);
  }
  return text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseJudgeMeReviewList(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;
  const reviews = (payload as { reviews?: unknown }).reviews;
  return Array.isArray(reviews) ? reviews : null;
}

export function parseJudgeMeAggregate(
  payload: unknown,
): JudgeMeAggregate | null {
  if (typeof payload === "string") return aggregateFromHtml(payload);
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  for (const key of ["badge", "widget", "html", "body"]) {
    const html = record[key];
    if (typeof html !== "string") continue;
    const parsed = aggregateFromHtml(html);
    if (parsed) return parsed;
  }
  return aggregateFromRecord(record);
}

export function mapPublishedProductReviews(
  records: readonly unknown[],
  product: ProductReviewTarget,
): PublishedProductReview[] {
  const byId = new Map<string, PublishedProductReview>();
  for (const record of records) {
    const review = mapPublishedReview(record, product);
    if (!review) continue;
    byId.set(review.id, review);
  }
  return [...byId.values()].sort(newestFirst);
}

export function resolveProductReviewSummary(
  reviews: readonly PublishedProductReview[],
  aggregates: readonly (JudgeMeAggregate | null | undefined)[],
): ProductReviewSummary | null {
  if (reviews.length === 0) return null;
  const computed = averageRating(reviews);
  if (computed === null) return null;
  const badge = aggregates.find(
    (item): item is JudgeMeAggregate =>
      !!item &&
      item.reviewCount >= 1 &&
      item.averageRating >= 1 &&
      item.averageRating <= 5,
  );
  const ratingValue = badge ? badge.averageRating : computed;
  if (ratingValue < 1 || ratingValue > 5) return null;
  return {
    ratingValue,
    reviewCount: badge
      ? Math.max(badge.reviewCount, reviews.length)
      : reviews.length,
    reviews: reviews.slice(0, VISIBLE_REVIEW_LIMIT),
  };
}

export function formatRating(value: number): string | null {
  if (!Number.isFinite(value) || value < 1 || value > 5) return null;
  const rounded = Math.round(value * 10) / 10;
  if (rounded < 1 || rounded > 5) return null;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * Adds aggregateRating and a few Review entries to an existing Product
 * document. Any other @type, including Organization, is returned unchanged.
 * Zero published reviews leave the document untouched.
 */
export function withProductReviewJsonLd<T extends Record<string, unknown>>(
  jsonLd: T,
  summary: ProductReviewSummary | null | undefined,
): T & {
  aggregateRating?: Record<string, unknown>;
  review?: Record<string, unknown>[];
} {
  if (jsonLd["@type"] !== "Product") return jsonLd;
  if (!summary || summary.reviewCount < 1 || summary.reviews.length < 1) {
    return jsonLd;
  }
  const ratingValue = formatRating(summary.ratingValue);
  if (!ratingValue) return jsonLd;
  const review = summary.reviews
    .slice(0, JSONLD_REVIEW_LIMIT)
    .map(reviewJsonLd)
    .filter((entry): entry is Record<string, unknown> => entry !== null);
  if (review.length === 0) return jsonLd;
  return {
    ...jsonLd,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount: summary.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review,
  };
}

function reviewJsonLd(
  review: PublishedProductReview,
): Record<string, unknown> | null {
  const ratingValue = formatRating(review.rating);
  const name = review.reviewerName.trim();
  const datePublished = review.publishedAt.slice(0, 10);
  if (!ratingValue || !name || !/^\d{4}-\d{2}-\d{2}$/.test(datePublished)) {
    return null;
  }
  const entry: Record<string, unknown> = {
    "@type": "Review",
    author: {
      "@type": "Person",
      name,
    },
    datePublished,
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
  };
  if (review.title) entry.name = review.title;
  if (review.body) entry.reviewBody = review.body;
  return entry;
}

function mapPublishedReview(
  record: unknown,
  product: ProductReviewTarget,
): PublishedProductReview | null {
  if (!record || typeof record !== "object") return null;
  const review = record as Record<string, unknown>;
  if (!isPublishedVisible(review) || !matchesProduct(review, product)) {
    return null;
  }
  const id = reviewId(review);
  const rating = integerRating(review.rating);
  const reviewerName = reviewerDisplayName(review);
  const publishedAt = isoTimestamp(review.created_at);
  if (!id || rating === null || !reviewerName || !publishedAt) return null;
  return {
    id,
    rating,
    title: textField(review.title),
    body: textField(review.body),
    reviewerName,
    publishedAt,
  };
}

function isPublishedVisible(review: Record<string, unknown>): boolean {
  if (
    review.hidden === true ||
    review.hidden === "true" ||
    review.hidden === 1
  ) {
    return false;
  }
  if (review.published === false || review.published === "false") return false;
  if (typeof review.curated === "string" && review.curated !== "ok") {
    return false;
  }
  return (
    review.curated === "ok" ||
    review.published === true ||
    review.published === "true"
  );
}

function matchesProduct(
  review: Record<string, unknown>,
  product: ProductReviewTarget,
): boolean {
  const external = numericId(review.product_external_id);
  const productId = shopifyNumericId(product.productId);
  if (external && productId && external === productId) return true;
  const handle =
    typeof review.product_handle === "string"
      ? review.product_handle.trim().toLowerCase()
      : "";
  if (!handle) return false;
  return [product.shopifyHandle, product.slug]
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    )
    .some((value) => value.trim().toLowerCase() === handle);
}

function reviewerDisplayName(review: Record<string, unknown>): string {
  const reviewer = review.reviewer;
  if (!reviewer || typeof reviewer !== "object") return "";
  const name = (reviewer as { name?: unknown }).name;
  if (typeof name !== "string") return "";
  const text = plainReviewText(name);
  if (!text || text.includes("@")) return "";
  return text;
}

function textField(value: unknown): string {
  return typeof value === "string" ? plainReviewText(value) : "";
}

function reviewId(review: Record<string, unknown>): string | null {
  const id = review.id;
  if (typeof id === "number" && Number.isFinite(id))
    return String(Math.trunc(id));
  if (typeof id === "string" && id.trim()) return id.trim();
  return null;
}

function integerRating(value: unknown): number | null {
  const rating =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  return rating;
}

function isoTimestamp(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function numericId(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return String(Math.trunc(value));
  }
  if (typeof value !== "string") return null;
  const match = value.trim().match(/(\d+)$/);
  if (!match?.[1] || match[1] === "0") return null;
  return match[1];
}

function newestFirst(a: PublishedProductReview, b: PublishedProductReview) {
  if (a.publishedAt !== b.publishedAt) {
    return a.publishedAt < b.publishedAt ? 1 : -1;
  }
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
}

function averageRating(
  reviews: readonly PublishedProductReview[],
): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}

function aggregateFromHtml(html: string): JudgeMeAggregate | null {
  const rating = html.match(
    /data-average-rating\s*=\s*["']([0-9]+(?:\.[0-9]+)?)["']/i,
  );
  const count = html.match(/data-number-of-reviews\s*=\s*["'](\d+)["']/i);
  if (!rating?.[1] || !count?.[1]) return null;
  const averageRating = Number(rating[1]);
  const reviewCount = Number(count[1]);
  if (!Number.isFinite(averageRating) || !Number.isFinite(reviewCount)) {
    return null;
  }
  return { averageRating, reviewCount };
}

function aggregateFromRecord(
  record: Record<string, unknown>,
): JudgeMeAggregate | null {
  const averageRating = finiteNumber(
    record.average_rating ?? record.averageRating,
  );
  const reviewCount = finiteNumber(
    record.number_of_reviews ?? record.numberOfReviews ?? record.review_count,
  );
  if (averageRating === null || reviewCount === null) return null;
  return { averageRating, reviewCount };
}

function finiteNumber(value: unknown): number | null {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(number) ? number : null;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (match, digits: string) =>
      fromCodePoint(Number(digits), match),
    )
    .replace(/&#x([0-9a-f]+);/gi, (match, hex: string) =>
      fromCodePoint(Number.parseInt(hex, 16), match),
    )
    .replace(/&([a-z]+);/gi, (match, name: string) => {
      return NAMED_ENTITIES[name.toLowerCase()] ?? match;
    });
}

function fromCodePoint(code: number, fallback: string): string {
  if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) return fallback;
  if (code >= 0xd800 && code <= 0xdfff) return "";
  return String.fromCodePoint(code);
}
