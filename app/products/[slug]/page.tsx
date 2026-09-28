import { AddToCartButton } from "components/bal/add-to-cart-button";
import { BenefitsStrip } from "components/bal/benefits-strip";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
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
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.description || product.blurb,
  };
}

function Stars() {
  return (
    <span style={{ color: "var(--stamp)", letterSpacing: 2, fontSize: 16 }}>
      ★★★★★
    </span>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="var(--navy)" />
      <path
        d="M4.8 8.1 L7 10.2 L11.2 5.8"
        stroke="var(--label)"
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
      stroke="var(--navy)"
      strokeWidth="2"
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
      style={{ marginTop: 56, background: "var(--navy)", padding: "0 80px" }}
    >
      <div
        className="bal-product-story-grid"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "center",
          minHeight: 280,
        }}
      >
        <div
          style={{
            height: 220,
            overflow: "hidden",
            borderRadius: 18,
            border: "2px solid var(--label)",
            background: "var(--label)",
          }}
        >
          <img
            src="/product-ritual.svg"
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ padding: "36px 0" }}>
          <h2
            className="label-title"
            style={{ fontSize: 38, color: "var(--label)" }}
          >
            Rooted in tradition.{" "}
            <span style={{ color: "var(--stamp-soft)" }}>
              Made for modern rituals.
            </span>
          </h2>
          <p
            style={{
              marginTop: 16,
              maxWidth: 470,
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(247,238,221,0.82)",
            }}
          >
            For generations, nothing went to waste. Date seeds were roasted over
            open flames and brewed for warmth, comfort, and connection.
          </p>
          <a
            href="/#about"
            className="label-btn label-btn-stamp"
            style={{ marginTop: 22 }}
          >
            Our story →
          </a>
        </div>
      </div>
    </section>
  );
}

