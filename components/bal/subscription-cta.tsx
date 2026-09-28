const perks = ["15% off", "Flexible deliveries", "Pause anytime"];

export function SubscriptionCTA() {
  return (
    <section
      id="subscription"
      className="bal-kraft-subscribe"
      style={{ background: "var(--navy)", padding: "72px 80px" }}
    >
      <div
        className="bal-kraft-subscribe-row"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div>
          <h2
            className="label-face"
            style={{
              fontSize: "clamp(34px, 3.6vw, 48px)",
              lineHeight: 1,
              fontWeight: 700,
              color: "var(--label)",
            }}
          >
            Never run out of your{" "}
            <span style={{ color: "var(--stamp-soft)" }}>bag.</span>
          </h2>
          <p
            style={{
              marginTop: 12,
              fontSize: 16,
              lineHeight: 1.55,
              color: "rgba(247,238,221,0.82)",
            }}
          >
            Subscribe and save 15% on every order. Delivered fresh, on your
            schedule.
          </p>
          <ul
            className="mono"
            style={{
              marginTop: 18,
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 24px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--label)",
            }}
          >
            {perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </div>
        <div
          className="bal-kraft-subscribe-actions"
          style={{ display: "flex" }}
        >
          <a
            href="#start-subscription"
            className="label-face bal-kraft-btn bal-kraft-btn-stamp"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 58,
              padding: "0 30px",
              borderRadius: 12,
              background: "var(--stamp)",
              color: "var(--label)",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}
          >
            Start your subscription
          </a>
        </div>
      </div>
    </section>
  );
}
