import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { PageShell } from "components/bal/page-shell";
import { ProductCard } from "components/bal/product-card";
import { getDrinkProducts } from "lib/catalog";

export const metadata = {
  title: "Café drinks",
  description:
    "Café drinks from BAL Coffee, including milk options when a drink has them.",
  robots: { index: false, follow: true },
};

export default async function DrinksPage() {
  const drinks = await getDrinkProducts();

  if (drinks.length === 0) {
    return (
      <PageShell
        eyebrow="Café"
        title="Café drinks"
        intro="Prepared drinks will show up here once they are published to the online shop. Bagged coffee is available now."
      >
        <p>
          <a href="/products" style={{ color: "var(--terra-deep)" }}>
            Shop bagged coffee →
          </a>
        </p>
      </PageShell>
    );
  }

  const missingPhoto = drinks.some((drink) => drink.missingImage);

  return (
    <>
      <Nav />
      <main style={{ background: "var(--cream)", padding: "48px 56px 80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            Café
          </p>
          <h1
            className="serif"
            style={{
              marginTop: 12,
              fontSize: "clamp(42px, 5vw, 64px)",
              lineHeight: 0.98,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            Drinks
          </h1>
          <p
            style={{
              marginTop: 16,
              maxWidth: 520,
              fontSize: 16,
              lineHeight: 1.5,
              color: "var(--ink-2)",
            }}
          >
            Choose whole milk or oat on the drink page when both are offered.
            Shipping is calculated at checkout.
          </p>
          {missingPhoto ? (
            <p
              style={{ marginTop: 10, fontSize: 14, color: "var(--ink-soft)" }}
            >
              Drinks without a photo yet use a placeholder until one is added in
              Shopify.
            </p>
          ) : null}
          <div
            className="bal-products-grid"
            style={{
              marginTop: 32,
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
      </main>
      <Footer />
      <Grain />
    </>
  );
}
