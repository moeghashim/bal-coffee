"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { EventMenuDrink } from "lib/event/menu";
import { formatEventCartLine } from "lib/event/orders";
import { checkoutStorageKey, toUsE164 } from "lib/event/phone";
import {
  DEFAULT_ICE,
  DEFAULT_SWEETNESS,
  DEFAULT_TEMPERATURE,
  DRINK_TEMPERATURES,
  ICE_LEVELS,
  SWEETNESS_LEVELS,
  temperatureLabel,
  type DrinkIce,
  type DrinkSweetness,
  type DrinkTemperature,
} from "lib/event/temperature";

type DrinkChoices = {
  temperature: DrinkTemperature;
  ice: DrinkIce;
  sweetness: DrinkSweetness;
};

const DEFAULT_CHOICES: DrinkChoices = {
  temperature: DEFAULT_TEMPERATURE,
  ice: DEFAULT_ICE,
  sweetness: DEFAULT_SWEETNESS,
};

const SMS_CONSENT = (
  <>
    Text me when my order is ready. Msg & data rates may apply. Reply STOP to
    opt out. <a href="/terms">Terms</a> and{" "}
    <a href="/privacy">Privacy Policy</a>.
  </>
);
const MAX_PER_LINE = 12;
const MAX_TOTAL = 24;

type OrderLine = {
  key: string;
  handle: string;
  name: string;
  merchandiseId: string;
  milk: string;
  unitCents: number;
  quantity: number;
  temperature: DrinkTemperature;
  ice?: DrinkIce;
  sweetness: DrinkSweetness;
};

