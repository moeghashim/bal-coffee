"use client";

import { useState } from "react";

export function Product() {
  const [qty, setQty] = useState(1);
  const [grind, setGrind] = useState("Whole seed");
  const [plan, setPlan] = useState<"once" | "monthly">("once");

  return (
    <section
      id="product"
      style={{ padding: "140px 48px 60px", background: "var(--cream-2)" }}
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
          § VII — The Lot
        </span>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(32px,4vw,56px)",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          Acquire a bag.
        </h2>
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "var(--ink-2)",
          }}
        >
          lot 04 / 2026 · limited
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 60,
        }}
      >
        <div>
          <div
            style={{
              aspectRatio: "4/5",
              background: "var(--cream)",
              border: "1px solid var(--line)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent 0 40px, rgba(42,31,23,0.03) 40px 41px)",
              }}
            />
            <div
              style={{
                position: "relative",
                width: "58%",
                aspectRatio: "0.7/1",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--ink)",
                  borderTopLeftRadius: "6px",
                  borderTopRightRadius: "6px",
                  boxShadow:
                    "inset -12px -30px 60px rgba(0,0,0,0.3), 20px 40px 80px rgba(42,31,23,0.25)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 28,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
                    borderBottom: "1px solid rgba(244,239,230,0.1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    textAlign: "center",
                    color: "var(--cream)",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.3em",
                      opacity: 0.5,
                      marginBottom: 10,
                    }}
                  >
                    BAL · NO.01
                  </div>
                  <div
                    className="serif"
                    style={{
                      fontSize: 40,
                      fontStyle: "italic",
                      fontWeight: 300,
                      lineHeight: 1,
                    }}
                  >
                    A
                    <br />
                    seed
                    <br />
                    <span style={{ color: "var(--terra)" }}>coffee.</span>
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.25em",
                      opacity: 0.4,
                      marginTop: 24,
                    }}
                  >
                    250g · medium roast · naturally 0mg
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                padding: "4px 10px",
                border: "1px solid var(--ink)",
                fontFamily: "var(--font-plex-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              spec. / bag 01
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "flex-end",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: "var(--ink-2)",
                }}
              >
                photographed
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: "var(--ink-2)",
                }}
              >
                Marín Studio, 2026
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 8,
              marginTop: 12,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  border: "1px solid var(--line)",
                  background:
                    i === 0 ? "var(--cream)" : "rgba(42,31,23,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: "var(--ink-2)",
                  }}
                >
                  {["bag", "seed", "brew", "lot"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            A seed coffee · medium roast
          </span>
          <h3
            className="serif"
            style={{
              fontSize: "clamp(44px, 5vw, 64px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.02,
              marginTop: 8,
              marginBottom: 24,
            }}
          >
            Bal, No. 01.
          </h3>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--ink-2)",
              maxWidth: 500,
              marginBottom: 32,
            }}
          >
            A naturally caffeine-free coffee, made from a single native seed.
            250g. Hand-roasted in small lots. Whole or ground to order.
          </p>

          <div style={{ border: "1px solid var(--line)", marginBottom: 32 }}>
            {(
              [
                ["Flavor", "Cocoa · walnut · dried fig"],
                ["Acidity", "Low — 2/7"],
                ["Body", "Full — 6/7"],
                ["Caffeine", "None. Never was."],
                ["Origin", "Single farm, single seed."],
              ] as const
            ).map(([k, v], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderBottom: i < 4 ? "1px solid var(--line)" : "none",
                  fontFamily: "var(--font-plex-mono)",
                  fontSize: 12,
                  letterSpacing: "0.04em",
                }}
              >
                <span
                  style={{
                    color: "var(--ink-2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    fontSize: 10,
                  }}
                >
                  {k}
                </span>
                <span style={{ color: "var(--ink)" }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 28 }}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
                marginBottom: 12,
              }}
            >
              Grind
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Whole seed", "Coarse", "Medium", "Fine", "Espresso"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrind(g)}
                  style={{
                    padding: "10px 16px",
                    border: "1px solid",
                    borderColor: grind === g ? "var(--ink)" : "var(--line)",
                    background: grind === g ? "var(--ink)" : "transparent",
                    color: grind === g ? "var(--cream)" : "var(--ink)",
                    fontFamily: "var(--font-fraunces)",
                    fontSize: 15,
                    fontStyle: grind === g ? "italic" : "normal",
                    borderRadius: 999,
                    transition: "all .2s",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
                marginBottom: 12,
              }}
            >
              Frequency
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                background: "var(--line)",
                border: "1px solid var(--line)",
              }}
            >
              <button
                onClick={() => setPlan("once")}
                style={{
                  padding: "20px",
                  background: plan === "once" ? "var(--ink)" : "var(--cream)",
                  color: plan === "once" ? "var(--cream)" : "var(--ink)",
                  textAlign: "left",
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                    marginBottom: 6,
                  }}
                >
                  Once
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 24,
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  $28
                </div>
              </button>
              <button
                onClick={() => setPlan("monthly")}
                style={{
                  padding: "20px",
                  background:
                    plan === "monthly" ? "var(--ink)" : "var(--cream)",
                  color: plan === "monthly" ? "var(--cream)" : "var(--ink)",
                  textAlign: "left",
                  position: "relative",
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                    marginBottom: 6,
                  }}
                >
                  Every month
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 24,
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  $24{" "}
                  <span style={{ fontSize: 12, opacity: 0.6 }}>/bag</span>
                </div>
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    padding: "2px 8px",
                    background: "var(--terra)",
                    color: "var(--cream)",
                    fontFamily: "var(--font-plex-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  save 14%
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid var(--ink)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ padding: "14px 18px", fontSize: 16 }}
              >
                −
              </button>
              <span
                className="mono"
                style={{
                  padding: "0 14px",
                  fontSize: 14,
                  minWidth: 24,
                  textAlign: "center",
                }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{ padding: "14px 18px", fontSize: 16 }}
              >
                +
              </button>
            </div>
            <button
              style={{
                flex: 1,
                background: "var(--ink)",
                color: "var(--cream)",
                fontFamily: "var(--font-plex-mono)",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <span>Acquire · ${(plan === "monthly" ? 24 : 28) * qty}</span>
              <span style={{ fontSize: 16 }}>→</span>
            </button>
          </div>

          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "var(--ink-2)",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Ships within 48 hrs · Carbon-neutral · Returns accepted in
            perpetuity
          </p>
        </div>
      </div>
    </section>
  );
}
