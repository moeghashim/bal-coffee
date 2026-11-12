export type PublishedReview = {
  id: string;
  quote: string;
  author: string;
};

/**
 * TODO(judge.me): Render "What our customers say" only when real, published
 * reviews exist. Pass those reviews in from Judge.me (see reviews_plan.md).
 * Until then this returns null: no placeholder stars, no sample quotes, and
 * no AggregateRating. When reviews exist, ratings belong on each product
 * page, not on this landing page.
 */
export function CustomerReviews({ reviews }: { reviews: PublishedReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <section
      id="reviews"
      aria-labelledby="customer-reviews-heading"
      className="bal-landing-pad"
      style={{ scrollMarginTop: 96, padding: "48px 56px 8px" }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h2
          id="customer-reviews-heading"
          className="serif"
          style={{
            fontSize: "clamp(28px, 3vw, 36px)",
            fontWeight: 500,
            lineHeight: 1.15,
            color: "var(--ink)",
          }}
        >
          What our customers say
        </h2>
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 16,
          }}
        >
          {reviews.map((review) => (
            <figure
              key={review.id}
              style={{
                margin: 0,
                padding: 18,
                border: "1px solid rgba(77,56,36,0.16)",
                borderRadius: 12,
                background: "rgba(255,252,246,0.78)",
              }}
            >
              <blockquote
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--ink)",
                }}
              >
                {review.quote}
              </blockquote>
              <figcaption
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: "var(--ink-soft)",
                }}
              >
                {review.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
