import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as latte from "./caffeine-free-latte.ts";
import * as howTo from "./how-to-make-date-seed-coffee.ts";
import * as vs from "./date-seed-coffee-vs-coffee.ts";
import {
  methodSchema,
  stepLead,
  stepVisibleText,
  type CopyStep,
  type MethodSection,
} from "./rich-text.ts";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  howToJsonLd,
  webPageJsonLd,
} from "./structured-data.ts";

const url = "https://www.balcoffee.com";

const forbidden =
  /\borganic\b|free shipping|best seller|prebiotic|digestion|\bdigest\b|\bgut\b|pregnan|blood sugar|antioxidant|\bvegan\b|weight loss|cholesterol|reflux|\breviews?\b|\[CONFIRM\]|teaspoon|\btsp\b|6 oz|\$\d/i;

const titles = [
  ["Date Seed Coffee vs Coffee: Caffeine, Taste & Brewing | BAL", 59],
  ["How to Make Date Seed Coffee: Espresso, Drip & Cezve | BAL", 58],
  ["Caffeine-Free Latte at Home: Hot or Iced | BAL Coffee", 53],
] as const;

const descriptions = [
  [
    "How date seed coffee compares with regular coffee and decaf: what it's made from, caffeine, taste and brewing. Naturally caffeine-free, no coffee beans.",
    152,
  ],
  [
    "How to make date seed coffee in an espresso machine, drip machine, French press, pour-over or cezve, with the grind and amount for each. Caffeine-free.",
    151,
  ],
  [
    "Make a caffeine-free latte at home, hot or iced, with DateSpresso: espresso-style date seed coffee with no coffee beans and no caffeine. Steps inside.",
    150,
  ],
] as const;

