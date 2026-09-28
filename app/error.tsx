"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "64px 20px",
      }}
    >
      <div
        className="label-panel label-shadow"
        style={{ maxWidth: 560, width: "100%", padding: "44px 40px" }}
      >
        <p className="label-kicker">Something went wrong</p>
        <h2 className="label-title" style={{ marginTop: 12, fontSize: 44 }}>
          Oh no!
        </h2>
        <p
          style={{
            marginTop: 16,
            fontSize: 16,
            lineHeight: 1.6,
            color: "var(--ink-2)",
          }}
        >
          There was an issue with our storefront. This could be a temporary
          issue, please try your action again.
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
          <button type="button" className="label-btn" onClick={() => reset()}>
            Try again
          </button>
          <a href="/" className="label-btn label-btn-outline">
            Home
          </a>
        </div>
      </div>
    </main>
  );
}
