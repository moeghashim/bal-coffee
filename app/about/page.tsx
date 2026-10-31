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
          A devoted coffee lover, Judy&apos;s journey with coffee has been a
          search for a cup that doesn&apos;t compromise well-being. Even a
          single shot of decaf left her feeling the effects on her heart rate.
        </p>
        <h2
          className="serif"
          style={{ fontSize: 26, marginTop: 28, color: "var(--ink)" }}
        >
          Why date seeds
        </h2>
        <p style={{ marginTop: 12 }}>
          She looked at alternatives, including mushroom coffee, and they
          didn&apos;t bring the comfort she wanted from the ritual. That is when
          BAL Coffee started: a date-seed coffee meant to be good for the person
          drinking it and easier on the land than growing more coffee trees.
        </p>
        <p style={{ marginTop: 16 }}>
          Date seeds are usually discarded. Roasting them is how BAL makes a
          naturally caffeine-free cup. Judy wanted something her family could
          drink any time of day, one that honors that heritage. BAL is
          online-only. There is no café or store to visit.
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
