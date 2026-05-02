"use client";

function BotanicalAccent() {
  return (
    <svg
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
  // TODO: replace with real product photography (mug + bag)
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "5 / 4",
        background:
          "linear-gradient(135deg, #ece2d2 0%, #d9cab2 60%, #b89a73 100%)",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 30px 60px -30px rgba(42,31,23,0.35)",
      }}
      aria-label="Bal coffee mug and Eastern Brew bag"
    >
      <svg
        viewBox="0 0 600 480"
        width="100%"
        height="100%"
        style={{ display: "block" }}
        aria-hidden
      >
        <defs>
          <linearGradient id="wallGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#efe6d6" />
            <stop offset="100%" stopColor="#cdb999" />
          </linearGradient>
          <linearGradient id="brewGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3a1f0f" />
            <stop offset="100%" stopColor="#1d0e06" />
          </linearGradient>
          <linearGradient id="bagGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e9d6b1" />
            <stop offset="100%" stopColor="#b48a55" />
          </linearGradient>
          <linearGradient id="cremaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a87650" />
            <stop offset="100%" stopColor="#7a4828" />
          </linearGradient>
        </defs>
        <rect width="600" height="480" fill="url(#wallGrad)" />
        <rect y="380" width="600" height="100" fill="#a78866" opacity="0.4" />

        {/* plant pot */}
        <rect x="240" y="90" width="120" height="80" fill="#e3d5b9" />
        <ellipse cx="300" cy="90" rx="60" ry="14" fill="#cbb88f" />
        <path
          d="M300 90 C 270 50, 240 30, 210 20 C 240 50, 260 80, 280 90"
          fill="#5a6a3a"
          opacity="0.85"
        />
        <path
          d="M300 90 C 320 40, 360 20, 400 14 C 380 50, 350 80, 320 90"
          fill="#6f7d44"
          opacity="0.9"
        />
        <path
          d="M300 90 C 290 40, 290 14, 296 0 C 308 30, 312 60, 308 90"
          fill="#7c8a4f"
          opacity="0.9"
        />

        {/* mug saucer */}
        <ellipse
          cx="180"
          cy="370"
          rx="120"
          ry="18"
          fill="#5e3a22"
          opacity="0.25"
        />
        {/* mug body */}
        <path
          d="M100 240 Q 100 220 130 220 L 230 220 Q 260 220 260 240 L 260 350 Q 260 380 220 380 L 140 380 Q 100 380 100 350 Z"
          fill="#f6efe2"
          stroke="#a48a6a"
          strokeWidth="2"
        />
        {/* mug interior brew */}
        <ellipse cx="180" cy="232" rx="74" ry="14" fill="url(#brewGrad)" />
        <ellipse
          cx="180"
          cy="230"
          rx="74"
          ry="14"
          fill="url(#cremaGrad)"
          opacity="0.85"
        />
        <ellipse
          cx="180"
          cy="228"
          rx="56"
          ry="9"
          fill="#caa17a"
          opacity="0.55"
        />
        {/* handle */}
        <path
          d="M260 250 Q 305 260 305 295 Q 305 330 260 340"
          fill="none"
          stroke="#a48a6a"
          strokeWidth="6"
        />
        <path
          d="M260 262 Q 290 270 290 295 Q 290 320 260 328"
          fill="none"
          stroke="#f6efe2"
          strokeWidth="3"
        />

        {/* coffee bag */}
        <path
          d="M380 130 L 540 130 Q 555 130 555 150 L 555 380 Q 555 400 535 400 L 385 400 Q 365 400 365 380 L 365 150 Q 365 130 380 130 Z"
          fill="url(#bagGrad)"
          stroke="#8a6638"
          strokeWidth="1.5"
        />
        <path
          d="M380 130 L 460 110 L 540 130"
          fill="#c8a778"
          stroke="#8a6638"
          strokeWidth="1.5"
        />
        {/* bag label */}
        <rect
          x="395"
          y="200"
          width="130"
          height="150"
          fill="#f4ead6"
          stroke="#7a5a34"
          strokeWidth="1"
        />
        <text
          x="460"
          y="230"
          textAnchor="middle"
          fill="#2a1f17"
          fontFamily="Fraunces, serif"
          fontSize="16"
          fontWeight="600"
          letterSpacing="2"
        >
          BAL
        </text>
        <line
          x1="410"
          y1="244"
          x2="510"
          y2="244"
          stroke="#7a5a34"
          strokeWidth="0.5"
        />
        <text
          x="460"
          y="278"
          textAnchor="middle"
          fill="#2a1f17"
          fontFamily="Fraunces, serif"
          fontSize="14"
          fontWeight="600"
        >
          EASTERN BREW
        </text>
        <text
          x="460"
          y="296"
          textAnchor="middle"
          fill="#7a5a34"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="7"
          letterSpacing="2"
        >
          TURKISH COFFEE STYLE
        </text>
        <circle cx="430" cy="320" r="10" fill="#7a5a34" opacity="0.3" />
        <circle cx="448" cy="328" r="8" fill="#7a5a34" opacity="0.25" />
        <circle cx="486" cy="320" r="9" fill="#7a5a34" opacity="0.3" />
        <text
          x="460"
          y="346"
          textAnchor="middle"
          fill="#7a5a34"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="7"
        >
          250g
        </text>
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        padding: "40px 56px 80px",
        overflow: "hidden",
      }}
    >
      <BotanicalAccent />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: 56,
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div style={{ paddingLeft: 80, paddingRight: 20 }}>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(44px, 5.6vw, 80px)",
              lineHeight: 1.02,
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            Coffee
            <br />
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--terra-deep)",
              }}
            >
              from the seed
            </span>
          </h1>
          <p
            style={{
              marginTop: 28,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--ink-2)",
              maxWidth: 380,
            }}
          >
            A naturally caffeine-free ritual,
            <br />
            roasted from date seeds.
            <br />
            Warm. Grounding. Yours, any time of day.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: 14 }}>
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
              Shop the collection
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
              How it brews
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
        </div>
        <div>
          <HeroImage />
        </div>
      </div>
    </section>
  );
}
