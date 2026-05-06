import {
  ArrowLeftIcon,
  InformationCircleIcon,
  MinusIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { BenefitsStrip } from "components/bal/benefits-strip";
import {
  getCurrentCart,
  removeCartLine,
  updateCartLineQuantity,
  type CartLine,
} from "components/bal/cart-actions";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { ProductCard } from "components/bal/product-card";
import { ProductMedia } from "components/bal/product-media";
import { products, type Product } from "lib/products";
import type { ShopifyImage, ShopifyMoney } from "lib/shopify";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Bal Coffee cart.",
};

function moneyValue(money?: ShopifyMoney | null) {
  return Number(money?.amount || 0);
}

function formatMoney(
  amount: number,
  currencyCode: string,
  fraction: "auto" | "always" = "auto",
) {
  const hasCents = Number.isFinite(amount) && amount % 1 !== 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: fraction === "always" || hasCents ? 2 : 0,
    maximumFractionDigits: fraction === "always" || hasCents ? 2 : 0,
  }).format(amount);
}

function getProductForLine(line: CartLine) {
  return products.find(
    (product) => product.shopifyHandle === line.merchandise.product.handle,
  );
}

function getLineImage(line: CartLine): ShopifyImage | undefined {
  return (
    line.merchandise.image ||
    line.merchandise.product.featuredImage ||
    undefined
  );
}

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

function EmptyCartPanel() {
  return (
    <div
      style={{
        padding: "42px",
        border: "1px solid rgba(77,56,36,0.16)",
        borderRadius: 14,
        background: "rgba(255,252,246,0.82)",
      }}
    >
      <h2
        className="serif"
        style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 400 }}
      >
        Your cart is empty.
      </h2>
      <p
        style={{
          marginTop: 10,
          maxWidth: 520,
          color: "var(--ink-2)",
          fontSize: 15,
          lineHeight: 1.6,
        }}
      >
        Add a roasted date seed coffee or cafe drink to begin your order.
      </p>
      <a
        href="/products"
        className="mono"
        style={{
          display: "inline-flex",
          marginTop: 24,
          minHeight: 44,
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          borderRadius: 6,
          background: "#32180d",
          color: "#fff4e8",
          fontSize: 11,
          letterSpacing: 0,
        }}
      >
        Shop products
      </a>
    </div>
  );
}

function QuantityAction({
  line,
  quantity,
  label,
  children,
  disabled = false,
}: {
  line: CartLine;
  quantity: number;
  label: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <form action={updateCartLineQuantity}>
      <input type="hidden" name="lineId" value={line.id} />
      <input type="hidden" name="quantity" value={quantity} />
      <button
        type="submit"
        aria-label={label}
        disabled={disabled}
        style={{
          display: "inline-flex",
          width: 31,
          height: 31,
          alignItems: "center",
          justifyContent: "center",
          color: disabled ? "rgba(42,31,23,0.35)" : "var(--ink)",
          cursor: disabled ? "default" : "pointer",
        }}
      >
        {children}
      </button>
    </form>
  );
}

