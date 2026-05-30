import { BenefitsStrip } from "components/bal/benefits-strip";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { PosOrder, type PosMenuItem } from "components/bal/pos-order";
import { getPosProducts } from "lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Café order",
  description:
    "Order café drinks and add your badge number. Prepared fresh, naturally caffeine-free.",
};

function EmptyMenuPanel() {
  return (
    <div
      style={{
        padding: "42px",
        border: "1px solid rgba(77,56,36,0.16)",
        borderRadius: 14,
        background: "rgba(255,252,246,0.82)",
      }}
    >
      <h2
        className="serif"
        style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 400 }}
      >
        Café ordering is unavailable right now.
      </h2>
      <p
        style={{
          marginTop: 10,
          maxWidth: 520,
          color: "var(--ink-2)",
          fontSize: 15,
          lineHeight: 1.6,
        }}
      >
        Our café drinks aren&apos;t available to order at the moment. Please
        check back soon.
      </p>
      <a
        href="/products"
        className="mono"
        style={{
          display: "inline-flex",
          marginTop: 24,
          minHeight: 44,
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          borderRadius: 6,
          background: "#32180d",
          color: "#fff4e8",
          fontSize: 11,
          letterSpacing: 0,
        }}
      >
        Shop products
      </a>
    </div>
  );
}

export default async function PosPage() {
  const products = await getPosProducts();

  const items: PosMenuItem[] = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    blurb: product.blurb,
    notes: product.notes,
    imageUrl: product.images?.[0]?.url,
    imageAlt: product.images?.[0]?.altText || `${product.name} drink`,
    accent: product.accent,
    availableForSale: product.availableForSale ?? true,
    variants: (product.variants ?? []).map((variant) => ({
      id: variant.id,
      title: variant.title,
      priceAmount: variant.priceAmount,
      currencyCode: variant.currencyCode,
    })),
  }));

  return (
    <>
      <Nav />
      <main style={{ background: "var(--cream)" }}>
        <section
          className="bal-pos-page"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "34px 50px 24px",
            borderTop: "1px solid rgba(77,56,36,0.12)",
          }}
        >
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <nav
              aria-label="Breadcrumb"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                color: "var(--ink-2)",
                fontSize: 13,
              }}
            >
              <a href="/">Home</a>
              <span style={{ color: "var(--ink-soft)" }}>/</span>
              <span>Café Order</span>
            </nav>

            <div
              className="bal-pos-heading"
              style={{ marginTop: 30, maxWidth: 680, paddingBottom: 34 }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--terra-deep)",
                }}
              >
                Order at the café
              </span>
              <h1
                className="serif"
                style={{
                  marginTop: 14,
                  fontSize: "clamp(48px, 6vw, 72px)",
                  lineHeight: 0.98,
                  fontWeight: 400,
                  color: "var(--ink)",
                }}
              >
                Café Order
              </h1>
              <p
                style={{
                  marginTop: 18,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "var(--ink-2)",
                }}
              >
                Pick your drinks, add your badge number, and head to checkout.
                Every cup is prepared fresh and naturally caffeine-free.
              </p>
            </div>

            {items.length ? <PosOrder items={items} /> : <EmptyMenuPanel />}

            <BenefitsStrip />
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
