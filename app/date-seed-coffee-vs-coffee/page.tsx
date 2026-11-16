import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { JsonLd } from "components/bal/json-ld";
import { Nav } from "components/bal/nav";
import { ProductCard } from "components/bal/product-card";
import {
  ContentClose,
  ContentFaq,
  ContentHero,
  DataTable,
  linkStyle,
  Paragraphs,
  Prose,
  Rich,
} from "components/bal/content-page";
import { getCoffeeProducts } from "lib/catalog";
import { cardSummaries, coffeeSlugs } from "lib/date-seed-coffee";
import {
  acidity,
  brewIntro,
  brewTip,
  closeBody,
  closeHref,
  closeLabel,
  closeTitle,
  compareHeaders,
  compareRows,
  crumbs,
  faqs,
  grindMatches,
  heroActions,
  homeLink,
  intro,
  madeFrom,
  path,
  tasteBags,
  tasteClose,
  tasteIntro,
  whereToStart,
  which,
  caffeine,
} from "lib/date-seed-coffee-vs-coffee";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  brewLinkLabel,
  faqPageJsonLd,
  pageMetadata,
  pageSeo,
  webPageJsonLd,
} from "lib/seo";
import { baseUrl } from "lib/utils";

const seo = pageSeo.dateSeedCoffeeVsCoffee;

export const metadata = pageMetadata({
  title: seo.title,
  description: seo.description,
  path,
  openGraphType: "article",
});

export default async function DateSeedCoffeeVsCoffeePage() {
  const live = await getCoffeeProducts();
  const cards = coffeeSlugs.flatMap((slug) => {
    const product = live.find((item) => item.slug === slug);
    return product ? [product] : [];
  });
  const schemaPage = {
    name: seo.h1,
    description: seo.description,
    path,
  };

  return (
    <>
      <JsonLd
        data={webPageJsonLd(baseUrl, {
          ...schemaPage,
          about: "Date seed coffee vs coffee",
        })}
      />
      <JsonLd data={articleJsonLd(baseUrl, schemaPage)} />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((crumb) => ({
            name: crumb.name,
            url: crumb.path === "/" ? baseUrl : `${baseUrl}${crumb.path}`,
          })),
        )}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <Nav />
      <main>
        <ContentHero
          crumbs={crumbs}
          eyebrow="Date seed coffee"
          title={seo.h1}
          intro={intro}
          actions={heroActions}
        />

        <Prose title="At a glance" wide headingId="compare-heading">
          <DataTable
            labelledBy="compare-heading"
            headers={compareHeaders}
            rows={compareRows}
          />
        </Prose>

        <Prose title="What each one is made from">
          <Paragraphs blocks={madeFrom} />
        </Prose>

        <Prose title="Caffeine: caffeine-free is not the same as decaf">
          <Paragraphs blocks={caffeine} />
        </Prose>

        <Prose title="Taste: coffee-inspired, not a copy">
          <Paragraphs blocks={tasteIntro} />
          <ul style={{ marginTop: 12, paddingLeft: "1.2em" }}>
            {tasteBags.map((bag) => (
              <li key={bag.href} style={{ marginTop: 8 }}>
                <a href={bag.href} style={linkStyle}>
                  <strong style={{ fontWeight: 600 }}>{bag.name}</strong>
                </a>{" "}
                {bag.text}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 16 }}>
            <Rich parts={tasteClose} />
          </p>
        </Prose>

        <Prose title="Acidity">
          <Paragraphs blocks={acidity} />
        </Prose>

        <Prose title="Brewing: same gear, matched grind">
          <p>
            <Rich parts={brewIntro} />
          </p>
          <ul style={{ marginTop: 12, paddingLeft: "1.2em" }}>
            {grindMatches.map((row) => (
              <li key={row.href} style={{ marginTop: 8 }}>
                {row.method}
                {" → "}
                <a href={row.href} style={linkStyle}>
                  <strong style={{ fontWeight: 600 }}>{row.bag}</strong>
                </a>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 16 }}>
            <Rich parts={brewTip} />
          </p>
        </Prose>

        <Prose title="Which should you drink?">
          <Paragraphs blocks={which} />
        </Prose>

        <Prose id="where-to-start" title="Where to start with BAL" wide band>
          <Paragraphs blocks={whereToStart} />
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
          <p style={{ marginTop: 16 }}>
            <Rich parts={homeLink} />
          </p>
        </Prose>

        <ContentFaq faqs={faqs} title="Date seed coffee vs coffee FAQ" />

        <ContentClose
          title={closeTitle}
          body={closeBody}
          primary={{ href: closeHref, label: closeLabel }}
        />
      </main>
      <Footer />
      <Grain />
    </>
  );
}
