import { AddToCartButton } from "components/bal/add-to-cart-button";
import { BenefitsStrip } from "components/bal/benefits-strip";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { ProductCard } from "components/bal/product-card";
import { ProductMedia } from "components/bal/product-media";
import {
  getProducts,
  getProductWithShopify,
  getRelatedProductsWithShopify,
} from "lib/catalog";
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
    <span style={{ color: "#6c6c2f", letterSpacing: 2, fontSize: 15 }}>
      ★★★★★
    </span>
  );
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
            alt=""
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
            href="/#about"
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
  const productImages =
    product.images && product.images.length > 0
      ? product.images.slice(0, 4)
      : [undefined, undefined, undefined, undefined];
  const hasLongName = product.name.length > 42;

  return (
    <>
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
                  <ProductMedia product={product} />
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
                      <ProductMedia product={product} image={image} compact />
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
                  {[
                    "Caffeine-Free",
                    "Prebiotic-Rich",
                    "Roasted Date Seeds",
                  ].map((tag) => (
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 18,
                        padding: "12px 14px",
                        border: "1px solid rgba(77,56,36,0.18)",
                        borderRadius: 8,
                        background: "rgba(255,252,246,0.78)",
                      }}
                    >
                      <div>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
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
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: "#eadfc6",
                          color: "var(--ink)",
                          fontSize: 12,
                        }}
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
                    style={{
                      padding: 18,
                      border: "1px solid rgba(77,56,36,0.16)",
                      borderRadius: 10,
                      background: "rgba(255,252,246,0.72)",
                    }}
                  >
                    <p
                      className="serif"
                      style={{ fontSize: 18, color: "var(--ink)" }}
                    >
                      Flavor Notes
                    </p>
                    <p
                      style={{
                        marginTop: 18,
                        fontSize: 14,
                        color: "var(--ink)",
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
                        borderBottom: "1px solid rgba(77,56,36,0.12)",
                        fontSize: 12,
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
          className="bal-product-reviews-section"
          style={{ padding: "18px 56px 0" }}
        >
          <div
            className="bal-product-reviews-grid"
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr",
              gap: 22,
            }}
          >
            <div>
              <div
                className="bal-product-section-heading"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h2
                  className="serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: "var(--ink)",
                    letterSpacing: 0,
                  }}
                >
                  What our customers say
                </h2>
                <a
                  href="#reviews"
                  style={{ fontSize: 12, color: "var(--ink)" }}
                >
                  View all reviews →
                </a>
              </div>
              <div
                className="bal-product-testimonials-grid"
                style={{
                  marginTop: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                }}
              >
                {reviews.map((review) => (
                  <article
                    key={review.author}
                    style={{
                      padding: 18,
                      border: "1px solid rgba(77,56,36,0.16)",
                      borderRadius: 8,
                      background: "rgba(255,252,246,0.76)",
                    }}
                  >
                    <Stars />
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: 12.5,
                        lineHeight: 1.4,
                        color: "var(--ink-2)",
                      }}
                    >
                      &quot;{review.quote}&quot;
                    </p>
                    <p
                      style={{
                        marginTop: 14,
                        fontSize: 12,
                        color: "var(--ink-soft)",
                      }}
                    >
                      {review.author}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h2
                className="serif"
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: 0,
                }}
              >
                Frequently Asked Questions
              </h2>
              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {[
                  `Is ${product.name} really caffeine-free?`,
                  "What does it taste like?",
                  "How should I store it?",
                  "Is it safe during pregnancy?",
                ].map((question) => (
                  <div
                    key={question}
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
                    <span>{question}</span>
                    <span>+</span>
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
