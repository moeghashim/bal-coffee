"use client";

import { useEffect, useState } from "react";
import { useCart } from "lib/commerce/cart-client";

type NavVariant = "default" | "kraft";

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

// The packaging wordmark: condensed navy BAL over the red smile.
function LabelLogo() {
  return (
    <a
      href="/"
      aria-label="BAL Coffee — home"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        color: "var(--navy)",
      }}
    >
      <span
        className="label-face"
        style={{
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "0.02em",
          lineHeight: 1,
        }}
      >
        BAL
      </span>
      <svg
        width="50"
        height="9"
        viewBox="0 0 54 10"
        fill="none"
        aria-hidden
        style={{ marginTop: -3 }}
      >
        <path
          d="M2 2 Q27 14 52 2"
          stroke="var(--stamp)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="mono"
        style={{ fontSize: 7, letterSpacing: "0.4em", marginTop: 1 }}
      >
        COFFEE
      </span>
    </a>
  );
}

function CartIcon({
  count = 0,
  variant,
}: {
  count?: number;
  variant: NavVariant;
}) {
  const kraft = variant === "kraft";

  return (
    <a
      href="/cart"
      aria-label="View cart"
      style={{
        position: "relative",
        width: kraft ? 44 : 36,
        height: kraft ? 44 : 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink)",
        border: kraft ? "2px solid var(--ink)" : undefined,
        borderRadius: kraft ? 10 : undefined,
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={kraft ? 1.8 : 1.6}
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
            top: kraft ? -8 : 1,
            right: kraft ? -8 : 0,
            display: "inline-flex",
            minWidth: kraft ? 20 : 17,
            height: kraft ? 20 : 17,
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            borderRadius: 999,
            background: kraft ? "var(--stamp)" : "#32180d",
            color: kraft ? "var(--label)" : "#fff4e8",
            fontSize: kraft ? 11 : 10,
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

const defaultLinks = [
  { href: "/products", label: "Shop" },
  { href: "/#about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/#journal", label: "Journal" },
  { href: "/#subscription", label: "Subscription" },
  { href: "/#contact", label: "Contact" },
];

const kraftLinks = [
  { href: "/#shop", label: "Shop" },
  { href: "/#process", label: "What's in the bag" },
  { href: "/#about", label: "Our story" },
  { href: "/#subscription", label: "Subscribe" },
];

export function Nav({ variant = "default" }: { variant?: NavVariant }) {
  const kraft = variant === "kraft";
  const cartCount = useCart((state) => state.data.totalQuantity);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = kraft ? kraftLinks : defaultLinks;
  const linkColor = kraft ? "var(--ink)" : "var(--ink-2)";
  const linkHover = kraft ? "var(--stamp)" : "var(--terra-deep)";

  return (
    <nav
      className="bal-nav"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: kraft
          ? scrolled
            ? "12px 80px"
            : "20px 80px"
          : scrolled
            ? "14px 56px"
            : "22px 56px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        transition: "all .25s ease",
        background: kraft
          ? scrolled
            ? "rgba(214,186,140,0.94)"
            : "var(--kraft)"
          : scrolled
            ? "rgba(244,239,230,0.92)"
            : "var(--cream)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled
          ? kraft
            ? "2px solid var(--ink)"
            : "1px solid var(--line-soft)"
          : kraft
            ? "2px solid transparent"
            : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {kraft ? <LabelLogo /> : <Logo />}
      </div>
      <div
        className={`bal-nav-links ${mobileOpen ? "bal-nav-links-open" : ""} ${
          kraft ? "label-face" : ""
        }`}
        style={{
          display: "flex",
          gap: kraft ? 38 : 36,
          fontSize: kraft ? 16 : 14,
          fontWeight: kraft ? 500 : undefined,
          letterSpacing: kraft ? "0.08em" : undefined,
          color: linkColor,
        }}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              transition: "color .2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
            onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
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
        <CartIcon count={cartCount} variant={variant} />
      </div>
    </nav>
  );
}
