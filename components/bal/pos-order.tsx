"use client";

import { Fragment, useActionState, useEffect, useMemo, useState } from "react";
import { createPosOrder } from "components/bal/pos-actions";
import { BADGE_PATTERN, type PosOrderState } from "lib/pos";

export type PosMenuVariant = {
  id: string;
  title: string;
  priceAmount: number;
  currencyCode: string;
};

export type PosMenuItem = {
  slug: string;
  name: string;
  blurb: string;
  notes: string[];
  imageUrl?: string;
  imageAlt: string;
  accent: string;
  availableForSale: boolean;
  variants: PosMenuVariant[];
};

const initialState: PosOrderState = {
  status: "idle",
  message: "",
};

// Persist the in-progress order so a refresh doesn't wipe the customer's
// selection before they reach checkout.
const STORAGE_KEY = "bal_pos_order_v1";

function formatPrice(amount: number, currencyCode: string) {
  const hasCents = Number.isFinite(amount) && amount % 1 !== 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(amount);
}

function Stepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "36px 1fr 36px",
        alignItems: "center",
        minHeight: 42,
        width: 124,
        border: "1px solid rgba(77,56,36,0.22)",
        borderRadius: 10,
        overflow: "hidden",
        background: "rgba(255,252,246,0.78)",
      }}
    >
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{
          height: "100%",
          fontSize: 18,
          color: value <= 0 ? "rgba(42,31,23,0.35)" : "var(--ink-2)",
          cursor: value <= 0 ? "default" : "pointer",
        }}
      >
        −
      </button>
      <span
        aria-live="polite"
        style={{ textAlign: "center", fontSize: 15, color: "var(--ink)" }}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(value + 1)}
        style={{ height: "100%", fontSize: 18, color: "var(--ink-2)" }}
      >
        +
      </button>
    </div>
  );
}

function VariantPills({
  item,
  selectedId,
  onSelect,
}: {
  item: PosMenuItem;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (item.variants.length < 2) {
    return null;
  }

  return (
    <div
      role="radiogroup"
      aria-label={`${item.name} options`}
      style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}
    >
      {item.variants.map((variant) => {
        const active = variant.id === selectedId;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(variant.id)}
            className="mono"
            style={{
              minHeight: 32,
              padding: "0 14px",
              borderRadius: 999,
              border: active
                ? "1px solid #32180d"
                : "1px solid rgba(77,56,36,0.22)",
              background: active ? "#32180d" : "rgba(255,252,246,0.7)",
              color: active ? "#fff4e8" : "var(--ink-2)",
              fontSize: 11,
              letterSpacing: 0,
              whiteSpace: "nowrap",
            }}
          >
            {variant.title} ·{" "}
            {formatPrice(variant.priceAmount, variant.currencyCode)}
          </button>
        );
      })}
    </div>
  );
}

function MenuRow({
  item,
  quantity,
  variant,
  onQuantity,
  onVariant,
}: {
  item: PosMenuItem;
  quantity: number;
  variant: PosMenuVariant;
  onQuantity: (next: number) => void;
  onVariant: (id: string) => void;
}) {
  const soldOut = !item.availableForSale || item.variants.length === 0;

  return (
    <div
      className="bal-pos-row"
      style={{
        display: "grid",
        gridTemplateColumns: "92px 1fr auto",
        gap: 18,
        alignItems: "start",
        padding: "18px 0",
        borderTop: "1px solid rgba(77,56,36,0.14)",
      }}
    >
      <div
        className="bal-pos-row-media"
        style={{
          width: 92,
          height: 92,
          borderRadius: 12,
          overflow: "hidden",
          background: item.accent,
          flex: "0 0 auto",
        }}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        ) : null}
      </div>

      <div style={{ minWidth: 0 }}>
        <h3
          className="serif"
          style={{
            fontSize: 22,
            lineHeight: 1.04,
            fontWeight: 400,
            color: "var(--ink)",
          }}
        >
          {item.name}
        </h3>
        <p
          style={{
            marginTop: 5,
            fontSize: 13,
            lineHeight: 1.35,
            color: "var(--ink-2)",
          }}
        >
          {item.blurb}
        </p>
        {item.notes.length ? (
          <p
            className="mono"
            style={{
              marginTop: 8,
              fontSize: 11,
              letterSpacing: 0,
              color: "var(--ink-soft)",
            }}
          >
            {item.notes.join(" · ")}
          </p>
        ) : null}
        {!soldOut ? (
          <VariantPills
            item={item}
            selectedId={variant.id}
            onSelect={onVariant}
          />
        ) : null}
      </div>

      <div
        className="bal-pos-row-actions"
        style={{
          display: "grid",
          justifyItems: "end",
          gap: 12,
          alignContent: "start",
        }}
      >
        <span className="serif" style={{ fontSize: 21, color: "var(--ink)" }}>
          {formatPrice(variant.priceAmount, variant.currencyCode)}
        </span>
        {soldOut ? (
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: 0,
              color: "var(--terra-deep)",
            }}
          >
            Sold out
          </span>
        ) : (
          <Stepper
            value={quantity}
            onChange={onQuantity}
            label={`${item.name} quantity`}
          />
        )}
      </div>
    </div>
  );
}

