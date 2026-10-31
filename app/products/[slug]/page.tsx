import { AddToCartButton } from "components/bal/add-to-cart-button";
import { BenefitsStrip } from "components/bal/benefits-strip";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { JsonLd } from "components/bal/json-ld";
import { Nav } from "components/bal/nav";
import { ProductCard } from "components/bal/product-card";
import {
  ProductImagePreload,
  ProductMedia,
} from "components/bal/product-media";
import {
  getProducts,
  getProductWithShopify,
  getRelatedProductsWithShopify,
} from "lib/catalog";
import { getShopAnalytics } from "lib/commerce/analytics-shop";
import { ProductViewedTracker } from "components/bal/product-viewed-tracker";
import {
  breadcrumbJsonLd,
  coffeeSeo,
  pageMetadata,
  productJsonLd,
} from "lib/seo";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductWithShopify(slug);

  if (!product || product.category === "drink") {
    return {};
  }

  const seo = coffeeSeo(product.slug);
  const description = seo?.description || product.blurb || product.name;

  return pageMetadata({
    title: seo?.title || `${product.name} | BAL Coffee`,
    description,
    path: `/products/${product.slug}`,
  });
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="#73743b" />
      <path
        d="M4.8 8.1 L7 10.2 L11.2 5.8"
        stroke="#fff8e9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrewIcon({ index }: { index: number }) {
  return (
    <svg
      width="76"
      height="70"
      viewBox="0 0 90 76"
      fill="none"
      stroke="#8d6c4c"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {index === 0 ? (
        <>
          <path d="M30 54 L66 18" />
          <ellipse
            cx="28"
            cy="56"
            rx="13"
            ry="5"
            transform="rotate(-35 28 56)"
          />
        </>
      ) : null}
      {index === 1 ? (
        <>
          <path d="M26 54 C 34 28, 62 28, 66 44 C 70 60, 38 66, 26 54 Z" />
          <path d="M56 34 L74 22" />
          <path d="M46 28 C 48 18, 62 14, 70 20" />
        </>
      ) : null}
      {index === 2 ? (
        <>
          <path d="M24 38 H60 V50 A14 14 0 0 1 46 64 H38 A14 14 0 0 1 24 50 Z" />
          <path d="M60 42 H70 A7 7 0 0 1 70 56 H60" />
          <path d="M32 24 C 32 18, 40 18, 40 12" />
          <path d="M48 24 C 48 18, 56 18, 56 12" />
        </>
      ) : null}
    </svg>
  );
}

