"use server";

import { cookies } from "next/headers";
import { getProduct } from "lib/products";
import {
  getUserError,
  shopifyFetch,
  type ShopifyCart,
  type ShopifyCartDetails,
  type ShopifyCartLine,
  type ShopifyUserError,
} from "lib/shopify";

const CART_ID_COOKIE = "bal_cart_id";

export type AddToCartState = {
  status: "idle" | "success" | "error";
  message: string;
  checkoutUrl?: string;
  totalQuantity?: number;
};

export type CartLine = ShopifyCartLine;

export type CartDetails = ShopifyCartDetails;

const initialError: AddToCartState = {
  status: "error",
  message: "Unable to add this product right now.",
};

async function getFirstAvailableVariantId(handle: string) {
  const data = await shopifyFetch<{
    product?: {
      variants: {
        nodes: {
          id: string;
          availableForSale: boolean;
        }[];
      };
    };
  }>(
    /* GraphQL */ `
      query ProductVariant($handle: String!) {
        product(handle: $handle) {
          variants(first: 10) {
            nodes {
              id
              availableForSale
            }
          }
        }
      }
    `,
    { handle },
  );

  return data.product?.variants.nodes.find(
    (variant) => variant.availableForSale,
  )?.id;
}

async function createCart(variantId: string, quantity: number) {
  const data = await shopifyFetch<{
    cartCreate: {
      cart?: ShopifyCart;
      userErrors: ShopifyUserError[];
    };
  }>(
    /* GraphQL */ `
      mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            totalQuantity
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      input: {
        lines: [{ merchandiseId: variantId, quantity }],
      },
    },
  );

  const error = getUserError(data.cartCreate.userErrors);

  if (error || !data.cartCreate.cart) {
    throw new Error(error || "Unable to create cart.");
  }

  return data.cartCreate.cart;
}

async function addLineToCart(
  cartId: string,
  variantId: string,
  quantity: number,
) {
  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart?: ShopifyCart;
      userErrors: ShopifyUserError[];
    };
  }>(
    /* GraphQL */ `
      mutation AddCartLine($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  );

  const error = getUserError(data.cartLinesAdd.userErrors);

  if (error || !data.cartLinesAdd.cart) {
    throw new Error(error || "Unable to update cart.");
  }

  return data.cartLinesAdd.cart;
}

async function getCart(cartId: string) {
  const data = await shopifyFetch<{
    cart?: Omit<CartDetails, "lines"> & {
      lines: {
        nodes: CartLine[];
      };
    };
  }>(
    /* GraphQL */ `
      query Cart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 25) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  title
                  product {
                    title
                    handle
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `,
    { cartId },
  );

  return data.cart
    ? {
        ...data.cart,
        lines: data.cart.lines.nodes,
      }
    : undefined;
}

async function saveCart(cart: ShopifyCart) {
  const cookieStore = await cookies();

  cookieStore.set(CART_ID_COOKIE, cart.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function addProductToCart(
  _prevState: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  const slug = String(formData.get("productSlug") || "");
  const quantity = Math.max(1, Number(formData.get("quantity") || 1));
  const product = getProduct(slug);

  if (!product) {
    return initialError;
  }

  try {
    const variantId = await getFirstAvailableVariantId(product.shopifyHandle);

    if (!variantId) {
      return {
        status: "error",
        message: `${product.name} is not available right now.`,
      };
    }

    const cookieStore = await cookies();
    const currentCartId = cookieStore.get(CART_ID_COOKIE)?.value;

    let cart: ShopifyCart;

    try {
      cart = currentCartId
        ? await addLineToCart(currentCartId, variantId, quantity)
        : await createCart(variantId, quantity);
    } catch {
      cart = await createCart(variantId, quantity);
    }

    await saveCart(cart);

    return {
      status: "success",
      message: `${product.name} added to cart.`,
      checkoutUrl: cart.checkoutUrl,
      totalQuantity: cart.totalQuantity,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : initialError.message,
    };
  }
}

export async function getCurrentCart(): Promise<CartDetails | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE)?.value;

  if (!cartId) {
    return undefined;
  }

  try {
    return await getCart(cartId);
  } catch {
    return undefined;
  }
}
