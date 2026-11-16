import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTENT_PATHS,
  NOINDEX_PATHS,
  sitemapEntries,
} from "./sitemap-entries.ts";
import { siteVerification } from "./site-verification.ts";
import { productNameSegments } from "./internal-links.ts";
import {
  formatPhrase,
  gtinFromBarcode,
  merchantReturnPolicy,
  offerShippingDetails,
  organizationCommerceFields,
  RETURN_NOT_PERMITTED,
  schemaPrice,
  sizeLabel,
} from "./merchant-listing.ts";
import { productJsonLd } from "./product-json-ld.ts";
import type { Product } from "./products.ts";

const SITE = "https://www.balcoffee.com";

function coffee(overrides: Partial<Product> = {}): Product {
  return {
    name: "DateSpresso",
    slug: "datespresso",
    shopifyHandle: "datespresso",
    type: "Espresso-style depth",
    category: "coffee",
    badge: "",
    blurb: "Bold & indulgent with espresso-style depth.",
    price: "$26.99",
    description:
      "DateSpresso is roasted date seed coffee made for espresso-style drinks. Size: 12 oz.",
    notes: [],
    details: [],
    benefits: [],
    ingredients: "Roasted date seeds.",
    nutrition: [],
    brewSteps: [],
    kind: "bag-dark",
    accent: "#351c10",
    availableForSale: true,
    priceAmount: 26.99,
    currencyCode: "USD",
    vendor: "BAL Coffee",
    sku: undefined,
    barcode: "00198168355725",
    weight: 340,
    weightUnit: "GRAMS",
    size: "12 oz",
    format: "espresso-style",
    images: [
      {
        url: "https://cdn.shopify.com/s/files/1/0865/4769/3867/files/image00006.jpg?v=1",
        width: 4000,
        height: 6000,
      },
    ],
    ...overrides,
  };
}

const INVENTED = [
  "shippingRate",
  "handlingTime",
  "priceValidUntil",
  "merchantReturnDays",
  "returnFees",
  "returnMethod",
  "returnShippingFeesAmount",
  "FreeReturn",
  "MerchantReturnFiniteReturnWindow",
  "MerchantReturnUnlimitedWindow",
  "aggregateRating",
  "organic",
];

test("shipping details are US transit of 2–3 days and do not invent a rate or handling time", () => {
  const shipping = offerShippingDetails();
  assert.deepEqual(shipping, {
    "@type": "OfferShippingDetails",
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "US",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 2,
        maxValue: 3,
        unitCode: "DAY",
      },
    },
  });
  assert.equal("shippingRate" in shipping, false);
  assert.equal("handlingTime" in (shipping.deliveryTime as object), false);
});

test("return policy is not permitted in the US and has no fee or method", () => {
  const policy = merchantReturnPolicy(SITE);
  assert.deepEqual(policy, {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory: RETURN_NOT_PERMITTED,
    merchantReturnLink: "https://www.balcoffee.com/returns",
  });
  assert.equal(policy.returnPolicyCategory, RETURN_NOT_PERMITTED);
  assert.equal(JSON.stringify(policy).includes("merchantReturnDays"), false);
  assert.equal(JSON.stringify(policy).includes("returnFees"), false);
  assert.equal(JSON.stringify(policy).includes("returnMethod"), false);
});

test("organization shipping and returns match the offer policy", () => {
  const fields = organizationCommerceFields(`${SITE}/`);
  assert.deepEqual(fields.shippingDetails, offerShippingDetails());
  assert.deepEqual(fields.hasMerchantReturnPolicy, merchantReturnPolicy(SITE));
});

test("product JSON-LD uses live price, stock, size, and weight without invented fields", () => {
  const data = productJsonLd(
    coffee(),
    `${SITE}/products/datespresso`,
    "SEO description that must not replace the visible description.",
  );
  const serialized = JSON.stringify(data);
  const offers = data.offers as Record<string, unknown>;

  assert.equal(data["@type"], "Product");
  assert.equal((data.brand as { name: string }).name, "BAL");
  assert.equal(data.sku, undefined);
  assert.equal(data.gtin14, "00198168355725");
  assert.equal(data.gtin13, undefined);
  assert.equal(data.size, "12 oz");
  assert.deepEqual(data.weight, {
    "@type": "QuantitativeValue",
    value: 340,
    unitCode: "GRM",
  });
  assert.equal(offers["@type"], "Offer");
  assert.equal(offers.price, "26.99");
  assert.equal(offers.priceCurrency, "USD");
  assert.equal(offers.availability, "https://schema.org/InStock");
  assert.equal(offers.itemCondition, "https://schema.org/NewCondition");
  assert.equal(offers.priceValidUntil, undefined);
  assert.deepEqual(offers.shippingDetails, offerShippingDetails());
  assert.deepEqual(offers.hasMerchantReturnPolicy, merchantReturnPolicy(SITE));
  assert.match(String(data.description), /espresso-style/);
  assert.equal(String(data.description).includes("SEO description"), false);
  assert.match(String(data.image), /cdn\.shopify\.com/);
  assert.match(String(data.image), /width=1200/);
  for (const field of INVENTED) {
    assert.equal(serialized.includes(field), false, field);
  }
});

