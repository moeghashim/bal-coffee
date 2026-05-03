const benefits = [
  {
    title: "Naturally Caffeine-Free",
    body: "Gentle on you, any time of day.",
    icon: "leaf",
  },
  {
    title: "Roasted Date Seeds",
    body: "Upcycled goodness, roasted with care.",
    icon: "seed",
  },
  {
    title: "Prebiotic-Rich",
    body: "Good for your gut, good for you.",
    icon: "gut",
  },
  {
    title: "Sustainable by Nature",
    body: "Better for you, better for the planet.",
    icon: "earth",
  },
];

function BenefitIcon({ icon }: { icon: string }) {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      stroke="#77783a"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="27" cy="27" r="25" />
      {icon === "leaf" ? (
        <>
          <path d="M15 35 C 18 24, 28 17, 39 16 C 37 29, 28 36, 16 36 Z" />
          <path d="M16 36 L 34 20" />
        </>
      ) : null}
      {icon === "seed" ? (
        <>
          <ellipse
            cx="27"
            cy="27"
            rx="10"
            ry="16"
            transform="rotate(40 27 27)"
          />
          <path d="M20 34 C 25 26, 30 22, 36 20" />
        </>
      ) : null}
      {icon === "gut" ? (
        <>
          <path d="M24 14 V 23 C 24 27 18 27 18 33 C 18 39 28 40 28 32 V 20" />
          <path d="M32 15 V 25 C 32 29 38 29 38 35 C 38 41 28 42 28 32" />
        </>
      ) : null}
      {icon === "earth" ? (
        <>
          <circle cx="27" cy="27" r="14" />
          <path d="M15 28 H39" />
          <path d="M27 13 C 21 20 21 34 27 41" />
          <path d="M27 13 C 33 20 33 34 27 41" />
        </>
      ) : null}
    </svg>
  );
}

export function BenefitsStrip() {
  return (
    <div
      style={{
        maxWidth: 1180,
        margin: "28px auto 0",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        border: "1px solid rgba(77,56,36,0.18)",
        borderRadius: 14,
        background: "rgba(253,247,236,0.78)",
        overflow: "hidden",
      }}
    >
      {benefits.map((benefit, index) => (
        <div
          key={benefit.title}
          style={{
            display: "grid",
            gridTemplateColumns: "64px 1fr",
            gap: 14,
            alignItems: "center",
            padding: "20px 26px",
            borderLeft: index === 0 ? "none" : "1px solid rgba(77,56,36,0.18)",
          }}
        >
          <BenefitIcon icon={benefit.icon} />
          <div>
            <p
              className="serif"
              style={{ fontSize: 18, lineHeight: 1.1, color: "var(--ink)" }}
            >
              {benefit.title}
            </p>
            <p
              style={{
                marginTop: 5,
                fontSize: 13,
                lineHeight: 1.35,
                color: "var(--ink-2)",
              }}
            >
              {benefit.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
