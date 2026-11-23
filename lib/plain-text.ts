/** Collapse markup and runs of whitespace. Schema and meta stay plain text. */
export function plainText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Shopify description HTML as separate lines. Block closers and <br> become
 * breaks before the other tags are stripped, so "Caffeine-free" and
 * "Coffee bean-free" stay apart.
 */
export function htmlToLines(html: string): string[] {
  const withBreaks = html
    .replace(/<br\b[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<\/div>/gi, "\n");

  const text = withBreaks.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ");

  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .map(spaceAfterColon)
    .filter((line) => line.length > 0);
}

/** "Size:12 oz" → "Size: 12 oz", while "1:4" stays a ratio. */
function spaceAfterColon(line: string) {
  return line.replace(
    /:([A-Za-z0-9])/g,
    (match, next: string, offset: number, source: string) => {
      const previous = offset > 0 ? source[offset - 1] : "";
      if (previous && /[0-9]/.test(previous)) return match;
      return `: ${next}`;
    },
  );
}
