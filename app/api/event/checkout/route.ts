import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getEventDrinks } from "lib/catalog";
import { createEventCheckoutCart } from "lib/commerce";
import { isAllowedCheckoutUrl } from "lib/event/checkout-url";
import { toEventMenuDrink, type EventMenuDrink } from "lib/event/menu";
import { normalizeFirstName, toUsE164 } from "lib/event/phone";
import {
  DEFAULT_ICE,
  DEFAULT_SWEETNESS,
  DEFAULT_TEMPERATURE,
  lineAttributes,
  parseIce,
  parseSweetness,
  parseTemperature,
  type DrinkIce,
  type DrinkSweetness,
  type DrinkTemperature,
} from "lib/event/temperature";

export const dynamic = "force-dynamic";

const VARIANT_ID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;
const MAX_PER_LINE = 12;
const MAX_TOTAL = 24;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Enter your name, phone, and drinks." }, 400);
  }
  if (!body || typeof body !== "object") {
    return json({ error: "Enter your name, phone, and drinks." }, 400);
  }
  const record = body as Record<string, unknown>;
  const name = normalizeFirstName(
    typeof record.name === "string" ? record.name : "",
  );
  const phone = toUsE164(typeof record.phone === "string" ? record.phone : "");
  if (!name) return json({ error: "Enter a first name." }, 400);
  if (!phone) return json({ error: "Enter a valid US mobile number." }, 400);
  if (record.consent !== true) {
    return json(
      { error: "Tick the text-message box so we can tell you it's ready." },
      400,
    );
  }

  const requested = normalizeLines(record.lines);
  if (!requested.ok) return json({ error: requested.error }, 400);

  let drinks: EventMenuDrink[] = [];
  try {
    drinks = (await getEventDrinks())
      .map(toEventMenuDrink)
      .filter((drink): drink is EventMenuDrink => drink != null);
  } catch {
    drinks = [];
  }
  const variants = new Map(
    drinks.flatMap((drink) =>
      drink.variants.map((variant) => [variant.id, variant] as const),
    ),
  );
  if (variants.size === 0) {
    return json({ error: "The drink menu is not available yet." }, 503);
  }

  for (const line of requested.lines) {
    const variant = variants.get(line.merchandiseId);
    if (!variant || !variant.available) {
      return json(
        { error: "One of those drinks is no longer available." },
        400,
      );
    }
  }

  const ref = `evt_${randomBytes(16).toString("base64url")}`;
  try {
    const cart = await createEventCheckoutCart(request, {
      lines: requested.lines,
      note: `BAL event pickup for ${name}`,
      attributes: [
        { key: "order_source", value: "event" },
        { key: "customer_name", value: name },
        { key: "customer_phone", value: phone },
        { key: "sms_consent", value: "yes" },
        { key: "event_ref", value: ref },
      ],
    });
    if (!isAllowedCheckoutUrl(cart.checkoutUrl)) {
      const host = safeHost(cart.checkoutUrl);
      console.error("unexpected event checkout host", host);
      return json({ error: "Checkout URL was not recognized." }, 502);
    }
    return json({ checkoutUrl: cart.checkoutUrl, ref });
  } catch (error) {
    const message =
      error instanceof Error ? error.message.slice(0, 300) : "Checkout failed";
    console.error("event checkout failed");
    return json({ error: message || "Checkout failed. Try again." }, 502);
  }
}

function normalizeLines(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    return { ok: false as const, error: "Pick at least one drink." };
  }
  const totals = new Map<
    string,
    {
      merchandiseId: string;
      quantity: number;
      temperature: DrinkTemperature;
      ice?: DrinkIce;
      sweetness: DrinkSweetness;
    }
  >();
  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      return { ok: false as const, error: "Pick at least one drink." };
    }
    const record = entry as Record<string, unknown>;
    const merchandiseId =
      typeof record.merchandiseId === "string" ? record.merchandiseId : "";
    const quantity = Number(record.quantity);
    const temperature =
      record.temperature === undefined
        ? DEFAULT_TEMPERATURE
        : parseTemperature(record.temperature);
    const sweetness =
      record.sweetness === undefined
        ? DEFAULT_SWEETNESS
        : parseSweetness(record.sweetness);
    if (!VARIANT_ID.test(merchandiseId)) {
      return { ok: false as const, error: "Pick a drink from the menu." };
    }
    if (!temperature) {
      return {
        ok: false as const,
        error: "Choose iced or hot for each drink.",
      };
    }
    if (!sweetness) {
      return {
        ok: false as const,
        error: "Choose a sweetness for each drink.",
      };
    }
    let ice: DrinkIce | undefined;
    if (temperature === "Iced") {
      ice =
        record.ice === undefined
          ? DEFAULT_ICE
          : (parseIce(record.ice) ?? undefined);
      if (!ice) {
        return {
          ok: false as const,
          error: "Choose an ice level for each iced drink.",
        };
      }
    }
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_PER_LINE
    ) {
      return {
        ok: false as const,
        error: `Quantity must be between 1 and ${MAX_PER_LINE}.`,
      };
    }
    const key = [merchandiseId, temperature, ice ?? "", sweetness].join("\0");
    const current = totals.get(key);
    totals.set(key, {
      merchandiseId,
      quantity: (current?.quantity ?? 0) + quantity,
      temperature,
      ice,
      sweetness,
    });
  }
  const lines = [...totals.values()].map((line) => ({
    merchandiseId: line.merchandiseId,
    quantity: line.quantity,
    attributes: lineAttributes(line),
  }));
  if (lines.some((line) => line.quantity > MAX_PER_LINE)) {
    return {
      ok: false as const,
      error: `Quantity must be between 1 and ${MAX_PER_LINE}.`,
    };
  }
  const total = lines.reduce((sum, line) => sum + line.quantity, 0);
  if (total > MAX_TOTAL) {
    return { ok: false as const, error: `Limit is ${MAX_TOTAL} drinks.` };
  }
  return { ok: true as const, lines };
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function safeHost(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return "invalid";
  }
}
