"use server";

import { BADGE_PATTERN, type PosOrderState } from "lib/pos";
import { getProduct } from "lib/products";
import {
  getUserError,
  shopifyFetch,
  type ShopifyCart,
  type ShopifyUserError,
} from "lib/shopify";

// The badge number is stored as a cart attribute so it carries through to the
// Shopify order ("Additional details" on the order in admin).
const BADGE_ATTRIBUTE_KEY = "Badge Number";

const QUANTITY_FIELD_PREFIX = "quantity_";

async function getProductVariants(handle: string) {
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
      query ProductVariants($handle: String!) {
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

  return data.product?.variants.nodes ?? [];
}

// Trust the product (server-validated) but never the price-bearing variant id
// from the form — confirm it's a real, available variant, else fall back to the
// first available one.
function resolveVariantId(
  variants: { id: string; availableForSale: boolean }[],
  requestedId: string,
) {
  const available = variants.filter((variant) => variant.availableForSale);
  const requested = available.find((variant) => variant.id === requestedId);

  return (requested || available[0])?.id;
}

async function createPosCart(
  lines: { merchandiseId: string; quantity: number }[],
  badge: string,
) {
  const data = await shopifyFetch<{
    cartCreate: {
      cart?: ShopifyCart;
      userErrors: ShopifyUserError[];
    };
  }>(
    /* GraphQL */ `
      mutation CreatePosCart($input: CartInput!) {
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
        lines,
        attributes: [{ key: BADGE_ATTRIBUTE_KEY, value: badge }],
      },
    },
  );

  const error = getUserError(data.cartCreate.userErrors);

  if (error || !data.cartCreate.cart) {
    throw new Error(error || "Unable to create the order.");
  }

  return data.cartCreate.cart;
}

export async function createPosOrder(
  _prevState: PosOrderState,
  formData: FormData,
): Promise<PosOrderState> {
  const badge = String(formData.get("badgeNumber") || "").trim();

  if (!badge) {
    return {
      status: "error",
      message: "Enter your badge number to place the order.",
    };
  }

  if (!BADGE_PATTERN.test(badge)) {
    return {
      status: "error",
      message: "Enter a valid badge number (2–32 letters or numbers).",
    };
  }

  // Collect selected drinks from the quantity_<slug> fields, ignoring anything
  // that isn't a real POS (drink) product. The chosen variant (milk option)
  // rides along in the matching variant_<slug> field.
  const selections: {
    handle: string;
    name: string;
    quantity: number;
    requestedVariantId: string;
  }[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(QUANTITY_FIELD_PREFIX)) {
      continue;
    }

    const slug = key.slice(QUANTITY_FIELD_PREFIX.length);
    const quantity = Math.floor(Number(value));
    const product = getProduct(slug);

    if (
      !product ||
      product.category !== "drink" ||
      !Number.isFinite(quantity) ||
      quantity < 1
    ) {
      continue;
    }

    selections.push({
      handle: product.shopifyHandle,
      name: product.name,
      quantity,
      requestedVariantId: String(formData.get(`variant_${slug}`) || ""),
    });
  }

  if (selections.length === 0) {
    return {
      status: "error",
      message: "Add at least one drink to your order.",
    };
  }

  try {
    const resolved = await Promise.all(
      selections.map(async (selection) => ({
        ...selection,
        variantId: resolveVariantId(
          await getProductVariants(selection.handle),
          selection.requestedVariantId,
        ),
      })),
    );

    const soldOut = resolved.find((item) => !item.variantId);

    if (soldOut) {
      return {
        status: "error",
        message: `${soldOut.name} is sold out right now. Remove it to continue.`,
      };
    }

    const cart = await createPosCart(
      resolved.map((item) => ({
        merchandiseId: item.variantId as string,
        quantity: item.quantity,
      })),
      badge,
    );

    return {
      status: "success",
      message: "Order ready — continue to payment.",
      checkoutUrl: cart.checkoutUrl,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to place the order right now.",
    };
  }
}
