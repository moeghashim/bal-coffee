function CoffeeBookArt() {
  // TODO: replace with real photograph (mug + open book, warm lamp light)
  return (
    <svg
      viewBox="0 0 600 480"
      width="100%"
      height="100%"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="lampGlow" cx="0.5" cy="0.2" r="0.8">
          <stop offset="0%" stopColor="#7a4a26" />
          <stop offset="60%" stopColor="#3a200f" />
          <stop offset="100%" stopColor="#180d05" />
        </radialGradient>
        <linearGradient id="tableGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4a2c18" />
          <stop offset="100%" stopColor="#1a0d05" />
        </linearGradient>
        <linearGradient id="brewE" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a1f0f" />
          <stop offset="100%" stopColor="#1d0e06" />
        </linearGradient>
      </defs>
      <rect width="600" height="480" fill="url(#lampGlow)" />
      <rect y="320" width="600" height="160" fill="url(#tableGrad)" />
      {/* book */}
      <path
        d="M70 280 L 290 280 L 300 360 L 280 360 L 280 290 L 80 290 L 80 360 L 60 360 Z"
        fill="#3a2418"
      />
      <path d="M80 290 L 280 290 L 280 358 L 80 358 Z" fill="#f1e6cd" />
      <path d="M180 290 L 180 358" stroke="#a48a6a" strokeWidth="1" />
      {[300, 312, 324, 336, 348].map((y) => (
        <line
          key={y}
          x1="100"
          y1={y}
          x2="170"
          y2={y}
          stroke="#7a5a34"
          strokeWidth="0.6"
          opacity="0.6"
        />
      ))}
      {[300, 312, 324, 336, 348].map((y) => (
        <line
          key={`r${y}`}
          x1="190"
          y1={y}
          x2="260"
          y2={y}
          stroke="#7a5a34"
          strokeWidth="0.6"
          opacity="0.6"
        />
      ))}
      {/* glass mug */}
      <ellipse cx="420" cy="370" rx="80" ry="10" fill="#000" opacity="0.5" />
      <path
        d="M360 240 Q 360 230 374 230 L 460 230 Q 474 230 474 240 L 474 350 Q 474 370 450 370 L 384 370 Q 360 370 360 350 Z"
        fill="rgba(255,240,220,0.18)"
        stroke="#caa17a"
        strokeWidth="1.5"
      />
      <path
        d="M376 252 Q 376 246 384 246 L 450 246 Q 458 246 458 252 L 458 348 Q 458 360 444 360 L 390 360 Q 376 360 376 348 Z"
        fill="url(#brewE)"
      />
      <ellipse cx="417" cy="252" rx="40" ry="5" fill="#a87650" opacity="0.7" />
      <path
        d="M474 260 Q 510 262 510 295 Q 510 326 474 330"
        fill="none"
        stroke="#caa17a"
        strokeWidth="3"
      />
      {/* lamp light highlights */}
      <ellipse
        cx="500"
        cy="80"
        rx="180"
        ry="80"
        fill="#caa17a"
        opacity="0.15"
      />
    </svg>
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
      width="200"
      height="260"
      viewBox="0 0 200 260"
      fill="none"
      stroke="var(--ink-2)"
      strokeWidth="1"
      strokeLinecap="round"
      className="bal-endofday-botanical"
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
        padding: "0 0 80px",
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
