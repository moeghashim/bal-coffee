import { PageShell } from "components/bal/page-shell";

export const metadata = {
  title: "Shipping & Delivery",
  description: "How BAL Coffee ships orders, including free shipping over $50.",
};

export default function ShippingPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Shipping & delivery"
      intro="Free shipping on orders over $50."
    >
      <p>
        Orders under $50 show a shipping rate at checkout, before you pay.
        Checkout is on checkout.balcoffee.com.
      </p>
      <p style={{ marginTop: 16 }}>
        We don&apos;t publish a delivery-time promise here. The checkout page is
        where the available shipping methods are confirmed for your address.
      </p>
      <p style={{ marginTop: 16 }}>
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
    </PageShell>
  );
}
