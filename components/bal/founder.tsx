import Image from "next/image";

function BeansAccent() {
  return (
    <svg
      width="160"
      height="120"
      viewBox="0 0 160 120"
      fill="none"
      stroke="var(--ink-2)"
      strokeWidth="1"
      style={{
        position: "absolute",
        right: -10,
        bottom: -28,
        opacity: 0.45,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <ellipse cx="50" cy="70" rx="22" ry="10" transform="rotate(-20 50 70)" />
      <path d="M30 75 C 50 60, 60 60, 70 70" transform="rotate(-20 50 70)" />
      <ellipse cx="100" cy="60" rx="24" ry="11" transform="rotate(15 100 60)" />
      <path d="M76 64 C 100 50, 116 56, 124 64" transform="rotate(15 100 60)" />
      <ellipse cx="120" cy="92" rx="20" ry="9" transform="rotate(-10 120 92)" />
      <path
        d="M100 95 C 120 84, 130 86, 140 92"
        transform="rotate(-10 120 92)"
      />
    </svg>
  );
}

export function Founder() {
  return (
    <section
      id="about"
      style={{
        position: "relative",
        background: "var(--cream)",
        overflow: "hidden",
        // Breathing room so the founder image doesn't butt against the
        // full-bleed "end of your day" art directly above it.
        marginTop: "clamp(48px, 6vw, 88px)",
        scrollMarginTop: "88px",
      }}
    >
      <div
        className="bal-founder-outer"
        style={{
          display: "grid",
          gridTemplateColumns: "0.85fr 1.4fr",
          alignItems: "stretch",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          className="bal-founder-image"
          style={{
            position: "relative",
            minHeight: 460,
            background: "#caa988",
          }}
        >
          <Image
            src="/founder.png"
            alt="Batool, founder of BAL Coffee"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div
          className="bal-founder-inner"
          style={{
            padding: "80px 56px",
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 48,
            alignItems: "center",
            position: "relative",
          }}
        >
          <div>
            <p
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
              }}
            >
              Our story
            </p>
            <h2
              className="serif"
              style={{
                marginTop: 14,
                fontSize: "clamp(30px, 2.8vw, 40px)",
                lineHeight: 1.1,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              Rooted in heritage,
              <br />
              crafted with heart
            </h2>
            <p
              style={{
                marginTop: 22,
                fontSize: 14,
                lineHeight: 1.65,
                color: "var(--ink-2)",
                maxWidth: 360,
              }}
            >
              BAL Coffee was born from a simple belief: the best rituals come
              from nature. As a mother and coffee lover, I created a brew that
              brings people together—anytime, day or night.
            </p>
            <p
              className="serif"
              style={{
                marginTop: 22,
                fontSize: 18,
                fontStyle: "italic",
                color: "var(--ink)",
              }}
            >
              — Batool
            </p>
            <p
              className="mono"
              style={{
                marginTop: 4,
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
              }}
            >
              Founder, BAL Coffee
            </p>
          </div>
          <div
            className="bal-founder-quote"
            style={{
              position: "relative",
              padding: "32px 36px",
              background: "var(--cream-3)",
              border: "1px solid var(--line-soft)",
              boxShadow: "0 18px 40px -28px rgba(42,31,23,0.3)",
              transform: "rotate(-1deg)",
            }}
          >
            <span
              className="serif"
              style={{
                position: "absolute",
                top: 6,
                left: 16,
                fontSize: 56,
                color: "var(--ink-soft)",
                lineHeight: 1,
                fontStyle: "italic",
              }}
              aria-hidden
            >
              &ldquo;
            </span>
            <p
              className="serif"
              style={{
                marginTop: 22,
                fontSize: 17,
                lineHeight: 1.55,
                color: "var(--ink)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              I wanted to create a coffee that my family could enjoy at any time
              of day—one that honors our heritage and the goodness of the land.
            </p>
            <BeansAccent />
          </div>
        </div>
      </div>
    </section>
  );
}
