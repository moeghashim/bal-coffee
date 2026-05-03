"use client";

import { useEffect, useState } from "react";

function Logo() {
  return (
    <a
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "var(--ink)",
      }}
      aria-label="BAL Coffee — home"
    >
      <span
        className="serif"
        style={{
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        BAL
      </span>
      <span
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
          marginTop: 6,
        }}
      >
        coffee
      </span>
    </a>
  );
}

function CartIcon() {
  return (
    <a
      href="/cart"
      aria-label="View cart"
      style={{
        position: "relative",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink)",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 7h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7z" />
        <path d="M9 7V5.5A3 3 0 0 1 12 2.5 3 3 0 0 1 15 5.5V7" />
      </svg>
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#shop", label: "Shop" },
    { href: "/#about", label: "About" },
    { href: "/#process", label: "Process" },
    { href: "/#journal", label: "Journal" },
    { href: "/#subscription", label: "Subscription" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: scrolled ? "14px 56px" : "22px 56px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        transition: "all .25s ease",
        background: scrolled ? "rgba(244,239,230,0.92)" : "var(--cream)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--line-soft)"
          : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Logo />
      </div>
      <div
        style={{
          display: "flex",
          gap: 36,
          fontSize: 14,
          color: "var(--ink-2)",
        }}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              transition: "color .2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--terra-deep)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-2)")}
          >
            {l.label}
          </a>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <CartIcon />
      </div>
    </nav>
  );
}
