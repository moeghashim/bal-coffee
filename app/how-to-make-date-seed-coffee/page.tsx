import {
  BulletSteps,
  ContentClose,
  ContentFaq,
  ContentHero,
  CtaLink,
  DataTable,
  linkStyle,
  MethodSections,
  Paragraphs,
  Prose,
} from "components/bal/content-page";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { JsonLd } from "components/bal/json-ld";
import { Nav } from "components/bal/nav";
import { getCoffeeProducts } from "lib/catalog";
import {
  brewerHeaders,
  brewerRows,
  closeBody,
  closeHref,
  closeLabel,
  closeTitle,
  closing,
  crumbs,
  faqs,
  fromScratch,
  fromScratchCta,
  grindIntro,
  heroActions,
  intro,
  methodSections,
  path,
  storage,
  strengthTips,
  withMilk,
} from "lib/how-to-make-date-seed-coffee";
import { methodSchema } from "lib/rich-text";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  howToJsonLd,
  pageMetadata,
  pageSeo,
  webPageJsonLd,
} from "lib/seo";
import { baseUrl } from "lib/utils";

const seo = pageSeo.howToMakeDateSeedCoffee;

export const metadata = pageMetadata({
  title: seo.title,
  description: seo.description,
  path,
  openGraphType: "article",
});

export default async function HowToMakeDateSeedCoffeePage() {
  const live = await getCoffeeProducts();
  const eastern = live.find((item) => item.slug === "eastern-brew");
  const easternAvailable = eastern ? eastern.availableForSale !== false : true;
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
          about: "How to make date seed coffee",
        })}
      />
      <JsonLd
        data={howToJsonLd(baseUrl, schemaPage, methodSchema(methodSections))}
      />
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
          eyebrow="Brewing guide"
          title={seo.h1}
          intro={intro}
          actions={heroActions}
        />

        <Prose
          title="Before you start: match the grind to your brewer"
          wide
          headingId="grind-heading"
        >
          <p>{grindIntro}</p>
          <DataTable
            labelledBy="grind-heading"
            headers={brewerHeaders}
            rows={brewerRows.map((row) => [
              row.brewer,
              <a key={row.href} href={row.href} style={linkStyle}>
                {row.bag}
              </a>,
              row.start,
            ])}
          />
        </Prose>

        <MethodSections
          sections={methodSections}
          easternAvailable={easternAvailable}
        />

        <Prose title="How to make date seed coffee with milk">
          <Paragraphs blocks={withMilk} />
        </Prose>

        <Prose title="Getting the strength right">
          <BulletSteps steps={strengthTips} />
        </Prose>

        <Prose title="Storing your bag">
          <Paragraphs blocks={storage} />
        </Prose>

        <Prose title="Can you make date seed coffee from scratch at home?">
          <Paragraphs blocks={fromScratch} />
          <div style={{ marginTop: 18 }}>
            <CtaLink href={fromScratchCta.href}>{fromScratchCta.label}</CtaLink>
          </div>
          <Paragraphs blocks={closing} />
        </Prose>

        <ContentFaq faqs={faqs} title="Date seed coffee brewing FAQ" />

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
