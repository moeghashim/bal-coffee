function BotanicalAccent() {
  return (
    <svg
      className="bal-hero-botanical"
      width="160"
      height="320"
      viewBox="0 0 160 320"
      fill="none"
      stroke="var(--ink-2)"
      strokeWidth="1"
      strokeLinecap="round"
      style={{
        position: "absolute",
        left: -10,
        top: 60,
        opacity: 0.35,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <path d="M30 20 C 50 80, 70 160, 60 300" />
      <path d="M52 60 C 80 60, 100 50, 110 40" />
      <path d="M52 60 C 80 80, 100 90, 116 88" />
      <path d="M58 110 C 90 110, 116 100, 130 92" />
      <path d="M58 110 C 90 130, 110 142, 130 150" />
      <path d="M62 170 C 90 168, 116 158, 132 150" />
      <path d="M60 220 C 90 220, 110 208, 124 198" />
      <path d="M60 220 C 88 240, 104 252, 120 258" />
      <ellipse cx="98" cy="42" rx="10" ry="4" transform="rotate(-15 98 42)" />
      <ellipse cx="104" cy="86" rx="11" ry="4" transform="rotate(10 104 86)" />
      <ellipse cx="120" cy="92" rx="10" ry="4" transform="rotate(-12 120 92)" />
      <ellipse
        cx="120"
        cy="148"
        rx="11"
        ry="4"
        transform="rotate(15 120 148)"
      />
      <ellipse
        cx="122"
        cy="154"
        rx="10"
        ry="4"
        transform="rotate(-8 122 154)"
      />
      <ellipse
        cx="116"
        cy="200"
        rx="10"
        ry="4"
        transform="rotate(-18 116 200)"
      />
      <ellipse cx="112" cy="252" rx="9" ry="3" transform="rotate(20 112 252)" />
    </svg>
  );
}

function HeroImage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "5 / 4",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 30px 60px -30px rgba(42,31,23,0.35)",
        background: "var(--cream-2)",
      }}
    >
      <img
        src="/product-ritual.svg"
        alt="Illustration of a BAL Coffee bag beside a filled mug and date seeds"
        width={1200}
        height={960}
        sizes="(max-width: 1024px) 100vw, 55vw"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="bal-hero"
      style={{
        position: "relative",
        padding: "40px 56px 80px",
        overflow: "hidden",
      }}
    >
      <BotanicalAccent />
      <div
        className="bal-hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: 56,
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          className="bal-hero-copy"
          style={{ paddingLeft: 80, paddingRight: 20 }}
        >
          <p
            className="serif"
            style={{
              fontSize: "clamp(22px, 2.4vw, 28px)",
              lineHeight: 1.15,
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--terra-deep)",
            }}
          >
            Coffee from the seed
          </p>
          <h1
            className="serif"
            style={{
              marginTop: 12,
              fontSize: "clamp(36px, 4.4vw, 58px)",
              lineHeight: 1.05,
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            Roasted date seed coffee, naturally caffeine-free
          </h1>
          <p
            style={{
              marginTop: 28,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--ink-2)",
              maxWidth: 420,
            }}
          >
            A caffeine-free coffee alternative roasted from date seeds, not
            coffee beans. Brew it in the morning or at night. We ship 12 oz bags
            across the United States.
          </p>
          <div
            className="bal-hero-buttons"
            style={{ marginTop: 36, display: "flex", gap: 14 }}
          >
            <a
              href="#shop"
              className="mono"
              style={{
                padding: "14px 24px",
                background: "var(--ink)",
                color: "var(--cream)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Shop date seed coffee
            </a>
            <a
              href="#process"
              className="mono"
              style={{
                padding: "14px 22px",
                border: "1px solid var(--ink)",
                color: "var(--ink)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              How it is made
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden
              >
                <path d="M2 1 L 10 6 L 2 11 Z" />
              </svg>
            </a>
          </div>
          <p
            style={{
              marginTop: 18,
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink-2)",
            }}
          >
            <a href="/faq" style={{ color: "var(--terra-deep)" }}>
              Is date seed coffee caffeine-free?
            </a>
            <span style={{ margin: "0 10px", color: "var(--ink-soft)" }}>
              ·
            </span>
            <a href="/about" style={{ color: "var(--terra-deep)" }}>
              Our story
            </a>
          </p>
        </div>
        <div>
          <HeroImage />
        </div>
      </div>
    </section>
  );
}
