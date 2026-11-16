import "server-only";

import { cache } from "react";
import {
  judgeMeConfigFromEnv,
  mapPublishedProductReviews,
  parseJudgeMeAggregate,
  parseJudgeMeReviewList,
  resolveProductReviewSummary,
  shopifyNumericId,
  type JudgeMeConfig,
  type ProductReviewSummary,
  type ProductReviewTarget,
} from "lib/judgeme";

/**
 * Server-only Judge.me reads. JUDGEME_API_TOKEN is a private token and is
 * sent only on these requests. A missing token, a bad response, a timeout,
 * or zero published reviews returns null so the page renders nothing and
 * the build still succeeds.
 */

const REVIEWS_ENDPOINT = "https://judge.me/api/v1/reviews";
const PRODUCT_WIDGET_ENDPOINT =
  "https://judge.me/api/v1/widgets/product_review";
const PREVIEW_BADGE_ENDPOINT = "https://judge.me/api/v1/widgets/preview_badge";

const REVALIDATE_SECONDS = 60 * 60;
const TIMEOUT_MS = 8_000;
const PER_PAGE = 100;
const MAX_PAGES = 5;

export async function getProductReviews(
  product: ProductReviewTarget,
): Promise<ProductReviewSummary | null> {
  const config = judgeMeConfigFromEnv(process.env);
  if (!config) return null;
  const identity = productQuery(product);
  if (!identity) return null;

  try {
    const [records, widgetBody, badgeBody] = await Promise.all([
      loadReviewRecords(config.token, config.shopDomain),
      judgeMeFetch(
        judgeMeUrl(PRODUCT_WIDGET_ENDPOINT, config, {
          ...identity,
          page: "1",
          per_page: "5",
        }),
      ),
      judgeMeFetch(judgeMeUrl(PREVIEW_BADGE_ENDPOINT, config, identity)),
    ]);
    if (records === null) return null;
    return resolveProductReviewSummary(
      mapPublishedProductReviews(records, product),
      [parseJudgeMeAggregate(badgeBody), parseJudgeMeAggregate(widgetBody)],
    );
  } catch {
    return null;
  }
}

const loadReviewRecords = cache(async (token: string, shopDomain: string) => {
  return fetchReviewPages({ token, shopDomain });
});

async function fetchReviewPages(
  config: JudgeMeConfig,
): Promise<unknown[] | null> {
  const collected: unknown[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const body = await judgeMeFetch(
      judgeMeUrl(REVIEWS_ENDPOINT, config, {
        page: String(page),
        per_page: String(PER_PAGE),
      }),
    );
    const list = body === null ? null : parseJudgeMeReviewList(body);
    if (list === null) return page === 1 ? null : collected;
    if (list.length === 0) break;

    let added = 0;
    for (const review of list) {
      const id = rawReviewId(review);
      if (id && seen.has(id)) continue;
      if (id) seen.add(id);
      collected.push(review);
      added += 1;
    }
    if (added === 0 || list.length < PER_PAGE) break;
  }

  return collected;
}

async function judgeMeFetch(url: URL): Promise<unknown | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const text = await response.text();
    if (!text.trim()) return null;
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

function judgeMeUrl(
  endpoint: string,
  config: JudgeMeConfig,
  params: Record<string, string> = {},
) {
  const url = new URL(endpoint);
  url.searchParams.set("shop_domain", config.shopDomain);
  url.searchParams.set("api_token", config.token);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return url;
}

function productQuery(
  product: ProductReviewTarget,
): Record<string, string> | null {
  const externalId = shopifyNumericId(product.productId);
  if (externalId) return { external_id: externalId };
  const handle = product.shopifyHandle?.trim();
  if (handle) return { handle };
  return null;
}

function rawReviewId(review: unknown): string | null {
  if (!review || typeof review !== "object") return null;
  const id = (review as { id?: unknown }).id;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  if (typeof id === "string" && id.trim()) return id.trim();
  return null;
}
