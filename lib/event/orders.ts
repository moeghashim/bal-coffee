import { toUsE164 } from "./phone";

export type EventDrinkLine = {
  title: string;
  variant?: string;
  quantity: number;
};

export type EventOrderDraft = {
  id: string;
  number: string;
  name: string;
  phone: string;
  consent: boolean;
  drinks: EventDrinkLine[];
  ref?: string;
  createdAt: string;
};

export type EventOrderStatus = "new" | "making" | "ready";

export type EventOrder = EventOrderDraft & {
  status: EventOrderStatus;
  smsSent: boolean;
  smsSid?: string;
  smsError?: string;
  updatedAt: string;
};

export type PublicEventOrder = {
  number: string;
  name: string;
  status: EventOrderStatus;
  drinks: EventDrinkLine[];
  createdAt: string;
};

const CONSENT_YES = new Set(["yes", "true", "1"]);

export function readySmsBody(name: string, number: string) {
  const safeName =
    name
      .replace(/[\u0000-\u001f]/g, " ")
      .replace(/[^\p{L}\p{N} .'’-]/gu, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 40) || "there";
  const digits = number.replace(/\D/g, "");
  return `Hi ${safeName}, your BAL Coffee order #${digits} is ready for pickup!`;
}

export function toPublicOrder(order: EventOrder): PublicEventOrder {
  return {
    number: order.number,
    name: order.name,
    status: order.status,
    drinks: order.drinks,
    createdAt: order.createdAt,
  };
}

export function mergePaidOrder(
  existing: EventOrder | null,
  draft: EventOrderDraft,
  now: string,
): EventOrder {
  if (!existing) {
    return {
      ...draft,
      status: "new",
      smsSent: false,
      createdAt: draft.createdAt,
      updatedAt: now,
    };
  }
  return {
    ...existing,
    number: draft.number || existing.number,
    name: draft.name || existing.name,
    phone: draft.phone || existing.phone,
    consent: existing.consent || draft.consent,
    drinks: draft.drinks.length > 0 ? draft.drinks : existing.drinks,
    ref: existing.ref || draft.ref,
    updatedAt: now,
  };
}

export function parseShopifyPaidOrder(
  payload: unknown,
): EventOrderDraft | null {
  const order = unwrapOrder(payload);
  if (!order) return null;

  const attributes = attributeMap(order);
  if (attributes.get("order_source")?.trim().toLowerCase() !== "event") {
    return null;
  }

  const financial = stringValue(order.financial_status);
  if (financial && financial !== "paid" && financial !== "partially_paid") {
    return null;
  }

  const id = stringValue(order.id);
  if (!id) return null;

  const number = orderNumber(order);
  if (!number) return null;

  const phoneInput =
    attributes.get("customer_phone") ||
    stringValue(order.phone) ||
    nestedString(order.customer, "phone") ||
    "";
  const phone = toUsE164(phoneInput) || phoneInput.trim();
  const name =
    cleanName(attributes.get("customer_name")) ||
    cleanName(nestedString(order.customer, "first_name")) ||
    cleanName(nestedString(order.billing_address, "first_name")) ||
    "Guest";
  const ref = attributes.get("event_ref")?.trim() || undefined;
  const createdAt =
    stringValue(order.created_at) ||
    stringValue(order.processed_at) ||
    new Date().toISOString();

  return {
    id,
    number,
    name,
    phone,
    consent: CONSENT_YES.has(
      attributes.get("sms_consent")?.trim().toLowerCase() ?? "",
    ),
    drinks: lineItems(order.line_items),
    ref,
    createdAt,
  };
}

function unwrapOrder(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const nested = record.order;
  if (nested && typeof nested === "object") {
    return nested as Record<string, unknown>;
  }
  return record;
}

function attributeMap(order: Record<string, unknown>) {
  const map = new Map<string, string>();
  for (const list of [
    order.note_attributes,
    order.noteAttributes,
    order.custom_attributes,
    order.customAttributes,
  ]) {
    if (!Array.isArray(list)) continue;
    for (const entry of list) {
      if (!entry || typeof entry !== "object") continue;
      const record = entry as Record<string, unknown>;
      const key = record.name ?? record.key;
      const value = record.value;
      if (typeof key !== "string") continue;
      if (typeof value !== "string" && typeof value !== "number") continue;
      map.set(key.toLowerCase(), String(value));
    }
  }
  return map;
}

function lineItems(value: unknown): EventDrinkLine[] {
  if (!Array.isArray(value)) return [];
  const lines: EventDrinkLine[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const title = stringValue(record.title) || stringValue(record.name);
    if (!title) continue;
    const variant = stringValue(record.variant_title);
    const quantity = Math.max(1, Math.round(Number(record.quantity) || 1));
    lines.push({
      title,
      ...(variant && variant !== "Default Title" ? { variant } : {}),
      quantity,
    });
  }
  return lines;
}

function orderNumber(order: Record<string, unknown>) {
  const name = stringValue(order.name);
  const fromName = name?.replace(/^#/, "").trim();
  if (fromName) return fromName;
  const numeric = order.order_number;
  if (typeof numeric === "number" && Number.isFinite(numeric)) {
    return String(numeric);
  }
  return null;
}

function cleanName(value: string | undefined) {
  const name = value
    ?.replace(/[\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!name) return undefined;
  return name.slice(0, 40);
}

function stringValue(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function nestedString(value: unknown, key: string) {
  if (!value || typeof value !== "object") return undefined;
  return stringValue((value as Record<string, unknown>)[key]);
}
