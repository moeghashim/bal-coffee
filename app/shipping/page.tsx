import { PageShell } from "components/bal/page-shell";
import { pageMetadata, pageSeo } from "lib/seo";

export const metadata = pageMetadata({
  title: pageSeo.shipping.title,
  description: pageSeo.shipping.description,
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Shipping & delivery"
      intro="Shipping costs are calculated at checkout."
    >
      <h2 className="serif" style={{ fontSize: 26, color: "var(--ink)" }}>
        Shipping rates
      </h2>
      <p style={{ marginTop: 12 }}>
        This page does not list a flat rate. Checkout is on
        checkout.balcoffee.com, and that is where the shipping cost for your
        address is shown before you pay.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
      >
        Where we ship
      </h2>
      <p style={{ marginTop: 12 }}>
        BAL is an online-only company based in Houston, Texas. We ship date seed
        coffee to addresses across the United States. We don&apos;t publish a
        delivery-time promise here. Checkout confirms the methods available for
        your address.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
      >
        Tracking your order
      </h2>
      <p style={{ marginTop: 12 }}>
        When an order ships, tracking is sent by email. If you can&apos;t find
        it, email{" "}
        <a
          href="mailto:judy@balcoffee.com"
          style={{ color: "var(--terra-deep)" }}
        >
          judy@balcoffee.com
        </a>{" "}
        with your order number.
      </p>
      <p style={{ marginTop: 16 }}>
        <a href="/products" style={{ color: "var(--terra-deep)" }}>
          Shop the coffees
        </a>
        {" · "}
        <a href="/returns" style={{ color: "var(--terra-deep)" }}>
          Returns
        </a>
        {" · "}
        <a href="/faq" style={{ color: "var(--terra-deep)" }}>
          FAQ
        </a>
      </p>
    </PageShell>
  );
}
