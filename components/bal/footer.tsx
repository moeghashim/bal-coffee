export function Footer() {
  const cols = [
    { title: "Read", links: ["The story", "The process", "Journal", "Lot log"] },
    {
      title: "Acquire",
      links: ["No. 01 · Medium", "No. 02 · Dark", "Brewing kit", "Gift a bag"],
    },
    { title: "Company", links: ["About", "The farm", "Press", "Contact"] },
  ];

  return (
    <footer
      style={{
        background: "var(--ink)",
        color: "var(--cream)",
        padding: "80px 48px 32px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 60,
          marginBottom: 80,
        }}
      >
        <div>
          <div
            className="serif"
            style={{
              fontSize: 64,
              fontStyle: "italic",
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            Bal.
          </div>
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.7,
              maxWidth: 360,
            }}
          >
            A coffee from a seed. Naturally caffeine-free. Made slowly, in small
            lots, by people who prefer to sleep.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              {col.title}
            </div>
            {col.links.map((l) => (
              <div
                key={l}
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 17,
                  fontStyle: "italic",
                  fontWeight: 400,
                  marginBottom: 8,
                  opacity: 0.85,
                }}
              >
                {l}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 32,
          borderTop: "1px solid rgba(244,239,230,0.15)",
        }}
      >
        <span
          className="mono"
          style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.5 }}
        >
          © Bal. 2026 · The seed was here first.
        </span>
        <span
          className="mono"
          style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.5 }}
        >
          Brewed in N. America · Served worldwide
        </span>
      </div>
    </footer>
  );
}
