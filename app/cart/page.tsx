import { BenefitsStrip } from "components/bal/benefits-strip";
import { CartContents } from "components/bal/cart-view";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { getProducts } from "lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Bal Coffee cart.",
};

function CartHeroArt() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: "0 0 auto auto",
        width: "48%",
        minWidth: 440,
        height: 250,
        overflow: "hidden",
        opacity: 0.96,
      }}
    >
      <svg
        viewBox="0 0 660 300"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="cart-hero-glow" cx="62%" cy="28%" r="72%">
            <stop offset="0" stopColor="#f8f0e3" />
            <stop offset="0.7" stopColor="#dbc3a5" />
            <stop offset="1" stopColor="#b49370" />
          </radialGradient>
          <filter
            id="cart-hero-shadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="16"
              stdDeviation="16"
              floodColor="#32180d"
              floodOpacity="0.22"
            />
          </filter>
        </defs>
        <rect
          width="660"
          height="300"
          fill="url(#cart-hero-glow)"
          opacity="0.72"
        />
        <path
          d="M138 122 C230 98 300 132 392 105 C502 72 592 94 660 54 L660 300 H84 C140 248 104 168 138 122 Z"
          fill="#d9bea0"
          opacity="0.42"
        />
        <g
          stroke="#65713b"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.78"
        >
          <path d="M142 76 C238 54 302 24 382 22" />
          {Array.from({ length: 9 }).map((_, index) => {
            const x = 180 + index * 24;
            const y = 64 - index * 5;
            return (
              <path
                key={`leaf-a-${index}`}
                d={`M${x} ${y} C ${x + 20} ${y - 28}, ${x + 48} ${y - 18}, ${x + 10} ${y + 5}`}
                strokeWidth="3.4"
              />
            );
          })}
          {Array.from({ length: 8 }).map((_, index) => {
            const x = 182 + index * 24;
            const y = 68 - index * 5;
            return (
              <path
                key={`leaf-b-${index}`}
                d={`M${x} ${y} C ${x - 20} ${y - 22}, ${x - 44} ${y - 8}, ${x - 10} ${y + 7}`}
                strokeWidth="3.4"
              />
            );
          })}
        </g>
        <g filter="url(#cart-hero-shadow)">
          <path
            d="M318 164 L554 104 L630 232 L366 262 Z"
            fill="#a28362"
            opacity="0.66"
          />
          <path
            d="M410 136 C450 126 488 136 500 160 C512 188 488 211 446 220 C404 228 365 216 354 190 C342 164 368 145 410 136 Z"
            fill="#c9a075"
          />
          <ellipse cx="430" cy="158" rx="82" ry="34" fill="#7c4a28" />
          <ellipse cx="430" cy="148" rx="72" ry="26" fill="#d7b186" />
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <ellipse
              key={item}
              cx={382 + item * 20}
              cy={145 + (item % 2) * 15}
              rx="13"
              ry="22"
              fill="#5b2a15"
              transform={`rotate(${-24 + item * 12} ${382 + item * 20} ${145})`}
            />
          ))}
          <ellipse cx="546" cy="74" rx="64" ry="19" fill="#8b6a4b" />
          <path
            d="M484 78 L608 78 L594 176 Q592 194 570 198 H522 Q500 194 498 176 Z"
            fill="#e7d4ba"
            stroke="#7c5738"
            strokeWidth="2"
          />
          <ellipse cx="546" cy="78" rx="62" ry="19" fill="#f0dfc8" />
          <ellipse cx="546" cy="77" rx="49" ry="12" fill="#27120b" />
          <path
            d="M604 102 C652 104 650 164 600 163"
            stroke="#7c5738"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        {[0, 1, 2, 3, 4, 5, 6].map((item) => (
          <ellipse
            key={`bean-${item}`}
            cx={260 + item * 28}
            cy={188 + ((item * 17) % 42)}
            rx="8"
            ry="14"
            fill="#4b2514"
            opacity="0.86"
            transform={`rotate(${22 + item * 19} ${260 + item * 28} ${188})`}
          />
        ))}
      </svg>
    </div>
  );
}

export default async function CartPage() {
  const products = await getProducts();

  return (
    <>
      <Nav />
      <main style={{ background: "var(--cream)" }}>
        <section
          className="bal-cart-page"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "34px 50px 16px",
            borderTop: "1px solid rgba(77,56,36,0.12)",
          }}
        >
          <CartHeroArt />
          <div
            className="bal-cart-container"
            style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}
          >
            <nav
              aria-label="Breadcrumb"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                color: "var(--ink-2)",
                fontSize: 13,
              }}
            >
              <a href="/">Home</a>
              <span style={{ color: "var(--ink-soft)" }}>/</span>
              <span>Cart</span>
            </nav>

            <div
              className="bal-cart-heading"
              style={{ marginTop: 34, maxWidth: 640, paddingBottom: 42 }}
            >
              <h1
                className="serif"
                style={{
                  fontSize: "clamp(54px, 6vw, 76px)",
                  lineHeight: 0.96,
                  fontWeight: 400,
                  color: "var(--ink)",
                }}
              >
                Your Cart
              </h1>
              <p
                style={{
                  marginTop: 20,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "var(--ink-2)",
                }}
              >
                Review your selection and complete your order.
              </p>
            </div>

            <CartContents products={products} />

            <BenefitsStrip />
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
