/**
 * Visible copy for /caffeine-free-latte. The page, HowTo JSON-LD, and
 * FAQPage JSON-LD all read this module.
 *
 * The house milk ratio is not confirmed. Hot and iced steps say to adjust
 * the amount to taste. No ounce measure is published. DateSpresso has no
 * gram dose; a dual-wall filter or a stronger setting is recommended, and
 * it pairs well with oat milk. Eastern Brew is not pushed on this page.
 */

import type { MethodSection, RichText } from "./rich-text";

export const path = "/caffeine-free-latte";

export const crumbs = [
  { name: "Home", path: "/" },
  { name: "Date seed coffee", path: "/date-seed-coffee" },
  { name: "Caffeine-free latte", path },
] as const;

export const intro =
  "A caffeine-free latte is espresso-style shots and steamed or cold milk, made with something other than coffee beans. With BAL's DateSpresso, use it in any espresso machine (we recommend a dual-wall filter or a stronger setting than you would for fresh ground espresso) and add milk. DateSpresso pairs well with oat milk. It's naturally caffeine-free, so it isn't a decaf latte, which still starts with coffee beans. It works hot or iced.";

export const heroActions = [
  {
    href: "/products/datespresso",
    label: "Shop DateSpresso for a caffeine-free latte",
    variant: "solid",
  },
] as const;

export const needs = [
  {
    lead: "DateSpresso",
    rest: ", BAL's date seed coffee ground for espresso machines. It's 100% roasted date seeds, with no coffee beans and no caffeine.",
  },
  {
    lead: "An espresso machine.",
    rest: "A dual-wall (pressurized) filter basket gives the best results. No machine? See the option below.",
  },
  {
    lead: "Milk.",
    rest: "DateSpresso pairs well with oat milk. Whole milk also works well.",
  },
  {
    lead: "Optional flavor:",
    rest: "vanilla, caramel, cinnamon, cardamom, honey or date syrup.",
  },
] as const;

export const methodSections: readonly MethodSection[] = [
  {
    id: "hot",
    title: "Hot caffeine-free latte",
    steps: [
      {
        lead: "Pull the shots",
        rest: "Use DateSpresso in any espresso machine. We recommend a dual-wall filter or a stronger setting than you would for fresh ground espresso.",
      },
      {
        lead: "Steam or froth the milk",
        rest: "Heat your milk and froth it, and adjust the amount to taste.",
      },
      {
        lead: "Combine",
        rest: "Pour the milk over the shots, holding back the foam, then spoon the foam on top.",
      },
      {
        lead: "Flavor it (optional)",
        rest: "Stir vanilla, caramel or a little honey into the shots before adding the milk, or dust the top with cinnamon.",
      },
    ],
  },
  {
    id: "iced",
    title: "Caffeine-free iced latte",
    steps: [
      {
        lead: "Pull the shots",
        rest: "of DateSpresso as above.",
      },
      {
        lead: "Fill a glass with ice",
        rest: "and pour in cold milk. Adjust the amount to taste.",
      },
      {
        lead: "Pour the shots over the top",
        rest: "and stir. For sweetness, stir a little date syrup or honey into the shots while they're warm.",
      },
    ],
  },
  {
    id: "no-machine",
    title: "No espresso machine? Make a latte-style cup with GrounDate",
    steps: [
      {
        text: "Brew GrounDate a little stronger than usual in a French press, drip machine or pour-over by adding more grounds, then top it with warm frothed milk, or pour it over ice with cold milk. It's not a true espresso latte, but it's smooth, mellow and caffeine-free.",
      },
    ],
    note: [
      "Brewing steps are in ",
      {
        href: "/how-to-make-date-seed-coffee",
        label: "how to make date seed coffee",
      },
      ".",
    ],
    cta: {
      href: "/products/groundate",
      label: "Shop GrounDate for a drip latte",
    },
  },
];

