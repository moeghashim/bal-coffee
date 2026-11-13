import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { parseShopifyPaidOrder } from "lib/event/orders";
import { getEventStore } from "lib/event/store";

const HANDLED_TOPICS = new Set([
  "products/create",
  "products/update",
  "orders/create",
  "orders/updated",
  "orders/paid",
  "customers/create",
]);

export async function POST(req: NextRequest) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "SHOPIFY_WEBHOOK_SECRET not configured" },
      { status: 500 },
    );
  }

  const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
  const topic = req.headers.get("x-shopify-topic");
  const shopDomain = req.headers.get("x-shopify-shop-domain");

  if (!hmacHeader || !topic) {
    return NextResponse.json(
      { error: "Missing required Shopify webhook headers" },
      { status: 401 },
    );
  }

  const rawBody = await req.text();
  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  if (!timingSafeEqual(computed, hmacHeader)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (!HANDLED_TOPICS.has(topic)) {
    return NextResponse.json({ ok: true, ignored: topic });
  }

  if (topic === "products/create" || topic === "products/update") {
    revalidatePath("/", "layout");
    revalidatePath("/products", "layout");
  }

  // orders/paid only. orders/create also fires for unpaid checkouts, so it
  // would put abandoned carts on the event board. Cart attributes written at
  // checkout (order_source=event) are what mark an order as an event order.
  if (topic === "orders/paid") {
    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const draft = parseShopifyPaidOrder(payload);
    if (!draft) {
      return NextResponse.json({ ok: true, topic, shop: shopDomain });
    }
    try {
      await getEventStore().savePaid(draft);
    } catch (error) {
      console.error("event order ingest failed", draft.id, error);
      return NextResponse.json(
        { error: "Event order was not stored" },
        { status: 500 },
      );
    }
    return NextResponse.json({
      ok: true,
      topic,
      shop: shopDomain,
      eventOrder: draft.number,
    });
  }

  return NextResponse.json({ ok: true, topic, shop: shopDomain });
}

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}
