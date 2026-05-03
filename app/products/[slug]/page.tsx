import { AddToCartButton } from "components/bal/add-to-cart-button";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { getProduct, products } from "lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.blurb,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main>
        <section
          style={{
            padding: "72px 56px 96px",
            background: "var(--cream)",
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 0.9fr",
              gap: 64,
              alignItems: "center",
            }}
          >
            <div
              style={{
                borderRadius: 4,
                overflow: "hidden",
                background: "var(--cream-2)",
                boxShadow: "0 30px 60px -34px rgba(42,31,23,0.32)",
              }}
            >
              <img
                src="/product-ritual.svg"
                alt={`${product.name} product ritual`}
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>

            <div>
              <a
                href="/#all-products"
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ink-soft)",
                }}
              >
                Back to all products
              </a>
              <p
                className="mono"
                style={{
                  marginTop: 32,
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--terra-deep)",
                }}
              >
                {product.type}
              </p>
              <h1
                className="serif"
                style={{
                  marginTop: 14,
                  fontSize: "clamp(44px, 5vw, 72px)",
                  lineHeight: 1,
                  fontWeight: 500,
                  color: "var(--ink)",
                }}
              >
                {product.name}
              </h1>
              <p
                className="serif"
                style={{
                  marginTop: 22,
                  fontSize: 24,
                  color: "var(--ink)",
                }}
              >
                {product.price}
              </p>
              <p
                style={{
                  marginTop: 24,
                  maxWidth: 480,
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "var(--ink-2)",
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  marginTop: 34,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 28,
                }}
              >
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
                    Tasting notes
                  </p>
                  <ul
                    style={{
                      marginTop: 14,
                      display: "grid",
                      gap: 9,
                      listStyle: "none",
                      color: "var(--ink-2)",
                      fontSize: 14,
                    }}
                  >
                    {product.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
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
                    Details
                  </p>
                  <ul
                    style={{
                      marginTop: 14,
                      display: "grid",
                      gap: 9,
                      listStyle: "none",
                      color: "var(--ink-2)",
                      fontSize: 14,
                    }}
                  >
                    {product.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ maxWidth: 280, marginTop: 22 }}>
                <AddToCartButton
                  productSlug={product.slug}
                  label="Add to cart"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
