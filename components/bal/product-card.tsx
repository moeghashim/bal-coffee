import { AddToCartButton } from "components/bal/add-to-cart-button";
import { ProductMedia } from "components/bal/product-media";
import { getProduct } from "lib/products";
import type { Product } from "lib/products";

// Tag colors cycle through the packaging palette so a row of bags reads as
// distinct labels.
const TAG_COLORS = ["var(--stamp)", "var(--navy)", "var(--olive)"];

type ProductCardProps = {
  product: Product;
  horizontal?: boolean;
  index?: number;
};

export function ProductCard({
  product,
  horizontal = false,
  index = 0,
}: ProductCardProps) {
  const localProduct = getProduct(product.slug);
  const displayName = localProduct?.name || product.name;
  const badge = product.badge || localProduct?.badge;
  const href = `/products/${product.slug}`;

  return (
    <article
      id={`product-${product.slug}`}
      className={`label-panel bal-kraft-card bal-product-card ${
        horizontal ? "bal-product-card-horizontal" : ""
      }`}
      style={{
        display: horizontal ? "grid" : "flex",
        gridTemplateColumns: horizontal ? "0.9fr 1fr" : undefined,
        flexDirection: horizontal ? undefined : "column",
        borderRadius: horizontal ? 16 : 22,
        overflow: "hidden",
        scrollMarginTop: 96,
      }}
    >
      <a
        href={href}
        aria-label={`View ${displayName}`}
        className={horizontal ? undefined : "bal-kraft-card-photo"}
        style={{
          position: "relative",
          display: "block",
          height: horizontal ? undefined : 380,
          minHeight: horizontal ? 190 : undefined,
          borderBottom: horizontal ? undefined : "2px solid var(--ink)",
          borderRight: horizontal ? "2px solid var(--ink)" : undefined,
          overflow: "hidden",
          background: "var(--kraft)",
        }}
      >
        {/* The product shots are tall portraits with the bag or cup in the
            lower half — bias the landscape crop down to keep it in frame. */}
        <ProductMedia
          product={product}
          compact={horizontal}
          fill
          objectPosition="center 70%"
        />
      </a>
      <div
        style={{
          flexGrow: 1,
          padding: horizontal ? "16px 16px 14px" : "24px 24px 22px",
          display: "flex",
          flexDirection: "column",
          gap: horizontal ? 6 : 10,
          minWidth: 0,
        }}
      >
        {badge && !horizontal ? (
          <span
            className="mono"
            style={{
              alignSelf: "flex-start",
              padding: "5px 10px",
              borderRadius: 6,
              background: TAG_COLORS[index % TAG_COLORS.length],
              color: "var(--label)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {badge}
          </span>
        ) : null}
        <h3
          className="label-title"
          style={{ fontSize: horizontal ? 22 : 36, overflowWrap: "anywhere" }}
        >
          <a href={href}>{displayName}</a>
        </h3>
        <p
          className="mono"
          style={{
            fontSize: horizontal ? 10 : 12,
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
          }}
        >
          {product.type}
        </p>
        <div
          style={{
            marginTop: "auto",
            paddingTop: horizontal ? 10 : 16,
            borderTop: "2px dashed rgba(42,31,23,0.35)",
            display: "flex",
            flexDirection: horizontal ? "column" : "row",
            justifyContent: "space-between",
            alignItems: horizontal ? "stretch" : "flex-start",
            gap: horizontal ? 8 : 16,
          }}
        >
          <span
            className="label-face"
            style={{
              fontSize: horizontal ? 22 : 30,
              lineHeight: horizontal ? 1 : "48px",
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            {product.price}
          </span>
          <div style={{ width: horizontal ? "100%" : 170 }}>
            <AddToCartButton
              compact
              product={{
                merchandiseId: product.merchandiseId,
                handle: product.shopifyHandle,
                title: product.name,
                amount: String(product.priceAmount ?? 0),
                currencyCode: product.currencyCode ?? "USD",
                availableForSale: product.availableForSale,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
