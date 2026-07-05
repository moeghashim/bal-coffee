import "server-only";
import type { ShopifyProduct } from "lib/shopify";
import { getStorefront, gql } from "./storefront";

/**
 * Product read path, backed by the Hydrogen Storefront client. Returns the
 * existing `ShopifyProduct` shape so callers (lib/products.ts) are unaffected by
 * the swap from the hand-rolled fetch layer.
 */
const PRODUCT_QUERY = gql(`
  query CommerceProduct($handle: String!) {
    product(handle: $handle) {
      handle
      title
      description
      availableForSale
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 6) {
        nodes {
          url
          altText
          width
          height
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`);

export async function getStorefrontProductByHandle(
  handle: string,
): Promise<ShopifyProduct | undefined> {
  const { data } = await getStorefront().graphql(PRODUCT_QUERY, {
    variables: { handle },
  });

  return (data?.product as ShopifyProduct | null | undefined) ?? undefined;
}

export async function getStorefrontProductsByHandles(handles: string[]) {
  const entries = await Promise.all(
    handles.map(async (handle) => {
      try {
        return [handle, await getStorefrontProductByHandle(handle)] as const;
      } catch {
        return [handle, undefined] as const;
      }
    }),
  );

  return new Map(entries);
}
