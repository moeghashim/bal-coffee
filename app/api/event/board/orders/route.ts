import { NextResponse, type NextRequest } from "next/server";
import {
  BOARD_COOKIE,
  boardCookieMatches,
  boardPasscode,
} from "lib/event/board-auth";
import type { EventOrder } from "lib/event/orders";
import { eventStoreIsDurable, getEventStore } from "lib/event/store";
import { markEventOrderMaking, markEventOrderReady } from "lib/event/workflow";

export const dynamic = "force-dynamic";

const ORDER_ID = /^[\w:/-]{1,80}$/;

export async function GET(request: NextRequest) {
  const denied = authorize(request);
  if (denied) return denied;
  try {
    const orders = (await getEventStore().list()).map(staffOrder);
    return json({ durable: eventStoreIsDurable(), orders });
  } catch (error) {
    console.error(
      "event board list failed",
      error instanceof Error ? error.message : "",
    );
    return json({ error: "Could not load orders." }, 503);
  }
}

export async function POST(request: NextRequest) {
  const denied = authorize(request);
  if (denied) return denied;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Missing order." }, 400);
  }
  const record =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const id = typeof record.id === "string" ? record.id : "";
  const action = record.action;
  if (!ORDER_ID.test(id) || (action !== "making" && action !== "ready")) {
    return json({ error: "Missing order." }, 400);
  }

  if (action === "making") {
    const order = await markEventOrderMaking(id);
    if (!order) return json({ error: "Order not found." }, 404);
    return json({ order: staffOrder(order) });
  }

  const result = await markEventOrderReady(id);
  return json(
    {
      order: result.order ? staffOrder(result.order) : undefined,
      sms: "sms" in result ? result.sms : undefined,
      error: "error" in result ? result.error : undefined,
    },
    result.httpStatus,
  );
}

function authorize(request: NextRequest) {
  if (!boardPasscode()) {
    return json(
      { error: "Set EVENT_BOARD_PASSCODE before using the board." },
      503,
    );
  }
  if (!boardCookieMatches(request.cookies.get(BOARD_COOKIE)?.value)) {
    return json({ error: "Sign in." }, 401);
  }
  return null;
}

function staffOrder(order: EventOrder) {
  return {
    id: order.id,
    number: order.number,
    name: order.name,
    phone: order.phone,
    consent: order.consent,
    drinks: order.drinks,
    status: order.status,
    smsSent: order.smsSent,
    smsError: order.smsError ?? null,
    createdAt: order.createdAt,
  };
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
