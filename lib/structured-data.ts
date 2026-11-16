/**
 * JSON-LD builders with no app imports, so unit tests can load this file
 * directly. Product and AggregateRating stay off the date seed coffee page.
 */

export function webPageJsonLd(
  url: string,
  page: {
    name: string;
    description: string;
    path?: string;
    about?: string;
  },
) {
  const pageUrl = `${url}${page.path ?? "/date-seed-coffee"}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.name,
    description: page.description,
    about: {
      "@type": "Thing",
      name: page.about ?? "Date seed coffee",
    },
    publisher: { "@id": `${url}/#organization` },
  };
}

export function articleJsonLd(
  url: string,
  page: { name: string; description: string; path: string },
) {
  const pageUrl = `${url}${page.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.name,
    description: page.description,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    author: {
      "@type": "Organization",
      name: "BAL Coffee",
      url,
    },
    publisher: { "@id": `${url}/#organization` },
  };
}

export function howToJsonLd(
  url: string,
  page: { name: string; description: string; path: string },
  sections: readonly {
    name: string;
    steps: readonly { name: string; text: string }[];
  }[],
) {
  const pageUrl = `${url}${page.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.name,
    description: page.description,
    url: pageUrl,
    step: sections.map((section, sectionIndex) => ({
      "@type": "HowToSection",
      position: sectionIndex + 1,
      name: section.name,
      itemListElement: section.steps.map((step, stepIndex) => ({
        "@type": "HowToStep",
        position: stepIndex + 1,
        name: step.name,
        text: step.text,
      })),
    })),
  };
}

/** Name + URL only. Same ListItem shape as collectionJsonLd, with no Product. */
export function itemListJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function faqPageJsonLd(
  questions: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
