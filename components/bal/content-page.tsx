import { ReactNode } from "react";
import {
  richPlain,
  stepVisibleText,
  type CopyStep,
  type MethodSection,
  type RichText,
} from "lib/rich-text";

export const linkStyle = { color: "var(--terra-deep)" };

const thStyle = {
  padding: "12px 16px",
  textAlign: "left" as const,
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  fontWeight: 500,
  color: "var(--ink-soft)",
  borderBottom: "1px solid rgba(77,56,36,0.14)",
};

export function Rich({ parts, color }: { parts: RichText; color?: string }) {
  return parts.map((part, index) =>
    typeof part === "string" ? (
      <span key={index}>{part}</span>
    ) : (
      <a
        key={index}
        href={part.href}
        style={{
          color: color ?? linkStyle.color,
          textDecoration: color ? "underline" : undefined,
        }}
      >
        {part.label}
      </a>
    ),
  );
}

export function Paragraphs({ blocks }: { blocks: readonly RichText[] }) {
  return blocks.map((block) => (
    <p key={richPlain(block)} style={{ marginTop: 16 }}>
      <Rich parts={block} />
    </p>
  ));
}

export function CtaLink({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "band" | "band-outline";
}) {
  const onBand = variant === "band" || variant === "band-outline";
  const outline = variant === "outline" || variant === "band-outline";
  return (
    <a
      href={href}
      className="mono"
      style={{
        padding: onBand ? "16px 28px" : outline ? "14px 22px" : "14px 24px",
        background:
          variant === "band"
            ? "var(--cream)"
            : outline
              ? "transparent"
              : "var(--ink)",
        color: onBand
          ? variant === "band-outline"
            ? "var(--cream)"
            : "var(--ink)"
          : outline
            ? "var(--ink)"
            : "var(--cream)",
        border: outline
          ? `1px solid ${onBand ? "var(--cream)" : "var(--ink)"}`
          : undefined,
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        borderRadius: 2,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontWeight: onBand ? 500 : undefined,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </a>
  );
}

export function ContentHero({
  crumbs,
  eyebrow,
  title,
  intro,
  actions,
}: {
  crumbs: readonly { name: string; path: string }[];
  eyebrow: string;
  title: string;
  intro: string;
  actions: readonly {
    href: string;
    label: string;
    variant?: "solid" | "outline";
  }[];
}) {
  return (
    <section
      className="bal-landing-pad"
      style={{
        padding: "36px 56px 64px",
        background:
          "radial-gradient(circle at 80% 12%, rgba(255,248,232,0.7), transparent 34%), linear-gradient(100deg, #f5ebdc 0%, #ead8bd 58%, #d2b78f 100%)",
        borderBottom: "1px solid rgba(77,56,36,0.14)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <nav
          aria-label="Breadcrumb"
          style={{ fontSize: 12, color: "var(--ink-soft)" }}
        >
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <span key={crumb.path}>
                {index > 0 ? (
                  <span aria-hidden="true" style={{ margin: "0 12px" }}>
                    /
                  </span>
                ) : null}
                {last ? (
                  <span>{crumb.name}</span>
                ) : (
                  <a href={crumb.path}>{crumb.name}</a>
                )}
              </span>
            );
          })}
        </nav>
        <p
          className="mono"
          style={{
            marginTop: 28,
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
          }}
        >
          {eyebrow}
        </p>
        <h1
          className="serif"
          style={{
            marginTop: 14,
            maxWidth: 760,
            fontSize: "clamp(36px, 4.6vw, 58px)",
            lineHeight: 1.05,
            fontWeight: 500,
            color: "var(--ink)",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            marginTop: 22,
            maxWidth: 680,
            fontSize: 18,
            lineHeight: 1.6,
            color: "var(--ink-2)",
          }}
        >
          {intro}
        </p>
        {actions.length > 0 ? (
          <div
            className="bal-landing-actions"
            style={{
              marginTop: 28,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            {actions.map((action) => (
              <CtaLink
                key={action.href + action.label}
                href={action.href}
                variant={action.variant ?? "solid"}
              >
                {action.label}
              </CtaLink>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Prose({
  id,
  title,
  children,
  wide = false,
  band = false,
  headingId,
}: {
  id?: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
  band?: boolean;
  headingId?: string;
}) {
  return (
    <section
      id={id}
      className="bal-landing-pad"
      style={{
        scrollMarginTop: 96,
        padding: band ? "56px 56px" : "36px 56px 8px",
        background: band ? "var(--cream-2)" : "transparent",
        borderTop: band ? "1px solid var(--line-soft)" : undefined,
        borderBottom: band ? "1px solid var(--line-soft)" : undefined,
      }}
    >
      <div style={{ maxWidth: wide ? 1180 : 760, margin: "0 auto" }}>
        <h2
          id={headingId}
          className="serif"
          style={{
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 500,
            lineHeight: 1.12,
            color: "var(--ink)",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            marginTop: 16,
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--ink-2)",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export function DataTable({
  labelledBy,
  headers,
  rows,
}: {
  labelledBy: string;
  headers: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}) {
  return (
    <div style={{ marginTop: 18, overflowX: "auto" }}>
      <table
        className="bal-brew-table"
        aria-labelledby={labelledBy}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "rgba(255,252,246,0.76)",
          border: "1px solid rgba(77,56,36,0.16)",
          borderRadius: 12,
        }}
      >
        <thead>
          <tr>
            {headers.map((heading, index) => (
              <th key={`${heading}-${index}`} scope="col" style={thStyle}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, index) => {
                const label = headers[index];
                return (
                  <td
                    key={`${rowIndex}-${index}`}
                    {...(label ? { "data-label": label } : {})}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepBody({ step }: { step: CopyStep }) {
  const text = stepVisibleText(step);
  if (!("lead" in step)) return text;
  const lead = step.lead.trim();
  return (
    <>
      <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{lead}</strong>
      {text.slice(lead.length)}
    </>
  );
}

export function StepList({ steps }: { steps: readonly CopyStep[] }) {
  const numbered = steps.some((step) => "lead" in step);
  if (!numbered) {
    return steps.map((step) => (
      <p key={stepVisibleText(step)} style={{ marginTop: 16 }}>
        <StepBody step={step} />
      </p>
    ));
  }
  return (
    <ol style={{ marginTop: 4, paddingLeft: "1.2em" }}>
      {steps.map((step) => (
        <li key={stepVisibleText(step)} style={{ marginTop: 8 }}>
          <StepBody step={step} />
        </li>
      ))}
    </ol>
  );
}

export function MethodSections({
  sections,
  easternAvailable = true,
}: {
  sections: readonly MethodSection[];
  easternAvailable?: boolean;
}) {
  return sections.map((section) => (
    <Prose key={section.id} id={section.id} title={section.title}>
      <StepList steps={section.steps} />
      {section.note ? (
        <p style={{ marginTop: 16 }}>
          <Rich parts={section.note} />
        </p>
      ) : null}
      {section.cta ? (
        <div style={{ marginTop: 18 }}>
          {section.cta.href === "/products/eastern-brew" &&
          !easternAvailable ? (
            <p>
              Eastern Brew is sold out right now.{" "}
              <a href={section.cta.href} style={linkStyle}>
                See Eastern Brew
              </a>
              .
            </p>
          ) : (
            <CtaLink
              href={section.cta.href}
              variant={section.cta.secondary ? "outline" : "solid"}
            >
              {section.cta.label}
            </CtaLink>
          )}
        </div>
      ) : null}
    </Prose>
  ));
}

export function BulletSteps({ steps }: { steps: readonly CopyStep[] }) {
  return (
    <ul style={{ marginTop: 12, paddingLeft: "1.2em" }}>
      {steps.map((step) => (
        <li key={stepVisibleText(step)} style={{ marginTop: 8 }}>
          <StepBody step={step} />
        </li>
      ))}
    </ul>
  );
}

export function ContentFaq({
  faqs,
  title = "FAQ",
}: {
  faqs: readonly { id: string; question: string; answer: string }[];
  title?: string;
}) {
  return (
    <Prose title={title}>
      <div style={{ display: "grid", gap: 28, marginTop: 8 }}>
        {faqs.map((item) => (
          <section key={item.id} id={item.id}>
            <h3
              className="serif"
              style={{
                fontSize: 22,
                fontWeight: 500,
                lineHeight: 1.25,
                color: "var(--ink)",
              }}
            >
              {item.question}
            </h3>
            <p style={{ marginTop: 8 }}>{item.answer}</p>
          </section>
        ))}
      </div>
    </Prose>
  );
}

export function ContentClose({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: RichText;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section
      className="bal-landing-pad bal-subscription"
      style={{
        marginTop: 56,
        background: "var(--terra)",
        color: "var(--cream)",
        padding: "44px 56px",
      }}
    >
      <div
        className="bal-subscription-grid"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr auto",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "var(--cream)",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              marginTop: 10,
              fontSize: 16,
              lineHeight: 1.55,
              color: "rgba(244,239,230,0.92)",
            }}
          >
            <Rich parts={body} color="var(--cream)" />
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          <CtaLink href={primary.href} variant="band">
            {primary.label}
          </CtaLink>
          {secondary ? (
            <CtaLink href={secondary.href} variant="band-outline">
              {secondary.label}
            </CtaLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
