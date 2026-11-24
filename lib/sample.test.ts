import assert from "node:assert/strict";
import test from "node:test";
import { cartLinesToGaItems } from "./ga.ts";
import {
  SAMPLE_GRINDS,
  SAMPLE_MAX_PER_ORDER,
  SAMPLE_TERMS,
  bagHandleForBlend,
  cartExceedsSampleLimit,
  cartHasSample,
  isSampleCartLine,
  isSampleShopifyProduct,
  pickSampleOffer,
  pickSampleOffers,
  sampleUnitsInCart,
  sampleVariantIdsInCart,
} from "./sample.ts";

function variant(blend: string, availableForSale = true, sku = "") {
  return {
    id: `gid://shopify/ProductVariant/${blend.replace(/\s/g, "")}`,
    title: blend,
    availableForSale,
    sku,
    price: { amount: "0.0", currencyCode: "USD" },
    selectedOptions: [{ name: "Blend", value: blend }],
  };
}

const sample = {
  handle: "sample",
  tags: ["sample", "no-index"],
  variants: {
    nodes: [
      variant("DateSpresso", true, "BAL-SMP-DS"),
      variant("GrounDate", false, "BAL-SMP-GD"),
      variant("Eastern Brew", true, "BAL-SMP-EB"),
    ],
  },
};

test("sample product is recognized by handle or tag, bags are not", () => {
  assert.equal(isSampleShopifyProduct({ handle: "sample" }), true);
  assert.equal(
    isSampleShopifyProduct({ handle: "taster", tags: ["Sample"] }),
    true,
  );
  assert.equal(
    isSampleShopifyProduct({ handle: "datespresso", tags: ["Coffee"] }),
    false,
  );
});

test("each bag maps to its own available sample variant", () => {
  const offer = pickSampleOffer(sample, "datespresso");
  assert.equal(offer?.blend, "DateSpresso");
  assert.equal(
    offer?.merchandiseId,
    "gid://shopify/ProductVariant/DateSpresso",
  );
  assert.equal(offer?.grind, "ground for espresso machines");
  assert.equal(pickSampleOffer(sample, "arabica")?.blend, "Eastern Brew");
});

test("call to action hides when the sample is missing or sold out", () => {
  assert.equal(pickSampleOffer(undefined, "datespresso"), undefined);
  assert.equal(pickSampleOffer(sample, "groundate"), undefined);
  assert.equal(pickSampleOffer(sample, "caramel-glow"), undefined);
  assert.deepEqual(
    pickSampleOffers(sample).map((offer) => offer.blend),
    ["DateSpresso", "Eastern Brew"],
  );
  assert.deepEqual(
    pickSampleOffers({ ...sample, handle: "datespresso", tags: [] }),
    [],
  );
});

test("one of each blend per order, mixed with bags allowed", () => {
  const bag = {
    quantity: 2,
    merchandise: { product: { handle: "groundate" } },
  };
  const line = (id: string, quantity = 1) => ({
    quantity,
    merchandise: { id, product: { handle: "sample" } },
  });
  const ds = line("gid://shopify/ProductVariant/DS");
  const gd = line("gid://shopify/ProductVariant/GD");
  const eb = { quantity: 1, merchandise: { id: "EB", sku: "BAL-SMP-EB" } };
  assert.equal(SAMPLE_MAX_PER_ORDER, 3);
  assert.equal(isSampleCartLine(bag), false);
  assert.equal(isSampleCartLine(eb), true);
  assert.equal(cartHasSample([bag]), false);
  assert.equal(cartHasSample([bag, ds]), true);
  // All three blends plus bags is allowed.
  assert.equal(cartExceedsSampleLimit([bag, ds, gd, eb]), false);
  assert.equal(sampleUnitsInCart([ds, gd, eb]), 3);
  assert.deepEqual(
    [...sampleVariantIdsInCart([bag, ds, eb])],
    ["gid://shopify/ProductVariant/DS", "EB"],
  );
  // Two of the same blend is not.
  assert.equal(
    cartExceedsSampleLimit([line("gid://shopify/ProductVariant/DS", 2)]),
    true,
  );
  assert.equal(
    cartExceedsSampleLimit([ds, line("gid://shopify/ProductVariant/DS")]),
    true,
  );
  // More than three sample lines is not.
  assert.equal(
    cartExceedsSampleLimit([
      ds,
      gd,
      eb,
      line("gid://shopify/ProductVariant/X"),
    ]),
    true,
  );
});

test("each blend's grind matches the bag pages", () => {
  assert.deepEqual(SAMPLE_GRINDS, {
    datespresso: "ground for espresso machines",
    groundate: "ground for traditional coffee machines and pour-over",
    arabica: "ground fine for a Turkish-style cup in a cezve or dallah",
  });
});

test("cart sample lines link back to the full bag", () => {
  assert.equal(bagHandleForBlend("Eastern Brew"), "arabica");
  assert.equal(bagHandleForBlend("datespresso"), "datespresso");
  assert.equal(bagHandleForBlend("Mystery"), undefined);
});

test("GA4 tags sample cart lines with item_category sample", () => {
  const items = cartLinesToGaItems([
    {
      quantity: 1,
      merchandise: {
        id: "gid://shopify/ProductVariant/1",
        title: "DateSpresso",
        product: { title: "BAL Coffee Sample, 20g", handle: "sample" },
      },
      cost: { amountPerQuantity: { amount: "0.0" } },
    },
    {
      quantity: 1,
      merchandise: {
        id: "gid://shopify/ProductVariant/2",
        title: "12oz",
        product: { title: "GrounDate", handle: "groundate" },
      },
      cost: { amountPerQuantity: { amount: "26.99" } },
    },
  ]);
  assert.equal(items[0]?.item_category, "sample");
  assert.equal(items[0]?.price, 0);
  assert.equal(items[1]?.item_category, undefined);
});

test("sample copy never promises free shipping or uses banned claims", () => {
  assert.match(SAMPLE_TERMS, /USPS Ground Advantage/);
  assert.match(SAMPLE_TERMS, /20g, enough for one cup/);
  assert.match(SAMPLE_TERMS, /only difference is the grind size/);
  assert.match(SAMPLE_TERMS, /One of each blend per order/);
  assert.doesNotMatch(SAMPLE_TERMS, /free shipping|ships free|organic/i);
});
