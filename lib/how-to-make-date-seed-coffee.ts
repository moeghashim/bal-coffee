/**
 * Visible copy for /how-to-make-date-seed-coffee. The page, HowTo JSON-LD,
 * and FAQPage JSON-LD all read this module.
 *
 * Official brew copy from Moe (21 Nov 2026). Unconfirmed amounts stay out:
 * - GrounDate hot brew has no dose. Use it like regular ground coffee in a
 *   traditional coffee machine or pour-over. No unsourced water temperature
 *   or French press steep time.
 * - GrounDate cold brew: 1:4 (treated as 1 part grounds to 4 parts water by
 *   volume) and steep 12-24 hours.
 * - DateSpresso has no gram dose. A dual-wall filter or a stronger setting
 *   than for fresh ground espresso is recommended. It pairs well with oat milk.
 * - Eastern Brew: one small 2 oz cup of water and one heaping teaspoon per
 *   serving, boiled 1-2 minutes, in a cezve, dallah, or any small pot.
 * - No latte milk ratio.
 */

import type { MethodSection, RichText } from "./rich-text";

export const path = "/how-to-make-date-seed-coffee";

export const crumbs = [
  { name: "Home", path: "/" },
  { name: "Date seed coffee", path: "/date-seed-coffee" },
  { name: "How to make", path },
] as const;

export const intro =
  "To make date seed coffee, brew roasted, ground date seeds the same way you brew coffee, using the grind made for your method. Use an espresso grind (DateSpresso) in an espresso machine, a drip grind (GrounDate) in a traditional coffee machine, pour-over or as cold brew, and a fine grind (Eastern Brew) in a cezve or dallah. Date seed coffee brews a little lighter in color than coffee, so judge it by taste.";

export const heroActions = [
  { href: "/products", label: "Find your bag", variant: "solid" },
] as const;

export const grindIntro =
  "Grind matters more than anything else. Espresso machines need a grind that holds up under pressure, drip and French press need a medium grind, and a cezve or dallah needs a very fine one. BAL roasts 100% date seeds in small batches and mills each bag for one method, so you don't have to grind anything.";

export const brewerHeaders = ["Your brewer", "Bag", "Start with"] as const;

export const brewerRows = [
  {
    brewer: "Espresso machine",
    href: "/products/datespresso",
    bag: "DateSpresso for date espresso",
    start:
      "Any espresso machine; a dual-wall filter or a stronger setting than for fresh ground espresso",
  },
  {
    brewer: "Traditional coffee machine, French press, pour-over, or cold brew",
    href: "/products/groundate",
    bag: "GrounDate for drip and French press",
    start:
      "Use like regular ground coffee in a machine or pour-over. For cold brew, 1:4 grounds to water, steep 12-24 hours",
  },
  {
    brewer: "Cezve, dallah, or any small pot",
    href: "/products/eastern-brew",
    bag: "Eastern Brew for Turkish-style coffee",
    start:
      "One small 2 oz cup of water and one heaping teaspoon per serving; boil 1-2 minutes",
  },
] as const;

export const methodSections: readonly MethodSection[] = [
  {
    id: "espresso",
    title: "How to make date seed coffee in an espresso machine (DateSpresso)",
    steps: [
      {
        lead: "Use",
        rest: "Your DateSpresso can be used in any espresso machine.",
      },
      {
        lead: "Filter or setting",
        rest: "We recommend using a dual-wall (pressurized) filter basket or a stronger setting than you would for fresh ground espresso.",
      },
      {
        lead: "Enjoy",
        rest: "DateSpresso pairs well with oat milk. Enjoy!",
      },
    ],
    note: [
      "Drink it straight, or turn it into a latte or iced drink. See ",
      {
        href: "/caffeine-free-latte",
        label: "how to make a caffeine-free latte",
      },
      ".",
    ],
    cta: {
      href: "/products/datespresso",
      label: "Shop DateSpresso for date espresso",
    },
  },
  {
    id: "drip",
    title: "How to make date seed coffee in a drip machine (GrounDate)",
    steps: [
      {
        text: "Use your BAL Coffee grounds in any traditional coffee machine, the same way you'd use regular ground coffee. Enjoy!",
      },
    ],
    note: [
      "The bag for drip, French press, and pour-over is ",
      {
        href: "/products/groundate",
        label: "GrounDate for drip and French press",
      },
      ".",
    ],
  },
  {
    id: "french-press",
    title: "How to make date seed coffee in a French press (GrounDate)",
    steps: [
      {
        text: "Use GrounDate in a French press the same way you'd use regular ground coffee. Press and pour. Enjoy!",
      },
    ],
  },
  {
    id: "pour-over",
    title: "Pour-over or reusable filter (GrounDate)",
    steps: [
      {
        text: "Use your BAL Coffee grounds in a pour-over, the same way you'd use regular ground coffee. Enjoy!",
      },
    ],
  },
  {
    id: "cold-brew",
    title: "How to make GrounDate cold brew",
    steps: [
      {
        lead: "Ratio",
        rest: "Use a 1:4 ratio (1 part GrounDate grounds to 4 parts water).",
      },
      {
        lead: "Steep",
        rest: "Steep 12-24 hours, then strain and enjoy.",
      },
    ],
    cta: {
      href: "/products/groundate",
      label: "Shop GrounDate for drip and cold brew",
    },
  },
  {
    id: "cezve",
    title:
      "How to make Turkish-style date seed coffee in a cezve (Eastern Brew)",
    steps: [
      {
        lead: "Heat",
        rest: "Heat one small 2 oz cup of water per serving in a cezve or dallah (or any small pot).",
      },
      {
        lead: "Add",
        rest: "Just before it comes to a boil, add one heaping teaspoon of BAL Coffee Eastern Brew per serving and stir.",
      },
      {
        lead: "Boil and serve",
        rest: "Allow to boil for 1-2 minutes, then serve immediately. Enjoy!",
      },
    ],
    note: [
      "The bag is ground fine for exactly this cup. Cardamom, cinnamon or your favorite sweetener all go well with it.",
    ],
    cta: {
      href: "/products/eastern-brew",
      label: "Shop Eastern Brew for Turkish-style coffee",
      secondary: true,
    },
  },
];

