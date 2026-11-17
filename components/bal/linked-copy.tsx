import { productNameSegments } from "lib/internal-links";

export function LinkedCopy({
  text,
  color = "var(--terra-deep)",
}: {
  text: string;
  color?: string;
}) {
  return productNameSegments(text).map((part, index) =>
    part.href ? (
      <a key={`${part.text}-${index}`} href={part.href} style={{ color }}>
        {part.text}
      </a>
    ) : (
      part.text
    ),
  );
}
