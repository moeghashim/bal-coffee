import {
  BRAND_NAME,
  CONDITION_LABEL,
  gtinFromBarcode,
  stockLabel,
  weightLabel,
} from "lib/merchant-listing";
import type { Product } from "lib/products";

export function ProductFacts({ product }: { product: Product }) {
  const weight = weightLabel(product.weight, product.weightUnit);
  const gtin = gtinFromBarcode(product.barcode);
  const facts = [
    stockLabel(product.availableForSale),
    product.size ? `Size ${product.size}` : undefined,
    weight ? `Weight ${weight.label}` : undefined,
    product.format ? `Format ${product.format}` : undefined,
    `Condition ${CONDITION_LABEL}`,
    `Brand ${BRAND_NAME}`,
    gtin ? `GTIN ${gtin.value}` : undefined,
  ].filter((fact): fact is string => Boolean(fact));

  return (
    <div className="bal-product-facts" style={{ marginTop: 12 }}>
      <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink)" }}>
        {facts.join(" · ")}
      </p>
      <p
        style={{
          marginTop: 8,
          fontSize: 13,
          lineHeight: 1.5,
          color: "var(--ink-soft)",
        }}
      >
        US shipping: $9.99 for one bag, $12.99 for 2 or more. Ships in 1–2
        business days; most orders arrive in 2–5 business days. All sales are
        final.{" "}
        <a href="/shipping" style={{ color: "var(--ink)" }}>
          Shipping
        </a>
        {" · "}
        <a href="/returns" style={{ color: "var(--ink)" }}>
          Returns
        </a>
      </p>
    </div>
  );
}
