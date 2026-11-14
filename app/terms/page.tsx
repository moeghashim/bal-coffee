import { PageShell } from "components/bal/page-shell";
import { getShopifyPolicy } from "lib/policies";

export const metadata = {
  title: "Terms of Service",
  description: "Terms governing your use of balcoffee.com and BAL purchases.",
};

export default async function TermsPage() {
  const policy = await getShopifyPolicy("terms-of-service");

  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro={
        policy
          ? "This is the terms of service published for the BAL Coffee store."
          : "The short version of how orders on this site work."
      }
    >
      {policy ? (
        <div
          className="bal-policy"
          dangerouslySetInnerHTML={{ __html: policy.html }}
        />
      ) : (
        <>
          <h2
            className="serif"
            style={{ fontSize: 22, marginTop: 8, color: "var(--ink)" }}
          >
            Use of this site
          </h2>
          <p style={{ marginTop: 12 }}>
            By using balcoffee.com you agree to use the site for lawful,
            personal purposes and not to interfere with its operation or other
            shoppers&apos; experience.
          </p>
          <h2
            className="serif"
            style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
          >
            Orders
          </h2>
          <p style={{ marginTop: 12 }}>
            Placing an order is an offer to purchase. We confirm orders by email
            once payment is captured at Shopify checkout. A recurring
            subscription is not offered.
          </p>
        </>
      )}
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        Text message (SMS) order notifications
      </h2>
      <p style={{ marginTop: 12 }}>
        BAL Coffee order notifications sends one text when your in-person event
        order is ready for pickup. We send it only if you tick the opt-in box on
        the order form. The text is transactional, never marketing.
      </p>
      <p style={{ marginTop: 12 }}>Message frequency: one message per order.</p>
      <p style={{ marginTop: 12 }}>Message and data rates may apply.</p>
      <p style={{ marginTop: 12 }}>Reply STOP to opt out and HELP for help.</p>
      <p style={{ marginTop: 12 }}>
        For support, email{" "}
        <a
          href="mailto:judy@balcoffee.com"
          style={{ color: "var(--terra-deep)" }}
        >
          judy@balcoffee.com.
        </a>
      </p>
      <p style={{ marginTop: 12 }}>
        Carriers are not liable for delayed or undelivered messages.
      </p>
      <p style={{ marginTop: 12 }}>Consent is not a condition of purchase.</p>
      <p style={{ marginTop: 12 }}>
        See our{" "}
        <a href="/privacy" style={{ color: "var(--terra-deep)" }}>
          privacy policy.
        </a>
      </p>
      <p style={{ marginTop: 28 }}>
        Questions about these terms? Email{" "}
        <a
          href="mailto:judy@balcoffee.com"
          style={{ color: "var(--terra-deep)" }}
        >
          judy@balcoffee.com
        </a>
        .
      </p>
    </PageShell>
  );
}
