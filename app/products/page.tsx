import { BenefitsStrip } from "components/bal/benefits-strip";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { ProductCard } from "components/bal/product-card";
import {
  ProductImagePreload,
  ProductMedia,
} from "components/bal/product-media";
import { getProducts } from "lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All products",
  description:
    "Shop naturally caffeine-free coffee made from roasted date seeds.",
};

function FilterIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M4 7 H20" />
      <path d="M4 17 H20" />
      <circle cx="9" cy="7" r="2" fill="var(--label)" />
      <circle cx="15" cy="17" r="2" fill="var(--label)" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ flex: "0 0 auto" }}
    >
      <path d="M4 6 L8 10 L12 6" />
    </svg>
  );
}

function DropdownButton({ label }: { label: string }) {
  return (
    <button type="button" className="label-chip" style={{ gap: 8 }}>
      <span>{label}</span>
      <ChevronDownIcon />
    </button>
  );
}

function CaffeineStamp() {
  return (
    <div
      className="label-stamp bal-products-seal"
      aria-hidden
      style={{
        position: "absolute",
        right: -18,
        top: -26,
        width: 128,
        height: 128,
        zIndex: 1,
      }}
    >
      <span
        className="label-face"
        style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}
      >
        0 mg
      </span>
      <span
        className="mono"
        style={{
          marginTop: 3,
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: "0.2em",
        }}
      >
        CAFFEINE
      </span>
    </div>
  );
}

export default async function ProductsPage() {
  const products = await getProducts();
  const heroProduct = products[0];
  const chips = ["All Products", ...products.map((product) => product.name)];

  return (
    <>
      <ProductImagePreload image={heroProduct?.images?.[0]} />
      <Nav />
      <main>
        <section
          className="bal-products-hero-section"
          style={{ padding: "0 80px" }}
        >
          <div
            className="bal-products-hero"
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 0.9fr",
              gap: 56,
              alignItems: "center",
              padding: "48px 0 40px",
            }}
          >
            <div>
              <p className="label-kicker">
                The collection · {products.length} roasts
              </p>
              <h1
                className="label-title"
                style={{
                  marginTop: 16,
                  fontSize: "clamp(56px, 7vw, 96px)",
                  lineHeight: 0.92,
                }}
              >
                All products
              </h1>
              <p
                style={{
                  marginTop: 20,
                  maxWidth: 420,
                  fontSize: 18,
                  lineHeight: 1.5,
                  color: "var(--ink-2)",
                }}
              >
                Naturally caffeine-free coffee made from roasted date seeds.
                Rooted in tradition. Roasted with care.
              </p>
            </div>
            <div style={{ position: "relative" }}>
              <div
                className="bal-products-hero-visual"
                style={{
                  position: "relative",
                  height: 340,
                  borderRadius: 22,
                  overflow: "hidden",
                  border: "2px solid var(--ink)",
                  background: "var(--label)",
                  transform: "rotate(1.5deg)",
                }}
              >
                {heroProduct ? (
                  <ProductMedia
                    product={heroProduct}
                    fill
                    priority
                    objectPosition="center 70%"
                  />
                ) : null}
              </div>
              <CaffeineStamp />
            </div>
          </div>
        </section>

        <section
          className="bal-products-shop"
          style={{ padding: "8px 80px 96px" }}
        >
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div
              className="bal-products-toolbar"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 24,
                paddingBottom: 22,
                borderBottom: "2px solid var(--ink)",
              }}
            >
              <div
                className="bal-products-chip-row"
                style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
              >
                {chips.map((chip, index) => (
                  <button
                    key={chip}
                    type="button"
                    className={`label-chip ${index === 0 ? "label-chip-active" : ""}`}
                  >
                    {chip}
                  </button>
                ))}
                <span
                  className="bal-products-toolbar-divider"
                  style={{
                    width: 2,
                    height: 34,
                    background: "rgba(42,31,23,0.3)",
                    margin: "0 8px",
                  }}
                />
                {["Roast Profile", "Brew Type"].map((label) => (
                  <DropdownButton key={label} label={label} />
                ))}
              </div>
              <div
                className="bal-products-sort-row"
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <DropdownButton label="Best Selling" />
                <FilterIcon />
              </div>
            </div>

            <div
              className="bal-products-grid"
              style={{
                marginTop: 32,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 26,
              }}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  index={index}
                />
              ))}
            </div>
            <BenefitsStrip />
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
