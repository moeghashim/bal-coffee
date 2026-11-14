import type { Metadata } from "next";
import { EventFrame } from "components/event/event-frame";
import { EventMenu } from "components/event/menu";
import { getEventDrinks } from "lib/catalog";
import { toEventMenuDrink, type EventMenuDrink } from "lib/event/menu";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event drinks",
  description: "Order a drink for pickup at a BAL Coffee event.",
};

export default async function EventPage() {
  let drinks: EventMenuDrink[] = [];
  try {
    drinks = (await getEventDrinks())
      .map(toEventMenuDrink)
      .filter((drink): drink is EventMenuDrink => drink != null);
  } catch {
    drinks = [];
  }

  return (
    <EventFrame
      kicker="In person"
      title="BAL Coffee"
      lede="Coffee-style drinks made from roasted date seeds instead of coffee beans. Naturally caffeine-free, roasted in Houston."
    >
      <h2 className="serif bal-event-order-heading">Order a drink</h2>
      <p className="bal-event-temp-cue">
        We recommend iced. Hot is available too.
      </p>
      <p className="bal-event-lede">
        Pick what you want, pay online, and we’ll text you when it’s ready for
        pickup.
      </p>
      <EventMenu drinks={drinks} />
    </EventFrame>
  );
}
