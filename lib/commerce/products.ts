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
      id
      handle
      title
      vendor
      description
      productType
      tags
      availableForSale
      updatedAt
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
      options {
        name
        optionValues {
          name
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 30) {
        nodes {
          id
          title
          availableForSale
          sku
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`);

const CATALOG_QUERY = gql(`
  query CommerceCatalog($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        vendor
        description
        productType
        tags
        availableForSale
        updatedAt
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
        options {
          name
          optionValues {
            name
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 30) {
          nodes {
            id
            title
            availableForSale
            sku
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              width
              height
            }
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

export async function getStorefrontCatalog(): Promise<ShopifyProduct[]> {
  const { data } = await getStorefront().graphql(CATALOG_QUERY, {
    variables: { first: 50 },
  });
  const nodes = data?.products?.nodes ?? [];
  return nodes.filter((node) => Boolean(node)) as ShopifyProduct[];
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
