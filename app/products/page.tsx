import { BenefitsStrip } from "components/bal/benefits-strip";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { ProductCard } from "components/bal/product-card";
import { ProductMedia } from "components/bal/product-media";
import { getProducts } from "lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All products",
  description:
    "Shop naturally caffeine-free coffee made from roasted date seeds.",
};

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 L21 21" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M4 7 H20" />
      <path d="M4 17 H20" />
      <circle cx="9" cy="7" r="2" fill="var(--cream)" />
      <circle cx="15" cy="17" r="2" fill="var(--cream)" />
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
      strokeWidth="1.7"
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
    <button
      type="button"
      style={{
        minHeight: 36,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "0 16px",
        border: "1px solid rgba(77,56,36,0.18)",
        borderRadius: 7,
        background: "rgba(255,252,246,0.76)",
        color: "var(--ink-2)",
        fontSize: 13,
        lineHeight: 1,
      }}
    >
      <span>{label}</span>
      <ChevronDownIcon />
    </button>
  );
}

function Seal() {
  return (
    <svg width="124" height="124" viewBox="0 0 124 124" fill="none" aria-hidden>
      <circle cx="62" cy="62" r="54" stroke="#766f35" strokeWidth="1.2" />
      <circle
        cx="62"
        cy="62"
        r="35"
        stroke="#766f35"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <path
        d="M62 38 C 54 48, 50 56, 50 66 C 50 76, 56 82, 62 86 C 68 82, 74 76, 74 66 C 74 56, 70 48, 62 38 Z"
        stroke="#766f35"
        strokeWidth="1.5"
      />
      <path d="M62 84 V 48" stroke="#766f35" strokeWidth="1.2" />
      <text
        x="62"
        y="18"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="8"
        letterSpacing="2"
        fill="#766f35"
      >
        ROASTED DATE SEEDS
      </text>
      <text
        x="62"
        y="109"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="8"
        letterSpacing="2"
        fill="#766f35"
      >
        CAFFEINE FREE
      </text>
    </svg>
  );
}

export default async function ProductsPage() {
  const products = await getProducts();
  const heroProduct = products[0];
  const chips = ["All Products", ...products.map((product) => product.name)];

  return (
    <>
      <Nav />
      <main>
        <section
          className="bal-products-hero-section"
          style={{
            borderTop: "1px solid rgba(77,56,36,0.12)",
            borderBottom: "1px solid rgba(77,56,36,0.14)",
            background:
              "radial-gradient(circle at 80% 20%, rgba(255,248,232,0.7), transparent 34%), linear-gradient(100deg, #f5ebdc 0%, #ead8bd 55%, #d2b78f 100%)",
          }}
        >
          <div
            className="bal-products-hero"
            style={{
              maxWidth: 1180,
              minHeight: 310,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "0.82fr 1.18fr",
              gap: 48,
              alignItems: "center",
              position: "relative",
              padding: "56px 0",
            }}
          >
            <div>
              <h1
                className="serif"
                style={{
                  fontSize: "clamp(48px, 6vw, 72px)",
                  lineHeight: 0.98,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: 0,
                }}
              >
                All products
              </h1>
              <p
                style={{
                  marginTop: 18,
                  maxWidth: 360,
                  fontSize: 18,
                  lineHeight: 1.35,
                  color: "var(--ink-2)",
                }}
              >
                Naturally caffeine-free coffee made from roasted date seeds.
                Rooted in tradition. Roasted with care.
              </p>
              <div
                style={{
                  marginTop: 28,
                  width: 310,
                  display: "grid",
                  gridTemplateColumns: "24px 1fr",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 18px",
                  border: "1px solid rgba(77,56,36,0.22)",
                  borderRadius: 999,
                  background: "rgba(255,252,246,0.78)",
                  color: "var(--ink-soft)",
                }}
              >
                <SearchIcon />
                <span style={{ fontSize: 14 }}>Search products...</span>
              </div>
            </div>
            <div
              className="bal-products-hero-visual"
              style={{ height: 280, position: "relative", overflow: "hidden" }}
            >
              {heroProduct ? <ProductMedia product={heroProduct} /> : null}
            </div>
            <div
              className="bal-products-seal"
              style={{ position: "absolute", right: 18, top: 28 }}
            >
              <Seal />
            </div>
          </div>
        </section>

        <section
          className="bal-products-shop"
          style={{ padding: "18px 56px 20px", background: "var(--cream)" }}
        >
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div
              className="bal-products-toolbar"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 24,
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
                    style={{
                      minHeight: 36,
                      padding: "0 18px",
                      border: "1px solid rgba(77,56,36,0.18)",
                      borderRadius: 999,
                      background:
                        index === 0 ? "#32180d" : "rgba(255,252,246,0.76)",
                      color: index === 0 ? "#fff4e8" : "var(--ink-2)",
                      fontSize: 13,
                    }}
                  >
                    {chip}
                  </button>
                ))}
                <span
                  className="bal-products-toolbar-divider"
                  style={{
                    width: 1,
                    height: 36,
                    background: "rgba(77,56,36,0.18)",
                    margin: "0 12px",
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
                marginTop: 22,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 18,
              }}
            >
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
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
