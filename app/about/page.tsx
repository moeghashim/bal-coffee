import { PageShell } from "components/bal/page-shell";

export const metadata = {
  title: "About",
  description:
    "BAL Coffee is a caffeine-free date-seed coffee founded by Judy Ghashim.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Our story"
      title="Rooted in heritage, crafted with heart"
      intro="Meet Judy, the heart and soul behind BAL Coffee."
    >
      <p>
        A devoted coffee lover, Judy&apos;s journey with coffee has been a
        search for a cup that doesn&apos;t compromise well-being. Even a single
        shot of decaf left her feeling the effects on her heart rate.
      </p>
      <p style={{ marginTop: 16 }}>
        She looked at alternatives, including mushroom coffee, and they
        didn&apos;t bring the comfort she wanted from the ritual. That is when
        BAL Coffee started: a date-seed coffee meant to be good for the person
        drinking it and easier on the land than growing more coffee trees.
      </p>
      <p style={{ marginTop: 16 }}>
        Date seeds are usually discarded. Roasting them is how BAL makes a
        naturally caffeine-free cup. Judy wanted something her family could
        drink any time of day, one that honors that heritage.
      </p>
      <p style={{ marginTop: 16 }}>
        Questions about the company? Email{" "}
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
