import { NextResponse, type NextRequest } from "next/server";
import { toPublicOrder } from "lib/event/orders";
import { eventStoreIsDurable, getEventStore } from "lib/event/store";

export const dynamic = "force-dynamic";

const REF = /^evt_[A-Za-z0-9_-]{20,40}$/;

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref")?.trim() ?? "";
  if (!REF.test(ref)) {
    return NextResponse.json(
      { error: "That order link is not valid." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const durable = eventStoreIsDurable();
  try {
    const order = await getEventStore().getByRef(ref);
    return NextResponse.json(
      {
        durable,
        order: order ? toPublicOrder(order) : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error(
      "event status read failed",
      error instanceof Error ? error.message : "",
    );
    return NextResponse.json(
      { durable, order: null, error: "Status is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
