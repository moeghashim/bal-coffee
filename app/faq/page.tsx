import { ReactNode } from "react";
import { PageShell } from "components/bal/page-shell";
import { pageMetadata, pageSeo } from "lib/seo";

const questions: { id: string; question: string; answer: ReactNode }[] = [
  {
    id: "what",
    question: "What is BAL Coffee?",
    answer:
      "BAL is roasted date seed coffee. The bags are made from date seeds, not coffee beans, and they are roasted in small batches.",
  },
  {
    id: "caffeine",
    question: "Does date seed coffee have caffeine?",
    answer:
      "The coffees are made from date seeds and are naturally caffeine-free. They are not decaffeinated coffee beans.",
  },
  {
    id: "decaf",
    question: "Is date seed coffee the same as decaf?",
    answer:
      "No. Decaf starts with coffee beans and has most of the caffeine removed. BAL never uses coffee beans. DateSpresso, GrounDate, and Eastern Brew are roasted date seeds.",
  },
  {
    id: "taste",
    question: "What does date seed coffee taste like?",
    answer: (
      <>
        Each bag tastes a little different. DateSpresso is rich and bold.
        GrounDate is smooth and mellow. Eastern Brew is warm and spiced. The
        flavor notes on each product page describe that bag:{" "}
        <a href="/products/datespresso" style={{ color: "var(--terra-deep)" }}>
          DateSpresso
        </a>
        ,{" "}
        <a href="/products/groundate" style={{ color: "var(--terra-deep)" }}>
          GrounDate
        </a>
        , and{" "}
        <a href="/products/eastern-brew" style={{ color: "var(--terra-deep)" }}>
          Eastern Brew
        </a>
        .
      </>
    ),
  },
  {
    id: "brew",
    question: "How do I brew it?",
    answer: (
      <>
        Use the method the bag was ground for.{" "}
        <a href="/products/datespresso" style={{ color: "var(--terra-deep)" }}>
          DateSpresso
        </a>{" "}
        is for espresso machines, lattes, and iced drinks.{" "}
        <a href="/products/groundate" style={{ color: "var(--terra-deep)" }}>
          GrounDate
        </a>{" "}
        is for drip, French press, and pour-over.{" "}
        <a href="/products/eastern-brew" style={{ color: "var(--terra-deep)" }}>
          Eastern Brew
        </a>{" "}
        is for a Turkish-style cup in a cezve. Each product page has the steps.
      </>
    ),
  },
  {
    id: "subscription",
    question: "Do you offer a subscription?",
    answer:
      "Not right now. You can order a bag whenever you like. We don't offer a subscribe-and-save discount until a subscription actually exists at checkout.",
  },
  {
    id: "shipping",
    question: "How much is shipping?",
    answer: (
      <>
        Shipping costs are calculated at checkout, before you pay. See{" "}
        <a href="/shipping" style={{ color: "var(--terra-deep)" }}>
          shipping and delivery
        </a>{" "}
        for how an order is tracked.
      </>
    ),
  },
  {
    id: "where",
    question: "Where does BAL ship?",
    answer:
      "BAL is an online-only company based in Houston, Texas. We sell and ship to addresses across the United States. Checkout shows the methods available for your address.",
  },
  {
    id: "track",
    question: "How do I track an order?",
    answer:
      "When an order ships, the tracking details are in the shipping email. If that email doesn't arrive, write to judy@balcoffee.com and include your order number.",
  },
  {
    id: "checkout",
    question: "Where does checkout happen?",
    answer:
      "Payment and shipping are handled by Shopify at checkout.balcoffee.com. BAL does not take card numbers on this website.",
  },
];

export const metadata = pageMetadata({
  title: pageSeo.faq.title,
  description: pageSeo.faq.description,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Date seed coffee FAQ"
      intro="Short answers from what we actually sell today. If yours isn't here, email us."
    >
      <div style={{ display: "grid", gap: 28 }}>
        {questions.map((item) => (
          <section key={item.id} id={item.id}>
            <h2
              className="serif"
              style={{ fontSize: 22, color: "var(--ink)", fontWeight: 500 }}
            >
              {item.question}
            </h2>
            <p style={{ marginTop: 8 }}>{item.answer}</p>
          </section>
        ))}
      </div>
      <p style={{ marginTop: 28 }}>
        Orders and returns:{" "}
        <a href="/returns" style={{ color: "var(--terra-deep)" }}>
          returns and exchanges
        </a>
        . Still stuck? Email{" "}
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
