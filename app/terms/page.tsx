import { PageShell } from "components/bal/page-shell";

export const metadata = {
  title: "Terms of Service",
  description: "Terms governing your use of balcoffee.com and BAL purchases.",
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="This page is a draft. Final terms will be published before launch."
    >
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        Use of this site
      </h2>
      <p style={{ marginTop: 12 }}>
        By using balcoffee.com you agree to use the site for lawful, personal
        purposes and not to interfere with its operation or other shoppers'
        experience.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        Orders &amp; subscriptions
      </h2>
      <p style={{ marginTop: 12 }}>
        Placing an order is an offer to purchase. We confirm orders by email
        once payment is captured. Subscriptions can be paused or cancelled at
        any time from your account.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        Contact
      </h2>
      <p style={{ marginTop: 12 }}>
        Questions about these terms? Reach us at{" "}
        <a
          href="mailto:hello@balcoffee.com"
          style={{ color: "var(--terra-deep)" }}
        >
          hello@balcoffee.com
        </a>
        .
      </p>
    </PageShell>
  );
}
