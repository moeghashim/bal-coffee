import { getProduct } from "lib/shopify";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { QuickShopButton } from "./quick-shop-button";

const HANDLES = ["arabica", "groundate", "datespresso"] as const;

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;
  const description = (product.description || "").slice(0, 120);
  const subtitle = product.tags?.find((t) => !t.startsWith("hidden"));

  return (
    <article
      style={{
        background: "var(--cream-3)",
        border: "1px solid var(--line-soft)",
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        href={`/product/${product.handle}`}
        style={{
          position: "relative",
          aspectRatio: "5 / 4",
          background: "var(--cream-2)",
          display: "block",
        }}
      >
        {product.featuredImage?.url && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        )}
      </Link>
      <div
        style={{
          padding: "20px 22px 22px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Link
          href={`/product/${product.handle}`}
          className="serif"
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          {product.title}
        </Link>
        {subtitle && (
          <p
            className="mono"
            style={{
              marginTop: 4,
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            {subtitle}
          </p>
        )}
        {description && (
          <p
            style={{
              marginTop: 14,
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "var(--ink-2)",
            }}
          >
            {description}
            {product.description.length > 120 ? "…" : ""}
          </p>
        )}
        <p
          className="serif"
          style={{
            marginTop: 16,
            fontSize: 18,
            color: "var(--ink)",
          }}
        >
          {formatPrice(price.amount, price.currencyCode)}
        </p>
        <div style={{ marginTop: 16 }}>
          <QuickShopButton product={product} />
        </div>
      </div>
    </article>
  );
}

export async function Bestsellers() {
  const products = (
    await Promise.all(HANDLES.map((handle) => getProduct(handle)))
  ).filter((p): p is Product => Boolean(p));

  return (
    <section
      id="shop"
      className="bal-bestsellers"
      style={{
        padding: "100px 56px",
        background: "var(--cream)",
      }}
    >
      <div
        className="bal-bestsellers-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.85fr 1fr 1fr 1fr",
          gap: 28,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: 12,
          }}
        >
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            Bestsellers
          </p>
          <h2
            className="serif"
            style={{
              marginTop: 16,
              fontSize: "clamp(34px, 3vw, 44px)",
              lineHeight: 1.05,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Our most
            <br />
            loved brews
          </h2>
          <p
            style={{
              marginTop: 22,
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink-2)",
              maxWidth: 260,
            }}
          >
            Three ways to experience BAL. Each one crafted to bring warmth,
            comfort, and connection to your daily ritual.
          </p>
          <Link
            href="/search"
            className="mono"
            style={{
              marginTop: 28,
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "13px 22px",
              background: "var(--ink)",
              color: "var(--cream)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              borderRadius: 2,
            }}
          >
            Shop all products
          </Link>
        </div>
        {products.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </section>
  );
}
