import {
  BulletSteps,
  ContentClose,
  ContentFaq,
  ContentHero,
  CtaLink,
  MethodSections,
  Paragraphs,
  Prose,
} from "components/bal/content-page";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { JsonLd } from "components/bal/json-ld";
import { Nav } from "components/bal/nav";
import {
  about,
  aboutActions,
  closeBody,
  closeHref,
  closeLabel,
  closeSecondary,
  closeTitle,
  crumbs,
  decafCompare,
  faqs,
  flavors,
  heroActions,
  intro,
  methodSections,
  needs,
  path,
  taste,
} from "lib/caffeine-free-latte";
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

const seo = pageSeo.caffeineFreeLatte;

export const metadata = pageMetadata({
  title: seo.title,
  description: seo.description,
  path,
  openGraphType: "article",
});

export default function CaffeineFreeLattePage() {
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
          about: "Caffeine-free latte",
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
          eyebrow="Caffeine-free latte"
          title={seo.h1}
          intro={intro}
          actions={heroActions}
        />

        <Prose title="What you need">
          <BulletSteps steps={needs} />
        </Prose>

        <MethodSections
          sections={methodSections.filter(
            (section) => section.id !== "no-machine",
          )}
        />

        <Prose title="Flavor ideas">
          <BulletSteps steps={flavors} />
        </Prose>

        <MethodSections
          sections={methodSections.filter(
            (section) => section.id === "no-machine",
          )}
        />

        <Prose title="Caffeine-free latte vs decaf latte">
          <Paragraphs blocks={decafCompare} />
        </Prose>

        <Prose title="What it tastes like">
          <Paragraphs blocks={taste} />
        </Prose>

        <Prose title="About BAL">
          <Paragraphs blocks={about} />
          <div
            className="bal-landing-actions"
            style={{
              marginTop: 18,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            {aboutActions.map((action, index) => (
              <CtaLink
                key={action.href}
                href={action.href}
                variant={index === 0 ? "solid" : "outline"}
              >
                {action.label}
              </CtaLink>
            ))}
          </div>
        </Prose>

        <ContentFaq faqs={faqs} title="Caffeine-free latte FAQ" />

        <ContentClose
          title={closeTitle}
          body={closeBody}
          primary={{ href: closeHref, label: closeLabel }}
          secondary={closeSecondary}
        />
      </main>
      <Footer />
      <Grain />
    </>
  );
}
