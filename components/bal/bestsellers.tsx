import { ProductCard } from "components/bal/product-card";
import { getFeaturedProducts } from "lib/catalog";
import type { Product } from "lib/products";

export async function Bestsellers({ products }: { products?: Product[] }) {
  const featuredProducts = products ?? (await getFeaturedProducts());
  const price = featuredProducts[0]?.price;

  return (
    <section
      id="shop"
      className="bal-kraft-section"
      style={{ padding: "8px 80px 96px", scrollMarginTop: 96 }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="bal-kraft-collection-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
          }}
        >
          <h2
            className="label-face"
            style={{
              fontSize: "clamp(44px, 5vw, 72px)",
              lineHeight: 1,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Pick your bag
          </h2>
          <p
            className="mono"
            style={{
              paddingBottom: 10,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            {featuredProducts.length} roasts · 340 g each
            {price ? ` · ${price}` : ""}
          </p>
        </div>

        <div
          id="all-products"
          className="bal-kraft-grid-3"
          style={{
            marginTop: 44,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 28,
            scrollMarginTop: 96,
          }}
        >
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>

        <div
          style={{ marginTop: 36, display: "flex", justifyContent: "center" }}
        >
          <a
            href="/products"
            className="label-face bal-kraft-btn bal-kraft-btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 52,
              padding: "0 28px",
              borderRadius: 12,
              border: "2px solid var(--ink)",
              color: "var(--ink)",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            Shop all products
          </a>
        </div>
      </div>
    </section>
  );
}
