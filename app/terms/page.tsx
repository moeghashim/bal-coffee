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
