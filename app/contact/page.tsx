import { PageShell } from "components/bal/page-shell";

export const metadata = {
  title: "Contact",
  description: "Email Judy at BAL Coffee.",
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Say hello"
      intro="The best way to reach BAL is by email."
    >
      <p>
        <a
          href="mailto:judy@balcoffee.com"
          className="serif"
          style={{ fontSize: 28, color: "var(--terra-deep)" }}
        >
          judy@balcoffee.com
        </a>
      </p>
      <h2
        id="orders"
        className="serif"
        style={{ fontSize: 22, marginTop: 36, color: "var(--ink)" }}
      >
        Orders and tracking
      </h2>
      <p style={{ marginTop: 12 }}>
        Include your order number. Tracking is sent in the shipping email when
        an order leaves. If that message hasn&apos;t arrived, we can look it up
        from the order number.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        Wholesale and careers
      </h2>
      <p style={{ marginTop: 12 }}>
        Use the same email and tell us what you have in mind. We don&apos;t have
        a separate wholesale portal or jobs board.
      </p>
    </PageShell>
  );
}
