import { BuyBox } from "components/bal/buy-box";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { JsonLd } from "components/bal/json-ld";
import { Nav } from "components/bal/nav";
import { ProductCard } from "components/bal/product-card";
import {
  ProductImagePreload,
  ProductMedia,
} from "components/bal/product-media";
import { ProductViewedTracker } from "components/bal/product-viewed-tracker";
import type { ShopAnalytics } from "lib/commerce/analytics";
import type { Product } from "lib/products";
import { productJsonLd } from "lib/seo";
import { baseUrl } from "lib/utils";

export function DrinkView({
  product,
  related,
  shopAnalytics,
}: {
  product: Product;
  related: Product[];
  shopAnalytics: ShopAnalytics | null;
}) {
  const url = `${baseUrl}/products/${product.slug}`;

  return (
    <>
      <JsonLd data={productJsonLd(product, url)} />
      <ProductImagePreload image={product.images?.[0]} />
      {shopAnalytics && product.productId && product.merchandiseId ? (
        <ProductViewedTracker
          shop={shopAnalytics}
          product={{
            id: product.productId,
            title: product.name,
            price: String(product.priceAmount ?? 0),
            vendor: product.vendor ?? "BAL Coffee",
            variantId: product.merchandiseId,
            variantTitle: product.variantTitle ?? "",
          }}
        />
      ) : null}
      <Nav />
      <main style={{ background: "var(--cream)" }}>
        <section style={{ padding: "14px 56px 48px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <nav style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              <a href="/">Home</a>
              <span style={{ margin: "0 12px" }}>/</span>
              <a href="/drinks">Café drinks</a>
              <span style={{ margin: "0 12px" }}>/</span>
              <span>{product.name}</span>
            </nav>
            <div
              className="bal-product-detail-grid"
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "1.05fr 1fr",
                gap: 42,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 10,
                    border: "1px solid rgba(77,56,36,0.16)",
                    aspectRatio: "1.16 / 1",
                    background: "#e7d3b4",
                  }}
                >
                  <ProductMedia product={product} priority />
                </div>
                {product.missingImage ? (
                  <p
                    className="mono"
                    style={{
                      marginTop: 10,
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink-soft)",
                    }}
                  >
                    Photo coming soon
                  </p>
                ) : null}
              </div>
              <div>
                <p
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                  }}
                >
                  Café drink
                </p>
                <h1
                  className="serif"
                  style={{
                    marginTop: 8,
                    fontSize: "clamp(40px, 5vw, 60px)",
                    lineHeight: 0.98,
                    fontWeight: 400,
                    color: "var(--ink)",
                  }}
                >
                  {product.name}
                </h1>
                {product.description ? (
                  <p
                    style={{
                      marginTop: 18,
                      maxWidth: 520,
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: "var(--ink-2)",
                    }}
                  >
                    {product.description}
                  </p>
                ) : null}
                <div style={{ marginTop: 22 }}>
                  <BuyBox product={product} showQuantity />
                </div>
                <p
                  style={{
                    marginTop: 14,
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  Free shipping on orders over $50
                </p>
              </div>
            </div>
            {related.length > 0 ? (
              <div style={{ marginTop: 48 }}>
                <h2
                  className="serif"
                  style={{
                    fontSize: 24,
                    fontWeight: 400,
                    color: "var(--ink)",
                  }}
                >
                  You may also like
                </h2>
                <div
                  className="bal-product-related-grid"
                  style={{
                    marginTop: 12,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 18,
                  }}
                >
                  {related.map((item) => (
                    <ProductCard key={item.slug} product={item} horizontal />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
