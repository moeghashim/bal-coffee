export function SubscriptionCTA() {
  return (
    <section
      id="subscription"
      className="bal-subscription"
      style={{
        background: "var(--terra)",
        color: "var(--cream)",
        padding: "44px 56px",
      }}
    >
      <div
        className="bal-subscription-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr auto",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <h3
            className="serif"
            style={{
              fontSize: "clamp(26px, 2.4vw, 34px)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "var(--cream)",
            }}
          >
            Order when you want
          </h3>
          <p
            style={{
              marginTop: 10,
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "rgba(244,239,230,0.9)",
              maxWidth: 460,
            }}
          >
            A recurring subscription isn&apos;t available yet. Shop a bag
            whenever you like. Shipping is calculated at checkout.
          </p>
        </div>
        <a
          href="/products"
          className="mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 28px",
            background: "var(--cream)",
            color: "var(--ink)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            borderRadius: 2,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Shop the coffee
        </a>
      </div>
    </section>
  );
}
