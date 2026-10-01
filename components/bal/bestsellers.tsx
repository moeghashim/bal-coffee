import { ProductCard } from "components/bal/product-card";
import { getFeaturedProducts } from "lib/catalog";

export async function Bestsellers() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section
      id="shop"
      className="bal-bestsellers"
      style={{
        padding: "88px 56px 96px",
        background: "var(--cream)",
      }}
    >
      <div
        id="all-products"
        className="bal-bestsellers-grid"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.82fr repeat(3, 1fr)",
          gap: 18,
          alignItems: "stretch",
          scrollMarginTop: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: 18,
          }}
        >
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            Bestsellers
          </p>
          <h2
            className="serif"
            style={{
              marginTop: 14,
              fontSize: "clamp(34px, 3vw, 48px)",
              lineHeight: 1,
              fontWeight: 400,
              color: "var(--ink)",
              letterSpacing: 0,
            }}
          >
            Our most
            <br />
            loved brews
          </h2>
          <p
            style={{
              marginTop: 20,
              fontSize: 15,
              lineHeight: 1.45,
              color: "var(--ink-2)",
              maxWidth: 270,
            }}
          >
            Three ways to experience BAL. Each one crafted to bring warmth,
            comfort, and connection to your daily ritual.
          </p>
          <a
            href="/products"
            className="mono"
            style={{
              marginTop: 28,
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "12px 20px",
              background: "#32180d",
              color: "#fff4e8",
              fontSize: 11,
              letterSpacing: 0,
              borderRadius: 6,
            }}
          >
            Shop all products
          </a>
        </div>
        {featuredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
