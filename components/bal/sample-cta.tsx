"use client";

import { useEffect, useRef, useState } from "react";
import { AddToCartButton } from "components/bal/add-to-cart-button";
import { useCart, useCartForm } from "lib/commerce/cart-client";
import { toGaItem, trackEcommerce, type GaItem } from "lib/ga";
import {
  SAMPLE_GA_CATEGORY,
  SAMPLE_TERMS,
  sampleVariantIdsInCart,
  type SampleOffer,
} from "lib/sample";

type Tone = "light" | "dark";

const OPTIMISTIC_PREFIX = "optimistic:";
/** Give up waiting on one add after this long and move to the next blend. */
const ADD_TIMEOUT_MS = 10_000;

function useSampleIdsInCart() {
  const lines = useCart((state) => state.data?.lines?.nodes ?? []);
  return sampleVariantIdsInCart(lines);
}

function sampleTitle(offer: SampleOffer) {
  return `20g sample: ${offer.blend}`;
}

function textColor(tone: Tone, soft = false) {
  if (tone === "dark") {
    return soft ? "rgba(244,239,230,0.9)" : "var(--cream)";
  }
  return soft ? "var(--ink-2)" : "var(--ink)";
}

function SampleAddButton({ offer }: { offer: SampleOffer }) {
  return (
    <AddToCartButton
      key={offer.merchandiseId}
      compact
      label={`Add a 20g ${offer.blend} sample`}
      product={{
        merchandiseId: offer.merchandiseId,
        handle: "sample",
        title: sampleTitle(offer),
        amount: offer.amount,
        currencyCode: offer.currencyCode,
        availableForSale: true,
        gaCategory: SAMPLE_GA_CATEGORY,
      }}
    />
  );
}

/**
 * Adds every sample not yet in the cart, one at a time. Each add waits for the
 * previous line to land so a new cart is never created twice in parallel.
 */
