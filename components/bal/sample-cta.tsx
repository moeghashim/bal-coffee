"use client";

import { useState } from "react";
import { AddToCartButton } from "components/bal/add-to-cart-button";
import { useCart } from "lib/commerce/cart-client";
import {
  SAMPLE_GA_CATEGORY,
  SAMPLE_TERMS,
  cartHasSample,
  type SampleOffer,
} from "lib/sample";

function useSampleInCart() {
  const lines = useCart((state) => state.data?.lines?.nodes ?? []);
  return cartHasSample(lines);
}

function SampleAlreadyInCart({ tone }: { tone: "light" | "dark" }) {
  return (
    <p
      style={{
        marginTop: 12,
        fontSize: 13,
        lineHeight: 1.5,
        color: tone === "dark" ? "rgba(244,239,230,0.9)" : "var(--ink-2)",
      }}
    >
      A sample is already in your cart. One sample per order.{" "}
      <a
        href="/cart"
        style={{
          color: tone === "dark" ? "var(--cream)" : "var(--terra-deep)",
          textDecoration: "underline",
        }}
      >
        View cart
      </a>
    </p>
  );
}

function SampleAddButton({ offer }: { offer: SampleOffer }) {
  return (
    <AddToCartButton
      key={offer.merchandiseId}
      compact
      label={`Add a 20g ${offer.blend} sample`}
      product={{
        merchandiseId: offer.merchandiseId,
        handle: "sample",
        title: `20g sample: ${offer.blend}`,
        amount: offer.amount,
        currencyCode: offer.currencyCode,
        availableForSale: true,
        gaCategory: SAMPLE_GA_CATEGORY,
      }}
    />
  );
}

/**
 * Product page call to action under Add to cart. Renders nothing when the
 * blend has no available sample (draft, unpublished, or sold out).
 */
export function SampleCta({ offer }: { offer?: SampleOffer }) {
  const inCart = useSampleInCart();
  if (!offer) return null;

  return (
    <div
      className="bal-sample-cta"
      style={{
        marginTop: 16,
        padding: "14px 16px",
        border: "1px dashed rgba(77,56,36,0.3)",
        borderRadius: 8,
        background: "rgba(255,252,246,0.6)",
      }}
    >
      <p
        className="serif"
        style={{ fontSize: 18, lineHeight: 1.2, color: "var(--ink)" }}
      >
        Not sure yet? Try a 20g sample
      </p>
      <p
        style={{
          marginTop: 6,
          fontSize: 12.5,
          lineHeight: 1.5,
          color: "var(--ink-2)",
        }}
      >
        {SAMPLE_TERMS}
      </p>
      {inCart ? (
        <SampleAlreadyInCart tone="light" />
      ) : (
        <SampleAddButton offer={offer} />
      )}
    </div>
  );
}

/** Homepage blend picker. Renders nothing when no sample is available. */
export function SamplePicker({ offers }: { offers: SampleOffer[] }) {
  const [selectedId, setSelectedId] = useState(offers[0]?.merchandiseId);
  const inCart = useSampleInCart();
  const selected =
    offers.find((offer) => offer.merchandiseId === selectedId) ?? offers[0];
  if (!selected) return null;

  return (
    <div style={{ minWidth: 260 }}>
      <div
        role="radiogroup"
        aria-label="Choose a sample blend"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {offers.map((offer) => {
          const checked = offer.merchandiseId === selected.merchandiseId;
          return (
            <button
              key={offer.merchandiseId}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setSelectedId(offer.merchandiseId)}
              style={{
                minHeight: 36,
                padding: "0 14px",
                borderRadius: 999,
                border: "1px solid var(--cream)",
                background: checked ? "var(--cream)" : "transparent",
                color: checked ? "var(--ink)" : "var(--cream)",
                fontSize: 13,
              }}
            >
              {offer.blend}
            </button>
          );
        })}
      </div>
      {inCart ? (
        <SampleAlreadyInCart tone="dark" />
      ) : (
        <SampleAddButton offer={selected} />
      )}
    </div>
  );
}
