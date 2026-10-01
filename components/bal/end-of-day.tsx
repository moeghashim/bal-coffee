function CoffeeBookArt() {
  return (
    <img
      src="/evening-ritual.svg"
      alt="A warm evening coffee beside an open book"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}

const stroke = "var(--terra-deep)";

function CalmingIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 L 22 12 L 28 12 L 23 16 L 25 22 L 20 18 L 15 22 L 17 16 L 12 12 L 18 12 Z" />
      <path d="M10 30 C 14 26, 26 26, 30 30" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M26 8 A 12 12 0 1 0 32 24 C 26 24, 22 20, 22 14 C 22 11, 24 9, 26 8 Z" />
      <circle cx="14" cy="14" r="0.8" fill={stroke} />
      <circle cx="10" cy="22" r="0.8" fill={stroke} />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 C 16 10, 14 12, 14 16 C 14 20, 16 22, 20 22 C 24 22, 26 20, 26 16 C 26 12, 24 10, 20 6 Z" />
      <path d="M14 22 C 10 22, 8 24, 8 28 C 8 32, 12 32, 14 30" />
      <path d="M26 22 C 30 22, 32 24, 32 28 C 32 32, 28 32, 26 30" />
      <path d="M20 22 V 34" />
    </svg>
  );
}

function BotanicalRight() {
  return (
    <svg
      className="bal-endofday-botanical"
      width="200"
      height="260"
      viewBox="0 0 200 260"
      fill="none"
      stroke="var(--ink-2)"
      strokeWidth="1"
      strokeLinecap="round"
      style={{
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        opacity: 0.25,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <path d="M40 240 C 70 180, 110 110, 170 30" />
      <ellipse cx="60" cy="200" rx="14" ry="5" transform="rotate(-30 60 200)" />
      <ellipse cx="86" cy="160" rx="16" ry="5" transform="rotate(-20 86 160)" />
      <ellipse
        cx="112"
        cy="120"
        rx="16"
        ry="5"
        transform="rotate(-15 112 120)"
      />
      <ellipse cx="138" cy="80" rx="14" ry="5" transform="rotate(-10 138 80)" />
      <ellipse cx="160" cy="40" rx="12" ry="4" transform="rotate(-5 160 40)" />
      <ellipse
        cx="100"
        cy="220"
        rx="9"
        ry="14"
        transform="rotate(-30 100 220)"
      />
      <ellipse
        cx="124"
        cy="226"
        rx="9"
        ry="14"
        transform="rotate(20 124 226)"
      />
    </svg>
  );
}

export function EndOfDay() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--cream)",
        padding: "0",
        overflow: "hidden",
      }}
    >
      <BotanicalRight />
      <div
        className="bal-endofday-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "stretch",
          maxWidth: 1280,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div>
          <CoffeeBookArt />
        </div>
        <div
          className="bal-endofday-copy"
          style={{
            padding: "70px 56px 70px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            Made for your moments
          </p>
          <h2
            className="serif"
            style={{
              marginTop: 14,
              fontSize: "clamp(34px, 3.4vw, 48px)",
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            The perfect
            <br />
            end to your day
          </h2>
          <p
            style={{
              marginTop: 22,
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--ink-2)",
              maxWidth: 380,
            }}
          >
            No caffeine. No jitters. Just a warm, comforting cup that helps you
            unwind and reconnect with what matters.
          </p>
          <div
            className="bal-endofday-perks"
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "repeat(3, auto)",
              gap: 36,
              maxWidth: 420,
            }}
          >
            {[
              { icon: <CalmingIcon />, label: "Calming\nby nature" },
              { icon: <MoonIcon />, label: "Gentle on\nyour sleep" },
              { icon: <TreeIcon />, label: "Rooted in\ntradition" },
            ].map((it, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {it.icon}
                </div>
                <p
                  className="mono"
                  style={{
                    marginTop: 10,
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ink-2)",
                    whiteSpace: "pre-line",
                    lineHeight: 1.5,
                  }}
                >
                  {it.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
