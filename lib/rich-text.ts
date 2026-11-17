/**
 * Inline copy shared by the content pages and their JSON-LD.
 * A step's visible sentence is stepVisibleText(step). Schema must use that
 * same string so the markup cannot drift from the page.
 */

export type RichPart =
  | string
  | { readonly href: string; readonly label: string };

export type RichText = readonly RichPart[];

export type CopyStep =
  | { readonly lead: string; readonly rest: string }
  | { readonly text: string };

export type MethodCta = {
  readonly href: string;
  readonly label: string;
  readonly secondary?: boolean;
};

export type MethodSection = {
  readonly id: string;
  readonly title: string;
  readonly steps: readonly CopyStep[];
  readonly note?: RichText;
  readonly cta?: MethodCta;
};

export function richPlain(parts: RichText) {
  return parts
    .map((part) => (typeof part === "string" ? part : part.label))
    .join("");
}

export function stepLead(step: CopyStep) {
  if (!("lead" in step)) return "";
  return step.lead.trim().replace(/[.,:;]+$/, "");
}

/** The exact sentence rendered for a step. */
export function stepVisibleText(step: CopyStep) {
  if (!("lead" in step)) return step.text.trim();
  const lead = step.lead.trim();
  const rest = step.rest.trim();
  if (!rest) return /[.!?]$/.test(lead) ? lead : `${lead}.`;
  if (/^[,:;]/.test(rest)) return `${lead}${rest}`;
  if (/^[a-z]/.test(rest)) return `${lead} ${rest}`;
  if (/[.!?:;,]$/.test(lead)) return `${lead} ${rest}`;
  return `${lead}. ${rest}`;
}

export function methodSchema(sections: readonly MethodSection[]) {
  return sections.map((section) => ({
    name: section.title,
    steps: section.steps.map((step) => ({
      name: stepLead(step) || section.title,
      text: stepVisibleText(step),
    })),
  }));
}
