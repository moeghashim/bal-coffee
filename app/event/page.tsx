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
      title="Order a drink"
      lede="Pick what you want, pay online, and we’ll text you when it’s ready for pickup."
    >
      <EventMenu drinks={drinks} />
    </EventFrame>
  );
}
