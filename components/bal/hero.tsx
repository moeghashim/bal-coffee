import { ProductMedia } from "components/bal/product-media";
import type { Product } from "lib/products";

function CaffeineStamp() {
  return (
    <div
      className="bal-kraft-stamp"
      aria-hidden
      style={{
        position: "absolute",
        right: -64,
        top: -40,
        width: 170,
        height: 170,
        borderRadius: 999,
        background: "var(--stamp)",
        border: "3px dashed rgba(247,238,221,0.7)",
        transform: "rotate(-12deg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <span
        className="label-face bal-kraft-stamp-value"
        style={{
          fontSize: 44,
          fontWeight: 700,
          lineHeight: 1,
          color: "var(--label)",
        }}
      >
        0 mg
      </span>
      <span
        className="mono bal-kraft-stamp-caption"
        style={{
          marginTop: 4,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.2em",
          color: "var(--label)",
        }}
      >
        CAFFEINE
      </span>
    </div>
  );
}

export function Hero({ product }: { product?: Product }) {
  return (
    <section
      className="bal-kraft-hero"
      style={{ padding: "48px 80px 96px", overflow: "hidden" }}
    >
      <div
        className="bal-kraft-hero-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 720px) minmax(0, 500px)",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 48,
        }}
      >
        <div
          className="bal-kraft-label bal-kraft-shadow"
          style={{
            position: "relative",
            containerType: "inline-size",
            minHeight: 580,
            padding: "60px 64px",
            background: "var(--label)",
            border: "2px solid var(--ink)",
            borderRadius: 22,
            boxShadow: "10px 10px 0 var(--ink)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            className="mono bal-kraft-eyebrow"
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            Date seed coffee · 340 g
          </p>
          <h1
            className="label-face"
            style={{
              marginTop: 22,
              // "CAFFEINE-FREE." sets ~6.2em wide in Oswald 700, so 15% of the
              // card's width keeps it on one line at every breakpoint.
              fontSize: "clamp(34px, 15cqi, 112px)",
              lineHeight: 0.93,
              fontWeight: 700,
              color: "var(--navy)",
            }}
          >
            <span style={{ display: "block", whiteSpace: "nowrap" }}>
              Caffeine-free.
            </span>
            <span
              style={{
                display: "block",
                whiteSpace: "nowrap",
                color: "var(--stamp)",
              }}
            >
              Full flavor.
            </span>
          </h1>
          <p
            style={{
              marginTop: 30,
              maxWidth: 500,
              fontSize: 18,
              lineHeight: 1.55,
              color: "#3d2f23",
            }}
          >
            Roasted from upcycled date seeds in small batches. Brews like
            coffee, pours like tradition — with nothing but the seed in the bag.
          </p>
          <div
            className="bal-kraft-hero-actions"
            style={{
              marginTop: "auto",
              paddingTop: 36,
              display: "flex",
              gap: 14,
            }}
          >
            <a
              href="#shop"
              className="label-face bal-kraft-btn bal-kraft-btn-navy"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 58,
                padding: "0 32px",
                borderRadius: 12,
                background: "var(--navy)",
                color: "var(--label)",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              Shop the bags
            </a>
            <a
              href="#process"
              className="label-face bal-kraft-btn bal-kraft-btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 58,
                padding: "0 28px",
                borderRadius: 12,
                border: "2px solid var(--navy)",
                color: "var(--navy)",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              What&apos;s inside
            </a>
          </div>
          <CaffeineStamp />
        </div>

        <div
          className="bal-kraft-hero-photo"
          style={{
            position: "relative",
            width: 500,
            aspectRatio: "500 / 720",
            borderRadius: 22,
            overflow: "hidden",
            border: "2px solid var(--ink)",
            transform: "rotate(2deg)",
            background: "var(--label)",
          }}
        >
          {product ? (
            <ProductMedia
              product={product}
              image={product.images?.[0]}
              fill
              priority
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
