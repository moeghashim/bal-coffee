export function Founder() {
  return (
    <section
      id="founder"
      style={{
        padding: "140px 48px",
        background: "var(--cream)",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          § VI — The Maker
        </span>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(32px,4vw,56px)",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          A hand behind the seed.
        </h2>
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "var(--ink-2)",
          }}
        >
          portrait · est. 2021
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              aspectRatio: "4/5",
              position: "relative",
              border: "1px solid var(--line)",
              background: "var(--cream-2)",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/founder.png"
              alt="Judy Ghashim, founder of Bal Coffee"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "contrast(1.02) saturate(0.92)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(42,31,23,0.08) 0%, rgba(42,31,23,0) 40%, rgba(42,31,23,0.55) 100%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                color: "var(--cream)",
              }}
            >
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    opacity: 0.8,
                    marginBottom: 4,
                  }}
                >
                  PLATE I.
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 20,
                    fontStyle: "italic",
                    fontWeight: 300,
                  }}
                >
                  Judy Ghashim
                </div>
              </div>
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  opacity: 0.8,
                }}
              >
                the roastery · morning
              </span>
            </div>

            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                padding: "4px 10px",
                border: "1px solid var(--cream)",
                fontFamily: "var(--font-plex-mono)",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--cream)",
                background: "rgba(42,31,23,0.4)",
                backdropFilter: "blur(4px)",
              }}
            >
              founder · roaster
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.35)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
              }}
            >
              Signed, the roaster —
            </div>
            <div
              className="serif"
              style={{
                fontSize: 28,
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--terra-deep)",
                transform: "rotate(-4deg)",
                letterSpacing: "-0.02em",
              }}
            >
              J. Ghashim
            </div>
          </div>
        </div>

        <div>
          <span
            className="serif"
            style={{
              display: "block",
              fontSize: "clamp(32px, 3.4vw, 44px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.15,
              color: "var(--ink)",
              marginBottom: 28,
            }}
          >
            &ldquo;I wanted the ritual of coffee
            <br />
            without losing the night that
            <br />
            came after it.&rdquo;
          </span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 28,
              alignItems: "start",
            }}
          >
            <span
              className="serif"
              style={{
                fontSize: 56,
                lineHeight: 0.9,
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--terra)",
              }}
            >
              J
            </span>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.75,
                color: "var(--ink-2)",
              }}
            >
              udy Ghashim grew up between two coffee cultures — the long,
              patient cardamom-laced brews of home, and the sharp, hurried
              espressos of the city she moved to. Both left her awake. Neither
              left her rested.
            </p>
          </div>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: "var(--ink-2)",
              marginTop: 24,
              maxWidth: 560,
            }}
          >
            She started reading, then asking, then traveling. She learned about
            a seed — not a bean — that had been roasted and brewed for centuries
            in her own grandmother&rsquo;s village. A coffee that never held
            caffeine to begin with. Judy roasted her first small lot in a
            borrowed drum in the autumn of 2021.
          </p>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: "var(--ink-2)",
              marginTop: 20,
              maxWidth: 560,
            }}
          >
            Bal is what came out of that drum. A coffee without the coffee.
            Still made, still slow, still in small lots — now shared past the
            farm gate, into cups that prefer to sleep.
          </p>

          <div
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 0,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.35)",
            }}
          >
            {(
              [
                ["Roasting since", "2014"],
                ["Bal founded", "October 2021"],
                ["Lots to date", "27 · small"],
              ] as const
            ).map(([k, v], i) => (
              <div
                key={i}
                style={{
                  padding: "20px 22px",
                  borderRight: i < 2 ? "1px solid var(--line)" : "none",
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--ink-2)",
                    marginBottom: 8,
                  }}
                >
                  {k}
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 24,
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--ink)",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
