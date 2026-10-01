import { ReactNode } from "react";
import { Footer } from "./footer";
import { Grain } from "./grain";
import { Nav } from "./nav";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "80px 56px 120px",
        }}
      >
        {eyebrow && (
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="serif"
          style={{
            marginTop: 14,
            fontSize: "clamp(36px, 4.4vw, 56px)",
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
          }}
        >
          {title}
        </h1>
        {intro && (
          <p
            style={{
              marginTop: 24,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--ink-2)",
            }}
          >
            {intro}
          </p>
        )}
        {children && (
          <div
            style={{
              marginTop: 40,
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--ink-2)",
            }}
          >
            {children}
          </div>
        )}
      </main>
      <Footer />
      <Grain />
    </>
  );
}
