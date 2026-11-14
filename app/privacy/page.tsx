import { PageShell } from "components/bal/page-shell";
import { shouldShowAnalyticsNote } from "lib/ga";
import { getShopifyPolicy } from "lib/policies";

export const metadata = {
  title: "Privacy Policy",
  description: "How BAL Coffee collects, uses, and protects your information.",
};

export default async function PrivacyPage() {
  const policy = await getShopifyPolicy("privacy-policy");
  const showAnalyticsNote = shouldShowAnalyticsNote(policy?.html ?? null);

  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro={
        policy
          ? "This is the privacy policy published for the BAL Coffee store."
          : "How we handle the information needed to fulfill an order."
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
            Information we collect
          </h2>
          <p style={{ marginTop: 12 }}>
            When you place an order, we collect the information needed to
            fulfill it — typically your name, email, shipping address, and
            payment details. Payment is processed by Shopify at checkout.
          </p>
          <h2
            className="serif"
            style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
          >
            How we use it
          </h2>
          <p style={{ marginTop: 12 }}>
            We use this information to process orders and send shipping updates.
            We don&apos;t sell the list.
          </p>
        </>
      )}
      {showAnalyticsNote ? (
        <>
          <h2
            className="serif"
            style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
          >
            Analytics and cookies
          </h2>
          <p style={{ marginTop: 12 }}>
            When analytics is turned on, this site uses Google Analytics 4.
            Google Analytics sets cookies and receives information about the
            pages and products you view, items you add to the cart, and when you
            start checkout. It does not receive your name, email address,
            shipping address, or payment details from this site. Orders are
            completed on Shopify checkout.
          </p>
        </>
      ) : null}
      <h2
        className="serif"
        style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
      >
        SMS / mobile information
      </h2>
      <p style={{ marginTop: 12 }}>
        We collect your mobile number only to send the order-ready text you
        asked for.
      </p>
      <p style={{ marginTop: 12 }}>
        Mobile information and SMS opt-in data and consent will not be shared
        with or sold to third parties or affiliates for marketing or promotional
        purposes.
      </p>
      <p style={{ marginTop: 12 }}>
        It is shared only with our messaging provider (Twilio) to deliver the
        message.
      </p>
      <p style={{ marginTop: 12 }}>To opt out, reply STOP.</p>
      <p style={{ marginTop: 12 }}>
        We keep your mobile number and SMS opt-in only as long as needed to run
        the event and fulfill the order.
      </p>
      <p style={{ marginTop: 28 }}>
        Questions about privacy? Email{" "}
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
