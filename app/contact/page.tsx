import { JsonLd } from "components/bal/json-ld";
import { PageShell } from "components/bal/page-shell";
import { contactPageJsonLd, pageMetadata, pageSeo } from "lib/seo";
import { baseUrl } from "lib/utils";

export const metadata = pageMetadata({
  title: pageSeo.contact.title,
  description: pageSeo.contact.description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageJsonLd(baseUrl)} />
      <PageShell
        eyebrow="Contact"
        title="Say hello"
        intro="Contact BAL Coffee. The best way to reach us is by email."
      >
        <p
          className="serif"
          style={{ fontSize: 22, color: "var(--ink)", marginBottom: 12 }}
        >
          Contact BAL Coffee
        </p>
        <p>
          <a
            href="mailto:judy@balcoffee.com"
            className="serif"
            style={{ fontSize: 28, color: "var(--terra-deep)" }}
          >
            judy@balcoffee.com
          </a>
        </p>
        <p style={{ marginTop: 12 }}>
          BAL is an online-only coffee company based in Houston, Texas.
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
          an order leaves. If that message hasn&apos;t arrived, we can look it
          up from the order number. Rates are covered on the{" "}
          <a href="/shipping" style={{ color: "var(--terra-deep)" }}>
            shipping page
          </a>
          , and problems with an order start on{" "}
          <a href="/returns" style={{ color: "var(--terra-deep)" }}>
            returns
          </a>
          .
        </p>
        <h2
          className="serif"
          style={{ fontSize: 22, marginTop: 32, color: "var(--ink)" }}
        >
          Wholesale and careers
        </h2>
        <p style={{ marginTop: 12 }}>
          Use the same email and tell us what you have in mind. We don&apos;t
          have a separate wholesale portal or jobs board. Product questions are
          in the{" "}
          <a href="/faq" style={{ color: "var(--terra-deep)" }}>
            FAQ
          </a>
          .
        </p>
      </PageShell>
    </>
  );
}
