import { PageShell } from "components/bal/page-shell";
import { getShopifyPolicy } from "lib/policies";

export const metadata = {
  title: "Privacy Policy",
  description: "How BAL Coffee collects, uses, and protects your information.",
};

export default async function PrivacyPage() {
  const policy = await getShopifyPolicy("privacy-policy");

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
