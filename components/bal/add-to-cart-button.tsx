"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  addProductToCart,
  type AddToCartState,
} from "components/bal/cart-actions";

const initialState: AddToCartState = {
  status: "idle",
  message: "",
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mono"
      style={{
        width: "100%",
        padding: "12px 16px",
        border: "1px solid var(--ink)",
        borderRadius: 2,
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        background: pending ? "var(--ink-soft)" : "transparent",
        color: "var(--ink)",
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
}: {
  productSlug: string;
  label?: string;
}) {
  const [state, formAction] = useActionState(addProductToCart, initialState);

  return (
    <form action={formAction} style={{ marginTop: 16 }}>
      <input type="hidden" name="productSlug" value={productSlug} />
      <SubmitButton label={state.status === "success" ? "Added" : label} />
      <p
        aria-live="polite"
        style={{
          marginTop: 10,
          minHeight: 20,
          fontSize: 12,
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
