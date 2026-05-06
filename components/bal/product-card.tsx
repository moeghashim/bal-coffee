import { AddToCartButton } from "components/bal/add-to-cart-button";
import { ProductMedia } from "components/bal/product-media";
import type { Product } from "lib/products";

type ProductCardProps = {
  product: Product;
  horizontal?: boolean;
};

export function ProductCard({ product, horizontal = false }: ProductCardProps) {
  const hasLongName = product.name.length > 34;

  return (
    <article
      id={`product-${product.slug}`}
      className={`bal-product-card ${horizontal ? "bal-product-card-horizontal" : ""}`}
      style={{
        display: horizontal ? "grid" : "flex",
        gridTemplateColumns: horizontal ? "1fr 0.95fr" : undefined,
        flexDirection: horizontal ? undefined : "column",
        overflow: "hidden",
        border: "1px solid rgba(77,56,36,0.16)",
        borderRadius: 14,
        background: "rgba(255,252,246,0.9)",
        scrollMarginTop: 96,
      }}
    >
      <a
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        style={{
          display: "block",
          aspectRatio: horizontal ? "1.35 / 1" : "1.36 / 1",
        }}
      >
        <ProductMedia product={product} compact={horizontal} />
      </a>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: horizontal ? "22px 22px 18px" : "14px 18px 16px",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          <div>
            <h3
              className="serif"
              style={{
                fontSize: horizontal ? 18 : 26,
                lineHeight: 1,
                fontWeight: 400,
                color: "var(--ink)",
                letterSpacing: 0,
              }}
            >
              <a
                href={`/products/${product.slug}`}
                style={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: horizontal ? 3 : 2,
                  fontSize: hasLongName ? (horizontal ? 15 : 20) : undefined,
                  lineHeight: hasLongName ? 1.12 : undefined,
                }}
              >
                {product.name}
              </a>
            </h3>
            <p
              style={{
                marginTop: 8,
                maxWidth: horizontal ? 160 : 230,
                minHeight: horizontal ? 44 : 42,
                fontSize: horizontal ? 12 : 15,
                lineHeight: 1.2,
                color: "var(--ink-2)",
              }}
            >
              {product.blurb}
            </p>
          </div>
          <p
            className="serif"
            style={{
              flex: "0 0 auto",
              fontSize: horizontal ? 18 : 28,
              lineHeight: 1,
              color: "var(--ink)",
            }}
          >
            {product.price}
          </p>
        </div>
        <div style={{ marginTop: "auto" }}>
          <AddToCartButton productSlug={product.slug} compact />
        </div>
      </div>
    </article>
  );
}
