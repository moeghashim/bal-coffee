const stroke = "#f4efe6";

function PercentIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 36 36"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="18" r="15" />
      <line x1="11" y1="25" x2="25" y2="11" />
      <circle cx="13" cy="13" r="2.4" />
      <circle cx="23" cy="23" r="2.4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="34"
      height="32"
      viewBox="0 0 40 36"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="10" width="20" height="14" />
      <path d="M23 14 H 31 L 36 19 V 24 H 23 Z" />
      <circle cx="11" cy="27" r="3" />
      <circle cx="29" cy="27" r="3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 36 36"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="18" r="15" />
      <line x1="14" y1="12" x2="14" y2="24" />
      <line x1="22" y1="12" x2="22" y2="24" />
    </svg>
  );
}

const perks = [
  { icon: <PercentIcon />, label: "15% off\nevery order" },
  { icon: <TruckIcon />, label: "Flexible\ndeliveries" },
  { icon: <PauseIcon />, label: "Pause or\ncancel anytime" },
];

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
          gridTemplateColumns: "1.2fr auto auto",
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
            Never run out of your ritual
          </h3>
          <p
            style={{
              marginTop: 10,
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "rgba(244,239,230,0.9)",
              maxWidth: 420,
            }}
          >
            Subscribe and save 15% on every order.
            <br />
            Delivered fresh, on your schedule.
          </p>
        </div>
        <div
          className="bal-subscription-perks"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, auto)",
            gap: 36,
          }}
        >
          {perks.map((p, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {p.icon}
              </div>
              <p
                className="mono"
                style={{
                  marginTop: 8,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--cream)",
                  whiteSpace: "pre-line",
                  lineHeight: 1.5,
                }}
              >
                {p.label}
              </p>
            </div>
          ))}
        </div>
        <a
          href="#start-subscription"
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
          Start your subscription
        </a>
      </div>
    </section>
  );
}
