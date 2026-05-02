type IconProps = { size?: number };

const stroke = "var(--terra-deep)";

function LeafIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 26 C 10 14, 18 8, 26 6 C 26 16, 20 24, 8 26 Z" />
      <path d="M6 26 L 22 10" />
    </svg>
  );
}

function SeedIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <ellipse cx="16" cy="16" rx="6" ry="11" />
      <path d="M16 6 V 26" />
      <path d="M12 12 C 14 14, 18 14, 20 12" />
      <path d="M12 20 C 14 22, 18 22, 20 20" />
    </svg>
  );
}

function CupIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 12 H 22 V 22 A 4 4 0 0 1 18 26 H 10 A 4 4 0 0 1 6 22 Z" />
      <path d="M22 14 H 25 A 3 3 0 0 1 25 20 H 22" />
      <path d="M11 8 C 11 6, 13 6, 13 8 C 13 10, 11 10, 11 12" />
      <path d="M16 7 C 16 5, 18 5, 18 7 C 18 9, 16 9, 16 11" />
    </svg>
  );
}

function JarIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="4" width="14" height="3" rx="0.5" />
      <path d="M8 9 H 24 L 22 26 A 2 2 0 0 1 20 28 H 12 A 2 2 0 0 1 10 26 Z" />
      <path d="M11 14 H 21" />
    </svg>
  );
}

type Feature = {
  icon: React.ReactNode;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    icon: <LeafIcon />,
    title: "Naturally\ncaffeine-free",
    body: "Gentle on the body.\nPerfect any time of day.",
  },
  {
    icon: <SeedIcon />,
    title: "Date-seed\nbased",
    body: "Upcycled goodness\nfrom the date fruit.",
  },
  {
    icon: <CupIcon />,
    title: "Smooth &\nearthy",
    body: "Rich, full-bodied\nand naturally smooth.",
  },
  {
    icon: <JarIcon />,
    title: "Small-batch\nroasted",
    body: "Roasted in small batches\nfor depth and quality.",
  },
];

export function Features() {
  return (
    <section
      className="bal-features"
      style={{
        background: "var(--cream-2)",
        padding: "44px 56px",
        borderTop: "1px solid var(--line-soft)",
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      <div
        className="bal-features-grid"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32,
        }}
      >
        {features.map((f, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 18,
              alignItems: "start",
            }}
          >
            <div style={{ paddingTop: 2 }}>{f.icon}</div>
            <div>
              <p
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  fontWeight: 500,
                  whiteSpace: "pre-line",
                  lineHeight: 1.5,
                }}
              >
                {f.title}
              </p>
              <p
                style={{
                  marginTop: 8,
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "var(--ink-2)",
                  whiteSpace: "pre-line",
                }}
              >
                {f.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