const reviews = [
  {
    author: "Sarah M.",
    quote: "Rich, bold, and so satisfying. My new nightly ritual!",
  },
  {
    author: "James L.",
    quote: "Love that it's caffeine-free but still feels like a real espresso.",
  },
  {
    author: "Priya K.",
    quote: "Smooth, delicious, and I feel great after every cup.",
  },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductWithShopify(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProductsWithShopify(product.slug);
  const shopAnalytics = await getShopAnalytics();
  const productImages =
    product.images && product.images.length > 0
      ? product.images.slice(0, 4)
      : [undefined, undefined, undefined, undefined];
  const hasLongName = product.name.length > 42;

  return (
    <>
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
      <main>
        <section
          className="bal-product-detail-section"
          style={{ padding: "24px 80px 0" }}
        >
          <div
            className="bal-product-detail-container"
            style={{ maxWidth: 1180, margin: "0 auto" }}
          >
            <nav
              className="mono"
              aria-label="Breadcrumb"
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
              }}
            >
              <a href="/">Home</a>
              <span style={{ margin: "0 12px" }}>/</span>
              <a href="/products">Shop</a>
              <span style={{ margin: "0 12px" }}>/</span>
              <span>{product.name}</span>
            </nav>

            <div
              className="bal-product-detail-grid"
              style={{
                marginTop: 22,
                display: "grid",
                gridTemplateColumns: "1.05fr 1fr",
                gap: 48,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  className="bal-product-main-visual label-shadow"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 22,
                    border: "2px solid var(--ink)",
                    background: "var(--label)",
                    aspectRatio: "1.16 / 1",
                  }}
                >
                  <ProductMedia
                    product={product}
                    priority
                    objectPosition="center 65%"
                  />
                  {product.badge ? (
                    <span
                      className="label-stamp label-face"
                      style={{
                        position: "absolute",
                        left: 18,
                        top: 18,
                        width: 92,
                        height: 92,
                        padding: 10,
                        fontSize: 15,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <div
                  className="bal-product-thumbs"
                  style={{
                    marginTop: 18,
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
                        borderRadius: 12,
                        border:
                          item === 0
                            ? "3px solid var(--navy)"
                            : "2px solid var(--ink)",
                        background: "var(--label)",
                        aspectRatio: "1.35 / 1",
                      }}
                    >
                      <ProductMedia product={product} image={image} compact />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ paddingTop: 2 }}>
                <p className="label-kicker">{product.type}</p>
                <h1
                  className="label-title"
                  style={{
                    marginTop: 12,
                    fontSize: hasLongName
                      ? "clamp(32px, 4vw, 48px)"
                      : "clamp(48px, 5.6vw, 76px)",
                    lineHeight: hasLongName ? 1.02 : 0.94,
                  }}
                >
                  {product.name}
                </h1>
                <div
                  className="bal-product-purchase-grid"
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Stars />
                  <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                    (842 reviews)
                  </span>
                </div>
                <p
                  className="label-face"
                  style={{
                    marginTop: 18,
                    fontSize: 40,
                    fontWeight: 600,
                    lineHeight: 1,
                    color: "var(--ink)",
                  }}
                >
                  {product.price}
                </p>
                <p
                  style={{
                    marginTop: 18,
                    maxWidth: 500,
                    fontSize: 16,
                    lineHeight: 1.6,
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
                  {[
                    "Caffeine-Free",
                    "Prebiotic-Rich",
                    "Roasted Date Seeds",
                  ].map((tag) => (
                    <span key={tag} className="label-chip">
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 24,
                    borderTop: "2px dashed rgba(42,31,23,0.35)",
                    paddingTop: 18,
                  }}
                >
                  <p className="label-kicker" style={{ marginBottom: 10 }}>
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
                  className="bal-product-extras"
                  style={{
                    marginTop: 14,
                    display: "grid",
                    gridTemplateColumns: "1fr 174px",
                    gap: 32,
                    alignItems: "start",
                  }}
                >
                  <div>
                    <div
                      className="label-panel"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 18,
                        padding: "14px 16px",
                        borderRadius: 14,
                      }}
                    >
                      <div>
                        <p className="label-title" style={{ fontSize: 18 }}>
                          Subscribe & Save 10%
                        </p>
                        <p
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: "var(--ink-soft)",
                          }}
                        >
                          Delivered monthly, skip or cancel anytime.
                        </p>
                      </div>
                      <span
                        className="label-chip label-chip-active"
                        style={{ minHeight: 30 }}
                      >
                        Save
                      </span>
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

                  <aside
                    className="label-panel"
                    style={{ padding: 18, borderRadius: 14 }}
                  >
                    <p className="label-title" style={{ fontSize: 18 }}>
                      Flavor Notes
                    </p>
                    <p
                      className="mono"
                      style={{
                        marginTop: 14,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--stamp)",
                      }}
                    >
                      {product.notes.join(" · ")}
                    </p>
                    <p
                      style={{
                        marginTop: 14,
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        color: "var(--ink-2)",
                      }}
                    >
                      Dark chocolate, roasted nuts, date caramel, smooth finish.
                    </p>
                  </aside>
                </div>
              </div>
            </div>

            <BenefitsStrip />

            <div
              className="bal-product-info-grid"
              style={{
                marginTop: 24,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 20,
              }}
            >
              <section className="label-panel" style={{ padding: 26 }}>
                <h2 className="label-title" style={{ fontSize: 28 }}>
                  Why you&apos;ll love it
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
                        fontSize: 14,
                        color: "var(--ink-2)",
                      }}
                    >
                      <CheckIcon />
                      {benefit}
                    </p>
                  ))}
                </div>
              </section>

              <section className="label-panel" style={{ padding: 26 }}>
                <h2 className="label-title" style={{ fontSize: 28 }}>
                  How to brew
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
                        className="label-face"
                        style={{
                          marginTop: 8,
                          fontSize: 16,
                          fontWeight: 600,
                          color: "var(--navy)",
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

              <section className="label-panel" style={{ padding: 26 }}>
                <h2 className="label-title" style={{ fontSize: 28 }}>
                  What&apos;s inside
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
                  That&apos;s it. No additives. No caffeine. Just pure roasted
                  goodness.
                </p>
                <div style={{ marginTop: 14, display: "grid", gap: 5 }}>
                  {product.nutrition.map((item) => (
                    <p
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom: "1px solid rgba(42,31,23,0.3)",
                        fontSize: 13,
                        color: "var(--ink-2)",
                      }}
                    >
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </p>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <StoryBand />

        <section
          className="bal-product-related-section"
          style={{ padding: "64px 80px 0" }}
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
              <h2 className="label-title" style={{ fontSize: 40 }}>
                You may also like
              </h2>
              <a href="/products" className="label-btn label-btn-outline">
                View all products →
              </a>
            </div>
            <div
              className="bal-product-related-grid"
              style={{
                marginTop: 24,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 20,
              }}
            >
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} horizontal />
              ))}
            </div>
          </div>
        </section>

        <section
          className="bal-product-reviews-section"
          style={{ padding: "56px 80px 96px" }}
        >
          <div
            className="bal-product-reviews-grid"
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr",
              gap: 32,
            }}
          >
            <div>
              <div
                className="bal-product-section-heading"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h2 className="label-title" style={{ fontSize: 30 }}>
                  What our customers say
                </h2>
                <a
                  href="#reviews"
                  className="mono"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--navy)",
                  }}
                >
                  View all reviews →
                </a>
              </div>
              <div
                className="bal-product-testimonials-grid"
                style={{
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                }}
              >
                {reviews.map((review) => (
                  <article
                    key={review.author}
                    className="label-panel"
                    style={{ padding: 18, borderRadius: 14 }}
                  >
                    <Stars />
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "var(--ink)",
                      }}
                    >
                      &quot;{review.quote}&quot;
                    </p>
                    <p
                      className="label-face"
                      style={{
                        marginTop: 14,
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--navy)",
                      }}
                    >
                      {review.author}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h2 className="label-title" style={{ fontSize: 30 }}>
                Frequently Asked Questions
              </h2>
              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                {[
                  `Is ${product.name} really caffeine-free?`,
                  "What does it taste like?",
                  "How should I store it?",
                  "Is it safe during pregnancy?",
                ].map((question) => (
                  <div
                    key={question}
                    className="label-panel"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--ink)",
                    }}
                  >
                    <span>{question}</span>
                    <span
                      className="label-face"
                      aria-hidden
                      style={{
                        fontSize: 20,
                        lineHeight: 1,
                        color: "var(--stamp)",
                      }}
                    >
                      +
                    </span>
                  </div>
                ))}
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
