import assert from "node:assert/strict";
import test from "node:test";
import { cartLinesToGaItems } from "./ga.ts";
import {
  SAMPLE_TERMS,
  bagHandleForBlend,
  cartExceedsSampleLimit,
  cartHasSample,
  isSampleCartLine,
  isSampleShopifyProduct,
  pickSampleOffer,
  pickSampleOffers,
  sampleUnitsInCart,
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

test("one sample per order, mixed with bags allowed", () => {
  const bag = {
    quantity: 2,
    merchandise: { product: { handle: "groundate" } },
  };
  const one = { quantity: 1, merchandise: { product: { handle: "sample" } } };
  const bySku = { quantity: 1, merchandise: { sku: "BAL-SMP-EB" } };
  assert.equal(isSampleCartLine(bag), false);
  assert.equal(isSampleCartLine(bySku), true);
  assert.equal(cartHasSample([bag]), false);
  assert.equal(cartHasSample([bag, one]), true);
  assert.equal(cartExceedsSampleLimit([bag, one]), false);
  assert.equal(sampleUnitsInCart([one, bySku]), 2);
  assert.equal(cartExceedsSampleLimit([one, bySku]), true);
  assert.equal(cartExceedsSampleLimit([{ ...one, quantity: 3 }]), true);
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
  assert.doesNotMatch(SAMPLE_TERMS, /free shipping|ships free|organic/i);
});