test("out of stock, a blank SKU, and a bad barcode stay out of the markup", () => {
  const data = productJsonLd(
    coffee({
      availableForSale: false,
      sku: "   ",
      barcode: "00198168355726",
      price: "$27",
      priceAmount: 27,
      size: undefined,
      format: undefined,
      weight: undefined,
      weightUnit: undefined,
      description: "Roasted date seeds.",
    }),
    `${SITE}/products/datespresso`,
  );
  const offers = data.offers as Record<string, unknown>;
  assert.equal(offers.price, "27");
  assert.equal(offers.availability, "https://schema.org/OutOfStock");
  assert.equal(data.sku, undefined);
  assert.equal(data.gtin14, undefined);
  assert.equal(data.gtin, undefined);
  assert.equal(data.size, undefined);
  assert.equal(data.weight, undefined);
  assert.equal(data.additionalProperty, undefined);
  assert.equal(JSON.stringify(data).includes("priceValidUntil"), false);
});

test("a real SKU is kept and a price range does not gain a shipping rate", () => {
  const data = productJsonLd(
    coffee({
      sku: "BAL-ESP-12",
      variants: [
        {
          id: "1",
          title: "12oz",
          availableForSale: true,
          priceLabel: "$26.99",
          priceAmount: 26.99,
          currencyCode: "USD",
          selectedOptions: [],
        },
        {
          id: "2",
          title: "2 lb",
          availableForSale: true,
          priceLabel: "$48.00",
          priceAmount: 48,
          currencyCode: "USD",
          selectedOptions: [],
        },
      ],
    }),
    `${SITE}/products/datespresso`,
  );
  const offers = data.offers as Record<string, unknown>;
  assert.equal(data.sku, "BAL-ESP-12");
  assert.equal(offers["@type"], "AggregateOffer");
  assert.equal(offers.lowPrice, "26.99");
  assert.equal(offers.highPrice, "48.00");
  assert.equal("shippingRate" in (offers.shippingDetails as object), false);
  assert.equal(offers.itemCondition, "https://schema.org/NewCondition");
});

test("gtin, size, and format helpers refuse values Shopify did not provide", () => {
  assert.equal(gtinFromBarcode(undefined), undefined);
  assert.equal(gtinFromBarcode(""), undefined);
  assert.equal(gtinFromBarcode("not-a-gtin"), undefined);
  assert.equal(gtinFromBarcode("00198168355726"), undefined);
  assert.deepEqual(gtinFromBarcode("00197644423729"), {
    property: "gtin14",
    value: "00197644423729",
  });
  assert.deepEqual(gtinFromBarcode("00198168927625"), {
    property: "gtin14",
    value: "00198168927625",
  });
  assert.equal(sizeLabel(undefined), undefined);
  assert.equal(sizeLabel("Default Title"), undefined);
  assert.equal(sizeLabel("12oz"), "12 oz");
  assert.equal(
    formatPhrase("made for drip-style brewing and a French press"),
    "drip-style",
  );
  assert.equal(formatPhrase("roasted date seeds"), undefined);
  assert.equal(schemaPrice(26.99, "$26.99"), "26.99");
  assert.equal(schemaPrice(27, "$27"), "27");
});

test("sitemap entries always have lastModified and skip noindex paths", () => {
  const entries = sitemapEntries(SITE, [
    { slug: "datespresso", updatedAt: "2026-11-12T05:20:34Z" },
    { slug: "eastern-brew" },
  ]);
  assert.equal(
    entries.every((entry) => typeof entry.lastModified === "string"),
    true,
  );
  assert.equal(
    entries.find((entry) => entry.url.endsWith("/products/datespresso"))
      ?.lastModified,
    "2026-11-12T05:20:34Z",
  );
  assert.equal(
    entries.find((entry) => entry.url.endsWith("/products/eastern-brew"))
      ?.lastModified,
    "2026-10-31",
  );
  assert.equal(
    entries.find((entry) => entry.url.endsWith("/privacy"))?.lastModified,
    "2026-11-14",
  );
  assert.equal(
    entries.find((entry) => entry.url.endsWith("/date-seed-coffee"))
      ?.lastModified,
    "2026-11-12",
  );
  assert.equal(
    entries.find((entry) => entry.url.endsWith("/returns"))?.lastModified,
    "2026-11-16",
  );
  assert.equal(
    entries.find((entry) => entry.url.endsWith("/shipping"))?.lastModified,
    "2026-11-16",
  );
  for (const path of NOINDEX_PATHS) {
    assert.equal(
      CONTENT_PATHS.some(
        (content) => content === path || content.startsWith(path),
      ),
      false,
      path,
    );
    assert.equal(
      entries.some((entry) => entry.url.includes(path)),
      false,
      path,
    );
  }
});

test("Bing verification meta is omitted when the env value is blank", () => {
  assert.equal(siteVerification(undefined), undefined);
  assert.equal(siteVerification("  "), undefined);
  assert.deepEqual(siteVerification("BING123"), {
    other: { "msvalidate.01": "BING123" },
  });
});

test("product name segments link the three coffees and leave other words", () => {
  assert.deepEqual(
    productNameSegments(
      "DateSpresso, GrounDate, and Eastern Brew are roasted date seeds.",
    ),
    [
      { text: "DateSpresso", href: "/products/datespresso" },
      { text: ", " },
      { text: "GrounDate", href: "/products/groundate" },
      { text: ", and " },
      { text: "Eastern Brew", href: "/products/eastern-brew" },
      { text: " are roasted date seeds." },
    ],
  );
});
