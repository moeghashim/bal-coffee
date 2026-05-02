type Product = {
  name: string;
  type: string;
  blurb: string;
  price: string;
  image: React.ReactNode;
};

function EasternBrewArt() {
  return (
    <svg
      viewBox="0 0 400 320"
      width="100%"
      height="100%"
      style={{ display: "block" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="bgEastern" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e9dcc1" />
          <stop offset="100%" stopColor="#b89a72" />
        </linearGradient>
        <linearGradient id="bagE" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ebd6ad" />
          <stop offset="100%" stopColor="#b1875a" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#bgEastern)" />
      <ellipse
        cx="200"
        cy="280"
        rx="180"
        ry="14"
        fill="#7a5a3a"
        opacity="0.25"
      />
      <path
        d="M120 80 L 280 80 Q 295 80 295 100 L 295 280 Q 295 295 280 295 L 120 295 Q 105 295 105 280 L 105 100 Q 105 80 120 80 Z"
        fill="url(#bagE)"
        stroke="#7a5a34"
        strokeWidth="1.2"
      />
      <path
        d="M120 80 L 200 65 L 280 80"
        fill="#c8a778"
        stroke="#7a5a34"
        strokeWidth="1.2"
      />
      <rect
        x="135"
        y="135"
        width="130"
        height="135"
        fill="#f5ead4"
        stroke="#7a5a34"
      />
      <text
        x="200"
        y="160"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="14"
        fontWeight="600"
        fill="#2a1f17"
        letterSpacing="2"
      >
        BAL
      </text>
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="13"
        fontWeight="600"
        fill="#2a1f17"
      >
        EASTERN BREW
      </text>
      <text
        x="200"
        y="216"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        fill="#7a5a34"
        letterSpacing="2"
      >
        TURKISH COFFEE STYLE
      </text>
      <circle cx="178" cy="240" r="7" fill="#7a5a34" opacity="0.3" />
      <circle cx="200" cy="246" r="6" fill="#7a5a34" opacity="0.25" />
      <circle cx="222" cy="240" r="7" fill="#7a5a34" opacity="0.3" />
      {/* small cup beside */}
      <ellipse cx="80" cy="270" rx="36" ry="6" fill="#5e3a22" opacity="0.3" />
      <path
        d="M48 220 Q 48 212 56 212 L 100 212 Q 108 212 108 220 L 108 258 Q 108 270 96 270 L 60 270 Q 48 270 48 258 Z"
        fill="#f4ead6"
        stroke="#a48a6a"
      />
      <ellipse cx="78" cy="216" rx="28" ry="5" fill="#3a1f0f" />
    </svg>
  );
}

function GrounDateArt() {
  return (
    <svg
      viewBox="0 0 400 320"
      width="100%"
      height="100%"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="bgG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e9dcc1" />
          <stop offset="100%" stopColor="#a78962" />
        </linearGradient>
        <linearGradient id="bagG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ebd6ad" />
          <stop offset="100%" stopColor="#a17a4d" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#bgG)" />
      <ellipse
        cx="200"
        cy="280"
        rx="180"
        ry="14"
        fill="#7a5a3a"
        opacity="0.3"
      />
      {/* bag */}
      <path
        d="M150 70 L 290 70 Q 305 70 305 90 L 305 270 Q 305 285 290 285 L 150 285 Q 135 285 135 270 L 135 90 Q 135 70 150 70 Z"
        fill="url(#bagG)"
        stroke="#7a5a34"
        strokeWidth="1.2"
      />
      <path
        d="M150 70 L 220 56 L 290 70"
        fill="#c8a778"
        stroke="#7a5a34"
        strokeWidth="1.2"
      />
      <rect
        x="160"
        y="120"
        width="120"
        height="135"
        fill="#f4e9d3"
        stroke="#7a5a34"
      />
      <text
        x="220"
        y="148"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="13"
        fontWeight="600"
        fill="#2a1f17"
        letterSpacing="2"
      >
        BAL
      </text>
      <text
        x="220"
        y="186"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="13"
        fontWeight="600"
        fill="#2a1f17"
      >
        GROUNDATE
      </text>
      <text
        x="220"
        y="202"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        fill="#7a5a34"
        letterSpacing="2"
      >
        CLASSIC BREWING
      </text>
      <circle cx="200" cy="226" r="7" fill="#7a5a34" opacity="0.3" />
      <circle cx="220" cy="232" r="6" fill="#7a5a34" opacity="0.25" />
      <circle cx="240" cy="226" r="7" fill="#7a5a34" opacity="0.3" />
      {/* french press */}
      <rect
        x="55"
        y="160"
        width="60"
        height="110"
        rx="4"
        fill="#f6efe2"
        stroke="#a48a6a"
      />
      <rect
        x="55"
        y="180"
        width="60"
        height="80"
        fill="#3a1f0f"
        opacity="0.85"
      />
      <rect x="50" y="155" width="70" height="10" fill="#9a7a52" />
      <rect x="78" y="135" width="14" height="22" fill="#9a7a52" />
      <circle cx="85" cy="135" r="6" fill="#9a7a52" />
    </svg>
  );
}

function DateSpressoArt() {
  return (
    <svg
      viewBox="0 0 400 320"
      width="100%"
      height="100%"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="bgD" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a2418" />
          <stop offset="100%" stopColor="#1a0d06" />
        </linearGradient>
        <linearGradient id="machineD" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2c2017" />
          <stop offset="100%" stopColor="#100905" />
        </linearGradient>
        <linearGradient id="cremaD" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c89066" />
          <stop offset="100%" stopColor="#7a4828" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#bgD)" />
      {/* counter */}
      <rect y="240" width="400" height="80" fill="#5a4a36" />
      {/* machine */}
      <rect
        x="120"
        y="40"
        width="180"
        height="160"
        rx="6"
        fill="url(#machineD)"
      />
      <rect x="140" y="70" width="140" height="60" rx="3" fill="#1a1410" />
      <circle cx="170" cy="100" r="6" fill="#caa17a" />
      <circle cx="190" cy="100" r="6" fill="#7a5a3a" />
      <rect x="180" y="200" width="60" height="36" fill="#1c1612" />
      <rect x="170" y="196" width="80" height="6" fill="#3a2c20" />
      {/* cup */}
      <ellipse cx="210" cy="280" rx="58" ry="6" fill="#000" opacity="0.4" />
      <path
        d="M170 240 L 250 240 L 244 280 Q 244 286 238 286 L 182 286 Q 176 286 176 280 Z"
        fill="#f4ead6"
        stroke="#a48a6a"
      />
      <ellipse cx="210" cy="240" rx="40" ry="5" fill="url(#cremaD)" />
      {/* steam */}
      <path
        d="M195 30 C 200 20, 190 12, 198 4"
        fill="none"
        stroke="#caa17a"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <path
        d="M215 30 C 220 22, 210 14, 218 6"
        fill="none"
        stroke="#caa17a"
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
  );
}

const products: Product[] = [
  {
    name: "Eastern Brew",
    type: "Turkish coffee style",
    blurb: "Finely ground for a traditional, rich and bold cup.",
    price: "$24.00",
    image: <EasternBrewArt />,
  },
  {
    name: "GrounDate",
    type: "Classic brewing",
    blurb: "Perfectly ground for drip or French press.",
    price: "$22.00",
    image: <GrounDateArt />,
  },
  {
    name: "DateSpresso",
    type: "Pod compatible",
    blurb: "Designed for Nespresso® machines.",
    price: "$24.00",
    image: <DateSpressoArt />,
  },
];

function ProductCard({ p }: { p: Product }) {
  return (
    <article
      style={{
        background: "var(--cream-3)",
        border: "1px solid var(--line-soft)",
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ aspectRatio: "5 / 4" }}>{p.image}</div>
      <div style={{ padding: "20px 22px 22px" }}>
        <h3
          className="serif"
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          {p.name}
        </h3>
        <p
          className="mono"
          style={{
            marginTop: 4,
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
          }}
        >
          {p.type}
        </p>
        <p
          style={{
            marginTop: 14,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: "var(--ink-2)",
          }}
        >
          {p.blurb}
        </p>
        <p
          className="serif"
          style={{
            marginTop: 16,
            fontSize: 18,
            color: "var(--ink)",
          }}
        >
          {p.price}
        </p>
        <button
          className="mono"
          style={{
            marginTop: 16,
            width: "100%",
            padding: "12px 16px",
            border: "1px solid var(--ink)",
            borderRadius: 2,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: "transparent",
            color: "var(--ink)",
          }}
        >
          Quick Shop
        </button>
      </div>
    </article>
  );
}

export function Bestsellers() {
  return (
    <section
      id="shop"
      className="bal-bestsellers"
      style={{
        padding: "100px 56px",
        background: "var(--cream)",
      }}
    >
      <div
        className="bal-bestsellers-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.85fr 1fr 1fr 1fr",
          gap: 28,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: 12,
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
            Bestsellers
          </p>
          <h2
            className="serif"
            style={{
              marginTop: 16,
              fontSize: "clamp(34px, 3vw, 44px)",
              lineHeight: 1.05,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Our most
            <br />
            loved brews
          </h2>
          <p
            style={{
              marginTop: 22,
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink-2)",
              maxWidth: 260,
            }}
          >
            Three ways to experience BAL. Each one crafted to bring warmth,
            comfort, and connection to your daily ritual.
          </p>
          <a
            href="#all-products"
            className="mono"
            style={{
              marginTop: 28,
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "13px 22px",
              background: "var(--ink)",
              color: "var(--cream)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              borderRadius: 2,
            }}
          >
            Shop all products
          </a>
        </div>
        {products.map((p) => (
          <ProductCard key={p.name} p={p} />
        ))}
      </div>
    </section>
  );
}
