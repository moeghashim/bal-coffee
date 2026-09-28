import Image from "next/image";

export function Founder() {
  return (
    <section
      id="about"
      className="bal-kraft-section"
      style={{ padding: "0 80px 110px", scrollMarginTop: 88 }}
    >
      <div
        className="bal-kraft-founder bal-kraft-shadow"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "460px minmax(0, 1fr)",
          background: "var(--label)",
          border: "2px solid var(--ink)",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "10px 10px 0 var(--ink)",
        }}
      >
        <div
          className="bal-kraft-founder-photo"
          style={{
            position: "relative",
            minHeight: 520,
            borderRight: "2px solid var(--ink)",
            background: "#caa988",
          }}
        >
          <Image
            src="/founder.png"
            alt="Judy Ghashim, founder of BAL Coffee, in front of shelves of BAL bags and copper coffee pots"
            fill
            sizes="(max-width: 1024px) 100vw, 460px"
            style={{ objectFit: "cover", objectPosition: "center 22%" }}
          />
        </div>
        <div
          className="bal-kraft-founder-copy"
          style={{
            padding: "56px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            className="mono"
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            Our story
          </p>
          <h2
            className="label-face"
            style={{
              marginTop: 16,
              fontSize: "clamp(34px, 4vw, 58px)",
              lineHeight: 0.98,
              fontWeight: 700,
              color: "var(--navy)",
            }}
          >
            Rooted in heritage.
            <br />
            <span style={{ color: "var(--stamp)" }}>Crafted with heart.</span>
          </h2>
          <p
            style={{
              marginTop: 24,
              maxWidth: 560,
              fontSize: 16,
              lineHeight: 1.65,
              color: "#3d2f23",
            }}
          >
            BAL Coffee was born from a simple belief: the best rituals come from
            nature. As a mother and coffee lover, I created a brew that brings
            people together—anytime, day or night.
          </p>
          <blockquote
            style={{
              marginTop: 20,
              maxWidth: 560,
              fontSize: 19,
              lineHeight: 1.5,
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            <span
              className="label-face"
              aria-hidden
              style={{ fontSize: 30, lineHeight: 0, color: "var(--stamp)" }}
            >
              &ldquo;
            </span>
            I wanted to create a coffee that my family could enjoy at any time
            of day—one that honors our heritage and the goodness of the
            land.&rdquo;
          </blockquote>
          <div
            style={{
              marginTop: 26,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "4px 14px",
            }}
          >
            <span
              className="label-face"
              style={{ fontSize: 24, fontWeight: 600, color: "var(--navy)" }}
            >
              Judy Ghashim
            </span>
            <span
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
              }}
            >
              Founder, BAL Coffee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
