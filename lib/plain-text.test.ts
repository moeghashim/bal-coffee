import assert from "node:assert/strict";
import test from "node:test";
import { htmlToLines } from "./plain-text.ts";
import { productJsonLd } from "./product-json-ld.ts";
import { products } from "./products.ts";

// Shopify's rich text for DateSpresso: labels in <strong>, breaks as <br>,
// and the "love it" items separated only by <br> (no <li>). Stripping tags
// without those breaks produces Caffeine-freeCoffee.
const datespressoHtml = [
  "<p>&nbsp;</p>",
  '<p data-start="243" data-end="460">DateSpresso is BAL Coffee’s caffeine-free espresso alternative made from 100% roasted date seeds. It is smooth, acid-free, and made for espresso-style drinks like lattes, iced drinks, and mocktails.</p>',
  "<p><strong>How to make:</strong><br>Your DateSpresso can be used in any espresso machine. We recommend using a dual-wall filter or a stronger setting than you would for fresh ground espresso. DateSpresso pairs well with oat milk. Enjoy!</p>",
  '<p data-start="838" data-end="880"><strong data-start="838" data-end="854">Ingredients:</strong><br data-start="854" data-end="857">100% roasted date seeds</p>',
  '<p data-start="882" data-end="899"><strong data-start="882" data-end="891">Size:</strong><br data-start="891" data-end="894">12 oz</p>',
  '<p><strong>Why You’ll Love It:</strong><br data-start="1005" data-end="1008">Caffeine-free<br data-start="1021" data-end="1024">Coffee bean-free<br>Acid-free<br>Made from roasted date seeds<br>Great for lattes and iced drinks<br>No additives or preservatives</p>',
  "<p>&nbsp;</p>",
].join("\n");

const groundateHtml = [
  "<p><strong>Cold brew:</strong><br>Use a 1:4 ratio (1 part GrounDate grounds to 4 parts water) and steep 12-24 hours.</p>",
  '<p><strong>Storage:</strong><br>Store in a cool, dry place.<br><br><meta charset="UTF-8"><strong>Why You’ll Love It:</strong><br><span>Caffeine-free</span><br><span>Coffee bean-free</span><br><span>Great hot, iced, or as cold brew</span></p>',
].join("");

test("shopify description html no longer runs list items together", () => {
  const stripped = datespressoHtml.replace(/<[^>]+>/g, "");
  assert.match(stripped, /Caffeine-freeCoffee/);

  const lines = htmlToLines(datespressoHtml);
  assert.equal(
    lines.some((line) => line.includes("Caffeine-freeCoffee")),
    false,
  );
  assert.deepEqual(lines.slice(-7), [
    "Why You’ll Love It:",
    "Caffeine-free",
    "Coffee bean-free",
    "Acid-free",
    "Made from roasted date seeds",
    "Great for lattes and iced drinks",
    "No additives or preservatives",
  ]);
  assert.equal(lines[0]?.startsWith("DateSpresso is BAL Coffee"), true);
  assert.equal(lines.includes("How to make:"), true);
  assert.equal(
    lines.includes(
      "Your DateSpresso can be used in any espresso machine. We recommend using a dual-wall filter or a stronger setting than you would for fresh ground espresso. DateSpresso pairs well with oat milk. Enjoy!",
    ),
    true,
  );
  assert.equal(lines.includes("Ingredients:"), true);
  assert.equal(lines.includes("100% roasted date seeds"), true);
  assert.equal(lines.includes("Size:"), true);
  assert.equal(lines.includes("12 oz"), true);
  assert.equal(lines.includes(""), false);

  const groundLines = htmlToLines(groundateHtml);
  assert.equal(
    groundLines.some((line) => line.includes("Caffeine-freeCoffee")),
    false,
  );
  assert.equal(
    groundLines.includes(
      "Use a 1:4 ratio (1 part GrounDate grounds to 4 parts water) and steep 12-24 hours.",
    ),
    true,
  );
  assert.deepEqual(groundLines.slice(-4), [
    "Why You’ll Love It:",
    "Caffeine-free",
    "Coffee bean-free",
    "Great hot, iced, or as cold brew",
  ]);

  assert.deepEqual(htmlToLines("<p>Size:12 oz</p>"), ["Size: 12 oz"]);
  assert.deepEqual(htmlToLines("<p>Ingredients:100% roasted date seeds</p>"), [
    "Ingredients: 100% roasted date seeds",
  ]);
  assert.deepEqual(htmlToLines("<p>Use a 1:4 ratio.</p>"), [
    "Use a 1:4 ratio.",
  ]);
  assert.deepEqual(htmlToLines("<p>Hello&nbsp;&nbsp;there</p><p></p>"), [
    "Hello there",
  ]);
  const listLines = htmlToLines(
    "<div><h2>Notes</h2><ul><li>Caffeine-free</li><li>Coffee bean-free</li></ul></div>",
  );
  assert.deepEqual(listLines, ["Notes", "Caffeine-free", "Coffee bean-free"]);
  assert.equal(listLines.join("\n").includes("Caffeine-freeCoffee"), false);

  const datespresso = products.find((item) => item.slug === "datespresso");
  assert.ok(datespresso);
  const data = productJsonLd(
    {
      ...datespresso,
      description: stripped.replace(/\s+/g, " ").trim(),
      descriptionLines: lines,
    },
    "https://www.balcoffee.com/products/datespresso",
    "SEO description that must not replace the visible description.",
  );
  const schemaDescription = String(data.description);
  assert.equal(schemaDescription.includes("Caffeine-freeCoffee"), false);
  assert.equal(schemaDescription.includes("SEO description"), false);
  assert.equal(
    schemaDescription.startsWith(
      "DateSpresso is roasted date seed coffee ground for espresso machines.",
    ),
    true,
  );
  assert.match(
    schemaDescription,
    /Caffeine-free\. Coffee bean-free\. Acid-free/,
  );
  assert.match(schemaDescription, /How to make: Your DateSpresso/);
  assert.match(
    schemaDescription,
    /Enjoy! Ingredients: 100% roasted date seeds/,
  );
  assert.equal(schemaDescription.includes(":."), false);
});

test("product capsules are the approved answer text", () => {
  const bySlug = new Map(
    products.map((product) => [product.slug, product.capsule]),
  );
  assert.equal(
    bySlug.get("datespresso"),
    "DateSpresso is roasted date seed coffee ground for espresso machines. It is 100% date seeds, naturally caffeine-free and roasted in small batches, with no coffee beans and no additives or preservatives. Use it in any espresso machine, ideally with a dual-wall filter, for lattes and iced drinks.",
  );
  assert.equal(
    bySlug.get("groundate"),
    "GrounDate is roasted date seed coffee ground for traditional coffee machines and pour-over, and it works as cold brew too. It is 100% date seeds, naturally caffeine-free and acid-free, with no coffee beans and no additives or preservatives. For cold brew, use 1 part grounds to 4 parts water by volume and steep 12–24 hours.",
  );
  assert.equal(
    bySlug.get("eastern-brew"),
    "Eastern Brew is roasted date seed coffee ground fine for a Turkish-style cup in a cezve or dallah. It is 100% date seeds, naturally caffeine-free and acid-free, with no coffee beans and no additives or preservatives. Use one heaping teaspoon per 2 oz cup of water and boil for 1–2 minutes.",
  );
});
