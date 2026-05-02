import { Footer } from "components/bal/footer";
import { Nav } from "components/bal/nav";
import { getProducts } from "lib/shopify";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Shop",
  description:
    "Shop BAL Coffee — naturally caffeine-free coffee from date seeds.",
};

function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;
  return (
    <Link
      href={`/product/${product.handle}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--cream-3)",
        border: "1px solid var(--line-soft)",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "5 / 4",
          background: "var(--cream-2)",
        }}
      >
        {product.featuredImage?.url && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      <div style={{ padding: "20px 22px 22px" }}>
        <h3
          className="serif"
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          {product.title}
        </h3>
        <p
          className="serif"
          style={{ marginTop: 12, fontSize: 18, color: "var(--ink)" }}
        >
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currencyCode,
            maximumFractionDigits: 0,
          }).format(Number(price.amount))}
        </p>
      </div>
    </Link>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const { sort, q } = await searchParams;
  const sortKey =
    sort === "price-asc" || sort === "price-desc"
      ? "PRICE"
      : sort === "trending"
        ? "BEST_SELLING"
        : "CREATED_AT";
  const reverse = sort === "price-desc" || sort === "latest";
  const products = await getProducts({ query: q, sortKey, reverse });

  return (
    <>
      <Nav />
      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "40px 56px 80px",
        }}
      >
        <header style={{ marginBottom: 32 }}>
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            Shop
          </p>
          <h1
            className="serif"
            style={{
              marginTop: 12,
              fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            All products
          </h1>
        </header>
        {products.length === 0 ? (
          <p style={{ color: "var(--ink-2)" }}>No products found.</p>
        ) : (
          <div
            className="bal-search-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {products.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
