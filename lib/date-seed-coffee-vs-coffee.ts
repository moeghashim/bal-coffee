/**
 * Visible copy for /date-seed-coffee-vs-coffee. The page, Article JSON-LD,
 * and FAQPage JSON-LD all read this module.
 *
 * Allowed product claims, in this wording only: acid-free, naturally
 * caffeine-free, and roasted in small batches (BAL as a whole).
 */

import type { RichText } from "./rich-text";

export const path = "/date-seed-coffee-vs-coffee";

export const crumbs = [
  { name: "Home", path: "/" },
  { name: "Date seed coffee", path: "/date-seed-coffee" },
  { name: "vs coffee", path },
] as const;

export const intro =
  "Date seed coffee is made from roasted date seeds. Regular coffee is made from roasted coffee beans. That one difference drives the rest. Date seed coffee is naturally caffeine-free, while regular coffee has caffeine and decaf still starts with coffee beans. Date seed coffee tastes roasted, smooth and earthy rather than like a copy of coffee. You brew it with the gear you already use for coffee. BAL's date seed coffee is acid-free and roasted in small batches in three grinds: espresso, drip and French press, and Turkish-style.";

export const heroActions = [
  { href: "/products", label: "Shop date seed coffee", variant: "solid" },
  {
    href: "/date-seed-coffee",
    label: "What is date seed coffee?",
    variant: "outline",
  },
] as const;

export const compareHeaders = [
  "",
  "Date seed coffee (BAL)",
  "Regular coffee",
] as const;

export const compareRows = [
  [
    "Made from",
    "Roasted date seeds (the pit inside a date)",
    "Roasted coffee beans",
  ],
  [
    "Caffeine",
    "None. Naturally caffeine-free",
    "Yes. The amount varies by bean, roast and brew",
  ],
  [
    "Decaf option needed?",
    "No. There's no caffeine to remove",
    "Decaf is coffee with most of the caffeine removed",
  ],
  [
    "Taste",
    "Roasted, smooth, earthy; coffee-inspired",
    "Wide range, from bright and fruity to dark and bitter",
  ],
  [
    "Acidity",
    "BAL's date seed coffee is acid-free",
    "Varies by bean and roast",
  ],
  [
    "Color in the cup",
    "Often a little lighter than coffee",
    "Light to very dark",
  ],
  [
    "Brewing",
    "Espresso machine, drip, French press, pour-over, cold brew or cezve, depending on the grind",
    "Every method",
  ],
  [
    "When to drink it",
    "Morning, after dinner, any time of day",
    "Many people avoid it late in the day because of the caffeine",
  ],
] as const;

export const madeFrom: RichText[] = [
  [
    "Coffee comes from the seed of the coffee plant, which is roasted and ground. Date seed coffee also comes from a seed, but a different one: the long, hard pit inside a date. Roast that seed, grind it and brew it the way you'd brew coffee, and you get a warm, dark cup with a roasted aroma.",
  ],
  [
    "BAL's bags have one ingredient, roasted date seeds. There are no coffee beans, no blends and nothing mixed in. ",
    {
      href: "/date-seed-coffee",
      label: "Read the full date seed coffee guide",
    },
    ".",
  ],
];

export const caffeine: RichText[] = [
  [
    "This is the biggest difference, and the one people mix up most. Regular coffee has caffeine. Decaf is still coffee: it starts with coffee beans and has most of the caffeine taken out. Date seed coffee never had caffeine to begin with, because date seeds don't contain it. That's why it's called naturally caffeine-free, not decaffeinated.",
  ],
  [
    "In practice, you can brew date seed coffee whenever you want a warm cup, whether that's the morning, mid-afternoon or after dinner. Since there's no caffeine, it won't give you a caffeine lift either. Most people drink it for the ritual and the roasted flavor, not as a pick-me-up.",
  ],
];

export const tasteIntro: RichText[] = [
  [
    "Date seed coffee tastes roasted, smooth and earthy. You still get a dark cup and a toasty aroma, but it's its own drink. It's made from the seed, not the fruit, so it isn't sweet on its own. Regular coffee covers a much wider range, from bright light roasts to heavy dark ones.",
  ],
  ["Each BAL bag leans a different way:"],
];