export const flavors = [
  {
    lead: "Vanilla latte:",
    rest: "vanilla with whole or oat milk.",
  },
  {
    lead: "Caramel latte:",
    rest: "caramel stirred into the warm shots.",
  },
  {
    lead: "Cardamom-cinnamon latte:",
    rest: "a pinch of each, a nod to the Middle Eastern cups date seeds have been brewed into for generations.",
  },
  {
    lead: "Honey or date syrup latte:",
    rest: "a spoonful in the shots, hot or iced.",
  },
] as const;

export const decafCompare: RichText[] = [
  [
    "A decaf latte is made with decaf espresso. That's coffee beans with most of the caffeine removed, so it isn't fully caffeine-free. A DateSpresso latte has no coffee beans at all. Date seeds don't contain caffeine, so the latte is naturally caffeine-free. More on that in ",
    {
      href: "/date-seed-coffee-vs-coffee",
      label: "date seed coffee vs regular coffee",
    },
    ".",
  ],
];

export const taste: RichText[] = [
  [
    "DateSpresso is rich, bold and indulgent, with espresso-style depth and a naturally roasted flavor. Milk softens it into a smooth, toasty latte. It's coffee-inspired rather than an exact copy of a coffee latte, and it isn't sweet on its own, so add vanilla, caramel or honey if you like a sweeter cup. The bag is ",
    {
      href: "/products/datespresso",
      label: "DateSpresso, caffeine-free date espresso",
    },
    ". ",
    {
      href: "/date-seed-coffee#taste",
      label: "What does date seed coffee taste like?",
    },
  ],
];

export const about: RichText[] = [
  [
    "BAL is based in Houston and roasts 100% date seeds in small batches. It's acid-free, naturally caffeine-free and sold in 12 oz bags, shipped to addresses across the US. ",
    {
      href: "/shipping",
      label: "12 oz bags have flat shipping in the US",
    },
    ".",
  ],
  [
    "Looking for a ",
    { href: "/", label: "caffeine-free coffee alternative" },
    " for every day? That's what BAL makes.",
  ],
];

export const aboutActions = [
  {
    href: "/products/datespresso",
    label: "Shop DateSpresso for date espresso",
  },
  { href: "/products", label: "See all three bags" },
] as const;

export const faqs = [
  {
    id: "faq-decaf-latte",
    question: "Is a decaf latte caffeine-free?",
    answer:
      "Not completely. Decaf espresso is made from coffee beans with most of the caffeine removed. A latte made with DateSpresso uses no coffee beans and is naturally caffeine-free.",
  },
  {
    id: "faq-date-seed-latte",
    question: "Can you make a latte with date seed coffee?",
    answer:
      "Yes. Use DateSpresso in any espresso machine (we recommend a dual-wall filter or a stronger setting than you would for fresh ground espresso) and add steamed or cold milk. DateSpresso pairs well with oat milk.",
  },
  {
    id: "faq-iced",
    question: "Can I make a caffeine-free iced latte?",
    answer:
      "Yes. Pour cold milk over ice, then add DateSpresso shots and stir.",
  },
  {
    id: "faq-milk",
    question: "What milk works best?",
    answer: "DateSpresso pairs well with oat milk. Whole milk also works well.",
  },
  {
    id: "faq-machine",
    question: "Do I need an espresso machine?",
    answer:
      "For a true latte, yes. Without one, brew GrounDate a little stronger in a French press or drip machine and top it with warm frothed milk.",
  },
] as const;

export const closeTitle = "Shop DateSpresso";
export const closeLabel = "Shop DateSpresso for a caffeine-free latte";
export const closeHref = "/products/datespresso";
export const closeSecondary = {
  href: "/products",
  label: "See all three bags",
} as const;
export const closeBody: RichText = [
  "It's acid-free, naturally caffeine-free and sold in 12 oz bags, shipped to addresses across the US.",
];
