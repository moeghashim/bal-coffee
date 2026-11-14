"use client";

import { useEffect, useState } from "react";
import { isAllowedCheckoutUrl } from "lib/event/checkout-url";
import { formatEventDrinkLine, type PublicEventOrder } from "lib/event/orders";
import { checkoutStorageKey } from "lib/event/phone";

const STATUS_LABEL = {
  new: "Paid — in the queue",
  making: "Making now",
  ready: "Ready for pickup",
} as const;

export function OrderStatus({ eventRef }: { eventRef: string }) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [order, setOrder] = useState<PublicEventOrder | null>(null);
  const [durable, setDurable] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(checkoutStorageKey(eventRef));
    setCheckoutUrl(stored && isAllowedCheckoutUrl(stored) ? stored : null);
  }, [eventRef]);

  useEffect(() => {
    let stopped = false;
    let timer = 0;

    async function tick() {
      try {
        const response = await fetch(
          `/api/event/order?ref=${encodeURIComponent(eventRef)}`,
          { cache: "no-store" },
        );
        const payload = (await response.json().catch(() => null)) as {
          order?: PublicEventOrder | null;
          durable?: boolean;
          error?: string;
        } | null;
        if (stopped) return;
        if (!response.ok) {
          setError(payload?.error || "Could not check the order.");
          return;
        }
        setError("");
        setDurable(payload?.durable !== false);
        setOrder(payload?.order ?? null);
        if (payload?.order?.status === "ready") window.clearInterval(timer);
      } catch {
        if (!stopped) setError("Could not check the order.");
      }
    }

    void tick();
    timer = window.setInterval(() => void tick(), 4000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [eventRef]);

  const payHref = checkoutUrl;

  return (
    <div className="bal-event-status" aria-live="polite">
      {order ? (
        <>
          <p className="mono bal-event-kicker">Order</p>
          <p className="serif bal-event-number">#{order.number}</p>
          <p className="bal-event-status-label">{STATUS_LABEL[order.status]}</p>
          <p>
            {order.name}
            {order.status === "ready"
              ? ", this one is ready for pickup."
              : ", we’ll text you when it’s ready for pickup."}
          </p>
          <ul className="bal-event-lines">
            {order.drinks.map((drink, index) => (
              <li
                key={`${drink.title}-${drink.variant ?? ""}-${drink.temperature ?? ""}-${index}`}
              >
                {formatEventDrinkLine(drink)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p className="bal-event-status-label">Waiting for payment</p>
          <p>
            This page fills in your order number after Shopify confirms the
            payment. Keep it open, or come back to it.
          </p>
          {durable ? null : (
            <p className="bal-event-fine">
              Until event storage is connected, use the order number on the
              Shopify confirmation page.
            </p>
          )}
          {payHref ? (
            <a
              className="bal-event-button"
              href={payHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pay on Shopify
            </a>
          ) : (
            <a className="bal-event-button" href="/event">
              Back to the menu
            </a>
          )}
          <p className="bal-event-fine">
            Checkout opens in a new tab so this page can stay put.
          </p>
        </>
      )}
      {error ? (
        <p className="bal-event-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
