"use client";

import { useEffect, useState } from "react";
import { useCart } from "lib/commerce/cart-client";

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

function CartIcon({ count = 0 }: { count?: number }) {
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
      {count > 0 ? (
        <span
          aria-label={`${count} items in cart`}
          style={{
            position: "absolute",
            top: 1,
            right: 0,
            display: "inline-flex",
            minWidth: 17,
            height: 17,
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            borderRadius: 999,
            background: "#32180d",
            color: "#fff4e8",
            fontSize: 10,
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </a>
  );
}

function SearchIcon() {
  return (
    <a
      href="/products"
      aria-label="Search products"
      style={{
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
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5 L21 21" />
      </svg>
    </a>
  );
}

export function Nav() {
  const cartCount = useCart((state) => state.data.totalQuantity);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/products", label: "Shop" },
    { href: "/#about", label: "About" },
    { href: "/#process", label: "Process" },
    { href: "/#journal", label: "Journal" },
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
        className={`bal-nav-links ${mobileOpen ? "bal-nav-links-open" : ""}`}
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
        className="bal-nav-cart"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <button
          type="button"
          className="bal-nav-mobile-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <path d="M6 6 L18 18" />
                <path d="M18 6 L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7 H20" />
                <path d="M4 12 H20" />
                <path d="M4 17 H20" />
              </>
            )}
          </svg>
        </button>
        <SearchIcon />
        <CartIcon count={cartCount} />
      </div>
    </nav>
  );
}