export const tasteBags = [
  {
    href: "/products/datespresso",
    name: "DateSpresso",
    text: "is rich, bold and indulgent, with espresso-style depth.",
  },
  {
    href: "/products/groundate",
    name: "GrounDate",
    text: "is smooth, balanced and mellow, an everyday cup.",
  },
  {
    href: "/products/eastern-brew",
    name: "Eastern Brew",
    text: "is warm and roasted, ground fine for a Turkish-style cup.",
  },
] as const;

export const tasteClose: RichText = [
  "It goes well with oat milk, whole milk, cinnamon, cardamom or vanilla. If you like it sweeter, add a little date syrup or honey.",
];

export const acidity: RichText[] = [
  [
    "BAL's date seed coffee is acid-free. The only ingredient is roasted date seeds. The acidity of regular coffee varies with the bean and the roast.",
  ],
];

export const brewIntro: RichText = [
  "You don't need new equipment. The thing to match is the grind. BAL grinds each bag for one method:",
];

export const grindMatches = [
  {
    method: "Espresso machine",
    href: "/products/datespresso",
    bag: "DateSpresso",
  },
  {
    method: "Drip machine, French press, pour-over or cold brew",
    href: "/products/groundate",
    bag: "GrounDate",
  },
  {
    method: "Cezve or dallah (Turkish coffee pot)",
    href: "/products/eastern-brew",
    bag: "Eastern Brew",
  },
] as const;

export const brewTip: RichText = [
  "One tip: date seed coffee often brews a little lighter in color than coffee. Judge it by taste, not color, and add more grounds if you want a stronger cup. Step-by-step instructions for each method are in our guide to ",
  {
    href: "/how-to-make-date-seed-coffee",
    label: "how to make date seed coffee",
  },
  ".",
];

export const which: RichText[] = [
  [
    "If you want caffeine, regular coffee is the drink for that. If you want the warm, dark-cup ritual without caffeine, at any hour, date seed coffee is built for that. And if you've been drinking decaf just to cut caffeine, date seed coffee skips the coffee beans altogether.",
  ],
];

export const whereToStart: RichText[] = [
  [
    "Pick the bag that matches how you already make coffee. If you brew with a drip machine or French press, start with GrounDate. If you have an espresso machine, choose DateSpresso. Every bag is 12 oz of 100% roasted date seeds, shipped from Houston to addresses across the US. ",
    {
      href: "/shipping",
      label: "Shipping is calculated at checkout",
    },
    ".",
  ],
];

export const homeLink: RichText = [
  "Looking for a ",
  { href: "/", label: "caffeine-free coffee alternative" },
  " for every day? That's what BAL makes.",
];

export const faqs = [
  {
    id: "faq-taste-like-coffee",
    question: "Does date seed coffee taste like coffee?",
    answer:
      "It's coffee-inspired rather than a copy. It tastes roasted, smooth and earthy, with a dark cup and toasty aroma. It isn't sweet, because it's made from the seed, not the fruit.",
  },
  {
    id: "faq-decaf",
    question: "Is date seed coffee decaf?",
    answer:
      "No. Decaf is made from coffee beans with most of the caffeine removed. Date seed coffee uses no coffee beans, and date seeds don't contain caffeine, so it's naturally caffeine-free.",
  },
  {
    id: "faq-decaf-vs-caffeine-free",
    question: "What's the difference between decaf and caffeine-free?",
    answer:
      "Decaf means caffeine was taken out of something that had it, like coffee beans. Caffeine-free means there was none to begin with. Date seed coffee is caffeine-free.",
  },
  {
    id: "faq-acidic",
    question: "Is date seed coffee acidic?",
    answer:
      "BAL's date seed coffee is acid-free. The only ingredient is roasted date seeds.",
  },
  {
    id: "faq-coffee-maker",
    question: "Can I use date seed coffee in my coffee maker?",
    answer:
      "Yes, as long as the grind matches the machine. Use GrounDate in a drip machine, French press, pour-over or as cold brew, DateSpresso in an espresso machine, and Eastern Brew in a cezve or dallah.",
  },
] as const;

export const closeTitle = "Shop all three";
export const closeLabel = "Shop all three";
export const closeHref = "/products";
export const closeBody: RichText = [
  "Every bag is 12 oz of 100% roasted date seeds, shipped from Houston to addresses across the US.",
];
