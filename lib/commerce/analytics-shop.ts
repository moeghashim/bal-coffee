import "server-only";
import type { ShopAnalytics } from "@shopify/hydrogen";
import { getStorefront, gql } from "./storefront";

/**
 * Server-side resolution of the shop analytics metadata the browser bus needs.
 * `shopId` must be the Shopify Shop GID; we read it from the Storefront API.
 * The storefront runs a single US/EN market, so language/currency are fixed.
 */
const SHOP_ANALYTICS_QUERY = gql(`
  query ShopAnalytics {
    shop {
      id
    }
  }
`);

export async function getShopAnalytics(): Promise<ShopAnalytics | null> {
  try {
    const { data } = await getStorefront().graphql(SHOP_ANALYTICS_QUERY);
    const shopId = (data as { shop?: { id?: string } } | undefined)?.shop?.id;
    if (!shopId) return null;

    return {
      shopId,
      acceptedLanguage: "EN",
      currency: "USD",
      hydrogenSubchannelId: process.env.PUBLIC_STOREFRONT_ID ?? "0",
    } satisfies ShopAnalytics;
  } catch {
    return null;
  }
}
