import type { Metadata } from "next";
import { organizationCommerceFields } from "lib/merchant-listing";

export {
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  howToJsonLd,
  itemListJsonLd,
  webPageJsonLd,
} from "./structured-data";
export { plainText } from "./plain-text";
export { productJsonLd } from "./product-json-ld";

/**
 * One primary intent per URL so the pages do not compete for the same query.
 * /date-seed-coffee owns "date seed coffee". The homepage owns the broader
 * caffeine-free coffee alternative. /products is the shop page. /faq is
 * support. Each coffee title starts with DateSpresso, GrounDate, or Eastern
 * Brew and then names the brew method.
 */
export const pageSeo = {
  home: {
    primary: "BAL Coffee; caffeine-free coffee alternative",
    intent:
      "Brand page for the caffeine-free coffee alternative. The date seed coffee explainer lives on /date-seed-coffee.",
    title: "BAL Coffee | Caffeine-Free Coffee Alternative from Houston",
    description:
      "A naturally caffeine-free coffee alternative roasted from 100% date seeds. Acid-free, no additives, three 12 oz bags. Shipped from Houston, TX.",
  },
  dateSeedCoffee: {
    primary: "date seed coffee",
    intent:
      "Explain date seed coffee, then send shoppers to the bag that matches how they brew.",
    title: "Date Pit Coffee & Date Seed Coffee, Caffeine-Free | BAL",
    description:
      "Date pit coffee and date seed coffee are the same drink: roasted date seeds, naturally caffeine-free and acid-free. A 12 oz bag is $26.99. Three grinds.",
    h1: "Date seed coffee: a caffeine-free cup roasted from date seeds",
  },
  dateSeedCoffeeVsCoffee: {
    primary: "date seed coffee vs coffee",
    intent:
      "Compare date seed coffee with regular coffee and decaf, then send readers back to the explainer and the bags.",
    title: "Decaf vs Caffeine-Free: Date Seed Coffee vs Coffee",
    description:
      "Decaf vs caffeine-free: decaf starts with coffee beans. Date seed coffee never had caffeine. Compare taste, acidity, and how each one is brewed.",
    h1: "Date seed coffee vs regular coffee: what's actually different",
  },
  howToMakeDateSeedCoffee: {
    primary: "how to make date seed coffee",
    intent:
      "Brewing steps for each grind. Amounts that are not printed on the bag stay as adjust to taste.",
    title: "How to Make Date Seed Coffee: Step-by-Step Brews | BAL",
    description:
      "How to make date seed coffee at home: espresso, drip, French press, pour-over, cold brew, or a cezve. The right grind for each method, step by step.",
    h1: "How to make date seed coffee, step by step",
  },
  caffeineFreeLatte: {
    primary: "caffeine-free latte",
    intent:
      "Hot and iced latte steps with DateSpresso. The product page stays the buy URL.",
    title: "Caffeine-Free Latte at Home: Hot, Iced, No Machine | BAL",
    description:
      "Make a caffeine-free latte at home, hot or iced, with DateSpresso. No coffee beans and no caffeine. No espresso machine? A GrounDate option is included.",
    h1: "How to make a caffeine-free latte at home",
  },
  products: {
    primary: "buy date seed coffee",
    intent: "Shop the three bags by brew method.",
    title: "Shop Date Seed Coffee | Espresso, Drip & Cezve, $26.99",
    description:
      "Three 12 oz bags of date seed coffee, $26.99 each. Espresso, drip and French press, or Turkish-style. Naturally caffeine-free, acid-free, no additives.",
  },
  datespresso: {
    primary: "date seed espresso alternative",
    intent: "Buy the espresso-style bag.",
    title: "DateSpresso | Caffeine-Free Date Espresso | BAL Coffee",
    description:
      "DateSpresso is caffeine-free date espresso roasted from 100% date seeds. Acid-free, no additives, for espresso machines and lattes. 12 oz bag, $26.99.",
    h1: "DateSpresso: roasted date seed coffee for espresso",
    brewHeading: "How to make DateSpresso",
    brewLink: "DateSpresso, for espresso",
    brewNote:
      "DateSpresso is caffeine-free date espresso: 100% roasted date seeds ground for an espresso machine, with no coffee beans and no additives or preservatives.",
  },
  groundate: {
    primary: "drip and French press date seed coffee",
    intent:
      "Buy the everyday drip, French press, and pour-over bag. Title and meta lead with GrounDate: the page already ranks near position 2 and needs a clearer snippet.",
    title: "GrounDate | Caffeine-Free Drip Date Seed Coffee | BAL",
    description:
      "GrounDate is date seed coffee for drip, French press, pour-over, and cold brew. Naturally caffeine-free, acid-free, 100% date seeds. 12 oz bag, $26.99.",
    h1: "GrounDate: roasted date seed coffee for drip and French press",
    brewHeading: "How to make GrounDate",
    brewLink: "GrounDate, for drip and French press",
    brewNote:
      "GrounDate is the everyday bag for drip, French press, pour-over, and cold brew. It is 100% roasted date seeds, naturally caffeine-free and acid-free.",
  },
  "eastern-brew": {
    primary: "Turkish-style date seed coffee",
    intent: "Buy the fine grind for a cezve.",
    title: "Eastern Brew | Turkish-Style Coffee, Caffeine-Free | BAL",
    description:
      "Eastern Brew is Turkish-style coffee made from roasted date seeds for a cezve. Naturally caffeine-free, acid-free, 100% date seeds. 12 oz bag, $26.99.",
    h1: "Eastern Brew: roasted date seed coffee for Turkish-style brewing",
    brewHeading: "How to make Eastern Brew",
    brewLink: "Eastern Brew, for a Turkish-style cup",
    brewNote:
      "Eastern Brew is Turkish-style coffee ground from roasted date seeds for a cezve or dallah. It is 100% date seeds, naturally caffeine-free and acid-free.",
  },
  faq: {
    primary: "BAL Coffee orders and shipping",
    intent:
      "Support page for orders, shipping, and tracking, plus short answers on caffeine and brewing.",
    title: "BAL Coffee FAQ: Orders, Shipping, Caffeine & Brewing",
    description:
      "Questions about ordering, shipping and tracking BAL Coffee, plus quick answers on caffeine and brewing date seed coffee.",
    h1: "BAL Coffee FAQ",
  },
  about: {
    primary: "BAL Coffee founder",
    intent:
      "Tell Judy Ghashim's story for shoppers who want to know who makes it.",
    title: "About BAL Coffee | Judy Ghashim's Date Seed Coffee",
    description:
      "Judy Ghashim started BAL Coffee in Houston to roast date seed coffee. 100% date seeds, naturally caffeine-free, acid-free, and roasted in small batches.",
  },
  shipping: {
    primary: "US shipping for 12 oz bags",
    intent:
      "Explain that US shipping is $9.99 for one bag, $12.99 for 2 or more, and most orders arrive in 2–5 business days.",
    title: "Shipping & Delivery | BAL Coffee",
    description:
      "How BAL Coffee ships date seed coffee across the US. US shipping is $9.99 for one bag, $12.99 for 2 or more. Most orders arrive in 2–5 business days. Tracking is sent by email.",
  },
  returns: {
    primary: "all sales are final",
    intent:
      "State that BAL does not accept returns, and how to write about a damaged or wrong item.",
    title: "Returns & Exchanges | BAL Coffee",
    description:
      "All sales are final. BAL Coffee does not accept returns. If an item arrives damaged or isn't what you ordered, contact us and include a photo if you have one.",
  },
  contact: {
    primary: "contact BAL Coffee",
    intent: "Reach the company about an order, tracking, or wholesale.",
    title: "Contact BAL Coffee | Orders, Tracking, and Wholesale",
    description:
      "Email info@balcoffee.com about a BAL Coffee order, tracking, or wholesale. Date seed coffee ships from Houston. Most US orders arrive in 2-5 business days.",
  },
} as const;

