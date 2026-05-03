import { PageShell } from "components/bal/page-shell";

export const metadata = {
  title: "Privacy Policy",
  description: "How BAL Coffee collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This page is a draft. Final policy language will be published before launch."
    >
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        Information we collect
      </h2>
      <p style={{ marginTop: 12 }}>
        When you place an order or subscribe to our newsletter, we collect the
        information needed to fulfill your order and stay in touch — typically
        your name, email, shipping address, and payment details.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        How we use it
      </h2>
      <p style={{ marginTop: 12 }}>
        We use this information to process orders, send shipping updates, and —
        only if you opt in — share occasional news and offers.
      </p>
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        Contact
      </h2>
      <p style={{ marginTop: 12 }}>
        Questions about this policy? Reach us at{" "}
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
