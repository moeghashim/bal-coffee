import { ReactNode } from "react";
import { CustomerReviews } from "components/bal/customer-reviews";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { JsonLd } from "components/bal/json-ld";
import { Nav } from "components/bal/nav";
import { ProductCard } from "components/bal/product-card";
import { getCoffeeProducts } from "lib/catalog";
import {
  brewIntro,
  brewRows,
  brewTip,
  caffeine,
  cardSummaries,
  chooseIntro,
  chooseNote,
  closeBody,
  coffeeSlugs,
  facts,
  faqs,
  ingredientsLine,
  intro,
  makeSteps,
  shopLink,
  tasteBullets,
  tasteClose,
  tasteIntro,
  whatIs,
} from "lib/date-seed-coffee";
import { getProduct } from "lib/products";
import {
  breadcrumbJsonLd,
  brewLinkLabel,
  faqPageJsonLd,
  itemListJsonLd,
  pageMetadata,
  pageSeo,
  webPageJsonLd,
} from "lib/seo";
import { baseUrl } from "lib/utils";

export const metadata = pageMetadata({
  title: pageSeo.dateSeedCoffee.title,
  description: pageSeo.dateSeedCoffee.description,
  path: "/date-seed-coffee",
});

const linkStyle = { color: "var(--terra-deep)" };

