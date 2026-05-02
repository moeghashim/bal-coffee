"use client";

import { addItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { Product } from "lib/shopify/types";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="mono"
      style={{
        width: "100%",
        padding: "12px 16px",
        border: "1px solid var(--ink)",
        borderRadius: 2,
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        background: isDisabled ? "transparent" : "transparent",
        color: "var(--ink)",
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      {pending ? "Adding…" : disabled ? "Sold out" : "Quick Shop"}
    </button>
  );
}

export function QuickShopButton({ product }: { product: Product }) {
  const { addCartItem } = useCart();
  const [, formAction] = useActionState(addItem, null);
  const variant = product.variants[0];
  const available = product.availableForSale && Boolean(variant);

  if (!variant) {
    return <SubmitButton disabled />;
  }

  return (
    <form
      action={async () => {
        addCartItem(variant, product);
        formAction.bind(null, variant.id)();
      }}
    >
      <SubmitButton disabled={!available} />
    </form>
  );
}
