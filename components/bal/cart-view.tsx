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
    <div className="label-panel label-shadow" style={{ padding: "44px" }}>
      <h2 className="label-title" style={{ fontSize: 40 }}>
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
      <a href="/products" className="label-btn" style={{ marginTop: 24 }}>
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
        gridTemplateColumns: "minmax(0, 1fr) 112px 84px 94px 32px",
        gap: 20,
        alignItems: "center",
        padding: "16px 0",
        borderTop: "2px dashed rgba(42,31,23,0.3)",
      }}
    >
      {/* Hidden set-quantity submit + line identity (progressive enhancement). */}
      <button {...register("set")} style={{ display: "none" }} />
      <input type="hidden" {...register("lineId", { value: line.id })} />

      <div
        className="bal-cart-product-cell"
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          gap: 18,
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <a
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          style={{
            display: "block",
            position: "relative",
            height: 120,
            overflow: "hidden",
            borderRadius: 12,
            border: "2px solid var(--ink)",
            background: "var(--kraft)",
          }}
        >
          <ProductMedia product={product} compact image={lineImage(line)} />
        </a>
        <div style={{ minWidth: 0 }}>
          <h2 className="label-title" style={{ fontSize: 26 }}>
            <a href={`/products/${product.slug}`}>{product.name}</a>
          </h2>
          <p
            className="mono"
            style={{
              marginTop: 9,
              color: "var(--ink-soft)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {product.type}
          </p>
          {notes ? (
            <p
              className="mono"
              style={{
                marginTop: 8,
                color: "var(--stamp)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {notes}
            </p>
          ) : null}
          {lineError?.userErrors?.[0]?.message ? (
            <p
              role="alert"
              style={{ marginTop: 8, fontSize: 12, color: "var(--stamp)" }}
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
          minHeight: 44,
          border: "2px solid var(--ink)",
          borderRadius: 10,
          background: "var(--label)",
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
        className="label-face bal-cart-price"
        style={{
          fontWeight: 600,
          fontSize: 22,
          lineHeight: 1,
          color: "var(--ink)",
          ...pendingStyle,
        }}
      >
        {unitPrice ? formatPrice(unitPrice) : ""}
      </p>
      <p
        className="label-face bal-cart-subtotal"
        style={{
          fontWeight: 600,
          fontSize: 22,
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
      <p className="label-kicker">We accept</p>
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
              border: "2px solid var(--ink)",
              borderRadius: 6,
              background: "var(--label)",
              color: "var(--navy)",
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
      className="bal-cart-summary label-panel label-shadow"
      style={{ alignSelf: "start", padding: "32px" }}
    >
      <h2 className="label-title" style={{ fontSize: 32 }}>
        Order Summary
      </h2>
      <div style={{ marginTop: 28, display: "grid", gap: 20 }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 20 }}
        >
          <span style={{ fontSize: 14, color: "var(--ink-2)" }}>Subtotal</span>
          <span
            className="label-face"
            style={{ fontSize: 20, fontWeight: 600 }}
          >
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
          <span
            className="label-face"
            style={{ fontSize: 20, fontWeight: 600 }}
          >
            At checkout
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 28,
          paddingTop: 26,
          borderTop: "2px dashed rgba(42,31,23,0.35)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <span className="label-title" style={{ fontSize: 30 }}>
          Total
        </span>
        <span
          className="label-face"
          style={{ fontSize: 38, lineHeight: 1, fontWeight: 600 }}
        >
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
          border: "2px solid var(--olive)",
          borderRadius: 12,
          background: "rgba(77,77,51,0.08)",
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
        className="label-btn label-btn-stamp"
        style={{
          marginTop: 28,
          display: "flex",
          width: "100%",
          minHeight: 58,
          fontSize: 18,
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
      style={{ marginTop: 56 }}
    >
      <h2
        id="cart-related-heading"
        className="label-title"
        style={{ fontSize: 40 }}
      >
        You may also like
      </h2>
      <div
        className="bal-cart-related-grid"
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 20,
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
            borderRadius: 18,
            border: "2px solid rgba(42,31,23,0.25)",
            background: "rgba(247,238,221,0.6)",
          }}
        />
      ) : hasItems ? (
        <div
          className="bal-cart-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 360px",
            gap: 28,
            alignItems: "start",
          }}
        >
          <section
            className="bal-cart-items label-panel"
            aria-label="Cart items"
            style={{ padding: "26px 24px" }}
          >
            <div
              className="bal-cart-table-header"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 112px 84px 94px 32px",
                gap: 20,
                padding: "0 0 14px",
                color: "var(--ink-soft)",
                fontFamily: "var(--font-plex-mono)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
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
                borderTop: "2px dashed rgba(42,31,23,0.3)",
              }}
            >
              <a href="/products" className="label-btn label-btn-outline">
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
