"use client";

import { useState } from "react";
import { AddToCartButton } from "components/bal/add-to-cart-button";
import { variantLabel, type Product } from "lib/products";

export function BuyBox({
  product,
  showQuantity = false,
}: {
  product: Product;
  showQuantity?: boolean;
}) {
  const variants = product.variants ?? [];
  const initial =
    variants.find((variant) => variant.availableForSale)?.id ??
    variants[0]?.id ??
    product.merchandiseId;
  const [selectedId, setSelectedId] = useState(initial);
  const selected =
    variants.find((variant) => variant.id === selectedId) ?? variants[0];
  const multiple = variants.length > 1;

  return (
    <div>
      {multiple ? (
        <div
          role="radiogroup"
          aria-label="Choose an option"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          {variants.map((variant) => {
            const selectedOption = variant.id === selected?.id;
            return (
              <button
                key={variant.id}
                type="button"
                role="radio"
                aria-checked={selectedOption}
                onClick={() => setSelectedId(variant.id)}
                style={{
                  minHeight: 36,
                  padding: "0 14px",
                  borderRadius: 999,
                  border: selectedOption
                    ? "1px solid #32180d"
                    : "1px solid rgba(77,56,36,0.22)",
                  background: selectedOption ? "#32180d" : "transparent",
                  color: selectedOption ? "#fff4e8" : "var(--ink)",
                  fontSize: 13,
                }}
              >
                {variantLabel(variant)}
                {variant.availableForSale ? "" : " · Sold out"}
              </button>
            );
          })}
        </div>
      ) : null}
      <p
        className="serif"
        style={{
          marginTop: multiple ? 16 : 0,
          fontSize: 28,
          color: "var(--ink)",
        }}
      >
        {selected?.priceLabel || product.price}
      </p>
      <AddToCartButton
        key={selected?.id || product.merchandiseId || "unavailable"}
        product={{
          merchandiseId: selected?.id || product.merchandiseId,
          handle: product.shopifyHandle,
          title: product.name,
          amount: String(selected?.priceAmount ?? product.priceAmount ?? 0),
          currencyCode: selected?.currencyCode || product.currencyCode || "USD",
          availableForSale:
            selected?.availableForSale ?? product.availableForSale,
        }}
        showQuantity={showQuantity}
      />
    </div>
  );
}
