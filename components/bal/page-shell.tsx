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
        className="bal-page-shell"
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "64px 56px 120px",
        }}
      >
        <div
          className="label-panel label-shadow bal-page-shell-card"
          style={{ padding: "52px 56px 56px" }}
        >
          {eyebrow && <p className="label-kicker">{eyebrow}</p>}
          <h1
            className="label-title"
            style={{
              marginTop: 14,
              fontSize: "clamp(38px, 5vw, 60px)",
              lineHeight: 0.98,
            }}
          >
            {title}
          </h1>
          {intro && (
            <p
              style={{
                marginTop: 22,
                fontSize: 17,
                lineHeight: 1.65,
                color: "var(--ink-2)",
              }}
            >
              {intro}
            </p>
          )}
          {children && (
            <div
              style={{
                marginTop: 32,
                paddingTop: 8,
                borderTop: "2px dashed rgba(42,31,23,0.3)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--ink-2)",
              }}
            >
              {children}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