export function PosOrder({ items }: { items: PosMenuItem[] }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [variantIds, setVariantIds] = useState<Record<string, string>>({});
  const [badge, setBadge] = useState("");
  const [restored, setRestored] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createPosOrder,
    initialState,
  );

  // Restore a saved in-progress order on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          if (saved.quantities) setQuantities(saved.quantities);
          if (saved.variantIds) setVariantIds(saved.variantIds);
          if (typeof saved.badge === "string") setBadge(saved.badge);
        }
      }
    } catch {
      // ignore unreadable/corrupt storage
    }
    setRestored(true);
  }, []);

  // Persist on every change once we've restored.
  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ quantities, variantIds, badge }),
      );
    } catch {
      // ignore quota/availability errors
    }
  }, [restored, quantities, variantIds, badge]);

  const currencyCode = items[0]?.variants[0]?.currencyCode || "USD";

  const variantFor = (item: PosMenuItem): PosMenuVariant | undefined => {
    const chosen = variantIds[item.slug];
    return (
      item.variants.find((variant) => variant.id === chosen) || item.variants[0]
    );
  };

  const selected = useMemo(
    () =>
      items
        .map((item) => ({
          item,
          quantity: quantities[item.slug] || 0,
          variant: variantFor(item),
        }))
        .filter((entry) => entry.quantity > 0 && entry.variant),
    [items, quantities, variantIds],
  );

  const totalQuantity = selected.reduce((sum, e) => sum + e.quantity, 0);
  const subtotal = selected.reduce(
    (sum, e) => sum + (e.variant?.priceAmount || 0) * e.quantity,
    0,
  );

  const badgeValid = BADGE_PATTERN.test(badge.trim());
  const success = state.status === "success" && Boolean(state.checkoutUrl);
  const canSubmit = totalQuantity > 0 && badgeValid && !isPending && !success;

  // On success the action returns the Shopify checkout URL; clear the saved
  // order and send the customer there to pay (visible fallback link below).
  useEffect(() => {
    if (success && state.checkoutUrl) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      window.location.href = state.checkoutUrl;
    }
  }, [success, state.checkoutUrl]);

  return (
    <form action={formAction}>
      {/* Hidden order fields — kept out of the grid so they never occupy a cell. */}
      {selected.map((entry) => (
        <Fragment key={entry.item.slug}>
          <input
            type="hidden"
            name={`quantity_${entry.item.slug}`}
            value={entry.quantity}
          />
          <input
            type="hidden"
            name={`variant_${entry.item.slug}`}
            value={entry.variant?.id || ""}
          />
        </Fragment>
      ))}

      <div
        className="bal-pos-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 388px",
          gap: 0,
          alignItems: "start",
        }}
      >
        <section
          aria-label="Café menu"
          className="bal-pos-menu"
          style={{
            padding: "10px 26px 26px",
            border: "1px solid rgba(77,56,36,0.17)",
            borderRadius: "14px 0 0 14px",
            background: "rgba(255,252,246,0.72)",
          }}
        >
          <h2
            className="serif"
            style={{
              paddingTop: 18,
              fontSize: 27,
              lineHeight: 1.1,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            Menu
          </h2>
          <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>
            Prepared fresh. Naturally caffeine-free.
          </p>
          <div style={{ marginTop: 14 }}>
            {items.map((item) => {
              const variant = variantFor(item);
              if (!variant) {
                return null;
              }
              return (
                <MenuRow
                  key={item.slug}
                  item={item}
                  quantity={quantities[item.slug] || 0}
                  variant={variant}
                  onQuantity={(next) =>
                    setQuantities((current) => ({
                      ...current,
                      [item.slug]: next,
                    }))
                  }
                  onVariant={(id) =>
                    setVariantIds((current) => ({
                      ...current,
                      [item.slug]: id,
                    }))
                  }
                />
              );
            })}
          </div>
        </section>

        <aside
          className="bal-pos-summary"
          style={{
            alignSelf: "start",
            padding: "30px",
            border: "1px solid rgba(77,56,36,0.17)",
            borderRadius: "0 14px 14px 0",
            background: "rgba(255,252,246,0.82)",
            boxShadow: "0 22px 60px rgba(50,24,13,0.06)",
          }}
        >
          <h2
            className="serif"
            style={{ fontSize: 26, lineHeight: 1.1, fontWeight: 400 }}
          >
            Your order
          </h2>

          <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
            {selected.length ? (
              selected.map((entry) => (
                <div
                  key={entry.item.slug}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    fontSize: 14,
                    color: "var(--ink-2)",
                  }}
                >
                  <span style={{ minWidth: 0 }}>
                    {entry.item.name}
                    <span style={{ color: "var(--ink-soft)" }}>
                      {" "}
                      × {entry.quantity}
                    </span>
                    {entry.item.variants.length > 1 && entry.variant ? (
                      <span
                        className="mono"
                        style={{
                          display: "block",
                          fontSize: 11,
                          letterSpacing: 0,
                          color: "var(--ink-soft)",
                        }}
                      >
                        {entry.variant.title}
                      </span>
                    ) : null}
                  </span>
                  <span className="serif" style={{ color: "var(--ink)" }}>
                    {formatPrice(
                      (entry.variant?.priceAmount || 0) * entry.quantity,
                      currencyCode,
                    )}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                No drinks added yet. Use the menu to build your order.
              </p>
            )}
          </div>

          <div
            style={{
              marginTop: 20,
              paddingTop: 18,
              borderTop: "1px solid rgba(77,56,36,0.18)",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span className="serif" style={{ fontSize: 22, lineHeight: 1 }}>
              Subtotal
            </span>
            <span className="serif" style={{ fontSize: 28, lineHeight: 1 }}>
              {formatPrice(subtotal, currencyCode)}
            </span>
          </div>
          <p style={{ marginTop: 8, fontSize: 12, color: "var(--ink-soft)" }}>
            Taxes calculated at checkout.
          </p>

          <div style={{ marginTop: 22 }}>
            <label
              htmlFor="pos-badge"
              className="mono"
              style={{
                display: "block",
                fontSize: 11,
                letterSpacing: 0,
                textTransform: "uppercase",
                color: "var(--ink-2)",
              }}
            >
              Badge number <span style={{ color: "var(--terra-deep)" }}>*</span>
            </label>
            <input
              id="pos-badge"
              name="badgeNumber"
              value={badge}
              onChange={(event) => setBadge(event.target.value)}
              required
              autoComplete="off"
              inputMode="text"
              maxLength={32}
              placeholder="e.g. 10482"
              aria-describedby="pos-badge-help"
              style={{
                marginTop: 8,
                width: "100%",
                minHeight: 48,
                padding: "0 16px",
                border: "1px solid rgba(77,56,36,0.24)",
                borderRadius: 9,
                background: "rgba(255,252,246,0.9)",
                color: "var(--ink)",
                fontSize: 16,
              }}
            />
            <p
              id="pos-badge-help"
              style={{ marginTop: 8, fontSize: 12, color: "var(--ink-soft)" }}
            >
              Required — your badge number is attached to this order.
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mono"
            style={{
              marginTop: 22,
              display: "flex",
              width: "100%",
              minHeight: 56,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9,
              background:
                canSubmit || isPending || success ? "#32180d" : "#6e594a",
              color: "#fff4e8",
              fontSize: 13,
              letterSpacing: 0,
              opacity: canSubmit || isPending || success ? 1 : 0.55,
              cursor: canSubmit ? "pointer" : "default",
            }}
          >
            {isPending
              ? "Placing order…"
              : success
                ? "Redirecting to payment…"
                : "Place order"}
          </button>

          <p
            aria-live="polite"
            style={{
              marginTop: 12,
              minHeight: 18,
              fontSize: 13,
              lineHeight: 1.5,
              color:
                state.status === "error"
                  ? "var(--terra-deep)"
                  : "var(--olive-deep)",
            }}
          >
            {state.status === "error" && state.message
              ? state.message
              : !badgeValid && badge.length > 0
                ? "Enter a valid badge number (2–32 letters or numbers)."
                : state.status === "success"
                  ? state.message
                  : ""}
          </p>

          {success && state.checkoutUrl ? (
            <a
              href={state.checkoutUrl}
              className="mono"
              style={{
                display: "flex",
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(77,56,36,0.2)",
                borderRadius: 9,
                background: "rgba(255,252,246,0.7)",
                color: "var(--ink-2)",
                fontSize: 12,
                letterSpacing: 0,
              }}
            >
              Continue to payment
            </a>
          ) : null}
        </aside>
      </div>
    </form>
  );
}
