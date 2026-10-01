"use client";

import { useState } from "react";
import {
  ProductProvider,
  toProductInput,
  useProductForm,
} from "lib/commerce/cart-client";

export type AddToCartProduct = {
  merchandiseId?: string;
  handle: string;
  title: string;
  amount: string;
  currencyCode: string;
  availableForSale?: boolean;
};

function SubmitButton({
  label,
  compact,
  disabled,
  pending,
}: {
  label: string;
  compact: boolean;
  disabled: boolean;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mono"
      style={{
        width: "100%",
        minHeight: compact ? 36 : 40,
        padding: compact ? "9px 14px" : "12px 16px",
        border: "1px solid #32180d",
        borderRadius: 5,
        fontSize: 11,
        letterSpacing: 0,
        background: pending ? "#6e594a" : "#32180d",
        color: "#fff4e8",
        opacity: disabled ? 0.75 : 1,
      }}
    >
      {pending ? "Adding..." : label}
    </button>
  );
}

function AddToCartForm({
  label,
  compact,
  showQuantity,
}: {
  label: string;
  compact: boolean;
  showQuantity: boolean;
}) {
  const { register, formProps, pending, selectedVariant, errors } =
    useProductForm();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = selectedVariant?.availableForSale === false;
  const errorMessage = errors.userErrors?.[0]?.message;
  const message = errorMessage ? errorMessage : added ? "Added to cart." : "";

  return (
    <form
      {...formProps({ afterSubmit: () => setAdded(true) })}
      style={{ marginTop: compact ? 10 : 16 }}
    >
      <input type="hidden" {...register("merchandiseId", {})} />
      <input
        type="hidden"
        readOnly
        {...register("quantity", { value: quantity })}
      />
      <div
        className="bal-add-to-cart-row"
        style={{
          display: showQuantity ? "grid" : "block",
          gridTemplateColumns: showQuantity ? "108px 1fr" : undefined,
          gap: 16,
          alignItems: "center",
        }}
      >
        {showQuantity ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 32px",
              alignItems: "center",
              minHeight: 40,
              border: "1px solid rgba(77,56,36,0.22)",
              borderRadius: 6,
              overflow: "hidden",
              background: "rgba(255,252,246,0.72)",
            }}
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              style={{ height: "100%", fontSize: 18, color: "var(--ink-2)" }}
            >
              -
            </button>
            <span style={{ textAlign: "center", fontSize: 14 }}>
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((value) => value + 1)}
              style={{ height: "100%", fontSize: 18, color: "var(--ink-2)" }}
            >
              +
            </button>
          </div>
        ) : null}
        <SubmitButton
          compact={compact}
          disabled={pending || soldOut}
          pending={pending}
          label={soldOut ? "Sold out" : added ? "Added" : label}
        />
      </div>
      <p
        aria-live="polite"
        style={{
          marginTop: compact ? 7 : 10,
          minHeight: compact ? 16 : 20,
          fontSize: compact ? 11 : 12,
          lineHeight: 1.5,
          color: errorMessage ? "var(--terra-deep)" : "var(--ink-2)",
        }}
      >
        {message}
      </p>
      {added && !errorMessage ? (
        <a
          href="/cart"
          className="mono"
          style={{
            display: "inline-flex",
            marginTop: 8,
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--terra-deep)",
          }}
        >
          View cart
        </a>
      ) : null}
    </form>
  );
}

export function AddToCartButton({
  product,
  label = "Add to cart",
  compact = false,
  showQuantity = false,
}: {
  product: AddToCartProduct;
  label?: string;
  compact?: boolean;
  showQuantity?: boolean;
}) {
  // No sellable variant — render an inert control instead of a broken form.
  if (!product.merchandiseId) {
    return (
      <div style={{ marginTop: compact ? 10 : 16 }}>
        <SubmitButton
          compact={compact}
          disabled
          pending={false}
          label="Sold out"
        />
      </div>
    );
  }

  const productInput = toProductInput({
    merchandiseId: product.merchandiseId,
    handle: product.handle,
    title: product.title,
    amount: product.amount,
    currencyCode: product.currencyCode,
    availableForSale: product.availableForSale ?? true,
  });

  return (
    <ProductProvider product={productInput}>
      <AddToCartForm
        label={label}
        compact={compact}
        showQuantity={showQuantity}
      />
    </ProductProvider>
  );
}
