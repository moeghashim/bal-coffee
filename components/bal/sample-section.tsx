import { SamplePicker } from "components/bal/sample-cta";
import { getSampleOffers } from "lib/catalog";
import { SAMPLE_TERMS } from "lib/sample";

/**
 * Homepage sample section (replaces the old "subscription isn't available"
 * strip). Hidden entirely while no sample is available to buy.
 */
export async function SampleSection() {
  let offers: Awaited<ReturnType<typeof getSampleOffers>> = [];
  try {
    offers = await getSampleOffers();
  } catch {
    offers = [];
  }
  if (offers.length === 0) return null;

  return (
    <section
      id="sample"
      className="bal-subscription"
      style={{
        background: "var(--terra)",
        color: "var(--cream)",
        padding: "44px 56px",
      }}
    >
      <div
        className="bal-subscription-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr auto",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <h3
            className="serif"
            style={{
              fontSize: "clamp(26px, 2.4vw, 34px)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "var(--cream)",
            }}
          >
            Try a 20g sample first
          </h3>
          <p
            style={{
              marginTop: 10,
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "rgba(244,239,230,0.9)",
              maxWidth: 520,
            }}
          >
            Pick a blend and taste it before you buy a bag: 100% date seeds,
            naturally caffeine-free, roasted in small batches. {SAMPLE_TERMS}
          </p>
        </div>
        <SamplePicker offers={offers} />
      </div>
    </section>
  );
}
