import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  brewRows,
  brewTip,
  caffeine,
  cardSummaries,
  chooseIntro,
  chooseNote,
  closeBody,
  facts,
  faqs,
  ingredientsLine,
  intro,
  makeSteps,
  tasteBullets,
  tasteClose,
  tasteIntro,
  whatIs,
} from "./date-seed-coffee.ts";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  itemListJsonLd,
  webPageJsonLd,
} from "./structured-data.ts";

const seoSource = readFileSync(new URL("./seo.ts", import.meta.url), "utf8");

const pageSeo = {
  home: {
    primary: "BAL Coffee; caffeine-free coffee alternative",
    title: "BAL Coffee | Caffeine-Free Coffee Alternative from Houston",
    description:
      "BAL Coffee roasts date seeds into a naturally caffeine-free coffee alternative. Three brew styles in 12 oz bags, shipped from Houston across the US.",
  },
  dateSeedCoffee: {
    primary: "date seed coffee",
    title: "Date Seed Coffee: Caffeine-Free Brew from Date Pits | BAL",
    description:
      "Date seed coffee is brewed from roasted date seeds, also called date pits. Naturally caffeine-free and acid-free, with no coffee beans. Find your brew.",
    h1: "Date seed coffee: a caffeine-free cup roasted from date seeds",
  },
  products: {
    primary: "buy date seed coffee",
    title: "Shop Date Seed Coffee: Espresso, Drip & Turkish | BAL",
    description:
      "Shop BAL date seed coffee by brew method: DateSpresso for espresso, GrounDate for drip and French press, Eastern Brew for a cezve. 12 oz bags.",
  },
  faq: {
    title: "BAL Coffee FAQ: Orders, Shipping, Caffeine & Brewing",
    description:
      "Questions about ordering, shipping and tracking BAL Coffee, plus quick answers on caffeine and brewing date seed coffee.",
    h1: "BAL Coffee FAQ",
  },
  datespresso: {
    title: "DateSpresso | Date Seed Espresso Alternative | BAL Coffee",
  },
  groundate: {
    title: "GrounDate | Drip & French Press Date Seed Coffee | BAL",
  },
  "eastern-brew": {
    title: "Eastern Brew | Turkish-Style Date Seed Coffee | BAL Coffee",
  },
} as const;

const forbidden =
  /\borganic\b|free shipping|best seller|prebiotic|digestion|\bgut\b|pregnan|blood sugar|antioxidant|\bvegan\b|weight loss|cholesterol/i;

test("landing page copy stays inside the allowed claims", () => {
  const copy = JSON.stringify({
    intro,
    whatIs,
    tasteIntro,
    tasteBullets,
    tasteClose,
    makeSteps,
    ingredientsLine,
    caffeine,
    chooseIntro,
    chooseNote,
    cardSummaries,
    facts,
    brewRows,
    brewTip,
    faqs,
    closeBody,
  });
  assert.equal(forbidden.test(copy), false);
  assert.equal(facts.includes("Acid-free"), true);
  assert.equal(facts.includes("100% date seeds"), true);
  assert.match(brewRows[0].brief, /18 to 20 grams/);
  assert.match(brewRows[0].brief, /dual-wall/);
  assert.doesNotMatch(brewRows[2].brief, /\d/);
  assert.equal(brewRows[2].slug, "eastern-brew");
});

test("approved titles are the strings shipped in lib/seo.ts", () => {
  for (const value of [
    pageSeo.home.title,
    pageSeo.home.description,
    pageSeo.home.primary,
    pageSeo.dateSeedCoffee.title,
    pageSeo.dateSeedCoffee.description,
    pageSeo.dateSeedCoffee.h1,
    pageSeo.dateSeedCoffee.primary,
    pageSeo.products.title,
    pageSeo.products.description,
    pageSeo.products.primary,
    pageSeo.faq.title,
    pageSeo.faq.description,
    pageSeo.faq.h1,
    pageSeo.datespresso.title,
    pageSeo.groundate.title,
    pageSeo["eastern-brew"].title,
  ]) {
    assert.equal(seoSource.includes(value), true, value);
  }
});

test("date seed coffee metadata matches the approved title and description", () => {
  assert.equal(
    pageSeo.dateSeedCoffee.title,
    "Date Seed Coffee: Caffeine-Free Brew from Date Pits | BAL",
  );
  assert.equal(pageSeo.dateSeedCoffee.title.length, 57);
  assert.equal(
    pageSeo.dateSeedCoffee.description,
    "Date seed coffee is brewed from roasted date seeds, also called date pits. Naturally caffeine-free and acid-free, with no coffee beans. Find your brew.",
  );
  assert.equal(pageSeo.dateSeedCoffee.description.length, 151);
  assert.equal(
    pageSeo.dateSeedCoffee.h1,
    "Date seed coffee: a caffeine-free cup roasted from date seeds",
  );
  assert.equal(pageSeo.dateSeedCoffee.primary, "date seed coffee");
});

