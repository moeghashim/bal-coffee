import { ProductCard } from "components/bal/product-card";
import { getDrinkProducts } from "lib/catalog";

export async function Drinks() {
  const drinks = await getDrinkProducts();
  if (drinks.length === 0) return null;
  const missingPhoto = drinks.some((drink) => drink.missingImage);

  return (
    <section
      id="drinks"
      style={{
        padding: "24px 56px 88px",
        background: "var(--cream)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
          }}
        >
          Café
        </p>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 24,
          }}
        >
          <h2
            className="serif"
            style={{
              fontSize: "clamp(34px, 3vw, 48px)",
              lineHeight: 1,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            Drinks
          </h2>
          <a href="/drinks" style={{ color: "var(--ink)", fontSize: 14 }}>
            View the menu →
          </a>
        </div>
        <p
          style={{
            marginTop: 16,
            maxWidth: 460,
            fontSize: 15,
            lineHeight: 1.45,
            color: "var(--ink-2)",
          }}
        >
          Prepared in the café. Choose whole milk or oat when a drink offers
          both.
        </p>
        {missingPhoto ? (
          <p style={{ marginTop: 8, fontSize: 13, color: "var(--ink-soft)" }}>
            A few drinks are still waiting on photos.
          </p>
        ) : null}
        <div
          className="bal-products-grid"
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
          }}
        >
          {drinks.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
