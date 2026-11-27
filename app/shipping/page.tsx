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
      intro="US shipping: $9.99 for one bag, $12.99 for 2 or more."
    >
      <h2 className="serif" style={{ fontSize: 26, color: "var(--ink)" }}>
        Shipping rates
      </h2>
      <p style={{ marginTop: 12 }}>
        US shipping is $9.99 for one 12 oz bag, and $12.99 for 2 or more, by
        USPS Ground Advantage. Priority Mail is available at checkout as a paid
        faster option, at the carrier rate for your address. Checkout is on
        checkout.balcoffee.com, and that is where you confirm the method before
        you pay.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
      >
        Where we ship
      </h2>
      <p style={{ marginTop: 12 }}>
        BAL is an online-only company based in Houston, Texas. We ship date seed
        coffee to addresses across the United States. Bags ship in 1–2 business
        days; most orders arrive in 2–5 business days. Checkout confirms the
        methods available for your address.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
      >
        20g samples
      </h2>
      <p style={{ marginTop: 12 }}>
        Each sample is 20g, enough for one cup, and is $0. You pay the shipping.
        Samples ship by USPS Ground Advantage at the rate shown at checkout,
        separately from any bags in the same order, with their own shipping
        charge. You can order one sample of each blend per order.
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
          href="mailto:info@balcoffee.com"
          style={{ color: "var(--terra-deep)" }}
        >
          info@balcoffee.com
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