export function EventMenu({ drinks }: { drinks: EventMenuDrink[] }) {
  const router = useRouter();
  const [choices, setChoices] = useState<Record<string, DrinkChoices>>({});
  const [milkIds, setMilkIds] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const noticeTimer = useRef<number | null>(null);

  const currency =
    drinks
      .flatMap((drink) => drink.variants)
      .find((variant) => variant.currencyCode)?.currencyCode ?? "USD";
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const cents = lines.reduce(
    (sum, line) => sum + line.unitCents * line.quantity,
    0,
  );

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  function updateChoice(handle: string, patch: Partial<DrinkChoices>) {
    setChoices((current) => ({
      ...current,
      [handle]: { ...(current[handle] ?? DEFAULT_CHOICES), ...patch },
    }));
  }

  function addDrink(drink: EventMenuDrink) {
    const variant = selectedVariant(drink, milkIds[drink.handle]);
    if (!variant?.available) return;
    const choice = choices[drink.handle] ?? DEFAULT_CHOICES;
    const ice = choice.temperature === "Iced" ? choice.ice : undefined;
    const key = [
      variant.id,
      choice.temperature,
      ice ?? "",
      choice.sweetness,
    ].join("\0");
    const total = lines.reduce((sum, line) => sum + line.quantity, 0);
    const existing = lines.find((line) => line.key === key);
    if (total >= MAX_TOTAL || (existing && existing.quantity >= MAX_PER_LINE)) {
      setError(
        total >= MAX_TOTAL
          ? `Limit is ${MAX_TOTAL} drinks.`
          : `${MAX_PER_LINE} is the most of one drink.`,
      );
      return;
    }
    setError("");
    setLines((current) => {
      const match = current.find((line) => line.key === key);
      if (match) {
        return current.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [
        ...current,
        {
          key,
          handle: drink.handle,
          name: drink.name,
          merchandiseId: variant.id,
          milk: variant.label,
          unitCents: Math.round(variant.priceAmount * 100),
          quantity: 1,
          temperature: choice.temperature,
          sweetness: choice.sweetness,
          ...(ice ? { ice } : {}),
        },
      ];
    });
    setNotice(drink.handle);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 1600);
  }

  function setLineQuantity(key: string, quantity: number) {
    setLines((current) => {
      if (quantity < 1) return current.filter((line) => line.key !== key);
      const others = current
        .filter((line) => line.key !== key)
        .reduce((sum, line) => sum + line.quantity, 0);
      const next = Math.min(MAX_PER_LINE, quantity);
      if (others + next > MAX_TOTAL) return current;
      return current.map((line) =>
        line.key === key ? { ...line, quantity: next } : line,
      );
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (lines.length === 0) {
      setError("Add at least one drink.");
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
          lines: lines.map((line) => ({
            merchandiseId: line.merchandiseId,
            quantity: line.quantity,
            temperature: line.temperature,
            sweetness: line.sweetness,
            ...(line.ice ? { ice: line.ice } : {}),
          })),
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
        {drinks.map((drink) => {
          const choice = choices[drink.handle] ?? DEFAULT_CHOICES;
          const variant = selectedVariant(drink, milkIds[drink.handle]);
          const inOrder = lines
            .filter((line) => line.handle === drink.handle)
            .reduce((sum, line) => sum + line.quantity, 0);
          const milks = drink.variants.filter((item) => item.label);
          return (
            <article key={drink.handle} className="bal-event-drink">
              {drink.imageSrc ? (
                <Image
                  src={drink.imageSrc}
                  alt={drink.name}
                  width={112}
                  height={112}
                  className="bal-event-drink-photo"
                />
              ) : (
                <div className="bal-event-drink-fallback serif" aria-hidden>
                  {drink.name.slice(0, 1)}
                </div>
              )}
              <div>
                <h2 className="serif">{drink.name}</h2>
                {drink.description ? (
                  <p className="bal-event-drink-copy">{drink.description}</p>
                ) : null}
                {milks.length > 0 ? (
                  <ChoiceField
                    legend="Milk"
                    name={`milk-${drink.handle}`}
                    options={milks.map((item) => ({
                      value: item.id,
                      label: item.available
                        ? item.label
                        : `${item.label} · Sold out`,
                      disabled: !item.available,
                    }))}
                    selected={variant?.id ?? ""}
                    onSelect={(id) =>
                      setMilkIds((current) => ({
                        ...current,
                        [drink.handle]: id,
                      }))
                    }
                  />
                ) : null}
                <ChoiceField
                  legend="Temperature"
                  name={`temperature-${drink.handle}`}
                  options={DRINK_TEMPERATURES.map((temperature) => ({
                    value: temperature,
                    label: temperatureLabel(temperature),
                  }))}
                  selected={choice.temperature}
                  onSelect={(temperature) =>
                    updateChoice(drink.handle, { temperature })
                  }
                />
                {choice.temperature === "Iced" ? (
                  <ChoiceField
                    legend="Ice"
                    name={`ice-${drink.handle}`}
                    options={ICE_LEVELS.map((ice) => ({
                      value: ice,
                      label: ice,
                    }))}
                    selected={choice.ice}
                    onSelect={(ice) => updateChoice(drink.handle, { ice })}
                  />
                ) : null}
                <ChoiceField
                  legend="Sweetness"
                  name={`sweetness-${drink.handle}`}
                  options={SWEETNESS_LEVELS.map((sweetness) => ({
                    value: sweetness,
                    label: sweetness,
                  }))}
                  selected={choice.sweetness}
                  onSelect={(sweetness) =>
                    updateChoice(drink.handle, { sweetness })
                  }
                />
                {inOrder > 0 ? (
                  <p className="bal-event-badge" aria-live="polite">
                    {inOrder} in your order
                  </p>
                ) : null}
                <button
                  type="button"
                  className="bal-event-button bal-event-add"
                  disabled={!variant?.available}
                  onClick={() => addDrink(drink)}
                >
                  {variant?.available
                    ? `Add to order · ${variant.priceLabel}`
                    : "Sold out"}
                </button>
                {notice === drink.handle ? (
                  <p className="bal-event-added" role="status">
                    Added ✓
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <section
        id="your-order"
        className="bal-event-order"
        aria-label="Your order"
      >
        <div className="bal-event-order-head">
          <h2 className="serif">Your order</h2>
          <p>
            {count > 0
              ? `${count} ${count === 1 ? "drink" : "drinks"} · ${formatCents(cents, currency)}`
              : "Nothing added yet"}
          </p>
        </div>
        {lines.length === 0 ? (
          <p className="bal-event-fine">
            Milk, temperature, ice, and sweetness only set up the next drink.
            Tap Add to order to put it here.
          </p>
        ) : (
          <ul className="bal-event-lines bal-event-order-lines">
            {lines.map((line) => (
              <li key={line.key}>
                <p>
                  {formatEventCartLine({
                    quantity: line.quantity,
                    title: line.name,
                    milk: line.milk,
                    temperature: line.temperature,
                    ice: line.ice,
                    sweetness: line.sweetness,
                  })}
                </p>
                <div className="bal-event-line-actions">
                  <div className="bal-event-qty">
                    <button
                      type="button"
                      aria-label={`Remove one ${line.name}`}
                      onClick={() =>
                        setLineQuantity(line.key, line.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span aria-live="polite">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${line.name}`}
                      onClick={() =>
                        setLineQuantity(line.key, line.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="bal-event-remove"
                    onClick={() => setLineQuantity(line.key, 0)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
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
        <button
          type="submit"
          className="bal-event-button"
          disabled={pending || count === 0}
        >
          {pending
            ? "Starting checkout…"
            : count > 0
              ? `Pay ${formatCents(cents, currency)}`
              : "Pay"}
        </button>
        <p className="bal-event-fine">
          You’ll pay on Shopify’s secure checkout. Tax is calculated there.
        </p>
        <p className="bal-event-fine">You can add a tip at checkout.</p>
      </section>
      <div className="bal-event-dock">
        <p>
          {count > 0
            ? `Your order · ${count} ${count === 1 ? "drink" : "drinks"} · ${formatCents(cents, currency)}`
            : "Your order · Nothing added yet"}
        </p>
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("your-order")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          Review
        </button>
      </div>
    </form>
  );
}

function selectedVariant(drink: EventMenuDrink, selectedId?: string) {
  const chosen = drink.variants.find((variant) => variant.id === selectedId);
  if (chosen?.available) return chosen;
  return (
    drink.variants.find((variant) => variant.available) ?? drink.variants[0]
  );
}

function ChoiceField<T extends string>({
  legend,
  name,
  options,
  selected,
  onSelect,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string; disabled?: boolean }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <fieldset className="bal-event-temp">
      <legend>{legend}</legend>
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            disabled={option.disabled}
            onChange={() => onSelect(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

function formatCents(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
