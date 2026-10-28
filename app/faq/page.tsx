import { PageShell } from "components/bal/page-shell";

const questions: { question: string; answer: string }[] = [
  {
    question: "What is BAL Coffee?",
    answer:
      "BAL is a naturally caffeine-free coffee made from roasted date seeds, not coffee beans. It is roasted in small batches.",
  },
  {
    question: "Does it have caffeine?",
    answer:
      "The coffees are made from date seeds and are naturally caffeine-free. They are not decaffeinated coffee beans.",
  },
  {
    question: "Do you offer a subscription?",
    answer:
      "Not right now. You can order a bag whenever you like. We don't offer a subscribe-and-save discount until a subscription actually exists at checkout.",
  },
  {
    question: "How much is shipping?",
    answer:
      "Free shipping on orders over $50. Shipping for smaller orders is shown at checkout, before you pay.",
  },
  {
    question: "How do I track an order?",
    answer:
      "When an order ships, the tracking details are in the shipping email. If that email doesn't arrive, write to judy@balcoffee.com and include your order number.",
  },
  {
    question: "Where does checkout happen?",
    answer:
      "Payment and shipping are handled by Shopify at checkout.balcoffee.com. BAL does not take card numbers on this website.",
  },
];

export const metadata = {
  title: "FAQ",
  description: "Answers about BAL Coffee, shipping, and orders.",
};

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Frequently asked questions"
      intro="Short answers from what we actually sell today. If yours isn't here, email us."
    >
      <div style={{ display: "grid", gap: 18 }}>
        {questions.map((item) => (
          <details key={item.question}>
            <summary
              className="serif"
              style={{ fontSize: 20, color: "var(--ink)", cursor: "pointer" }}
            >
              {item.question}
            </summary>
            <p style={{ marginTop: 8 }}>{item.answer}</p>
          </details>
        ))}
      </div>
      <p style={{ marginTop: 28 }}>
        Still stuck? Email{" "}
        <a
          href="mailto:judy@balcoffee.com"
          style={{ color: "var(--terra-deep)" }}
        >
          judy@balcoffee.com
        </a>
        .
      </p>
    </PageShell>
  );
}
