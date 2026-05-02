import { PageShell } from "components/bal/page-shell";

export const metadata = {
  title: "Journal",
  description: "Stories, brewing notes, and field reports from BAL Coffee.",
};

export default function JournalPage() {
  return (
    <PageShell
      eyebrow="Journal"
      title="Notes from the roastery"
      intro="Recipes, brewing notes, and the people behind BAL. New entries coming soon."
    />
  );
}