function CartLineRow({ line }: { line: CartLine }) {
  const product = getProductForLine(line);
  const displayProduct: Product =
    product ||
    ({
      name: line.merchandise.product.title,
      slug: line.merchandise.product.handle,
      shopifyHandle: line.merchandise.product.handle,
      type: line.merchandise.title,
      category: "coffee",
      badge: "",
      blurb: "Naturally caffeine-free BAL Coffee selection.",
      price: "",
      description: "",
      notes: [line.merchandise.title].filter(Boolean),
      details: [],
      benefits: [],
      ingredients: "",
      nutrition: [],
      brewSteps: [],
      kind: "bag-dark",
      accent: "#351c10",
    } satisfies Product);
  const lineTotal = moneyValue(line.cost.totalAmount);
  const currencyCode = line.cost.totalAmount.currencyCode;
  const unitPrice = line.quantity > 0 ? lineTotal / line.quantity : lineTotal;
  const notes =
    product?.notes.join(" · ") ||
    (line.merchandise.title === "Default Title" ? "" : line.merchandise.title);

  return (
    <div
      className="bal-cart-line"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 1fr) 112px 84px 94px 32px",
        gap: 28,
        alignItems: "center",
        padding: "12px 0",
        borderTop: "1px solid rgba(77,56,36,0.16)",
      }}
    >
      <div
        className="bal-cart-product-cell"
        style={{
          display: "grid",
          gridTemplateColumns: "204px 1fr",
          gap: 24,
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <a
          href={`/products/${displayProduct.slug}`}
          aria-label={`View ${displayProduct.name}`}
          style={{
            display: "block",
            height: 150,
            overflow: "hidden",
            borderRadius: 10,
            background: "var(--cream-2)",
          }}
        >
          <ProductMedia
            product={displayProduct}
            compact
            image={getLineImage(line)}
          />
        </a>
        <div style={{ minWidth: 0 }}>
          <h2
            className="serif"
            style={{
              fontSize: 23,
              lineHeight: 1.12,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            <a href={`/products/${displayProduct.slug}`}>
              {displayProduct.name}
            </a>
          </h2>
          <p
            style={{
              marginTop: 9,
              color: "var(--ink-2)",
              fontSize: 14,
              lineHeight: 1.35,
            }}
          >
            {displayProduct.type}
          </p>
          {notes ? (
            <p
              className="mono"
              style={{
                marginTop: 10,
                color: "var(--ink-soft)",
                fontSize: 11,
                letterSpacing: 0,
              }}
            >
              {notes}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className="bal-cart-quantity"
        style={{
          display: "grid",
          gridTemplateColumns: "31px 1fr 31px",
          alignItems: "center",
          minHeight: 42,
          border: "1px solid rgba(77,56,36,0.2)",
          borderRadius: 10,
          background: "rgba(255,252,246,0.76)",
        }}
      >
        <QuantityAction
          line={line}
          quantity={line.quantity - 1}
          label={`Decrease ${displayProduct.name} quantity`}
          disabled={line.quantity <= 1}
        >
          <MinusIcon width={14} />
        </QuantityAction>
        <span
          style={{
            textAlign: "center",
            fontSize: 14,
            lineHeight: 1,
            color: "var(--ink)",
          }}
        >
          {line.quantity}
        </span>
        <QuantityAction
          line={line}
          quantity={line.quantity + 1}
          label={`Increase ${displayProduct.name} quantity`}
        >
          <PlusIcon width={14} />
        </QuantityAction>
      </div>

      <p
        className="serif bal-cart-price"
        style={{ fontSize: 21, lineHeight: 1, color: "var(--ink)" }}
      >
        {formatMoney(unitPrice, currencyCode)}
      </p>
      <p
        className="serif bal-cart-subtotal"
        style={{ fontSize: 21, lineHeight: 1, color: "var(--ink)" }}
      >
        {formatMoney(lineTotal, currencyCode)}
      </p>
      <form action={removeCartLine}>
        <input type="hidden" name="lineId" value={line.id} />
        <button
          type="submit"
          aria-label={`Remove ${displayProduct.name}`}
          style={{
            display: "inline-flex",
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink)",
          }}
        >
          <TrashIcon width={22} />
        </button>
      </form>
    </div>
  );
}

function DiscountForm() {
  return (
    <form
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 78px",
        minHeight: 48,
        overflow: "hidden",
        border: "1px solid rgba(77,56,36,0.18)",
        borderRadius: 9,
        background: "rgba(255,252,246,0.72)",
      }}
    >
      <label
        style={{
          display: "grid",
          gridTemplateColumns: "22px 1fr",
          gap: 10,
          alignItems: "center",
          padding: "0 14px",
          color: "var(--ink-soft)",
        }}
      >
        <TagIcon width={18} />
        <span className="mono" style={{ fontSize: 12, letterSpacing: 0 }}>
          Discount code or gift card
        </span>
      </label>
      <button
        type="button"
        className="mono"
        style={{
          background: "#32180d",
          color: "#fff4e8",
          fontSize: 12,
          letterSpacing: 0,
        }}
      >
        Apply
      </button>
    </form>
  );
}

function PaymentBadges() {
  return (
    <div
      style={{
        marginTop: 34,
        display: "grid",
        gap: 14,
        justifyItems: "center",
      }}
    >
      <p style={{ fontSize: 12, color: "var(--ink-2)" }}>We accept</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {["VISA", "MC", "AMEX", "DISC", "Apple", "G Pay"].map((badge) => (
          <span
            key={badge}
            className="mono"
            style={{
              display: "inline-flex",
              minWidth: 42,
              height: 26,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(77,56,36,0.16)",
              borderRadius: 5,
              background: "rgba(255,252,246,0.82)",
              color: badge === "MC" ? "#d95d27" : "#1d5f9f",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0,
            }}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

function OrderSummary({
  subtotal,
  tax,
  total,
  currencyCode,
  checkoutUrl,
}: {
  subtotal: number;
  tax: number;
  total: number;
  currencyCode: string;
  checkoutUrl: string;
}) {
  return (
    <aside
      className="bal-cart-summary"
      style={{
        alignSelf: "start",
        padding: "34px",
        border: "1px solid rgba(77,56,36,0.17)",
        borderRadius: 14,
        background: "rgba(255,252,246,0.78)",
        boxShadow: "0 22px 60px rgba(50,24,13,0.06)",
      }}
    >
      <h2
        className="serif"
        style={{ fontSize: 27, lineHeight: 1.1, fontWeight: 400 }}
      >
        Order Summary
      </h2>
      <div style={{ marginTop: 28, display: "grid", gap: 20 }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 20 }}
        >
          <span style={{ fontSize: 14, color: "var(--ink-2)" }}>Subtotal</span>
          <span className="serif" style={{ fontSize: 18 }}>
            {formatMoney(subtotal, currencyCode)}
          </span>
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 20 }}
        >
          <span style={{ fontSize: 14, color: "var(--ink-2)" }}>Shipping</span>
          <span style={{ fontSize: 15, color: "var(--olive-deep)" }}>Free</span>
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 20 }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: "var(--ink-2)",
            }}
          >
            Estimated Tax <InformationCircleIcon width={15} />
          </span>
          <span className="serif" style={{ fontSize: 18 }}>
            {formatMoney(tax, currencyCode, "always")}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 28,
          paddingTop: 26,
          borderTop: "1px solid rgba(77,56,36,0.18)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <span className="serif" style={{ fontSize: 28, lineHeight: 1 }}>
          Total
        </span>
        <span className="serif" style={{ fontSize: 36, lineHeight: 1 }}>
          {formatMoney(total, currencyCode, "always")}
        </span>
      </div>

      <div
        style={{
          marginTop: 26,
          display: "grid",
          gridTemplateColumns: "34px 1fr",
          gap: 14,
          alignItems: "center",
          padding: "15px 16px",
          border: "1px solid rgba(77,83,42,0.3)",
          borderRadius: 9,
          background: "rgba(225,220,177,0.46)",
          color: "var(--olive-deep)",
        }}
      >
        <TruckIcon width={28} />
        <div>
          <p style={{ fontSize: 13, lineHeight: 1.25 }}>
            You have unlocked free shipping
          </p>
          <p style={{ marginTop: 4, fontSize: 12, lineHeight: 1.3 }}>
            Enjoy free standard shipping on this order.
          </p>
        </div>
      </div>

      <a
        href={checkoutUrl}
        className="mono"
        style={{
          marginTop: 28,
          display: "flex",
          minHeight: 58,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9,
          background: "#32180d",
          color: "#fff4e8",
          fontSize: 13,
          letterSpacing: 0,
        }}
      >
        Proceed to Checkout
      </a>
      <a
        href={checkoutUrl}
        className="mono"
        style={{
          marginTop: 14,
          display: "flex",
          minHeight: 54,
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(77,56,36,0.18)",
          borderRadius: 9,
          background: "rgba(255,252,246,0.58)",
          color: "var(--ink-2)",
          fontSize: 13,
          letterSpacing: 0,
        }}
      >
        Pay with{" "}
        <span style={{ marginLeft: 6, color: "#5c35d5", fontWeight: 800 }}>
          Shop Pay
        </span>
      </a>
      <PaymentBadges />
    </aside>
  );
}