test("home, shop, and faq titles are retargeted and product titles stay", () => {
  assert.equal(
    pageSeo.home.title,
    "BAL Coffee | Caffeine-Free Coffee Alternative from Houston",
  );
  assert.equal(pageSeo.home.title.length, 58);
  assert.equal(
    pageSeo.home.description,
    "BAL Coffee roasts date seeds into a naturally caffeine-free coffee alternative. Three brew styles in 12 oz bags, shipped from Houston across the US.",
  );
  assert.equal(pageSeo.home.description.length, 148);
  assert.equal(
    pageSeo.home.primary,
    "BAL Coffee; caffeine-free coffee alternative",
  );

  assert.equal(
    pageSeo.products.title,
    "Shop Date Seed Coffee: Espresso, Drip & Turkish | BAL",
  );
  assert.equal(pageSeo.products.title.length, 53);
  assert.equal(
    pageSeo.products.description,
    "Shop BAL date seed coffee by brew method: DateSpresso for espresso, GrounDate for drip and French press, Eastern Brew for a cezve. 12 oz bags.",
  );
  assert.equal(pageSeo.products.description.length, 142);
  assert.equal(pageSeo.products.primary, "buy date seed coffee");

  assert.equal(
    pageSeo.faq.title,
    "BAL Coffee FAQ: Orders, Shipping, Caffeine & Brewing",
  );
  assert.equal(pageSeo.faq.title.length, 52);
  assert.equal(
    pageSeo.faq.description,
    "Questions about ordering, shipping and tracking BAL Coffee, plus quick answers on caffeine and brewing date seed coffee.",
  );
  assert.equal(pageSeo.faq.description.length, 120);
  assert.equal(pageSeo.faq.h1, "BAL Coffee FAQ");

  assert.equal(
    pageSeo.datespresso.title,
    "DateSpresso | Date Seed Espresso Alternative | BAL Coffee",
  );
  assert.equal(
    pageSeo.groundate.title,
    "GrounDate | Drip & French Press Date Seed Coffee | BAL",
  );
  assert.equal(
    pageSeo["eastern-brew"].title,
    "Eastern Brew | Turkish-Style Date Seed Coffee | BAL Coffee",
  );
});

test("landing JSON-LD is WebPage, breadcrumb, item list, and FAQ only", () => {
  const url = "https://www.balcoffee.com";
  const webpage = webPageJsonLd(url, {
    name: pageSeo.dateSeedCoffee.h1,
    description: pageSeo.dateSeedCoffee.description,
  });
  assert.equal(webpage["@type"], "WebPage");
  assert.equal(
    webpage["@id"],
    "https://www.balcoffee.com/date-seed-coffee#webpage",
  );
  assert.equal(webpage.name, pageSeo.dateSeedCoffee.h1);
  assert.equal(webpage.description, pageSeo.dateSeedCoffee.description);
  assert.deepEqual(webpage.about, {
    "@type": "Thing",
    name: "Date seed coffee",
  });
  assert.deepEqual(webpage.publisher, {
    "@id": "https://www.balcoffee.com/#organization",
  });

  const crumbs = breadcrumbJsonLd([
    { name: "Home", url },
    { name: "Date seed coffee", url: `${url}/date-seed-coffee` },
  ]);
  assert.equal(crumbs["@type"], "BreadcrumbList");
  assert.equal(crumbs.itemListElement.length, 2);
  assert.equal(crumbs.itemListElement[1].name, "Date seed coffee");

  const list = itemListJsonLd([
    { name: "DateSpresso", url: `${url}/products/datespresso` },
    { name: "GrounDate", url: `${url}/products/groundate` },
    { name: "Eastern Brew", url: `${url}/products/eastern-brew` },
  ]);
  assert.equal(list["@type"], "ItemList");
  assert.equal(list.itemListElement.length, 3);
  assert.equal(list.itemListElement[0].url, `${url}/products/datespresso`);
  assert.equal(
    list.itemListElement.some((item) =>
      JSON.stringify(item).includes("Product"),
    ),
    false,
  );

  const faq = faqPageJsonLd(faqs);
  assert.equal(faq["@type"], "FAQPage");
  assert.equal(faq.mainEntity.length, 7);
  assert.deepEqual(
    faq.mainEntity.map((item) => item.name),
    faqs.map((item) => item.question),
  );
  assert.deepEqual(
    faq.mainEntity.map((item) => item.acceptedAnswer.text),
    faqs.map((item) => item.answer),
  );

  const serialized = JSON.stringify({ webpage, crumbs, list, faq });
  assert.equal(serialized.includes("aggregateRating"), false);
  assert.equal(serialized.includes('"@type":"Product"'), false);
  assert.equal(serialized.includes('"@type":"Review"'), false);
});
