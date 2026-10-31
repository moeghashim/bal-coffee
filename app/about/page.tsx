import { JsonLd } from "components/bal/json-ld";
import { PageShell } from "components/bal/page-shell";
import { aboutPageJsonLd, pageMetadata, pageSeo } from "lib/seo";
import { baseUrl } from "lib/utils";

export const metadata = pageMetadata({
  title: pageSeo.about.title,
  description: pageSeo.about.description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutPageJsonLd(baseUrl)} />
      <PageShell
        eyebrow="Our story"
        title="Rooted in heritage, crafted with heart"
        intro="Meet Judy, the heart and soul behind BAL Coffee. Based in Houston, Texas, shipping across the United States."
      >
        <p>
          Judy Ghashim started BAL Coffee in Houston so her family could share a
          coffee ritual any time of day.
        </p>
        <h2
          className="serif"
          style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
        >
          Why date seeds
        </h2>
        <p style={{ marginTop: 12 }}>
          She looked at alternatives, including mushroom coffee, and they
          didn&apos;t bring the comfort she wanted from the ritual. Decaf is
          still made from coffee beans. BAL roasts date seeds, which are usually
          discarded, and puts no coffee beans in the bag.
        </p>
        <p style={{ marginTop: 16 }}>
          Roasting date seeds is how BAL makes a naturally caffeine-free cup.
          Judy wanted something her family could drink any time of day, one that
          honors that heritage. BAL is online-only. There is no café or store to
          visit. Orders ship across the United States.
        </p>
        <h2
          className="serif"
          style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
        >
          The coffees
        </h2>
        <p style={{ marginTop: 12 }}>
          <a
            href="/products/datespresso"
            style={{ color: "var(--terra-deep)" }}
          >
            DateSpresso
          </a>
          ,{" "}
          <a href="/products/groundate" style={{ color: "var(--terra-deep)" }}>
            GrounDate
          </a>
          , and{" "}
          <a
            href="/products/eastern-brew"
            style={{ color: "var(--terra-deep)" }}
          >
            Eastern Brew
          </a>
          . More on caffeine and brewing is in the{" "}
          <a href="/faq" style={{ color: "var(--terra-deep)" }}>
            date seed coffee FAQ
          </a>
          .
        </p>
        <h2
          className="serif"
          style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
        >
          Questions? Contact us
        </h2>
        <p style={{ marginTop: 12 }}>
          Email{" "}
          <a
            href="mailto:judy@balcoffee.com"
            style={{ color: "var(--terra-deep)" }}
          >
            judy@balcoffee.com
          </a>{" "}
          or visit the{" "}
          <a href="/contact" style={{ color: "var(--terra-deep)" }}>
            contact page
          </a>
          .
        </p>
      </PageShell>
    </>
  );
}
