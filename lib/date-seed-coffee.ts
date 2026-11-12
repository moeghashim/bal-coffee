/**
 * Visible copy for /date-seed-coffee. The page and FAQPage JSON-LD both read
 * this module so the markup cannot drift from the text.
 *
 * Allowed claims: 100% date seeds, naturally caffeine-free, acid-free, roasted
 * in small batches. Eastern Brew has no confirmed dose, so that row describes
 * the method only.
 */

export const coffeeSlugs = [
  "datespresso",
  "groundate",
  "eastern-brew",
] as const;

export type CoffeeSlug = (typeof coffeeSlugs)[number];

export const cardSummaries: Record<CoffeeSlug, string> = {
  datespresso:
    "Rich and bold, with espresso-style depth. Made for espresso machines, lattes and iced drinks.",
  groundate:
    "Smooth and balanced for everyday cups. Works in a drip machine, French press or pour-over.",
  "eastern-brew": "A fine grind for a cezve, warm and roasted.",
};

export const facts = [
  "100% date seeds",
  "Naturally caffeine-free",
  "Acid-free",
  "Roasted in small batches",
] as const;

export const intro =
  "Date seed coffee is a coffee-style drink made by roasting and grinding the seed inside a date, also called the date pit. There are no coffee beans in it, so it is naturally caffeine-free. BAL roasts 100% date seeds in small batches and grinds them three ways, for espresso, for drip and French press, and for a Turkish-style cezve.";

export const whatIs = [
  "Every date has one long, hard seed at its center. Most get thrown away. Roast that seed, grind it, and brew it like coffee, and you get a warm, dark cup with a roasted aroma. That cup is date seed coffee, also known as date pit coffee.",
  "It isn't new. Date seeds have been roasted and brewed for generations in the Middle East and North Africa, where nothing from the date palm went to waste. BAL brings that tradition to a modern kitchen, with no coffee beans, no blends and nothing added. The only ingredient in every bag is roasted date seeds.",
] as const;

export const tasteIntro = [
  "Date seed coffee tastes roasted, smooth and earthy. It is coffee-inspired rather than a copy of coffee: you still get a dark cup and a toasty aroma, but it drinks smoother than most coffee. It's made from the seed, not the fruit, so it isn't a sweet date drink. If you like it sweeter, add a little date syrup, honey or vanilla.",
  "Each BAL bag is roasted and ground for its own cup:",
] as const;

export const tasteBullets: { slug: CoffeeSlug; text: string }[] = [
  {
    slug: "datespresso",
    text: "rich, bold and indulgent, with espresso-style depth.",
  },
  {
    slug: "groundate",
    text: "smooth, balanced and mellow, an everyday cup.",
  },
  {
    slug: "eastern-brew",
    text: "warm and roasted, ground fine for a traditional Turkish-style cup.",
  },
];

export const tasteClose =
  "It goes well with oat milk, whole milk, cinnamon or cardamom, hot or iced.";

export const makeSteps = [
  {
    title: "Seed",
    body: "we start with date seeds, a natural byproduct of the date harvest.",
  },
  {
    title: "Roast",
    body: "the seeds are slow-roasted in small batches to bring out deep, toasty notes.",
  },
  {
    title: "Grind",
    body: "each roast is milled for one brew method, from a fine Turkish-style grind to a grind made for drip and French press.",
  },
  {
    title: "Bag",
    body: "sealed in 12 oz resealable bags and shipped from Houston to addresses across the US.",
  },
] as const;

export const ingredientsLine =
  "Ingredients: roasted date seeds. That's the whole list.";

export const caffeine = [
  "Date seeds don't contain caffeine, so there's nothing to remove. That's different from decaf. Decaf starts with coffee beans and has most of the caffeine taken out, while BAL never uses coffee beans at all. You can pour a cup in the morning, after dinner, or any time you want something warm without caffeine.",
  "BAL's date seed coffee is also acid-free and made with nothing but roasted date seeds.",
] as const;

export const chooseIntro =
  "Pick the bag that matches how you already make coffee. All three are 100% roasted date seeds, naturally caffeine-free, in a 12 oz bag.";

export const chooseNote =
  "Not sure? Start with GrounDate if you brew with a drip machine or French press. Choose DateSpresso if you have an espresso machine.";

export const brewIntro =
  "Brew it with the gear you already own. The steps for each bag are on its product page.";

export const brewRows: {
  method: string;
  slug: CoffeeSlug;
  brief: string;
}[] = [
  {
    method: "Espresso machine",
    slug: "datespresso",
    brief:
      "Use 18 to 20 grams for two shots. A dual-wall filter gives the best results. Adjust the amount for your machine and taste.",
  },
  {
    method: "Drip, French press, pour-over",
    slug: "groundate",
    brief:
      "Add 1 to 2 teaspoons per cup to your brewer and use hot water just off the boil. Adjust to taste.",
  },
  {
    method: "Cezve (Turkish-style)",
    slug: "eastern-brew",
    brief:
      "Add the fine grounds and water to your cezve, warm gently, then pour slowly so the grounds settle.",
  },
];

export const brewTip =
  "Tip: date seed coffee often brews a little lighter in color than coffee. Judge it by taste rather than color, and add more grounds if you like a stronger cup.";

export const faqs: { id: string; question: string; answer: string }[] = [
  {
    id: "faq-caffeine-free",
    question: "Is date seed coffee caffeine-free?",
    answer:
      "Yes. Date seeds don't contain caffeine, so date seed coffee is naturally caffeine-free. It isn't decaf: decaf is made from coffee beans with most of the caffeine removed, and BAL uses no coffee beans.",
  },
  {
    id: "faq-date-pit",
    question: "Is date seed coffee the same as date pit coffee?",
    answer:
      'Yes. "Date seed" and "date pit" mean the same thing, the hard seed inside a date. You\'ll see both names, and some people call it date stone coffee too.',
  },
  {
    id: "faq-taste",
    question: "What does date seed coffee taste like?",
    answer:
      "It's roasted, smooth and earthy, coffee-inspired without being a copy of coffee. DateSpresso is the boldest of BAL's three. GrounDate is smooth and mellow, and Eastern Brew is warm and suited to a Turkish-style cup.",
  },
  {
    id: "faq-acidic",
    question: "Is date seed coffee acidic?",
    answer:
      "BAL's date seed coffee is acid-free. The only ingredient is roasted date seeds.",
  },
  {
    id: "faq-make",
    question: "How do you make date seed coffee?",
    answer:
      "The simplest way is to brew a roasted, ground bag the same way you'd brew coffee. Use DateSpresso in an espresso machine, GrounDate in a drip machine, French press or pour-over, and Eastern Brew in a cezve. Making it from scratch means cleaning, drying, roasting and grinding the seeds yourself, which takes time to get right.",
  },
  {
    id: "faq-sweet",
    question: 'Is date seed coffee sweet? Is it the same as "date coffee"?',
    answer:
      "No. Date seed coffee is made from the seed, not the fruit, so it isn't sweet on its own. Recipes called \"date coffee\" usually mean regular coffee sweetened with dates or date syrup. You can add date syrup to date seed coffee if you'd like it sweeter.",
  },
  {
    id: "faq-where",
    question: "Where can I buy date seed coffee in the US?",
    answer:
      "BAL sells its three date seed coffees online and ships from Houston to addresses across the United States. Shipping is calculated at checkout. Shop date seed coffee.",
  },
];

export const shopLink = {
  href: "/products",
  label: "Shop date seed coffee",
} as const;

export const closeBody = "Three grinds, one ingredient, no caffeine.";
