"use client";

import CartModal from "components/cart/modal";
import Link from "next/link";
import { useEffect, useState } from "react";

function Logo() {
  return (
    <Link
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
    </Link>
  );
}

function CartIconVisual({ count }: { count: number }) {
  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        width: 36,
        height: 36,
        display: "inline-flex",
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
      {count > 0 && (
        <span
          className="mono"
          style={{
            position: "absolute",
            top: 2,
            right: 0,
            minWidth: 16,
            height: 16,
            borderRadius: 999,
            background: "var(--terra)",
            color: "var(--cream)",
            fontSize: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            fontWeight: 500,
          }}
        >
          {count}
        </span>
      )}
    </span>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6 L 18 18" />
          <path d="M18 6 L 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/search", label: "Shop" },
    { href: "/#about", label: "About" },
    { href: "/#process", label: "Process" },
    { href: "/journal", label: "Journal" },
    { href: "/#subscription", label: "Subscription" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav
      className="bal-nav"
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
        className={`bal-nav-links${menuOpen ? " bal-nav-links-open" : ""}`}
        style={{
          display: "flex",
          gap: 36,
          fontSize: 14,
          color: "var(--ink-2)",
        }}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            style={{
              transition: "color .2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--terra-deep)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-2)")}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div
        className="bal-nav-cart"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        <CartModal
          renderTrigger={(count) => <CartIconVisual count={count} />}
        />
        <button
          type="button"
          className="bal-nav-mobile-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>
    </nav>
  );
}
