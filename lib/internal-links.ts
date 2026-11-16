const PRODUCT_LINKS = [
  ["DateSpresso", "/products/datespresso"],
  ["GrounDate", "/products/groundate"],
  ["Eastern Brew", "/products/eastern-brew"],
] as const;

const PRODUCT_PATTERN = /(DateSpresso|GrounDate|Eastern Brew)/g;

export function productNameSegments(text: string) {
  const parts = text.split(PRODUCT_PATTERN);
  return parts.filter(Boolean).map((part) => {
    const href = PRODUCT_LINKS.find(([name]) => name === part)?.[1];
    return href ? { text: part, href } : { text: part };
  });
}
