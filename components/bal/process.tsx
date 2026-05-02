const iconStroke = "#cdb892";

function StepSeed() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke={iconStroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <ellipse cx="22" cy="34" rx="9" ry="14" transform="rotate(-25 22 34)" />
      <ellipse cx="40" cy="30" rx="9" ry="14" transform="rotate(20 40 30)" />
      <path d="M22 22 L 22 48" transform="rotate(-25 22 34)" />
      <path d="M40 18 L 40 44" transform="rotate(20 40 30)" />
    </svg>
  );
}

function StepRoast() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke={iconStroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 36 L 50 36" />
      <path d="M14 36 C 14 32, 18 30, 22 30 L 42 30 C 46 30, 50 32, 50 36" />
      <path d="M16 28 L 16 22" />
      <path d="M22 26 L 22 18" />
      <path d="M28 28 L 28 20" />
      <path d="M34 26 L 34 18" />
      <path d="M40 28 L 40 22" />
      <path d="M46 26 L 46 20" />
      <path d="M10 36 L 10 44 L 54 44 L 54 36" />
      <circle cx="32" cy="50" r="2" />
      <circle cx="22" cy="52" r="1.5" />
      <circle cx="42" cy="52" r="1.5" />
    </svg>
  );
}

function StepGrind() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke={iconStroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 14 H 42 L 40 26 H 24 Z" />
      <path d="M24 26 H 40 V 44 H 24 Z" />
      <path d="M22 44 H 42 L 44 50 H 20 Z" />
      <path d="M28 32 H 36" />
      <path d="M28 38 H 36" />
      <path d="M32 14 V 8" />
      <circle cx="32" cy="6" r="2.5" />
    </svg>
  );
}

function StepBrew() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke={iconStroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 28 H 44 V 42 A 6 6 0 0 1 38 48 H 20 A 6 6 0 0 1 14 42 Z" />
      <path d="M44 32 H 50 A 4 4 0 0 1 50 42 H 44" />
      <path d="M22 22 C 22 18, 26 18, 26 22 C 26 26, 22 26, 22 30" />
      <path d="M30 20 C 30 16, 34 16, 34 20 C 34 24, 30 24, 30 28" />
      <path d="M38 22 C 38 18, 42 18, 42 22 C 42 26, 38 26, 38 30" />
    </svg>
  );
}

function BotanicalRight() {
  return (
    <svg
      width="180"
      height="200"
      viewBox="0 0 180 200"
      fill="none"
      stroke="#cdb892"
      strokeWidth="1"
      strokeLinecap="round"
      className="bal-process-botanical"
      style={{
        position: "absolute",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        opacity: 0.45,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <path d="M40 180 C 60 130, 90 80, 140 30" />
      <ellipse cx="60" cy="150" rx="14" ry="5" transform="rotate(-30 60 150)" />
      <ellipse cx="80" cy="120" rx="16" ry="5" transform="rotate(-20 80 120)" />
      <ellipse cx="100" cy="90" rx="16" ry="5" transform="rotate(-15 100 90)" />
      <ellipse cx="120" cy="60" rx="14" ry="5" transform="rotate(-10 120 60)" />
      <ellipse cx="140" cy="30" rx="12" ry="4" transform="rotate(-5 140 30)" />
      <path d="M50 165 C 70 165, 80 170, 90 178" />
    </svg>
  );
}

const steps = [
  {
    num: "1",
    title: "Seed",
    icon: <StepSeed />,
    body: "We start with date seeds,\na natural byproduct with\nincredible potential.",
  },
  {
    num: "2",
    title: "Roast",
    icon: <StepRoast />,
    body: "Slow-roasted to unlock\ndeep, toasty notes and\nsmooth complexity.",
  },
  {
    num: "3",
    title: "Grind",
    icon: <StepGrind />,
    body: "Milled to perfection for\nthe brew method\nyou love.",
  },
  {
    num: "4",
    title: "Brew",
    icon: <StepBrew />,
    body: "Brew your moment.\nSavor warmth, clarity,\nand connection.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="bal-process"
      style={{
        position: "relative",
        background: "var(--olive)",
        color: "#e8e0c8",
        padding: "70px 56px",
        overflow: "hidden",
      }}
    >
      <BotanicalRight />
      <div
        className="bal-process-grid"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.9fr 1px repeat(4, 1fr)",
          gap: 28,
          alignItems: "start",
          position: "relative",
        }}
      >
        <div>
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#bdb08a",
            }}
          >
            The ritual
          </p>
          <h2
            className="serif"
            style={{
              marginTop: 14,
              fontSize: "clamp(32px, 3vw, 44px)",
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "#f1eacf",
            }}
          >
            From seed
            <br />
            to sacred
          </h2>
        </div>
        <div
          className="bal-process-divider"
          style={{
            width: 1,
            height: "100%",
            background: "rgba(255,255,255,0.18)",
          }}
        />
        {steps.map((s) => (
          <div key={s.num}>
            <div style={{ marginBottom: 14 }}>{s.icon}</div>
            <h3
              className="serif"
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "#f1eacf",
                marginBottom: 10,
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 14,
                  marginRight: 8,
                  color: "#bdb08a",
                  letterSpacing: "0.04em",
                }}
              >
                {s.num}.
              </span>
              {s.title}
            </h3>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "#cfc6a8",
                whiteSpace: "pre-line",
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
