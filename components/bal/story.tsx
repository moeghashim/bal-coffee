function StoryIcon({ step }: { step: number }) {
  const common = {
    width: 90,
    height: 90,
    viewBox: "-50 -50 100 100",
  } as const;

  if (step === 0) {
    return (
      <svg {...common}>
        <ellipse cx="0" cy="0" rx="22" ry="32" fill="var(--ink-2)" />
        <path
          d="M 0,-32 C 4,-12 -4,12 2,32"
          stroke="var(--cream)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    );
  }
  if (step === 1) {
    return (
      <svg {...common}>
        <ellipse cx="0" cy="0" rx="22" ry="32" fill="var(--ink)" />
        <path
          d="M 0,-32 C 4,-12 -4,12 2,32"
          stroke="var(--cream)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M -40,20 Q -30,10 -24,20"
          stroke="var(--terra)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 24,-20 Q 30,-30 40,-20"
          stroke="var(--terra)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      </svg>
    );
  }
  if (step === 2) {
    return (
      <svg {...common}>
        {Array.from({ length: 18 }).map((_, i) => {
          const x = -35 + (i % 6) * 14 + Math.sin(i) * 2;
          const y = -20 + Math.floor(i / 6) * 14 + Math.cos(i) * 2;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.5 + Math.sin(i) * 0.8}
              fill="var(--ink-2)"
            />
          );
        })}
      </svg>
    );
  }
  if (step === 3) {
    return (
      <svg {...common}>
        <path
          d="M -4,-40 Q 2,-20 -2,0 Q 4,20 -2,40"
          stroke="var(--terra-deep)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="0" cy="44" rx="8" ry="1.5" fill="var(--ink-2)" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M -24,-10 L -22,28 Q -22,36 -14,36 L 14,36 Q 22,36 22,28 L 24,-10 Z"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <path
        d="M 22,-2 Q 34,-2 34,10 Q 34,20 22,22"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <path
        d="M -20,-10 L 20,-10"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <ellipse cx="0" cy="-10" rx="20" ry="3" fill="var(--terra-deep)" />
      <path
        d="M -6,-22 Q -2,-18 -4,-14 M 4,-20 Q 8,-16 6,-12"
        stroke="var(--ink-2)"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export function Story() {
  const steps = [
    {
      n: "I",
      title: "The seed",
      body: "A single native seed, sun-dried. Never picked as fruit. Never chemically stripped. It never held caffeine to begin with.",
    },
    {
      n: "II",
      title: "The roast",
      body: "Twenty-three minutes over low flame. We listen for the second crack — then pull one breath sooner. The oils stay inside.",
    },
    {
      n: "III",
      title: "The grind",
      body: "Medium-fine. The crease of the seed opens along a natural seam and releases a deep, chocolate dust.",
    },
    {
      n: "IV",
      title: "The brew",
      body: "94°C water. Four minutes. Still. It pours the color of wet earth after a long rain.",
    },
    {
      n: "V",
      title: "The cup",
      body: "Drink it at 11pm. At 2am. Before the meeting. After the argument. It will not keep you up. It was never going to.",
    },
  ];

  return (
    <section id="story" style={{ padding: "140px 48px 120px", position: "relative" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 80,
          borderBottom: "1px solid var(--line)",
          paddingBottom: 24,
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--terra-deep)",
          }}
        >
          § II — The Process
        </span>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(32px,4vw,56px)",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          From seed, to cup.
        </h2>
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "var(--ink-2)",
          }}
        >
          five movements
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 1,
          background: "var(--line)",
        }}
      >
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              background: "var(--cream)",
              padding: "40px 24px 36px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              minHeight: 380,
              position: "relative",
            }}
          >
            <span
              className="serif"
              style={{
                fontSize: 68,
                lineHeight: 1,
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--terra)",
              }}
            >
              {s.n}
            </span>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 100,
              }}
            >
              <StoryIcon step={i} />
            </div>
            <h3
              className="serif"
              style={{ fontSize: 22, fontWeight: 400, color: "var(--ink)" }}
            >
              {s.title}
            </h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
              {s.body}
            </p>
            <span
              className="mono"
              style={{
                position: "absolute",
                top: 20,
                right: 24,
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "var(--ink-2)",
              }}
            >
              0{i + 1}/05
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
