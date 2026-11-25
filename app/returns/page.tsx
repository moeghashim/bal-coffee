import { PageShell } from "components/bal/page-shell";
import { pageMetadata, pageSeo } from "lib/seo";

export const metadata = pageMetadata({
  title: pageSeo.returns.title,
  description: pageSeo.returns.description,
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Returns & exchanges"
      intro="All sales are final. We don't accept returns."
    >
      <h2 className="serif" style={{ fontSize: 26, color: "var(--ink)" }}>
        All sales are final
      </h2>
      <p style={{ marginTop: 12 }}>
        All sales are final. BAL does not accept returns.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
      >
        Damaged or wrong item
      </h2>
      <p style={{ marginTop: 12 }}>
        If something arrives damaged or isn&apos;t what you ordered, contact{" "}
        <a
          href="mailto:info@balcoffee.com"
          style={{ color: "var(--terra-deep)" }}
        >
          info@balcoffee.com
        </a>{" "}
        as soon as you can and include a photo if you have one.
      </p>
      <p style={{ marginTop: 16 }}>
        <a href="/shipping" style={{ color: "var(--terra-deep)" }}>
          Shipping
        </a>
        {" · "}
        <a href="/contact" style={{ color: "var(--terra-deep)" }}>
          Contact
        </a>
      </p>
    </PageShell>
  );
}
