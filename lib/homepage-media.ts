/** Local, bag-forward crops of real BAL product photos for the homepage. */

export const heroPhoto = {
  src: "/homepage/hero-bags.jpg",
  alt: "12 oz bags of DateSpresso, GrounDate, and Eastern Brew, roasted from date seeds, with dates in front",
  width: 2400,
  height: 1600,
} as const;

export const bagCardPhotos: Record<
  string,
  { src: string; alt: string; width: number; height: number }
> = {
  datespresso: {
    src: "/homepage/card-datespresso.jpg",
    alt: "DateSpresso bag of roasted date seed coffee, ground for espresso",
    width: 1200,
    height: 1500,
  },
  groundate: {
    src: "/homepage/card-groundate.jpg",
    alt: "GrounDate bag of roasted date seed coffee, ground for drip and French press",
    width: 1200,
    height: 1500,
  },
  "eastern-brew": {
    src: "/homepage/card-eastern-brew.jpg",
    alt: "Eastern Brew bag of roasted date seed coffee, ground fine for a Turkish-style cup",
    width: 1200,
    height: 1500,
  },
};

export const samplePhoto = {
  src: "/homepage/sample-pour.jpg",
  alt: "GrounDate date seed coffee poured over ice, with the bag and dates beside the cup",
  width: 2000,
  height: 1333,
} as const;

export const processPhoto = {
  src: "/homepage/process-seeds.jpg",
  alt: "Whole dates, raw and roasted date seeds, and a tablespoon of ground date seed coffee",
  width: 2000,
  height: 1500,
} as const;

/** Short taste + brew lines. Allowed claims only; no health language. */
export const bagTasteLines: Record<string, string> = {
  datespresso: "The boldest of the three. For espresso.",
  groundate: "Smooth and mellow. For drip and French press.",
  "eastern-brew": "Warm and finely ground. For a Turkish-style cup.",
};

export const HOMEPAGE_FACTS = [
  "100% date seeds",
  "naturally caffeine-free",
  "acid-free",
  "small-batch roasted in Houston",
  "no additives or preservatives",
] as const;
