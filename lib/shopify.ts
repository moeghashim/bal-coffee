export type ShopifyUserError = {
  message: string;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    title: string;
    image?: ShopifyImage | null;
    product: {
      title: string;
      handle: string;
      featuredImage?: ShopifyImage | null;
    };
  };
  cost: {
    totalAmount: ShopifyMoney;
  };
};

export type ShopifyCartDetails = ShopifyCart & {
  lines: ShopifyCartLine[];
  cost: {
    subtotalAmount?: ShopifyMoney | null;
    totalTaxAmount?: ShopifyMoney | null;
    totalAmount: ShopifyMoney;
  };
};

export type ShopifyProduct = {
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage?: ShopifyImage | null;
  images: {
    nodes: ShopifyImage[];
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      price: ShopifyMoney;
    }[];
  };
};

function getShopifyEndpoint() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-10";

  if (!domain || !token) {
    return undefined;
  }

  const origin = domain.startsWith("http") ? domain : `https://${domain}`;

  return {
    url: `${origin}/api/${apiVersion}/graphql.json`,
    token,
  };
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown>,
) {
  const endpoint = getShopifyEndpoint();

  if (!endpoint) {
    throw new Error("Shopify Storefront API is not configured.");
  }

  const response = await fetch(endpoint.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": endpoint.token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const body = (await response.json()) as ShopifyResponse<T>;

  if (!response.ok || body.errors?.length) {
    throw new Error(body.errors?.[0]?.message || "Shopify request failed.");
  }

  return body.data as T;
}

export function getUserError(errors: ShopifyUserError[] = []) {
  return errors[0]?.message;
}

export function formatShopifyPrice(money: ShopifyMoney) {
  const amount = Number(money.amount);
  const hasCents = Number.isFinite(amount) && amount % 1 !== 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(amount);
}

export async function getShopifyProductByHandle(handle: string) {
  const data = await shopifyFetch<{
    product?: ShopifyProduct | null;
  }>(
    /* GraphQL */ `
      query Product($handle: String!) {
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
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `,
    { handle },
  );

  return data.product || undefined;
}

export async function getShopifyProductsByHandles(handles: string[]) {
  const entries = await Promise.all(
    handles.map(async (handle) => {
      try {
        return [handle, await getShopifyProductByHandle(handle)] as const;
      } catch {
        return [handle, undefined] as const;
      }
    }),
  );

  return new Map(entries);
}
