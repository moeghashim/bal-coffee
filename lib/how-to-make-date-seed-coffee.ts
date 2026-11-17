/**
 * Visible copy for /how-to-make-date-seed-coffee. The page, HowTo JSON-LD,
 * and FAQPage JSON-LD all read this module.
 *
 * Unconfirmed amounts are not given a number:
 * - GrounDate per cup: follow the directions on the bag, then adjust to taste.
 * - Eastern Brew dose: adjust to taste. No gram or milliliter amount.
 * - French press steep time: left out. The step says steep, press and pour.
 */

import type { MethodSection, RichText } from "./rich-text";

export const path = "/how-to-make-date-seed-coffee";

export const crumbs = [
  { name: "Home", path: "/" },
  { name: "Date seed coffee", path: "/date-seed-coffee" },
  { name: "How to make", path },
] as const;

export const intro =
  "To make date seed coffee, brew roasted, ground date seeds the same way you brew coffee, using the grind made for your method. Use an espresso grind (DateSpresso) in an espresso machine, a drip grind (GrounDate) in a drip machine, French press or pour-over, and a fine grind (Eastern Brew) in a cezve. Start with the amounts below, then adjust to taste. Date seed coffee brews a little lighter in color than coffee, so judge it by taste.";

export const heroActions = [
  { href: "/products", label: "Find your bag", variant: "solid" },
] as const;

export const grindIntro =
  "Grind matters more than anything else. Espresso machines need a grind that holds up under pressure, drip and French press need a medium grind, and a cezve needs a very fine one. BAL roasts 100% date seeds in small batches and mills each bag for one method, so you don't have to grind anything.";

export const brewerHeaders = ["Your brewer", "Bag", "Start with"] as const;

export const brewerRows = [
  {
    brewer: "Espresso machine",
    href: "/products/datespresso",
    bag: "DateSpresso",
    start: "18 to 20 grams for two shots, dual-wall filter",
  },
  {
    brewer: "Drip machine, French press, pour-over, reusable filter",
    href: "/products/groundate",
    bag: "GrounDate",
    start: "Follow the directions on the bag, and use water just off the boil",
  },
  {
    brewer: "Cezve (Turkish coffee pot) or small saucepan",
    href: "/products/eastern-brew",
    bag: "Eastern Brew",
    start:
      "Add the grounds to water and adjust to taste. Heat gently, stir, pour slowly",
  },
] as const;

export const methodSections: readonly MethodSection[] = [
  {
    id: "espresso",
    title: "How to make date seed coffee in an espresso machine (DateSpresso)",
    steps: [
      {
        lead: "Dose",
        rest: "Use 18 to 20 grams of DateSpresso for two shots.",
      },
      {
        lead: "Filter",
        rest: "For best results, use a dual-wall (pressurized) filter basket.",
      },
      {
        lead: "Pull and adjust",
        rest: "Pull your shots as usual, then adjust the amount for your machine and taste.",
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
    cta: { href: "/products/datespresso", label: "Shop DateSpresso" },
  },
  {
    id: "drip",
    title: "How to make date seed coffee in a drip machine (GrounDate)",
    steps: [
      {
        lead: "Scoop",
        rest: "Add GrounDate to the filter, and follow the directions on the bag.",
      },
      {
        lead: "Brew",
        rest: "Run the machine as you would for coffee.",
      },
      {
        lead: "Taste and adjust",
        rest: "If the cup is too light for you, use more grounds next time.",
      },
    ],
  },
  {
    id: "french-press",
    title: "How to make date seed coffee in a French press (GrounDate)",
    steps: [
      {
        lead: "Scoop",
        rest: "Add GrounDate to the press, and follow the directions on the bag.",
      },
      {
        lead: "Pour",
        rest: "Use hot water just off the boil.",
      },
      {
        lead: "Press and sip",
        rest: "Steep, press and pour. Enjoy smooth, roasted depth.",
      },
    ],
  },
  {
    id: "pour-over",
    title: "Pour-over or reusable filter (GrounDate)",
    steps: [
      {
        text: "Follow the directions on the bag in your cone or reusable coffee filter, and pour hot water just off the boil slowly over the grounds. Adjust the amount to taste.",
      },
    ],
    cta: { href: "/products/groundate", label: "Shop GrounDate" },
  },
  {
    id: "cezve",
    title:
      "How to make Turkish-style date seed coffee in a cezve (Eastern Brew)",
    steps: [
      {
        lead: "Scoop",
        rest: "Add Eastern Brew's fine grounds and water to a cezve (Turkish coffee pot) or a small saucepan.",
      },
      {
        lead: "Heat",
        rest: "Warm it gently and stir well.",
      },
      {
        lead: "Serve",
        rest: "Pour slowly so the grounds settle in the pot, and enjoy.",
      },
    ],
    note: [
      "Use as much as you like for the strength you want. The bag is ground fine for exactly this cup. Cardamom, cinnamon or your favorite sweetener all go well with it.",
    ],
    cta: {
      href: "/products/eastern-brew",
      label: "Shop Eastern Brew",
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
    rest: "rather than brewing longer.",
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
      "For espresso, use 18 to 20 grams of DateSpresso for two shots. For drip, French press or pour-over, follow the directions on the bag for GrounDate. For a cezve, add Eastern Brew to taste. Then adjust.",
  },
  {
    id: "faq-espresso",
    question: "Can you put date seed coffee in an espresso machine?",
    answer:
      "Yes. Use an espresso grind like DateSpresso, 18 to 20 grams for two shots, and a dual-wall filter gives the best results.",
  },
  {
    id: "faq-french-press",
    question: "Can you make date seed coffee in a French press?",
    answer:
      "Yes. Use a drip and French press grind like GrounDate, add hot water just off the boil, then press and pour.",
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
    label: "Shipping is calculated at checkout",
  },
  ".",
];