export type CoffeeSlug = "datespresso" | "groundate" | "eastern-brew";

export function coffeeSeo(slug: string) {
  if (
    slug === "datespresso" ||
    slug === "groundate" ||
    slug === "eastern-brew"
  ) {
    return pageSeo[slug];
  }
  return undefined;
}

export function brewLinkLabel(slug: string) {
  return coffeeSeo(slug)?.brewLink;
}

const DEFAULT_SHARE_IMAGE = {
  url: "/opengraph-image",
  alt: "BAL Coffee roasted date seed coffee",
};

export function pageMetadata({
  title,
  description,
  path,
  index = true,
  openGraphType = "website",
  image,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  openGraphType?: "website" | "article";
  image?: { url: string; alt: string };
}): Metadata {
  const shareImage = image ?? DEFAULT_SHARE_IMAGE;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "BAL Coffee",
      locale: "en_US",
      type: openGraphType,
      images: [{ url: shareImage.url, alt: shareImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage.url],
    },
  };
}

export function organizationJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: "BAL Coffee",
    url,
    email: "info@balcoffee.com",
    logo: `${url}/favicon.ico`,
    description:
      "BAL Coffee makes roasted date seed coffee, a caffeine-free coffee alternative, and ships across the United States from Houston, Texas.",
    founder: {
      "@type": "Person",
      name: "Judy Ghashim",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "info@balcoffee.com",
    },
    ...organizationCommerceFields(url),
  };
}

export function websiteJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BAL Coffee",
    url,
    publisher: { "@id": `${url}/#organization` },
  };
}

export function collectionJsonLd(
  url: string,
  products: { name: string; slug: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shop roasted date seed coffee",
    url: `${url}/products`,
    isPartOf: { "@type": "WebSite", name: "BAL Coffee", url },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: `${url}/products/${product.slug}`,
      })),
    },
  };
}

export function aboutPageJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: pageSeo.about.title,
    url: `${url}/about`,
    about: { "@id": `${url}/#organization` },
  };
}

export function contactPageJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: pageSeo.contact.title,
    url: `${url}/contact`,
    about: { "@id": `${url}/#organization` },
  };
}