function TryAllSamples({
  offers,
  tone,
}: {
  offers: SampleOffer[];
  tone: Tone;
}) {
  const { formProps, register } = useCartForm();
  const lines = useCart((state) => state.data?.lines?.nodes ?? []);
  const pendingLines = useCart((state) => state.pending.lines);
  const inCart = sampleVariantIdsInCart(lines);
  const missing = offers.filter((offer) => !inCart.has(offer.merchandiseId));

  const [queue, setQueue] = useState<SampleOffer[]>([]);
  const [current, setCurrent] = useState<SampleOffer | null>(null);
  const submitted = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const running = queue.length > 0 || current !== null;

  useEffect(() => {
    if (current || queue.length === 0) return;
    setCurrent(queue[0] ?? null);
    setQueue((rest) => rest.slice(1));
  }, [current, queue]);

  useEffect(() => {
    if (!current || submitted.current === current.merchandiseId) return;
    submitted.current = current.merchandiseId;
    formRef.current?.requestSubmit(buttonRef.current ?? undefined);
    const timer = setTimeout(() => setCurrent(null), ADD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    if (!current || submitted.current !== current.merchandiseId) return;
    const landed = lines.some(
      (line) =>
        line.merchandise?.id === current.merchandiseId &&
        !line.id.startsWith(OPTIMISTIC_PREFIX) &&
        !pendingLines.has(line.id),
    );
    if (landed) setCurrent(null);
  }, [lines, pendingLines, current]);

  if (offers.length < 2 || missing.length === 0) return null;

  const label = running
    ? "Adding samples..."
    : missing.length === offers.length
      ? offers.length === 3
        ? "Try all 3"
        : `Add all ${offers.length} samples`
      : `Add the other ${missing.length}`;

  return (
    <form
      ref={formRef}
      {...formProps()}
      style={{ marginTop: 8 }}
      aria-busy={running || undefined}
    >
      <input
        type="hidden"
        {...register("merchandiseId", { value: current?.merchandiseId ?? "" })}
      />
      <input type="hidden" {...register("quantity", { value: 1 })} />
      <button
        ref={buttonRef}
        {...register("add")}
        style={{ display: "none" }}
        tabIndex={-1}
        aria-hidden
      />
      <button
        type="button"
        disabled={running}
        onClick={() => {
          submitted.current = null;
          setQueue(missing);
          const items = missing
            .map((offer) =>
              toGaItem({
                itemId: offer.merchandiseId,
                itemName: sampleTitle(offer),
                price: offer.amount,
                quantity: 1,
                itemCategory: SAMPLE_GA_CATEGORY,
              }),
            )
            .filter((item): item is GaItem => Boolean(item));
          if (items.length > 0) trackEcommerce("add_to_cart", items);
        }}
        className="mono"
        style={{
          width: "100%",
          minHeight: 36,
          padding: "9px 14px",
          borderRadius: 5,
          fontSize: 11,
          letterSpacing: 0,
          border: `1px solid ${tone === "dark" ? "var(--cream)" : "#32180d"}`,
          background: "transparent",
          color: textColor(tone),
          opacity: running ? 0.7 : 1,
        }}
      >
        {label}
      </button>
    </form>
  );
}

function GrindList({ offers, tone }: { offers: SampleOffer[]; tone: Tone }) {
  return (
    <ul
      style={{
        marginTop: 8,
        paddingLeft: 18,
        fontSize: 12.5,
        lineHeight: 1.5,
        color: textColor(tone, true),
        listStyle: "disc",
      }}
    >
      {offers.map((offer) => (
        <li key={offer.merchandiseId}>
          <strong style={{ fontWeight: 500, color: textColor(tone) }}>
            {offer.blend}
          </strong>
          : {offer.grind}
        </li>
      ))}
    </ul>
  );
}

function InCartNote({ tone, text }: { tone: Tone; text: string }) {
  return (
    <p
      style={{
        marginTop: 10,
        fontSize: 12.5,
        lineHeight: 1.5,
        color: textColor(tone, true),
      }}
    >
      {text}{" "}
      <a
        href="/cart"
        style={{
          color: tone === "dark" ? "var(--cream)" : "var(--terra-deep)",
          textDecoration: "underline",
        }}
      >
        View cart
      </a>
    </p>
  );
}

/**
 * Product page call to action under Add to cart. Renders nothing when this
 * blend has no available sample (draft, unpublished, or sold out).
 */
export function SampleCta({
  offer,
  offers,
}: {
  offer?: SampleOffer;
  offers: SampleOffer[];
}) {
  const inCart = useSampleIdsInCart();
  if (!offer) return null;
  const thisInCart = inCart.has(offer.merchandiseId);

  return (
    <div
      className="bal-sample-cta"
      style={{
        marginTop: 16,
        padding: "14px 16px",
        border: "1px dashed rgba(77,56,36,0.3)",
        borderRadius: 8,
        background: "rgba(255,252,246,0.6)",
      }}
    >
      <p
        className="serif"
        style={{ fontSize: 18, lineHeight: 1.2, color: "var(--ink)" }}
      >
        Not sure yet? Try a 20g sample
      </p>
      <p
        style={{
          marginTop: 6,
          fontSize: 12.5,
          lineHeight: 1.5,
          color: "var(--ink-2)",
        }}
      >
        The {offer.blend} sample is {offer.grind}. {SAMPLE_TERMS}
      </p>
      {offers.length > 1 ? <GrindList offers={offers} tone="light" /> : null}
      {thisInCart ? (
        <InCartNote
          tone="light"
          text={`A ${offer.blend} sample is already in your cart.`}
        />
      ) : (
        <SampleAddButton offer={offer} />
      )}
      <TryAllSamples offers={offers} tone="light" />
    </div>
  );
}

/** Homepage blend picker. Renders nothing when no sample is available. */
export function SamplePicker({ offers }: { offers: SampleOffer[] }) {
  const [selectedId, setSelectedId] = useState(offers[0]?.merchandiseId);
  const inCart = useSampleIdsInCart();
  const selected =
    offers.find((offer) => offer.merchandiseId === selectedId) ?? offers[0];
  if (!selected) return null;
  const allInCart = offers.every((offer) => inCart.has(offer.merchandiseId));

  return (
    <div style={{ minWidth: 260, maxWidth: 380 }}>
      <div
        role="radiogroup"
        aria-label="Choose a sample blend"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {offers.map((offer) => {
          const checked = offer.merchandiseId === selected.merchandiseId;
          return (
            <button
              key={offer.merchandiseId}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setSelectedId(offer.merchandiseId)}
              style={{
                minHeight: 36,
                padding: "0 14px",
                borderRadius: 999,
                border: "1px solid var(--cream)",
                background: checked ? "var(--cream)" : "transparent",
                color: checked ? "var(--ink)" : "var(--cream)",
                fontSize: 13,
              }}
            >
              {offer.blend}
            </button>
          );
        })}
      </div>
      <p
        style={{
          marginTop: 10,
          fontSize: 13,
          lineHeight: 1.5,
          color: "rgba(244,239,230,0.9)",
        }}
      >
        {selected.blend} is {selected.grind}.
      </p>
      {allInCart ? (
        <InCartNote
          tone="dark"
          text="All the samples are in your cart. One of each per order."
        />
      ) : inCart.has(selected.merchandiseId) ? (
        <InCartNote
          tone="dark"
          text={`A ${selected.blend} sample is already in your cart.`}
        />
      ) : (
        <SampleAddButton offer={selected} />
      )}
      <TryAllSamples offers={offers} tone="dark" />
    </div>
  );
}

export { GrindList };
