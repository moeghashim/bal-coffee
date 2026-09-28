import { AddToCartButton } from "components/bal/add-to-cart-button";
import { ProductMedia } from "components/bal/product-media";
import type { Product } from "lib/products";

// Tag colors cycle through the packaging palette so the three bags read as
// distinct labels.
const TAG_COLORS = ["var(--stamp)", "var(--navy)", "var(--olive)"];

export function LabelCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <article
      id={`product-${product.slug}`}
      className="bal-kraft-card"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--label)",
        border: "2px solid var(--ink)",
        borderRadius: 22,
        overflow: "hidden",
        scrollMarginTop: 96,
      }}
    >
      <a
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="bal-kraft-card-photo"
        style={{
          position: "relative",
          display: "block",
          height: 380,
          borderBottom: "2px solid var(--ink)",
          overflow: "hidden",
        }}
      >
        {/* The product shots are tall portraits with the bag or cup in the
            lower half — bias the landscape crop down to keep it in frame. */}
        <ProductMedia product={product} fill objectPosition="center 70%" />
      </a>
      <div
        style={{
          flexGrow: 1,
          padding: "24px 24px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
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
          {product.badge}
        </span>
        <h3
          className="label-face"
          style={{
            fontSize: 36,
            lineHeight: 1,
            fontWeight: 700,
            color: "var(--navy)",
          }}
        >
          <a href={`/products/${product.slug}`}>{product.name}</a>
        </h3>
        <p
          className="mono"
          style={{
            fontSize: 12,
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
            paddingTop: 16,
            borderTop: "2px dashed rgba(42,31,23,0.35)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <span
            className="label-face"
            style={{
              fontSize: 30,
              lineHeight: "48px",
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            {product.price}
          </span>
          <div style={{ width: 170 }}>
            <AddToCartButton
              variant="label"
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
