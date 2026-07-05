"use client";
import type { CartLine, ProductInput } from "@shopify/hydrogen";
import {
  createCartComponents,
  createProductComponents,
} from "@shopify/hydrogen/react";
import type { cartHandlers } from "./cart-handlers";

// Re-export cart types through the boundary so UI code never imports
// `@shopify/hydrogen` directly (enforced by scripts/check-import-boundary.mjs).
export type { CartLine };

/**
 * Client cart bindings, derived once from the server cart handlers so the store
 * is typed to the same cart shape the `/api/cart` route returns. `import type`
 * keeps the server-only handlers module out of the client bundle — only the
 * type crosses the boundary.
 *
 * These are the app's stable cart hooks; UI imports them from here, never from
 * `@shopify/hydrogen/react` directly (HYDROGEN_MIGRATION.md).
 */
export const { CartProvider, useCart, useCartForm } =
  createCartComponents<typeof cartHandlers>();

/**
 * Product form bindings for add-to-cart. Bal products are single-variant, so
 * callers build a minimal {@link CartProductInput} (see `toProductInput`) and
 * render `<ProductProvider>` around an add-to-cart form driven by
 * `useProductForm`. Requires a `<CartProvider>` ancestor (root layout).
 */
export const { ProductProvider, useProductForm } =
  createProductComponents<ProductInput>();

export type CartProductInput = ProductInput;

/**
 * Build the minimal Hydrogen `ProductInput` for a single-variant product from
 * plain, server-serializable fields. No options / adjacent variants — the one
 * sellable variant is the selected variant.
 */
export function toProductInput(input: {
  merchandiseId: string;
  handle: string;
  title: string;
  amount: string;
  currencyCode: string;
  availableForSale: boolean;
  productId?: string;
  optionName?: string;
  optionValue?: string;
}): CartProductInput {
  // A self-consistent synthetic option so the form store resolves the single
  // variant as selected. The option name/value are internal only — add-to-cart
  // submits the variant GID (merchandiseId), not an option selection — so they
  // don't need to match Shopify's real option ("Size"), only each other.
  const optionName = input.optionName ?? "Title";
  const optionValue = input.optionValue ?? "Default Title";
  const variant = {
    id: input.merchandiseId,
    title: optionValue,
    availableForSale: input.availableForSale,
    selectedOptions: [{ name: optionName, value: optionValue }],
    price: { amount: input.amount, currencyCode: input.currencyCode },
    product: { handle: input.handle, title: input.title },
  };

  return {
    id: input.productId ?? input.handle,
    title: input.title,
    handle: input.handle,
    // Single existing, available variant. "v1_0" is Shopify's encoding for a
    // one-variant product; without it the form store treats the variant as
    // non-existent and the add-to-cart submit no-ops.
    encodedVariantExistence: "v1_0",
    encodedVariantAvailability: "v1_0",
    options: [
      {
        name: optionName,
        optionValues: [{ name: optionValue, firstSelectableVariant: variant }],
      },
    ],
    adjacentVariants: [],
    selectedOrFirstAvailableVariant: variant,
  };
}
