"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { Seed } from "./seed";

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const styles: Record<string, CSSProperties> = {
    tl: {
      top: 80,
      left: 40,
      borderTop: "1px solid var(--ink)",
      borderLeft: "1px solid var(--ink)",
    },
    tr: {
      top: 80,
      right: 40,
      borderTop: "1px solid var(--ink)",
      borderRight: "1px solid var(--ink)",
    },
    bl: {
      bottom: 20,
      left: 40,
      borderBottom: "1px solid var(--ink)",
      borderLeft: "1px solid var(--ink)",
    },
    br: {
      bottom: 20,
      right: 40,
      borderBottom: "1px solid var(--ink)",
      borderRight: "1px solid var(--ink)",
    },
  };
  return (
    <div
      style={{ position: "absolute", width: 14, height: 14, ...styles[pos] }}
    />
  );
}

function Callout({
  style,
  num,
  label,
  delay = 0,
}: {
  style?: CSSProperties;
  num: string;
  label: string;
  delay?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: `fadeInUp .8s ${delay}s both`,
        ...style,
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "1px solid var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-fraunces)",
          fontStyle: "italic",
          fontSize: 12,
          color: "var(--ink)",
          background: "var(--cream)",
        }}
      >
        {num}
      </span>
      <span
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        position: "relative",
        paddingTop: 120,
        paddingBottom: 80,
        display: "grid",
        gridTemplateColumns: "1fr",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ink-2)",
          }}
        >
          Vol. 01 · A Field Guide
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "var(--line)",
            margin: "0 24px",
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ink-2)",
          }}
        >
          No. 001 — The Seed
        </span>
      </div>

      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 48px",
          gap: 40,
          position: "relative",
        }}
      >
        <div style={{ textAlign: "right", paddingRight: 20 }}>
          <p
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--terra-deep)",
              marginBottom: 28,
            }}
          >
            ① Not a bean
          </p>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(42px, 6vw, 84px)",
              lineHeight: 0.98,
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--ink)",
            }}
          >
            Coffee,
            <br />
            without
            <br />
            <span style={{ fontStyle: "normal", fontWeight: 400 }}>
              the coffee.
            </span>
          </h1>
          <p
            style={{
              marginTop: 32,
              maxWidth: 320,
              marginLeft: "auto",
              fontSize: 15,
              lineHeight: 1.55,
              color: "var(--ink-2)",
            }}
          >
            A seed. Roasted dark. Ground fine.
            <br />
            Brewed slow. No caffeine, no crash,
            <br />
            no ceremony lost.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            transform: `translate(${mouse.x * -10}px, ${mouse.y * -10}px)`,
            transition: "transform .4s cubic-bezier(.2,.7,.2,1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -60,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                style={{
                  width: i % 4 === 0 ? 18 : 10,
                  height: 1,
                  background: "var(--ink-2)",
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: -82,
              top: "50%",
              transform: "translateY(-50%) rotate(-90deg)",
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
              }}
            >
              12 mm (actual)
            </span>
          </div>

          <Seed size={420} roast={0.55} />

          <Callout
            style={{ top: -10, right: -40 }}
            num="a"
            label="pericarp"
            delay={0.2}
          />
          <Callout
            style={{
              top: "50%",
              right: -40,
              transform: "translateY(-50%)",
            }}
            num="b"
            label="endosperm"
            delay={0.35}
          />
          <Callout
            style={{ bottom: 10, right: -40 }}
            num="c"
            label="embryo"
            delay={0.5}
          />
        </div>

        <div style={{ paddingLeft: 20, maxWidth: 320 }}>
          <p
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--terra-deep)",
              marginBottom: 28,
            }}
          >
            ② The specimen
          </p>
          <div
            style={{
              border: "1px solid var(--line)",
              padding: "20px 22px",
              background: "rgba(255,255,255,0.25)",
            }}
          >
            <table
              className="mono"
              style={{
                width: "100%",
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "var(--ink-2)",
                lineHeight: 1.8,
              }}
            >
              <tbody>
                <tr>
                  <td>Genus</td>
                  <td style={{ textAlign: "right", color: "var(--ink)" }}>
                    Bal.
                  </td>
                </tr>
                <tr>
                  <td>Origin</td>
                  <td style={{ textAlign: "right", color: "var(--ink)" }}>
                    Seed, not bean
                  </td>
                </tr>
                <tr>
                  <td>Caffeine</td>
                  <td style={{ textAlign: "right", color: "var(--ink)" }}>
                    0.00 mg
                  </td>
                </tr>
                <tr>
                  <td>Body</td>
                  <td style={{ textAlign: "right", color: "var(--ink)" }}>
                    Full · earthy
                  </td>
                </tr>
                <tr>
                  <td>Harvest</td>
                  <td style={{ textAlign: "right", color: "var(--ink)" }}>
                    Lot 04 / 2026
                  </td>
                </tr>
                <tr>
                  <td>Roaster</td>
                  <td style={{ textAlign: "right", color: "var(--ink)" }}>
                    J. Ghashim
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p
            className="serif"
            style={{
              marginTop: 22,
              fontSize: 13,
              lineHeight: 1.55,
              color: "var(--ink-2)",
              fontStyle: "italic",
            }}
          >
            &ldquo;Read it slowly. It&rsquo;s older than espresso.&rdquo;
          </p>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--ink-2)",
          }}
        >
          Continue
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: "var(--ink-2)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
