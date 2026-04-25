"use client";

import { useEffect, useState } from "react";

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const a = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function describeArc(
  x: number,
  y: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, r, endAngle);
  const end = polarToCartesian(x, y, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function Ritual() {
  const [time, setTime] = useState(22);
  useEffect(() => {
    const id = setInterval(() => {
      setTime((t) => (t >= 24 ? 20 : t + 0.05));
    }, 80);
    return () => clearInterval(id);
  }, []);
  const hh = Math.floor(time);
  const mm = Math.floor((time - hh) * 60);

  return (
    <section style={{ padding: "140px 48px", position: "relative" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div>
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--terra-deep)",
            }}
          >
            § V — An invitation
          </span>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1,
              marginTop: 16,
            }}
          >
            A coffee
            <br />
            for the hour
            <br />
            <span style={{ color: "var(--terra)" }}>after the last one.</span>
          </h2>
          <p
            style={{
              marginTop: 32,
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--ink-2)",
              maxWidth: 480,
            }}
          >
            The world is full of coffees that wake you up. This is a coffee for
            when you&rsquo;d rather not be woken. Drink it late. Drink it black.
            Drink it with someone.
          </p>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              "after dinner",
              "before bed",
              "during a book",
              "at 2am",
              "on a Sunday",
              "instead of wine",
            ].map((t) => (
              <span
                key={t}
                style={{
                  padding: "8px 16px",
                  border: "1px solid var(--ink)",
                  borderRadius: 999,
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 14,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            aspectRatio: "1",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          <svg viewBox="-100 -100 200 200" width="100%" height="100%">
            <defs>
              <radialGradient id="nightSky" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#2A1F17" />
                <stop offset="1" stopColor="#1A130D" />
              </radialGradient>
            </defs>
            <circle cx="0" cy="0" r="92" fill="url(#nightSky)" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
              const x1 = Math.cos(a) * 80,
                y1 = Math.sin(a) * 80;
              const x2 = Math.cos(a) * (i % 6 === 0 ? 70 : 76),
                y2 = Math.sin(a) * (i % 6 === 0 ? 70 : 76);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#F4EFE6"
                  strokeWidth={i % 6 === 0 ? 1 : 0.4}
                  opacity="0.6"
                />
              );
            })}
            {[0, 6, 12, 18].map((h) => {
              const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
              return (
                <text
                  key={h}
                  x={Math.cos(a) * 58}
                  y={Math.sin(a) * 58 + 4}
                  fontFamily="var(--font-plex-mono)"
                  fontSize="7"
                  fill="#F4EFE6"
                  opacity="0.7"
                  textAnchor="middle"
                >
                  {String(h).padStart(2, "0")}
                </text>
              );
            })}
            <path
              d={describeArc(
                0,
                0,
                88,
                (18 / 24) * 360 - 90,
                (23.99 / 24) * 360 - 90,
              )}
              fill="none"
              stroke="#B8653A"
              strokeWidth="2.5"
              opacity="0.9"
              strokeLinecap="round"
            />
            {(() => {
              const a = (time / 24) * Math.PI * 2 - Math.PI / 2;
              return (
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos(a) * 55}
                  y2={Math.sin(a) * 55}
                  stroke="#F4EFE6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              );
            })()}
            <circle cx="0" cy="0" r="3" fill="#B8653A" />
            <circle
              cx="0"
              cy="0"
              r="8"
              fill="none"
              stroke="#B8653A"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
              }}
            >
              now · {String(hh).padStart(2, "0")}:
              {String(mm).padStart(2, "0")} · still safe to brew
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