export default async function CartPage() {
  const cart = await getCurrentCart();
  const hasItems = Boolean(cart?.lines.length);
  const cartHandles = new Set(
    cart?.lines.map((line) => line.merchandise.product.handle) || [],
  );
  const recommended = products
    .filter((product) => !cartHandles.has(product.shopifyHandle))
    .slice(0, 3);
  const subtotalMoney = cart?.cost.subtotalAmount || cart?.cost.totalAmount;
  const currencyCode = subtotalMoney?.currencyCode || "USD";
  const subtotal = moneyValue(subtotalMoney);
  const tax = cart?.cost.totalTaxAmount
    ? moneyValue(cart.cost.totalTaxAmount)
    : Math.round(subtotal * 8.25) / 100;
  const total = cart?.cost.totalTaxAmount
    ? moneyValue(cart.cost.totalAmount)
    : subtotal + tax;

  return (
    <>
      <Nav cartCount={cart?.totalQuantity || 0} />
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
              style={{
                marginTop: 34,
                maxWidth: 640,
                paddingBottom: 42,
              }}
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

            {hasItems && cart ? (
              <div
                className="bal-cart-layout"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) 388px",
                  gap: 0,
                  alignItems: "start",
                }}
              >
                <section
                  className="bal-cart-items"
                  aria-label="Cart items"
                  style={{
                    padding: "28px 20px 28px 18px",
                    border: "1px solid rgba(77,56,36,0.17)",
                    borderRadius: "14px 0 0 14px",
                    background: "rgba(255,252,246,0.72)",
                  }}
                >
                  <div
                    className="bal-cart-table-header"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "minmax(260px, 1fr) 112px 84px 94px 32px",
                      gap: 28,
                      padding: "0 0 16px",
                      color: "var(--ink)",
                      fontSize: 13,
                    }}
                  >
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Price</span>
                    <span>Subtotal</span>
                    <span />
                  </div>
                  {cart.lines.map((line) => (
                    <CartLineRow key={line.id} line={line} />
                  ))}
                  <div
                    className="bal-cart-item-actions"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(260px, 368px) 1fr",
                      gap: 24,
                      alignItems: "center",
                      paddingTop: 20,
                      borderTop: "1px solid rgba(77,56,36,0.16)",
                    }}
                  >
                    <DiscountForm />
                    <a
                      href="/products"
                      className="mono"
                      style={{
                        justifySelf: "end",
                        display: "inline-flex",
                        minHeight: 44,
                        alignItems: "center",
                        gap: 8,
                        padding: "0 18px",
                        border: "1px solid rgba(77,56,36,0.18)",
                        borderRadius: 9,
                        background: "rgba(255,252,246,0.62)",
                        color: "var(--olive-deep)",
                        fontSize: 12,
                        letterSpacing: 0,
                      }}
                    >
                      <ArrowLeftIcon width={16} />
                      Continue Shopping
                    </a>
                  </div>
                </section>
                <OrderSummary
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  currencyCode={currencyCode}
                  checkoutUrl={cart.checkoutUrl}
                />
              </div>
            ) : (
              <EmptyCartPanel />
            )}

            <section
              className="bal-cart-related"
              aria-labelledby="cart-related-heading"
              style={{ marginTop: 20 }}
            >
              <h2
                id="cart-related-heading"
                className="serif"
                style={{
                  fontSize: 30,
                  lineHeight: 1.1,
                  fontWeight: 400,
                  color: "var(--ink)",
                }}
              >
                You may also like
              </h2>
              <div
                className="bal-cart-related-grid"
                style={{
                  marginTop: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                {recommended.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    horizontal
                  />
                ))}
              </div>
            </section>

            <BenefitsStrip />
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
