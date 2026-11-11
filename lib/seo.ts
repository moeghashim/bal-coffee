import type { Metadata } from "next";
import { shopifyImageUrl } from "lib/images";
import type { Product } from "lib/products";

export {
  breadcrumbJsonLd,
  faqPageJsonLd,
  itemListJsonLd,
  webPageJsonLd,
} from "./structured-data";

function priceString(amount: number) {
  return amount.toFixed(2);
}

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
      "BAL Coffee roasts date seeds into a naturally caffeine-free coffee alternative. Three brew styles in 12 oz bags, shipped from Houston across the US.",
  },
  dateSeedCoffee: {
    primary: "date seed coffee",
    intent:
      "Explain date seed coffee, then send shoppers to the bag that matches how they brew.",
    title: "Date Seed Coffee: Caffeine-Free Brew from Date Pits | BAL",
    description:
      "Date seed coffee is brewed from roasted date seeds, also called date pits. Naturally caffeine-free and acid-free, with no coffee beans. Find your brew.",
    h1: "Date seed coffee: a caffeine-free cup roasted from date seeds",
  },
  products: {
    primary: "buy date seed coffee",
    intent: "Shop the three bags by brew method.",
    title: "Shop Date Seed Coffee: Espresso, Drip & Turkish | BAL",
    description:
      "Shop BAL date seed coffee by brew method: DateSpresso for espresso, GrounDate for drip and French press, Eastern Brew for a cezve. 12 oz bags.",
  },
  datespresso: {
    primary: "date seed espresso alternative",
    intent: "Buy the espresso-style bag.",
    title: "DateSpresso | Date Seed Espresso Alternative | BAL Coffee",
    description:
      "DateSpresso is roasted date seed coffee for espresso machines, lattes and iced drinks. Naturally caffeine-free, 100% date seeds, 12 oz bag.",
    h1: "DateSpresso: roasted date seed coffee for espresso",
    brewHeading: "How to brew espresso-style",
    brewLink: "DateSpresso, for espresso",
  },
  groundate: {
    primary: "drip and French press date seed coffee",
    intent:
      "Buy the everyday drip, French press, and pour-over bag. Title and meta lead with GrounDate: the page already ranks near position 2 and needs a clearer snippet.",
    title: "GrounDate | Drip & French Press Date Seed Coffee | BAL",
    description:
      "GrounDate by BAL Coffee: roasted date seed coffee for drip, French press, and pour-over. Naturally caffeine-free, 100% date seeds, 12 oz bag.",
    h1: "GrounDate: roasted date seed coffee for drip and French press",
    brewHeading: "How to brew drip, French press, or pour-over",
    brewLink: "GrounDate, for drip and French press",
  },
  "eastern-brew": {
    primary: "Turkish-style date seed coffee",
    intent: "Buy the fine grind for a cezve.",
    title: "Eastern Brew | Turkish-Style Date Seed Coffee | BAL Coffee",
    description:
      "Eastern Brew is roasted date seed coffee for Turkish-style brewing in a cezve. Naturally caffeine-free, 100% date seeds, 12 oz bag.",
    h1: "Eastern Brew: roasted date seed coffee for Turkish-style brewing",
    brewHeading: "How to brew in a cezve",
    brewLink: "Eastern Brew, for a Turkish-style cup",
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
    title: "About BAL Coffee | Roasted Date Seed Coffee by Judy Ghashim",
    description:
      "Meet Judy Ghashim, the Houston-based founder of BAL Coffee, and the story behind our naturally caffeine-free roasted date seed coffee.",
  },
  shipping: {
    primary: "shipping cost at checkout",
    intent: "Explain that rates are calculated at checkout for US orders.",
    title: "Shipping & Delivery | BAL Coffee",
    description:
      "How BAL Coffee ships date seed coffee across the US. Rates are calculated at checkout. Tracking is sent by email.",
  },
  returns: {
    primary: "returns and exchanges",
    intent:
      "Tell a customer how to write in about a return or a damaged order.",
    title: "Returns & Exchanges | BAL Coffee",
    description:
      "How to contact BAL Coffee about a return, exchange or a damaged order. Email your order number and we will reply with next steps.",
  },
  contact: {
    primary: "contact BAL Coffee",
    intent: "Reach the company about an order, tracking, or wholesale.",
    title: "Contact BAL Coffee | Orders, Wholesale & Questions",
    description:
      "Email BAL Coffee about orders, tracking, wholesale or questions. BAL is an online-only coffee company based in Houston, Texas.",
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

/** Collapse markup and runs of whitespace. Schema and meta stay plain text. */
export function plainText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
    email: "judy@balcoffee.com",
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
      email: "judy@balcoffee.com",
    },
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

export function productJsonLd(
  product: Product,
  url: string,
  description?: string,
) {
  const images = (product.images ?? [])
    .map((image) => shopifyImageUrl(image.url, 1200))
    .filter((imageUrl) => imageUrl.length > 0);
  const variants = (product.variants ?? []).filter((variant) =>
    Number.isFinite(variant.priceAmount),
  );
  const amounts = variants.map((variant) => variant.priceAmount);
  const currency = variants[0]?.currencyCode || product.currencyCode || "USD";
  const availability = product.availableForSale
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
  const low = amounts.length > 0 ? Math.min(...amounts) : undefined;
  const high = amounts.length > 0 ? Math.max(...amounts) : undefined;
  const schemaDescription = plainText(
    description || product.blurb || product.name,
  );

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: schemaDescription,
    brand: {
      "@type": "Brand",
      name: product.vendor || "BAL Coffee",
    },
  };

  if (images.length > 0) data.image = images;
  // Real Shopify SKUs only. Never invent a GTIN, MPN, or SKU.
  if (product.sku) data.sku = product.sku;

  if (low !== undefined && high !== undefined && low !== high) {
    data.offers = {
      "@type": "AggregateOffer",
      lowPrice: priceString(low),
      highPrice: priceString(high),
      priceCurrency: currency,
      offerCount: variants.length,
      availability,
      url,
    };
  } else if (low !== undefined) {
    data.offers = {
      "@type": "Offer",
      price: priceString(low),
      priceCurrency: currency,
      availability,
      url,
    };
  }

  return data;
}
