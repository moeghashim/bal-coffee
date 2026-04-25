"use client";

import { useState } from "react";
import { Seed } from "./seed";

const roasts = [
  {
    min: 0,
    max: 0.2,
    name: "Raw",
    label: "I — green",
    body: "The seed, as the field left it. Grassy. Pale. Uninterested in your morning.",
  },
  {
    min: 0.2,
    max: 0.4,
    name: "Light",
    label: "II — light",
    body: "A first kiss of heat. Hay, honey, a whisper of spice. The seed begins to remember it will be coffee.",
  },
  {
    min: 0.4,
    max: 0.6,
    name: "Medium",
    label: "III — medium",
    body: "Our house roast. Cocoa, walnut, the smell of a wool sweater in a library. Bal, at rest.",
  },
  {
    min: 0.6,
    max: 0.8,
    name: "Dark",
    label: "IV — dark",
    body: "Past the second crack. Bitter chocolate, dried fig. For those who want coffee to taste like coffee.",
  },
  {
    min: 0.8,
    max: 1.01,
    name: "Ember",
    label: "V — ember",
    body: "Almost carbon. Molasses and smoke. We make fewer of these. We make them on purpose.",
  },
];

export function RoastSlider() {
  const [v, setV] = useState(0.45);
  const current = roasts.find((r) => v >= r.min && v < r.max) || roasts[2]!;

  return (
    <section
      id="ritual"
      style={{
        padding: "140px 48px",
        background: "var(--cream-2)",
        position: "relative",
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
          § IV — Choose your roast
        </span>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(32px,4vw,56px)",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          Drag, slowly.
        </h2>
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "var(--ink-2)",
          }}
        >
          five stages of fire
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 520,
            position: "relative",
          }}
        >
          <svg
            viewBox="0 0 400 480"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              opacity: 0.25,
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 60}
                x2="400"
                y2={i * 60}
                stroke="var(--ink-2)"
                strokeWidth="0.5"
                strokeDasharray="2 4"
              />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 66}
                y1="0"
                x2={i * 66}
                y2="480"
                stroke="var(--ink-2)"
                strokeWidth="0.5"
                strokeDasharray="2 4"
              />
            ))}
          </svg>
          <Seed size={380} roast={v} />
          <span
            className="mono"
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            spec. A — {Math.round(v * 100)}% roasted
          </span>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--terra-deep)",
              }}
            >
              {current.label}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>
          <h3
            className="serif"
            style={{
              fontSize: "clamp(56px, 7vw, 96px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1,
              color: "var(--ink)",
            }}
          >
            {current.name}.
          </h3>
          <p
            style={{
              marginTop: 28,
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--ink-2)",
              maxWidth: 480,
              minHeight: 108,
            }}
          >
            {current.body}
          </p>

          <div style={{ marginTop: 48 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
                fontFamily: "var(--font-plex-mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
              }}
            >
              {roasts.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setV(r.min + (r.max - r.min) / 2)}
                  style={{
                    color:
                      current === r ? "var(--terra-deep)" : "var(--ink-2)",
                    fontWeight: current === r ? 500 : 400,
                    transition: "color .3s",
                  }}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <div
              style={{
                position: "relative",
                height: 44,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 4,
                  background:
                    "linear-gradient(to right, #C4BE8C, #B48248, #8F5230, #5A3020, #2A1A10)",
                  borderRadius: 2,
                }}
              />
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <div
                  key={t}
                  style={{
                    position: "absolute",
                    left: `${t * 100}%`,
                    transform: "translateX(-50%)",
                    width: 1,
                    height: 12,
                    background: "var(--ink)",
                    opacity: 0.4,
                  }}
                />
              ))}
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={v}
                onChange={(e) => setV(parseFloat(e.target.value))}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  opacity: 0,
                  cursor: "grab",
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${v * 100}%`,
                  transform: "translateX(-50%)",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2px solid var(--ink)",
                  background: "var(--cream)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  boxShadow: "0 4px 12px rgba(42,31,23,0.2)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "var(--ink)",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 48,
              padding: "24px 28px",
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.4)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--ink-2)",
                  marginBottom: 4,
                }}
              >
                Selected lot
              </div>
              <div
                className="serif"
                style={{
                  fontSize: 22,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                250g · {current.name} roast
              </div>
            </div>
            <button
              style={{
                padding: "12px 28px",
                background: "var(--ink)",
                color: "var(--cream)",
                fontFamily: "var(--font-plex-mono)",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                borderRadius: 999,
              }}
            >
              Add to cart · $28
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
