import assert from "node:assert/strict";
import test from "node:test";
import { productImageAlt, type Product } from "./products.ts";

const datespresso = {
  name: "DateSpresso",
  slug: "datespresso",
  category: "coffee",
  type: "Espresso-style depth",
} satisfies Pick<Product, "name" | "slug" | "category" | "type">;

function shopifyFile(file: string, altText?: string) {
  return {
    url: `https://cdn.shopify.com/s/files/1/0865/4769/3867/files/${file}?v=1&width=1200`,
    altText,
  };
}

test("product photos use distinct descriptions instead of one repeated alt", () => {
  const files = [
    "image00006.jpg",
    "image00008.jpg",
    "image00015.jpg",
    "image00017.jpg",
  ];
  const alts = files.map((file) =>
    productImageAlt(datespresso, shopifyFile(file, "DateSpresso")),
  );
  assert.equal(new Set(alts).size, alts.length);
  assert.match(alts[0] ?? "", /espresso machine/i);
  assert.match(alts[1] ?? "", /DateSpresso bag/i);
  for (const alt of alts) {
    assert.doesNotMatch(alt, /caffeine-free date-seed coffee/i);
    assert.equal(alt.split(/date seed coffee/i).length < 3, true, alt);
  }
});

test("a specific Shopify alt is kept when the photo is not one we have described", () => {
  const alt = productImageAlt(datespresso, {
    url: "https://cdn.shopify.com/s/files/1/0865/4769/3867/files/new-angle.jpg",
    altText: "Open DateSpresso bag showing the espresso grind",
  });
  assert.equal(alt, "Open DateSpresso bag showing the espresso grind");
});

test("a missing photo falls back to a bag description for that grind", () => {
  assert.equal(
    productImageAlt(datespresso),
    "DateSpresso bag of roasted date seeds ground for an espresso machine",
  );
  assert.equal(
    productImageAlt({
      name: "Honey latte",
      slug: "honey-latte",
      category: "drink",
      type: "Café drink",
    }),
    "Honey latte café drink",
  );
});
