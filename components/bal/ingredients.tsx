import { ProductMedia } from "components/bal/product-media";
import type { Product } from "lib/products";

// "What's in the bag": a nutrition-facts panel read from the catalog (every
// roast shares the same single-ingredient profile) beside a lifestyle photo.
export function Ingredients({ product }: { product?: Product }) {
  if (!product) return null;

  const rows = [
    ...product.nutrition,
    { label: "Caffeine", value: "0 mg", highlight: true },
  ];

  return (
    <section
      id="process"
      className="bal-kraft-section"
      style={{ padding: "0 80px 96px" }}
    >
      <div
        className="bal-kraft-bag-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "560px minmax(0, 1fr)",
          gap: 48,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            padding: "36px 40px",
            background: "var(--label)",
            border: "2px solid var(--ink)",
            borderRadius: 22,
          }}
        >
          <h2
            className="label-face"
            style={{
              fontSize: "clamp(36px, 3.4vw, 48px)",
              lineHeight: 1,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            One ingredient.
          </h2>
          <p style={{ marginTop: 10, fontSize: 16, color: "var(--ink-2)" }}>
            Nothing hidden. Nothing added.
          </p>
          <dl
            style={{
              marginTop: 22,
              borderTop: "10px solid var(--ink)",
              paddingTop: 12,
            }}
          >
            <div
              className="mono"
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: 10,
                borderBottom: "4px solid var(--ink)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <dt>Per serving</dt>
              <dd>1–2 tsp</dd>
            </div>
            {rows.map((row, index) => {
              const last = index === rows.length - 1;
              const highlight = "highlight" in row && row.highlight;

              return (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    fontSize: 17,
                    borderBottom: last
                      ? "4px solid var(--ink)"
                      : "1px solid rgba(42,31,23,0.35)",
                  }}
                >
                  <dt style={{ fontWeight: 600 }}>{row.label}</dt>
                  <dd
                    style={{
                      fontWeight: highlight ? 700 : undefined,
                      color: highlight ? "var(--stamp)" : undefined,
                    }}
                  >
                    {row.value.replace(/^(\d+)g$/, "$1 g")}
                  </dd>
                </div>
              );
            })}
          </dl>
          <p
            className="mono"
            style={{ marginTop: 16, fontSize: 12, letterSpacing: "0.06em" }}
          >
            <span style={{ fontWeight: 600 }}>INGREDIENTS:</span>{" "}
            {product.ingredients}
          </p>
        </div>

        <div
          className="bal-kraft-bag-photo"
          style={{
            position: "relative",
            minHeight: 560,
            borderRadius: 22,
            overflow: "hidden",
            border: "2px solid var(--ink)",
            background: "var(--label)",
          }}
        >
          <ProductMedia
            product={product}
            image={product.images?.[0]}
            fill
            objectPosition="center 92%"
          />
          <p
            className="label-face bal-kraft-chip"
            style={{
              position: "absolute",
              left: 24,
              top: 24,
              padding: "14px 18px",
              background: "var(--label)",
              border: "2px solid var(--ink)",
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 600,
              color: "var(--navy)",
            }}
          >
            Upcycled from the date fruit
          </p>
        </div>
      </div>
    </section>
  );
}
