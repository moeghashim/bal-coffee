import type { Metadata } from "next";
import { EventFrame } from "components/event/event-frame";
import { OrderStatus } from "components/event/order-status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order status",
  description: "Status for a BAL Coffee event drink order.",
};

export default async function EventOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const eventRef = ref?.trim() ?? "";
  const valid = /^evt_[A-Za-z0-9_-]{20,40}$/.test(eventRef);

  return (
    <EventFrame kicker="Event order" title="Your order">
      {valid ? (
        <OrderStatus eventRef={eventRef} />
      ) : (
        <p className="bal-event-empty">
          This link is missing an order reference.{" "}
          <a href="/event">Start from the menu.</a>
        </p>
      )}
    </EventFrame>
  );
}
