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
      intro="Write to us about an order and we will tell you what we can do."
    >
      <h2 className="serif" style={{ fontSize: 26, color: "var(--ink)" }}>
        How to start a return
      </h2>
      <p style={{ marginTop: 12 }}>
        Email{" "}
        <a
          href="mailto:judy@balcoffee.com"
          style={{ color: "var(--terra-deep)" }}
        >
          judy@balcoffee.com
        </a>{" "}
        with your order number, what you received, and whether you&apos;d like a
        return or a replacement. We&apos;ll reply with next steps. Please
        don&apos;t ship anything back until we confirm where it should go.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
      >
        Damaged or wrong item
      </h2>
      <p style={{ marginTop: 12 }}>
        If something arrives damaged or isn&apos;t what you ordered, contact us
        as soon as you can and include a photo if you have one.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
      >
        Refunds
      </h2>
      <p style={{ marginTop: 12 }}>
        This page does not set a return window or a restocking fee. Those
        details need a final policy from the owner before we publish them.
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
