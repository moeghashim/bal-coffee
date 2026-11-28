const items = [
  {
    title: "100% date seeds",
    body: "No coffee beans. No additives or preservatives.",
  },
  {
    title: "Naturally caffeine-free",
    body: "Brew it in the morning or at night.",
  },
  { title: "Acid-free", body: "A smooth cup, roasted from date seeds." },
  {
    title: "Small-batch in Houston",
    body: "Roasted in small batches, then shipped across the US.",
  },
];

export function TrustStrip() {
  return (
    <section className="bal-trust" aria-label="Why BAL">
      <div className="bal-trust-grid">
        {items.map((item) => (
          <div key={item.title} className="bal-trust-item">
            <p className="mono bal-trust-title">{item.title}</p>
            <p className="bal-trust-body">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
