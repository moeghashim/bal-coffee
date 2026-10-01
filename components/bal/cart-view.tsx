"use client";

import {
  ArrowLeftIcon,
  InformationCircleIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { ProductCard } from "components/bal/product-card";
import { ProductMedia } from "components/bal/product-media";
import { useCart, useCartForm, type CartLine } from "lib/commerce/cart-client";
import { formatPrice } from "lib/commerce/money";
import { getProductByShopifyHandle, type Product } from "lib/products";
import type { ShopifyImage } from "lib/shopify";

type Money = { amount: string; currencyCode: string };

function displayProductForLine(line: CartLine): Product {
  const handle = line.merchandise?.product?.handle ?? "";
  const matched = getProductByShopifyHandle(handle);
  if (matched) return matched;

  // A line for a product not in our local catalog — synthesize enough to render.
  return {
    name: line.merchandise?.product?.title ?? "Product",
    slug: handle,
    shopifyHandle: handle,
    type: line.merchandise?.title ?? "",
    category: "coffee",
    badge: "",
    blurb: "Naturally caffeine-free BAL Coffee selection.",
    price: "",
    description: "",
    notes: [line.merchandise?.title].filter(Boolean) as string[],
    details: [],
    benefits: [],
    ingredients: "",
    nutrition: [],
    brewSteps: [],
    kind: "bag-dark",
    accent: "#351c10",
  } satisfies Product;
}

function lineImage(line: CartLine): ShopifyImage | undefined {
  const image =
    line.merchandise?.image ?? line.merchandise?.product?.featuredImage;
  return image ? (image as ShopifyImage) : undefined;
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
        Add a roasted date seed coffee to begin your order.
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

function CartLineRow({ line }: { line: CartLine }) {
  const { formProps, register } = useCartForm();
  const pendingLines = useCart((state) => state.pending.lines);
  const isPending = pendingLines.has(line.id);
  const lineError = useCart((state) => state.errors.lines.get(line.id));

  const product = displayProductForLine(line);
  const unitPrice = line.cost?.amountPerQuantity as Money | undefined;
  const lineTotal = line.cost?.totalAmount as Money | undefined;
  const notes =
    product.notes.join(" · ") ||
    (line.merchandise?.title === "Default Title"
      ? ""
      : (line.merchandise?.title ?? ""));
  const pendingStyle = isPending ? { opacity: 0.3 } : undefined;

  return (
    <form
      {...formProps()}
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
      {/* Hidden set-quantity submit + line identity (progressive enhancement). */}
      <button {...register("set")} style={{ display: "none" }} />
      <input type="hidden" {...register("lineId", { value: line.id })} />

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
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          style={{
            display: "block",
            height: 150,
            overflow: "hidden",
            borderRadius: 10,
            background: "var(--cream-2)",
          }}
        >
          <ProductMedia product={product} compact image={lineImage(line)} />
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
            <a href={`/products/${product.slug}`}>{product.name}</a>
          </h2>
          <p
            style={{
              marginTop: 9,
              color: "var(--ink-2)",
              fontSize: 14,
              lineHeight: 1.35,
            }}
          >
            {product.type}
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
          {lineError?.userErrors?.[0]?.message ? (
            <p
              role="alert"
              style={{ marginTop: 8, fontSize: 12, color: "var(--terra-deep)" }}
            >
              {lineError.userErrors[0].message}
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
        <button
          type="submit"
          {...register("decrease")}
          aria-label={`Decrease ${product.name} quantity`}
          style={{
            display: "inline-flex",
            width: 31,
            height: 31,
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink)",
          }}
        >
          <MinusIcon width={14} />
        </button>
        <input
          {...register("quantity", { value: line.quantity, interactive: true })}
          aria-label={`${product.name} quantity`}
          className={isPending ? "bal-cart-qty-pending" : undefined}
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: 14,
            lineHeight: 1,
            color: "var(--ink)",
            background: "transparent",
            border: "none",
            ...pendingStyle,
          }}
        />
        <button
          type="submit"
          {...register("increase")}
          aria-label={`Increase ${product.name} quantity`}
          style={{
            display: "inline-flex",
            width: 31,
            height: 31,
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink)",
          }}
        >
          <PlusIcon width={14} />
        </button>
      </div>

      <p
        className="serif bal-cart-price"
        style={{
          fontSize: 21,
          lineHeight: 1,
          color: "var(--ink)",
          ...pendingStyle,
        }}
      >
        {unitPrice ? formatPrice(unitPrice) : ""}
      </p>
      <p
        className="serif bal-cart-subtotal"
        style={{
          fontSize: 21,
          lineHeight: 1,
          color: "var(--ink)",
          ...pendingStyle,
        }}
      >
        {lineTotal ? formatPrice(lineTotal) : ""}
      </p>
      <button
        type="submit"
        {...register("remove")}
        aria-label={`Remove ${product.name}`}
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

function OrderSummary() {
  const subtotal = useCart((state) => state.data.cost?.subtotalAmount) as
    | Money
    | undefined;
  const total = useCart((state) => state.data.cost?.totalAmount) as
    | Money
    | undefined;
  const checkoutUrl = useCart((state) => state.data.checkoutUrl) as
    | string
    | null
    | undefined;

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
            {subtotal ? formatPrice(subtotal) : "—"}
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
            At checkout
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
          {total ? formatPrice(total, { withCents: true }) : "—"}
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
        href={checkoutUrl || "#"}
        aria-disabled={checkoutUrl ? undefined : true}
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
          pointerEvents: checkoutUrl ? undefined : "none",
          opacity: checkoutUrl ? 1 : 0.6,
        }}
      >
        Proceed to Checkout
      </a>
      <PaymentBadges />
    </aside>
  );
}

function RelatedProducts({
  products,
  cartHandles,
}: {
  products: Product[];
  cartHandles: Set<string>;
}) {
  const recommended = products
    .filter((product) => !cartHandles.has(product.shopifyHandle))
    .slice(0, 3);

  if (!recommended.length) return null;

  return (
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
          <ProductCard key={product.slug} product={product} horizontal />
        ))}
      </div>
    </section>
  );
}

export function CartContents({ products }: { products: Product[] }) {
  const lines = useCart((state) => state.data.lines.nodes) as CartLine[];
  const loading = useCart((state) => state.loading);
  const hasItems = lines.length > 0;
  const cartHandles = new Set(
    lines
      .map((line) => line.merchandise?.product?.handle)
      .filter((handle): handle is string => Boolean(handle)),
  );

  return (
    <>
      {loading ? (
        <div
          aria-hidden
          style={{
            height: 260,
            borderRadius: 14,
            border: "1px solid rgba(77,56,36,0.12)",
            background: "rgba(255,252,246,0.5)",
          }}
        />
      ) : hasItems ? (
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
                gridTemplateColumns: "minmax(260px, 1fr) 112px 84px 94px 32px",
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
            {lines.map((line) => (
              <CartLineRow key={line.id} line={line} />
            ))}
            <div
              className="bal-cart-item-actions"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                justifyItems: "end",
                paddingTop: 20,
                borderTop: "1px solid rgba(77,56,36,0.16)",
              }}
            >
              <a
                href="/products"
                className="mono"
                style={{
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
          <OrderSummary />
        </div>
      ) : (
        <EmptyCartPanel />
      )}

      <RelatedProducts products={products} cartHandles={cartHandles} />
    </>
  );
}