export const withMilk: RichText[] = [
  [
    "Date seed coffee goes well with oat milk or whole milk. Brew a cup by any method above and add warm milk, or use DateSpresso shots for a proper latte. Our ",
    { href: "/caffeine-free-latte", label: "caffeine-free latte guide" },
    " covers hot and iced lattes step by step.",
  ],
];

export const strengthTips = [
  {
    lead: "Go by taste, not color",
    rest: "Date seed coffee often brews lighter than coffee, so a lighter cup isn't necessarily a weak one.",
  },
  {
    lead: "For more strength, add more grounds",
    rest: "rather than brewing longer. For GrounDate cold brew, stay within 12-24 hours.",
  },
  {
    lead: "To sweeten it,",
    rest: "add a little date syrup, honey or vanilla. It's made from the seed, not the fruit, so it isn't sweet on its own.",
  },
] as const;

export const storage: RichText[] = [
  [
    "Store it in a cool, dry place and seal the bag tightly after each use. Each BAL bag holds 12 oz and is resealable.",
  ],
];

export const fromScratch: RichText[] = [
  [
    "You can, but it takes some work. You'd need to collect date pits, clean and dry them, roast them evenly and grind them. Date seeds are very hard, so getting an even roast and the right grind for your brewer takes practice. If you'd rather skip straight to the cup, BAL's bags come roasted in small batches and already ground for your brew method.",
  ],
];

export const fromScratchCta = {
  href: "/products",
  label: "Shop date seed coffee",
} as const;

export const closing: RichText[] = [
  [
    "New to date seed coffee? Start with ",
    { href: "/date-seed-coffee", label: "what it is and how it tastes" },
    ", or see how it ",
    {
      href: "/date-seed-coffee-vs-coffee",
      label: "compares with regular coffee",
    },
    ".",
  ],
  [
    "Looking for a ",
    { href: "/", label: "caffeine-free coffee alternative" },
    " for every day? That's what BAL makes.",
  ],
];

export const faqs = [
  {
    id: "faq-how-much",
    question: "How much date seed coffee do I use per cup?",
    answer:
      "For DateSpresso, use it in any espresso machine; a dual-wall filter or a stronger setting than you would for fresh ground espresso is recommended. For GrounDate in a coffee machine or pour-over, use it like regular ground coffee. For GrounDate cold brew, use a 1:4 ratio (1 part grounds to 4 parts water) and steep 12-24 hours. For Eastern Brew, heat one small 2 oz cup of water per serving and add one heaping teaspoon, then boil 1-2 minutes.",
  },
  {
    id: "faq-espresso",
    question: "Can you put date seed coffee in an espresso machine?",
    answer:
      "Yes. Your DateSpresso can be used in any espresso machine. We recommend a dual-wall filter or a stronger setting than you would for fresh ground espresso.",
  },
  {
    id: "faq-french-press",
    question: "Can you make date seed coffee in a French press?",
    answer:
      "Yes. Use GrounDate in a French press the same way you'd use regular ground coffee.",
  },
  {
    id: "faq-cold-brew",
    question: "Can you make date seed coffee as cold brew?",
    answer:
      "Yes. With GrounDate, use a 1:4 ratio (1 part grounds to 4 parts water) and steep 12-24 hours.",
  },
  {
    id: "faq-lighter",
    question: "Why does my date seed coffee look lighter than coffee?",
    answer:
      "It often brews a little lighter in color. Judge it by taste, and add more grounds if you want it stronger.",
  },
  {
    id: "faq-homemade",
    question: "Is homemade date seed coffee the same as a bag from BAL?",
    answer:
      "Both are roasted, ground date seeds. Making it at home means cleaning, drying, roasting and grinding the seeds yourself. BAL's bags are roasted in small batches and ground for a specific brew method.",
  },
] as const;

export const closeTitle = "Shop date seed coffee";
export const closeLabel = "Shop date seed coffee";
export const closeHref = "/products";
export const closeBody: RichText = [
  {
    href: "/shipping",
    label: "12 oz bags have flat shipping in the US",
  },
  ".",
];
