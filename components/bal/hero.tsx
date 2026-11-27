import Image from "next/image";
import { heroPhoto } from "lib/homepage-media";

export function Hero() {
  return (
    <section className="bal-hero">
      <div className="bal-hero-grid">
        <div className="bal-hero-copy">
          <p className="serif bal-hero-eyebrow">Not coffee beans.</p>
          <h1 className="serif bal-hero-title">
            Roasted date seed coffee, naturally caffeine-free
          </h1>
          <p className="bal-hero-lead">
            100% date seeds. Brew it morning or night.
          </p>
          <p className="bal-hero-meta">
            12 oz bags, $26.99. US shipping: $9.99 for one bag, $12.99 for 2 or
            more.
          </p>
          <div className="bal-hero-buttons">
            <a href="#shop" className="mono bal-btn bal-btn-solid">
              Shop the bags
            </a>
            <a href="#sample" className="mono bal-btn bal-btn-outline">
              Try a 20g sample
            </a>
          </div>
        </div>
        <div className="bal-hero-visual">
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            width={heroPhoto.width}
            height={heroPhoto.height}
            sizes="(max-width: 1024px) calc(100vw - 40px), 55vw"
            priority
            fetchPriority="high"
            className="bal-hero-image"
          />
        </div>
      </div>
    </section>
  );
}
