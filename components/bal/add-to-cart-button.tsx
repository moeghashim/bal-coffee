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
  disabled,
  pending,
}: {
  label: string;
  disabled: boolean;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="label-btn"
      style={{
        width: "100%",
        padding: "0 20px",
        background: pending ? "#4a5670" : undefined,
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
    <form {...formProps({ afterSubmit: () => setAdded(true) })}>
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
          gridTemplateColumns: showQuantity ? "124px 1fr" : undefined,
          gap: 14,
          alignItems: "center",
        }}
      >
        {showQuantity ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 40px",
              alignItems: "center",
              minHeight: 48,
              border: "2px solid var(--ink)",
              borderRadius: 10,
              overflow: "hidden",
              background: "var(--label)",
            }}
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              style={{ height: "100%", fontSize: 20, color: "var(--ink)" }}
            >
              -
            </button>
            <span
              className="label-face"
              style={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((value) => value + 1)}
              style={{ height: "100%", fontSize: 20, color: "var(--ink)" }}
            >
              +
            </button>
          </div>
        ) : null}
        <SubmitButton
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
          color: errorMessage ? "var(--stamp)" : "var(--ink-2)",
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
            marginTop: 4,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--stamp)",
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
    return <SubmitButton disabled pending={false} label="Sold out" />;
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
