import { PageShell } from "components/bal/page-shell";

export const metadata = {
  title: "Returns & Exchanges",
  description:
    "How to ask BAL Coffee about a return or a problem with an order.",
};

export default function ReturnsPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Returns & exchanges"
      intro="Write to us about an order and we will tell you what we can do."
    >
      <p>
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
      <p style={{ marginTop: 16 }}>
        If something arrives damaged or isn&apos;t what you ordered, contact us
        as soon as you can and include a photo if you have one.
      </p>
      <p style={{ marginTop: 16 }}>
        This page does not set a return window or a restocking fee. Those
        details need a final policy from the owner before we publish them.
      </p>
    </PageShell>
  );
}