function StoryBand() {
  return (
    <section
      className="bal-product-story-band"
      style={{
        marginTop: 12,
        background:
          "linear-gradient(100deg, #d7bd95 0%, #efe2cc 52%, #f6efe3 100%)",
      }}
    >
      <div
        className="bal-product-story-grid"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 48,
          alignItems: "center",
          minHeight: 190,
        }}
      >
        <div style={{ height: 190, overflow: "hidden" }}>
          <img
            src="/product-ritual.svg"
            alt="A warm tabletop scene with a Bal Coffee bag, a filled mug, date seeds, and soft morning light."
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ padding: "28px 0" }}>
          <h2
            className="serif"
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: "var(--ink)",
              letterSpacing: 0,
            }}
          >
            Rooted in tradition. Made for modern rituals.
          </h2>
          <p
            style={{
              marginTop: 12,
              maxWidth: 470,
              fontSize: 13.5,
              lineHeight: 1.5,
              color: "var(--ink-2)",
            }}
          >
            For generations, nothing went to waste. Date seeds were roasted over
            open flames and brewed for warmth, comfort, and connection.
          </p>
          <a
            href="/about"
            style={{
              display: "inline-flex",
              marginTop: 14,
              color: "var(--ink)",
              fontSize: 14,
            }}
          >
            Our Story →
          </a>
        </div>
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductWithShopify(slug);

  if (!product) {
    notFound();
  }

  if (product.slug !== slug) {
    redirect(`/products/${product.slug}`);
  }

  const related = (await getRelatedProductsWithShopify(product.slug)).filter(
    (item) => item.category !== "drink",
  );
  const shopAnalytics = await getShopAnalytics();
  const seo = coffeeSeo(product.slug);
  const productImages =
    product.images && product.images.length > 0
      ? product.images.slice(0, 4)
      : [undefined, undefined, undefined, undefined];
  const heading = seo?.h1 ?? product.name;
  const hasLongName = heading.length > 42;
  const productUrl = `${baseUrl}/products/${product.slug}`;

  if (product.category === "drink") {
    notFound();
  }

  return (
    <>
      <JsonLd data={productJsonLd(product, productUrl, seo?.description)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Shop", url: `${baseUrl}/products` },
          { name: product.name, url: productUrl },
        ])}
      />
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
        <section
          className="bal-product-detail-section"
          style={{ padding: "14px 56px 18px" }}
        >
          <div
            className="bal-product-detail-container"
            style={{ maxWidth: 1180, margin: "0 auto" }}
          >
            <nav style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              <a href="/">Home</a>
              <span style={{ margin: "0 12px" }}>/</span>
              <a href="/products">Shop</a>
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
                  className="bal-product-main-visual"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 10,
                    border: "1px solid rgba(77,56,36,0.16)",
                    aspectRatio: "1.16 / 1",
                  }}
                >
                  <ProductMedia product={product} priority />
                  <span
                    className="mono"
                    style={{
                      position: "absolute",
                      left: 18,
                      top: 18,
                      width: 66,
                      height: 66,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 999,
                      border: "1px solid rgba(255,244,232,0.7)",
                      background: "rgba(50,24,13,0.82)",
                      color: "#fff4e8",
                      fontSize: 10,
                      textAlign: "center",
                      lineHeight: 1.1,
                    }}
                  >
                    {product.badge}
                  </span>
                </div>
                <div
                  className="bal-product-thumbs"
                  style={{
                    marginTop: 12,
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12,
                  }}
                >
                  {productImages.map((image, item) => (
                    <div
                      key={image?.url || item}
                      style={{
                        overflow: "hidden",
                        borderRadius: 8,
                        border:
                          item === 0
                            ? "2px solid #32180d"
                            : "1px solid rgba(77,56,36,0.18)",
                        aspectRatio: "1.35 / 1",
                      }}
                    >
                      <ProductMedia
                        product={product}
                        image={image}
                        compact
                        targetWidth={480}
                        sizes="(max-width: 768px) 22vw, 180px"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ paddingTop: 2 }}>
                <h1
                  className="serif"
                  style={{
                    fontSize: hasLongName
                      ? "clamp(30px, 3.8vw, 44px)"
                      : "clamp(46px, 5vw, 64px)",
                    lineHeight: hasLongName ? 1.06 : 0.98,
                    fontWeight: 400,
                    color: "var(--ink)",
                    letterSpacing: 0,
                  }}
                >
                  {heading}
                </h1>
                <p
                  className="serif"
                  style={{ marginTop: 18, fontSize: 28, color: "var(--ink)" }}
                >
                  {product.price}
                </p>
                <p
                  style={{
                    marginTop: 18,
                    maxWidth: 500,
                    fontSize: 15,
                    lineHeight: 1.45,
                    color: "var(--ink-2)",
                  }}
                >
                  {product.description}
                </p>
                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 9,
                  }}
                >
                  <a
                    href="/faq#caffeine"
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(115,116,59,0.35)",
                      background: "#e9dec3",
                      color: "#5f6030",
                      fontSize: 12,
                    }}
                  >
                    Caffeine-free
                  </a>
                  {["Roasted date seeds", "12 oz bag"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 999,
                        border: "1px solid rgba(115,116,59,0.35)",
                        background: "#e9dec3",
                        color: "#5f6030",
                        fontSize: 12,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 22,
                    borderTop: "1px solid rgba(77,56,36,0.16)",
                    paddingTop: 14,
                  }}
                >
                  <p
                    style={{
                      marginBottom: 8,
                      fontSize: 12,
                      color: "var(--ink-2)",
                    }}
                  >
                    Quantity
                  </p>
                  <AddToCartButton
                    product={{
                      merchandiseId: product.merchandiseId,
                      handle: product.shopifyHandle,
                      title: product.name,
                      amount: String(product.priceAmount ?? 0),
                      currencyCode: product.currencyCode ?? "USD",
                      availableForSale: product.availableForSale,
                    }}
                    showQuantity
                  />
                </div>

                <div
                  style={{
                    marginTop: 14,
                    display: "grid",
                    gridTemplateColumns: "1fr 174px",
                    gap: 32,
                    alignItems: "start",
                  }}
                >
                  <div>
                    <p
                      style={{
                        marginTop: 14,
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "var(--ink-soft)",
                      }}
                    >
                      Shipping is calculated at checkout.{" "}
                      <a href="/shipping" style={{ color: "var(--ink)" }}>
                        Shipping details
                      </a>
                      .{" "}
                      <a href="/faq#decaf" style={{ color: "var(--ink)" }}>
                        How it differs from decaf
                      </a>
                      .
                    </p>
                  </div>

                  <aside
                    style={{
                      padding: 18,
                      border: "1px solid rgba(77,56,36,0.16)",
                      borderRadius: 10,
                      background: "rgba(255,252,246,0.72)",
                    }}
                  >
                    <h2
                      className="serif"
                      style={{
                        fontSize: 18,
                        fontWeight: 400,
                        color: "var(--ink)",
                      }}
                    >
                      What it tastes like
                    </h2>
                    <p
                      style={{
                        marginTop: 18,
                        fontSize: 14,
                        color: "var(--ink)",
                      }}
                    >
                      {product.notes.join(" · ")}
                    </p>
                  </aside>
                </div>
              </div>
            </div>

            <BenefitsStrip />

            <div
              className="bal-product-info-grid"
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 14,
              }}
            >
              <section
                style={{
                  padding: 22,
                  border: "1px solid rgba(77,56,36,0.16)",
                  borderRadius: 10,
                  background: "rgba(255,252,246,0.74)",
                }}
              >
                <h2
                  className="serif"
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    color: "var(--ink)",
                    letterSpacing: 0,
                  }}
                >
                  In this bag
                </h2>
                <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
                  {product.benefits.map((benefit) => (
                    <p
                      key={benefit}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "18px 1fr",
                        gap: 12,
                        alignItems: "center",
                        fontSize: 13,
                        color: "var(--ink-2)",
                      }}
                    >
                      <CheckIcon />
                      {benefit}
                    </p>
                  ))}
                </div>
              </section>

              <section
                style={{
                  padding: 22,
                  border: "1px solid rgba(77,56,36,0.16)",
                  borderRadius: 10,
                  background: "rgba(255,252,246,0.74)",
                }}
              >
                <h2
                  className="serif"
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    color: "var(--ink)",
                    letterSpacing: 0,
                  }}
                >
                  {seo?.brewHeading ?? "How to brew"}
                </h2>
                <div
                  style={{
                    marginTop: 18,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                  }}
                >
                  {product.brewSteps.map((step, index) => (
                    <div key={step.title} style={{ textAlign: "center" }}>
                      <BrewIcon index={index} />
                      <p
                        style={{
                          marginTop: 8,
                          fontSize: 13,
                          color: "var(--ink)",
                        }}
                      >
                        {index + 1}. {step.title}
                      </p>
                      <p
                        style={{
                          marginTop: 5,
                          fontSize: 11.5,
                          lineHeight: 1.35,
                          color: "var(--ink-soft)",
                        }}
                      >
                        {step.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section
                style={{
                  padding: 22,
                  border: "1px solid rgba(77,56,36,0.16)",
                  borderRadius: 10,
                  background: "rgba(255,252,246,0.74)",
                }}
              >
                <h2
                  className="serif"
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    color: "var(--ink)",
                    letterSpacing: 0,
                  }}
                >
                  Ingredients
                </h2>
                <p
                  style={{
                    marginTop: 14,
                    fontSize: 13,
                    lineHeight: 1.45,
                    color: "var(--ink-2)",
                  }}
                >
                  <strong>Ingredients:</strong> {product.ingredients}
                </p>
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 13,
                    lineHeight: 1.45,
                    color: "var(--ink-2)",
                  }}
                >
                  Roasted date seeds. No coffee beans.
                </p>
              </section>
            </div>
          </div>
        </section>

        <StoryBand />

        <section
          className="bal-product-related-section"
          style={{ padding: "18px 56px 0" }}
        >
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div
              className="bal-product-section-heading"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                className="serif"
                style={{
                  fontSize: 24,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: 0,
                }}
              >
                You may also like
              </h2>
              <a href="/products" style={{ color: "var(--ink)", fontSize: 13 }}>
                View all products →
              </a>
            </div>
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
        </section>

        <section
          className="bal-product-faq-section"
          style={{ padding: "18px 56px 0" }}
        >
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <h2
              className="serif"
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: "var(--ink)",
                letterSpacing: 0,
              }}
            >
              Frequently asked questions
            </h2>
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
              }}
              className="bal-product-faq-grid"
            >
              {[
                {
                  href: "/faq#caffeine",
                  label: `Is ${product.name} caffeine-free?`,
                },
                {
                  href: "/faq#taste",
                  label: "What does date seed coffee taste like?",
                },
                { href: "/faq#brew", label: "How do I brew it?" },
                {
                  href: "/faq#shipping",
                  label: "How much is shipping?",
                },
              ].map((question) => (
                <a
                  key={question.href}
                  href={question.href}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    border: "1px solid rgba(77,56,36,0.14)",
                    borderRadius: 7,
                    background: "rgba(255,252,246,0.76)",
                    fontSize: 13,
                    color: "var(--ink-2)",
                  }}
                >
                  <span>{question.label}</span>
                  <span aria-hidden>→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
