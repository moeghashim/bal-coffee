import type { Metadata } from "next";
import { EventBoard } from "components/event/board";
import { EventFrame } from "components/event/event-frame";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event board",
  description: "Team board for BAL Coffee event drink orders.",
};

export default function EventBoardPage() {
  return (
    <EventFrame
      wide
      kicker="Team"
      title="Event board"
      lede="Paid event orders only. Press Ready to text the customer, once."
    >
      <EventBoard />
    </EventFrame>
  );
}