function read(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function visibleSteps(sections: readonly MethodSection[]) {
  return sections.flatMap((section) =>
    section.steps.map((step) => ({
      section: section.title,
      name: stepLead(step) || section.title,
      text: stepVisibleText(step),
    })),
  );
}

function schemaSteps(data: ReturnType<typeof howToJsonLd>) {
  return data.step.flatMap((section) =>
    section.itemListElement.map((step) => ({
      section: section.name,
      name: step.name,
      text: step.text,
    })),
  );
}

function assertFaqMatches(
  faqs: readonly { question: string; answer: string }[],
) {
  const faq = faqPageJsonLd(faqs);
  assert.equal(faq["@type"], "FAQPage");
  assert.deepEqual(
    faq.mainEntity.map((item) => item.name),
    faqs.map((item) => item.question),
  );
  assert.deepEqual(
    faq.mainEntity.map((item) => item.acceptedAnswer.text),
    faqs.map((item) => item.answer),
  );
  return faq;
}

function assertLeadStepsStartWithLead(steps: readonly CopyStep[]) {
  for (const step of steps) {
    if (!("lead" in step)) continue;
    assert.equal(
      stepVisibleText(step).startsWith(step.lead.trim()),
      true,
      stepVisibleText(step),
    );
  }
}

test("new page titles and meta stay within the snippet limits", () => {
  const seoSource = read("./seo.ts");
  for (const [title, length] of titles) {
    assert.equal(title.length, length);
    assert.equal(title.length <= 60, true, title);
    assert.equal(seoSource.includes(title), true, title);
  }
  for (const [description, length] of descriptions) {
    assert.equal(description.length, length);
    assert.equal(description.length <= 160, true);
    assert.equal(seoSource.includes(description), true, description);
  }
});

test("new page copy avoids banned claims and unconfirmed amounts", () => {
  for (const [label, copy] of [
    ["vs", vs],
    ["how-to", howTo],
    ["latte", latte],
  ] as const) {
    const serialized = JSON.stringify(copy);
    assert.equal(
      forbidden.test(serialized),
      false,
      `${label} ${serialized.match(forbidden)?.[0]}`,
    );
    assert.equal(serialized.includes("1 to 2"), false, label);
    assert.equal(/steep for|minutes?/i.test(serialized), false, label);
  }
});

test("GrounDate, Eastern Brew, French press, and latte ratios stay unnumbered", () => {
  const groundRow = howTo.brewerRows[1];
  const easternRow = howTo.brewerRows[2];
  assert.equal(groundRow?.bag, "GrounDate");
  assert.match(groundRow?.start ?? "", /follow the directions on the bag/i);
  assert.doesNotMatch(groundRow?.start ?? "", /\d|teaspoon/i);
  assert.equal(easternRow?.bag, "Eastern Brew");
  assert.match(easternRow?.start ?? "", /adjust to taste/i);
  assert.doesNotMatch(easternRow?.start ?? "", /\d/);

  for (const id of ["drip", "french-press", "pour-over", "cezve"]) {
    const section = howTo.methodSections.find((item) => item.id === id);
    assert.ok(section, id);
    assert.doesNotMatch(JSON.stringify(section), /\d|teaspoon|minute/i, id);
  }

  const french = howTo.methodSections.find(
    (item) => item.id === "french-press",
  );
  assert.match(
    stepVisibleText(french!.steps[2]!),
    /^Press and sip\. Steep, press and pour\. Enjoy smooth, roasted depth\.$/,
  );

  const dose = howTo.faqs[0];
  assert.match(dose?.answer ?? "", /18 to 20 grams/);
  assert.match(dose?.answer ?? "", /follow the directions on the bag/i);
  assert.match(dose?.answer ?? "", /add Eastern Brew to taste/i);
  assert.doesNotMatch(dose?.answer ?? "", /teaspoon|1 to 2/);

  const hotMilk = latte.methodSections.find((item) => item.id === "hot")
    ?.steps[1];
  const icedMilk = latte.methodSections.find((item) => item.id === "iced")
    ?.steps[1];
  assert.ok(hotMilk && icedMilk);
  assert.match(stepVisibleText(hotMilk), /adjust the amount to taste/i);
  assert.match(stepVisibleText(icedMilk), /adjust the amount to taste/i);
  assert.doesNotMatch(stepVisibleText(hotMilk), /\d|\boz\b/i);
  assert.doesNotMatch(stepVisibleText(icedMilk), /\d|\boz\b/i);
  assert.match(JSON.stringify(howTo.methodSections[0]), /18 to 20 grams/);
});

test("FAQ JSON-LD matches the visible FAQ copy", () => {
  assertFaqMatches(vs.faqs);
  assertFaqMatches(howTo.faqs);
  assertFaqMatches(latte.faqs);
  assert.equal(vs.faqs.length, 5);
  assert.equal(howTo.faqs.length, 5);
  assert.equal(latte.faqs.length, 5);
});

test("HowTo JSON-LD matches the visible brew and latte steps", () => {
  const pages = [
    {
      name: "How to make date seed coffee, step by step",
      description: descriptions[1][0],
      path: howTo.path,
      sections: howTo.methodSections,
    },
    {
      name: "How to make a caffeine-free latte at home",
      description: descriptions[2][0],
      path: latte.path,
      sections: latte.methodSections,
    },
  ];

  for (const page of pages) {
    const visible = visibleSteps(page.sections);
    const schema = schemaSteps(
      howToJsonLd(
        url,
        {
          name: page.name,
          description: page.description,
          path: page.path,
        },
        methodSchema(page.sections),
      ),
    );
    assert.deepEqual(schema, visible);
    assert.equal(schema.length > 0, true);
    for (const section of page.sections) {
      assertLeadStepsStartWithLead(section.steps);
    }
  }

  const latteSchema = JSON.stringify(methodSchema(latte.methodSections));
  for (const step of [...latte.flavors, ...latte.needs]) {
    assert.equal(latteSchema.includes(stepVisibleText(step)), false);
  }
  assert.equal(JSON.stringify(latte).includes("eastern-brew"), false);
  assert.equal(JSON.stringify(latte).includes("Eastern Brew"), false);

  assert.deepEqual(
    howTo.methodSections.map((section) => section.cta?.href),
    [
      "/products/datespresso",
      undefined,
      undefined,
      "/products/groundate",
      "/products/eastern-brew",
    ],
  );
  assert.equal(howTo.methodSections[4]?.cta?.secondary, true);
  assert.deepEqual(
    vs.tasteBags.map((bag) => bag.href),
    ["/products/datespresso", "/products/groundate", "/products/eastern-brew"],
  );
});

test("comparison page schema is article, webpage, breadcrumb, and FAQ", () => {
  const page = {
    name: "Date seed coffee vs regular coffee: what's actually different",
    description: descriptions[0][0],
    path: vs.path,
  };
  const webpage = webPageJsonLd(url, {
    ...page,
    about: "Date seed coffee vs coffee",
  });
  const article = articleJsonLd(url, page);
  const crumbs = breadcrumbJsonLd(
    vs.crumbs.map((crumb) => ({
      name: crumb.name,
      url: crumb.path === "/" ? url : `${url}${crumb.path}`,
    })),
  );
  const faq = assertFaqMatches(vs.faqs);

  assert.equal(webpage["@id"], `${url}${vs.path}#webpage`);
  assert.equal(webpage.url, `${url}${vs.path}`);
  assert.equal(article["@type"], "Article");
  assert.equal(article.headline, page.name);
  assert.equal(article.mainEntityOfPage, `${url}${vs.path}`);
  assert.equal(crumbs.itemListElement.at(-1)?.item, `${url}${vs.path}`);
  assert.deepEqual(
    crumbs.itemListElement.map((item) => item.name),
    ["Home", "Date seed coffee", "vs coffee"],
  );

  const serialized = JSON.stringify({ webpage, article, crumbs, faq });
  assert.equal(serialized.includes('"@type":"Product"'), false);
  assert.equal(serialized.includes('"@type":"Review"'), false);
  assert.equal(serialized.includes("aggregateRating"), false);
  assert.equal(serialized.includes("HowTo"), false);
});

test("page files render the same copy the schema is built from", () => {
  const ui = read("../components/bal/content-page.tsx");
  assert.match(ui, /stepVisibleText\(step\)/);
  assert.match(ui, /function ContentFaq/);
  assert.match(ui, /faqs\.map/);

  const pages = [
    ["../app/date-seed-coffee-vs-coffee/page.tsx", "articleJsonLd"],
    ["../app/how-to-make-date-seed-coffee/page.tsx", "howToJsonLd"],
    ["../app/caffeine-free-latte/page.tsx", "howToJsonLd"],
  ] as const;

  for (const [file, schema] of pages) {
    const source = read(file);
    assert.match(source, new RegExp(schema));
    assert.match(source, /faqPageJsonLd\(faqs\)/);
    assert.match(source, /<ContentFaq faqs=\{faqs\}/);
    assert.match(source, /webPageJsonLd/);
    assert.match(source, /breadcrumbJsonLd/);
    assert.doesNotMatch(source, /use client/);
    assert.doesNotMatch(
      source,
      /productJsonLd|aggregateRating|CustomerReviews/,
    );
    assert.doesNotMatch(source, /\[CONFIRM\]|teaspoon|6 oz|\$\d/);
    if (schema === "howToJsonLd") {
      assert.match(source, /methodSchema\(methodSections\)/);
      assert.match(source, /<MethodSections/);
    }
  }

  const howPage = read("../app/how-to-make-date-seed-coffee/page.tsx");
  const lattePage = read("../app/caffeine-free-latte/page.tsx");
  for (const faq of [...howTo.faqs, ...latte.faqs, ...vs.faqs]) {
    assert.equal(howPage.includes(faq.question), false);
    assert.equal(lattePage.includes(faq.question), false);
  }

  const sitemap = read("../lib/sitemap-entries.ts");
  const guide = read("../app/date-seed-coffee/page.tsx");
  const faqPage = read("../app/faq/page.tsx");
  const productPage = read("../app/products/[slug]/page.tsx");
  for (const route of [vs.path, howTo.path, latte.path]) {
    assert.equal(sitemap.includes(`"${route}"`), true, route);
    assert.match(guide, new RegExp(`href="${route}"`));
    assert.match(faqPage, new RegExp(`href="${route}"`));
  }
  assert.match(productPage, /href="\/how-to-make-date-seed-coffee"/);
  assert.match(productPage, /Brewing guide/);
});
