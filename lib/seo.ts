import type { Metadata } from "next";
import { shopifyImageUrl } from "lib/images";
import type { Product } from "lib/products";

function priceString(amount: number) {
  return amount.toFixed(2);
}

/**
 * One primary intent per URL so the pages do not compete for the same query.
 * Search Console (6–29 Oct 2026) has impressions for brand and product names
 * only, so each coffee title starts with DateSpresso, GrounDate, or Eastern
 * Brew and then names the brew method.
 */
export const pageSeo = {
  home: {
    primary: "date seed coffee",
    intent:
      "Introduce the category and the caffeine-free alternative, then send shoppers to the bags.",
    title: "Date Seed Coffee | Caffeine-Free Coffee Alternative | BAL",
    description:
      "BAL makes roasted date seed coffee: a naturally caffeine-free coffee alternative with no coffee beans. Shop 12 oz bags shipped across the US.",
  },
  products: {
    primary: "roasted date seed coffee",
    intent: "Compare the three bags and choose a brew method.",
    title: "Shop Roasted Date Seed Coffee | Caffeine-Free | BAL",
    description:
      "Shop BAL's roasted date seed coffees: DateSpresso, GrounDate and Eastern Brew. 100% roasted date seeds, naturally caffeine-free, 12 oz bags.",
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
    primary: "date seed coffee questions",
    intent: "Answer caffeine, decaf, taste, brewing, and shipping questions.",
    title: "Date Seed Coffee FAQ: Caffeine, Brewing, Shipping | BAL",
    description:
      "Answers about BAL's roasted date seed coffee: caffeine, how it differs from decaf, brewing, shipping and orders.",
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
