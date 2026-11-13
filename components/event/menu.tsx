"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventMenuDrink } from "lib/event/menu";
import { checkoutStorageKey, toUsE164 } from "lib/event/phone";

const SMS_CONSENT =
  "Text me when my order is ready. Msg & data rates may apply. Reply STOP to opt out.";

export function EventMenu({ drinks }: { drinks: EventMenuDrink[] }) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const currency =
    drinks
      .flatMap((drink) => drink.variants)
      .find((variant) => variant.currencyCode)?.currencyCode ?? "USD";

  const summary = useMemo(() => {
    let count = 0;
    let cents = 0;
    const lines: { merchandiseId: string; quantity: number }[] = [];
    for (const drink of drinks) {
      for (const variant of drink.variants) {
        const quantity = quantities[variant.id] ?? 0;
        if (quantity < 1) continue;
        count += quantity;
        cents += Math.round(variant.priceAmount * 100) * quantity;
        lines.push({ merchandiseId: variant.id, quantity });
      }
    }
    return { count, cents, lines };
  }, [drinks, quantities]);

  function setQuantity(id: string, next: number) {
    const quantity = Math.max(0, Math.min(12, next));
    setQuantities((current) => {
      const copy = { ...current };
      if (quantity === 0) delete copy[id];
      else copy[id] = quantity;
      return copy;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (summary.lines.length === 0) {
      setError("Pick at least one drink.");
      return;
    }
    if (!name.trim()) {
      setError("Enter a first name.");
      return;
    }
    if (!toUsE164(phone)) {
      setError("Enter a valid US mobile number.");
      return;
    }
    if (!consent) {
      setError("Tick the text-message box so we can tell you it's ready.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/event/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          consent: true,
          lines: summary.lines,
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        checkoutUrl?: string;
        ref?: string;
        error?: string;
      } | null;
      if (!response.ok || !payload?.checkoutUrl || !payload.ref) {
        setError(payload?.error || "Checkout didn't start. Try again.");
        setPending(false);
        return;
      }
      sessionStorage.setItem(
        checkoutStorageKey(payload.ref),
        payload.checkoutUrl,
      );
      router.push(`/event/order?ref=${encodeURIComponent(payload.ref)}`);
    } catch {
      setError("Checkout didn't start. Check your connection and try again.");
      setPending(false);
    }
  }

  if (drinks.length === 0) {
    return (
      <p className="bal-event-empty" role="status">
        No drinks are on the menu yet. The counter can still take your order.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="bal-event-drinks">
        {drinks.map((drink) => (
          <article key={drink.handle} className="bal-event-drink">
            {drink.imageUrl ? (
              <img src={drink.imageUrl} alt={drink.imageAlt} />
            ) : (
              <div className="bal-event-drink-fallback serif" aria-hidden>
                {drink.name.slice(0, 1)}
              </div>
            )}
            <div>
              <h2 className="serif">{drink.name}</h2>
              <ul>
                {drink.variants.map((variant) => {
                  const quantity = quantities[variant.id] ?? 0;
                  return (
                    <li key={variant.id}>
                      <div>
                        {variant.label ? (
                          <p className="bal-event-variant">{variant.label}</p>
                        ) : null}
                        <p className="bal-event-price">
                          {variant.available ? variant.priceLabel : "Sold out"}
                        </p>
                      </div>
                      <div className="bal-event-qty">
                        <button
                          type="button"
                          aria-label={`Remove one ${drink.name}${variant.label ? ` ${variant.label}` : ""}`}
                          disabled={!variant.available || quantity === 0}
                          onClick={() => setQuantity(variant.id, quantity - 1)}
                        >
                          −
                        </button>
                        <span aria-live="polite">{quantity}</span>
                        <button
                          type="button"
                          aria-label={`Add one ${drink.name}${variant.label ? ` ${variant.label}` : ""}`}
                          disabled={!variant.available || quantity >= 12}
                          onClick={() => setQuantity(variant.id, quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <label className="bal-event-field">
        First name
        <input
          name="given-name"
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="next"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={40}
        />
      </label>
      <label className="bal-event-field">
        Mobile phone
        <input
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(713) 555-1212"
          enterKeyHint="done"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
      </label>
      <label className="bal-event-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>{SMS_CONSENT}</span>
      </label>
      {error ? (
        <p className="bal-event-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="bal-event-paybar">
        <p>
          {summary.count > 0
            ? `${summary.count} ${summary.count === 1 ? "drink" : "drinks"} · ${formatCents(summary.cents, currency)}`
            : "Select drinks"}
        </p>
        <button type="submit" className="bal-event-button" disabled={pending}>
          {pending ? "Starting checkout…" : "Continue to payment"}
        </button>
        <p className="bal-event-fine">
          You’ll pay on Shopify’s secure checkout. Tax is calculated there.
        </p>
        <p className="bal-event-fine">You can add a tip at checkout.</p>
      </div>
    </form>
  );
}

function formatCents(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
