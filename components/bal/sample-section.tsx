import Image from "next/image";
import { GrindList, SamplePicker } from "components/bal/sample-cta";
import { getSampleOffers } from "lib/catalog";
import { samplePhoto } from "lib/homepage-media";
import { SAMPLE_TERMS_SHORT } from "lib/sample";

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
    <section id="sample" className="bal-sample">
      <div className="bal-sample-grid">
        <div className="bal-sample-copy">
          <h2 className="serif bal-sample-title">Try a 20g sample first</h2>
          <p className="bal-sample-lead">
            Taste BAL before you buy a bag. {SAMPLE_TERMS_SHORT}
          </p>
          <GrindList offers={offers} tone="dark" />
        </div>
        <figure className="bal-sample-photo">
          <Image
            src={samplePhoto.src}
            alt={samplePhoto.alt}
            width={samplePhoto.width}
            height={samplePhoto.height}
            sizes="(max-width: 1024px) calc(100vw - 48px), 32vw"
            className="bal-sample-photo-image"
          />
        </figure>
        <div className="bal-sample-picker">
          <SamplePicker offers={offers} />
        </div>
      </div>
    </section>
  );
}
