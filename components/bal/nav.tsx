"use client";

import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "14px 48px" : "24px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all .3s ease",
        background: scrolled ? "rgba(244,239,230,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--line-soft)"
          : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--cream)",
            fontFamily: "var(--font-fraunces)",
            fontSize: 15,
            fontStyle: "italic",
            fontWeight: 500,
            paddingBottom: 2,
          }}
        >
          b
        </div>
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Bal Coffee
        </span>
      </div>
      <div
        className="mono"
        style={{
          display: "flex",
          gap: 40,
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <a href="#story">The Seed</a>
        <a href="#ritual">The Ritual</a>
        <a href="#product">Acquire</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span
          className="mono"
          style={{ fontSize: 11, letterSpacing: "0.14em" }}
        >
          EN · USD
        </span>
        <button
          style={{
            padding: "8px 16px",
            border: "1px solid var(--ink)",
            borderRadius: 999,
            fontFamily: "var(--font-plex-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            background: "transparent",
            color: "var(--ink)",
          }}
        >
          Cart · 0
        </button>
      </div>
    </nav>
  );
}