function Prose({
  id,
  title,
  children,
  wide = false,
  band = false,
  headingId,
}: {
  id?: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
  band?: boolean;
  headingId?: string;
}) {
  return (
    <section
      id={id}
      className="bal-landing-pad"
      style={{
        scrollMarginTop: 96,
        padding: band ? "56px 56px" : "36px 56px 8px",
        background: band ? "var(--cream-2)" : "transparent",
        borderTop: band ? "1px solid var(--line-soft)" : undefined,
        borderBottom: band ? "1px solid var(--line-soft)" : undefined,
      }}
    >
      <div style={{ maxWidth: wide ? 1180 : 760, margin: "0 auto" }}>
        <h2
          id={headingId}
          className="serif"
          style={{
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 500,
            lineHeight: 1.12,
            color: "var(--ink)",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            marginTop: 16,
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--ink-2)",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function Paragraphs({ text }: { text: readonly string[] }) {
  return text.map((paragraph) => (
    <p key={paragraph} style={{ marginTop: 16 }}>
      {paragraph}
    </p>
  ));
}

function ShopAnswer({ text }: { text: string }) {
  const index = text.lastIndexOf(shopLink.label);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <a href={shopLink.href} style={linkStyle}>
        {shopLink.label}
      </a>
      {text.slice(index + shopLink.label.length)}
    </>
  );
}

export default async function DateSeedCoffeePage() {
  const live = await getCoffeeProducts();
  const cards = coffeeSlugs.flatMap((slug) => {
    const product = live.find((item) => item.slug === slug);
    return product ? [product] : [];
  });
  const listItems = coffeeSlugs.map((slug) => {
    const product = live.find((item) => item.slug === slug) ?? getProduct(slug);
    return {
      name: product?.name ?? slug,
      url: `${baseUrl}/products/${slug}`,
    };
  });

  return (
    <>
      <JsonLd
        data={webPageJsonLd(baseUrl, {
          name: pageSeo.dateSeedCoffee.h1,
          description: pageSeo.dateSeedCoffee.description,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Date seed coffee", url: `${baseUrl}/date-seed-coffee` },
        ])}
      />
      <JsonLd data={itemListJsonLd(listItems)} />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <Nav />
      <main>
        <section
          className="bal-landing-pad"
          style={{
            padding: "36px 56px 64px",
            background:
              "radial-gradient(circle at 80% 12%, rgba(255,248,232,0.7), transparent 34%), linear-gradient(100deg, #f5ebdc 0%, #ead8bd 58%, #d2b78f 100%)",
            borderBottom: "1px solid rgba(77,56,36,0.14)",
          }}
        >
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <nav
              aria-label="Breadcrumb"
              style={{ fontSize: 12, color: "var(--ink-soft)" }}
            >
              <a href="/">Home</a>
              <span aria-hidden="true" style={{ margin: "0 12px" }}>
                /
              </span>
              <span>Date seed coffee</span>
            </nav>
            <p
              className="mono"
              style={{
                marginTop: 28,
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
              }}
            >
              Date seed coffee
            </p>
            <h1
              className="serif"
              style={{
                marginTop: 14,
                maxWidth: 760,
                fontSize: "clamp(36px, 4.6vw, 58px)",
                lineHeight: 1.05,
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              {pageSeo.dateSeedCoffee.h1}
            </h1>
            <p
              style={{
                marginTop: 22,
                maxWidth: 680,
                fontSize: 18,
                lineHeight: 1.6,
                color: "var(--ink-2)",
              }}
            >
              {intro}
            </p>
            <div
              className="bal-landing-actions"
              style={{
                marginTop: 28,
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <a
                href="#choose-your-brew"
                className="mono"
                style={{
                  padding: "14px 24px",
                  background: "var(--ink)",
                  color: "var(--cream)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  borderRadius: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Choose your brew
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href="/products"
                className="mono"
                style={{
                  padding: "14px 22px",
                  border: "1px solid var(--ink)",
                  color: "var(--ink)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  borderRadius: 2,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Shop all three
              </a>
            </div>
            <ul
              className="bal-landing-facts"
              style={{
                marginTop: 36,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                listStyle: "none",
              }}
            >
              {facts.map((fact) => (
                <li
                  key={fact}
                  className="serif"
                  style={{
                    padding: "18px 14px",
                    border: "1px solid rgba(77,56,36,0.16)",
                    borderRadius: 12,
                    background: "rgba(255,252,246,0.82)",
                    textAlign: "center",
                    fontSize: 18,
                    lineHeight: 1.25,
                    color: "var(--ink)",
                  }}
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Prose title="What is date seed coffee?">
          <Paragraphs text={whatIs} />
        </Prose>

        <Prose id="taste" title="What does date seed coffee taste like?">
          <Paragraphs text={tasteIntro} />
          <ul style={{ marginTop: 12, paddingLeft: "1.2em" }}>
            {tasteBullets.map((bullet) => (
              <li key={bullet.slug} style={{ marginTop: 8 }}>
                <a href={`/products/${bullet.slug}`} style={linkStyle}>
                  {brewLinkLabel(bullet.slug)}
                </a>
                {": "}
                {bullet.text}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 16 }}>{tasteClose}</p>
        </Prose>

        <Prose title="How BAL makes date seed coffee">
          <ol style={{ marginTop: 4, paddingLeft: "1.2em" }}>
            {makeSteps.map((step) => (
              <li key={step.title} style={{ marginTop: 8 }}>
                <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
                  {step.title}:
                </strong>{" "}
                {step.body}
              </li>
            ))}
          </ol>
          <p style={{ marginTop: 16 }}>{ingredientsLine}</p>
        </Prose>

        <Prose title="A naturally caffeine-free coffee alternative">
          <Paragraphs text={caffeine} />
        </Prose>

        <Prose id="choose-your-brew" title="Choose your brew" wide band>
          <p>{chooseIntro}</p>
          {cards.length > 0 ? (
            <div
              className="bal-products-grid"
              style={{
                marginTop: 22,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 18,
              }}
            >
              {cards.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  showBrewLink
                  summary={
                    cardSummaries[product.slug as keyof typeof cardSummaries]
                  }
                />
              ))}
            </div>
          ) : (
            <ul style={{ marginTop: 18, paddingLeft: "1.2em" }}>
              {coffeeSlugs.map((slug) => (
                <li key={slug} style={{ marginTop: 8 }}>
                  <a href={`/products/${slug}`} style={linkStyle}>
                    {brewLinkLabel(slug)}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p style={{ marginTop: 18 }}>{chooseNote}</p>
        </Prose>

        <Prose
          title="How to brew date seed coffee"
          wide
          headingId="brew-heading"
        >
          <p>{brewIntro}</p>
          <div style={{ marginTop: 18, overflowX: "auto" }}>
            <table
              className="bal-brew-table"
              aria-labelledby="brew-heading"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "rgba(255,252,246,0.76)",
                border: "1px solid rgba(77,56,36,0.16)",
                borderRadius: 12,
              }}
            >
              <thead>
                <tr>
                  {["Method", "Bag", "In brief"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        color: "var(--ink-soft)",
                        borderBottom: "1px solid rgba(77,56,36,0.14)",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brewRows.map((row) => (
                  <tr key={row.slug}>
                    <td data-label="Method">{row.method}</td>
                    <td data-label="Bag">
                      <a href={`/products/${row.slug}`} style={linkStyle}>
                        {brewLinkLabel(row.slug)}
                      </a>
                    </td>
                    <td data-label="In brief">{row.brief}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 16 }}>{brewTip}</p>
        </Prose>

        {/* Hidden until Judge.me (or another source) supplies published reviews. */}
        <CustomerReviews reviews={[]} />

        <Prose title="Date seed coffee FAQ">
          <div style={{ display: "grid", gap: 28, marginTop: 8 }}>
            {faqs.map((item) => (
              <section key={item.id} id={item.id}>
                <h3
                  className="serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.25,
                    color: "var(--ink)",
                  }}
                >
                  {item.question}
                </h3>
                <p style={{ marginTop: 8 }}>
                  {item.id === "faq-where" ? (
                    <ShopAnswer text={item.answer} />
                  ) : (
                    item.answer
                  )}
                </p>
              </section>
            ))}
          </div>
        </Prose>

        <section
          className="bal-landing-pad bal-subscription"
          style={{
            marginTop: 56,
            background: "var(--terra)",
            color: "var(--cream)",
            padding: "44px 56px",
          }}
        >
          <div
            className="bal-subscription-grid"
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.4fr auto",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <h2
                className="serif"
                style={{
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 500,
                  lineHeight: 1.15,
                  color: "var(--cream)",
                }}
              >
                Find your date seed coffee
              </h2>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "rgba(244,239,230,0.92)",
                }}
              >
                {closeBody}
              </p>
            </div>
            <a
              href="/products"
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 28px",
                background: "var(--cream)",
                color: "var(--ink)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                borderRadius: 2,
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Shop all three
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
