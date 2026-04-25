export function Manifesto() {
  const tenets = [
    "Naturally caffeine-free",
    "Drink it at midnight",
    "Made from a seed",
    "Zero milligrams",
    "Full body · full silence",
    "Brew it slow",
    "Sleep, undisturbed",
  ];

  return (
    <section
      style={{
        padding: "28px 0",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--cream-2)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          animation: "marquee 40s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {[...Array(3)].flatMap((_, i) =>
          tenets.map((t, j) => (
            <span
              key={`${i}-${j}`}
              className="serif"
              style={{
                fontSize: 28,
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--ink)",
                display: "flex",
                alignItems: "center",
                gap: 48,
              }}
            >
              {t}
              <span style={{ fontSize: 12, color: "var(--terra)" }}>❋</span>
            </span>
          )),
        )}
      </div>
    </section>
  );
}
