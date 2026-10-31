import { PageShell } from "components/bal/page-shell";

export default function NotFound() {
  return (
    <PageShell
      eyebrow="404"
      title="Page not found"
      intro="That page is not on balcoffee.com."
    >
      <p>
        <a href="/products" style={{ color: "var(--terra-deep)" }}>
          Shop date seed coffee
        </a>
      </p>
    </PageShell>
  );
}
