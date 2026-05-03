"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  addProductToCart,
  type AddToCartState,
} from "components/bal/cart-actions";

const initialState: AddToCartState = {
  status: "idle",
  message: "",
};

function SubmitButton({ label, compact }: { label: string; compact: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
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
        opacity: pending ? 0.75 : 1,
      }}
    >
      {pending ? "Adding..." : label}
    </button>
  );
}

export function AddToCartButton({
  productSlug,
  label = "Add to cart",
  compact = false,
  showQuantity = false,
}: {
  productSlug: string;
  label?: string;
  compact?: boolean;
  showQuantity?: boolean;
}) {
  const [state, formAction] = useActionState(addProductToCart, initialState);
  const [quantity, setQuantity] = useState(1);

  return (
    <form action={formAction} style={{ marginTop: compact ? 10 : 16 }}>
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="quantity" value={quantity} />
      <div
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
          label={state.status === "success" ? "Added" : label}
        />
      </div>
      <p
        aria-live="polite"
        style={{
          marginTop: compact ? 7 : 10,
          minHeight: compact ? 16 : 20,
          fontSize: compact ? 11 : 12,
          lineHeight: 1.5,
          color:
            state.status === "error" ? "var(--terra-deep)" : "var(--ink-2)",
        }}
      >
        {state.message}
      </p>
      {state.checkoutUrl ? (
        <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
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
          <a
            href={state.checkoutUrl}
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
            Checkout
          </a>
        </span>
      ) : null}
    </form>
  );
}
