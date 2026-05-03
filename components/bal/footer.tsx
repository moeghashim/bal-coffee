"use client";

import { FormEvent } from "react";

const linkColumns: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Eastern Brew", href: "/products/eastern-brew" },
      { label: "GrounDate", href: "/products/groundate" },
      { label: "DateSpresso", href: "/products/datespresso" },
      { label: "Gift cards", href: "/#subscription" },
      { label: "Subscription", href: "/#subscription" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/#about" },
      { label: "Our Process", href: "/#process" },
      { label: "Sustainability", href: "/#process" },
      { label: "Wholesale", href: "/#contact" },
      { label: "Careers", href: "/#contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/#contact" },
      { label: "Shipping & Delivery", href: "/#contact" },
      { label: "Returns & Exchanges", href: "/#contact" },
      { label: "Track Your Order", href: "/#contact" },
      { label: "Contact Us", href: "/#contact" },
    ],
  },
];

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 9h3V5h-3a4 4 0 0 0-4 4v3H7v4h3v8h4v-8h3l1-4h-4V9z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 4v10.2a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 4c.4 2.6 2.4 4.5 5 4.6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  );
}

function LeafMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 26 C 10 14, 18 8, 26 6 C 26 16, 20 24, 8 26 Z" />
      <path d="M6 26 L 22 10" />
    </svg>
  );
}

export function Footer() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <footer
      id="contact"
      className="bal-footer"
      style={{
        background:
          "radial-gradient(circle at 28% 0%, rgba(127,85,47,0.22), transparent 36%), linear-gradient(105deg, #211109 0%, #321b0f 52%, #1a0e08 100%)",
        color: "#ead8bd",
        padding: "34px 56px 20px",
        borderTop: "1px solid rgba(238,216,185,0.14)",
      }}
    >
      <div
        className="bal-footer-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1.4fr",
          gap: 44,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className="serif"
              style={{
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#f1d9b6",
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
                color: "#d0b890",
                marginTop: 8,
              }}
            >
              coffee
            </span>
          </div>
          <p
            style={{
              marginTop: 20,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "#d0b890",
              maxWidth: 240,
            }}
          >
            Naturally caffeine-free coffee made from date seeds. Rooted in
            tradition. Roasted with care.
          </p>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              gap: 16,
              color: "#d0b890",
            }}
          >
            <a href="#instagram" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#facebook" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#tiktok" aria-label="TikTok">
              <TikTokIcon />
            </a>
            <a href="#email" aria-label="Email">
              <MailIcon />
            </a>
          </div>
        </div>

        {linkColumns.map((col) => (
          <div key={col.title}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#e7c896",
                marginBottom: 16,
              }}
            >
              {col.title}
            </div>
            {col.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  display: "block",
                  fontSize: 13.5,
                  color: "#d0b890",
                  marginBottom: 10,
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        ))}

        <div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#e7c896",
              marginBottom: 16,
            }}
          >
            Stay in touch
          </div>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "#d0b890",
              marginBottom: 16,
            }}
          >
            Join our community for brewing tips, stories, and exclusive offers.
          </p>
          <form
            onSubmit={onSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              border: "1px solid rgba(238,216,185,0.22)",
              borderRadius: 8,
              overflow: "hidden",
              background: "rgba(255,246,231,0.05)",
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              aria-label="Email address"
              style={{
                border: "none",
                outline: "none",
                padding: "12px 14px",
                fontSize: 13.5,
                background: "transparent",
                color: "#f1d9b6",
              }}
            />
            <button
              type="submit"
              className="mono"
              style={{
                padding: "12px 20px",
                background: "#77783a",
                color: "#fff4e8",
                fontSize: 11,
                letterSpacing: 0,
                borderRadius: 0,
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div
        className="bal-footer-bottom"
        style={{
          maxWidth: 1280,
          margin: "28px auto 0",
          paddingTop: 18,
          borderTop: "1px solid rgba(238,216,185,0.14)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#bfa887",
          }}
        >
          <LeafMark />
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.16em",
              color: "#bfa887",
            }}
          >
            © 2024 BAL Coffee. All rights reserved.
          </span>
        </div>
        <div
          className="mono"
          style={{
            display: "flex",
            gap: 28,
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "#bfa887",
          }}
        >
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
