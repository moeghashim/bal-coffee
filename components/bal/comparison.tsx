export function Comparison() {
  return (
    <section
      style={{
        padding: "120px 48px",
        background: "var(--ink)",
        color: "var(--cream)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.5,
          }}
        >
          § III — A Comparison
        </span>
        <span
          className="mono"
          style={{ fontSize: 11, letterSpacing: "0.22em", opacity: 0.5 }}
        >
          measured in milligrams
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          marginTop: 80,
          background: "rgba(244,239,230,0.15)",
        }}
      >
        <div
          style={{
            background: "var(--ink)",
            padding: "60px 48px",
            position: "relative",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            Ordinary coffee
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginTop: 16,
            }}
          >
            <span
              className="serif"
              style={{
                fontSize: 160,
                lineHeight: 1,
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              95
            </span>
            <span
              className="mono"
              style={{ fontSize: 14, letterSpacing: "0.1em", opacity: 0.6 }}
            >
              mg/cup
            </span>
          </div>
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.7,
              maxWidth: 380,
            }}
          >
            Roughly the amount needed to accelerate a human heart for six hours,
            and to negotiate with sleep for another four.
          </p>
        </div>
        <div
          style={{
            background: "var(--ink)",
            padding: "60px 48px",
            position: "relative",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--terra)",
            }}
          >
            Bal
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginTop: 16,
            }}
          >
            <span
              className="serif"
              style={{
                fontSize: 160,
                lineHeight: 1,
                fontWeight: 300,
                fontStyle: "italic",
                color: "var(--terra)",
              }}
            >
              0
            </span>
            <span
              className="mono"
              style={{ fontSize: 14, letterSpacing: "0.1em", opacity: 0.6 }}
            >
              mg/cup
            </span>
          </div>
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.7,
              maxWidth: 380,
            }}
          >
            Not decaffeinated. Not reduced. Not filtered. Simply a plant that
            never made the molecule in the first place.
          </p>
          <span
            style={{
              position: "absolute",
              top: 60,
              right: 48,
              padding: "4px 10px",
              border: "1px solid var(--terra)",
              fontFamily: "var(--font-plex-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--terra)",
            }}
          >
            by nature
          </span>
        </div>
      </div>

      <p
        className="serif"
        style={{
          marginTop: 80,
          textAlign: "center",
          fontSize: "clamp(22px, 2.6vw, 32px)",
          fontStyle: "italic",
          fontWeight: 300,
          lineHeight: 1.4,
          maxWidth: 720,
          marginLeft: "auto",
          marginRight: "auto",
          opacity: 0.92,
        }}
      >
        &ldquo;We didn&rsquo;t remove caffeine.
        <br />
        We just grew something that doesn&rsquo;t make it.&rdquo;
      </p>
    </section>
  );
}
