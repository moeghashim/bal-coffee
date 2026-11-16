import { useId, type CSSProperties } from "react";
import { formatRating, type ProductReviewSummary } from "lib/judgeme";

const visuallyHidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const STAR_PATH =
  "M10 1.6 12.2 6.9l5.7.5-4.3 3.7 1.3 5.5L10 13.8 4.9 16.6l1.3-5.5L1.9 7.4l5.7-.5L10 1.6z";

export function ProductRatingSummary({
  summary,
}: {
  summary: ProductReviewSummary | null;
}) {
  if (!summary || summary.reviewCount < 1 || summary.reviews.length < 1) {
    return null;
  }
  const rating = formatRating(summary.ratingValue);
  if (!rating) return null;
  const countLabel = `${summary.reviewCount} ${summary.reviewCount === 1 ? "review" : "reviews"}`;

  return (
    <a
      href="#reviews"
      aria-label={`Rated ${rating} out of 5 from ${countLabel}`}
      style={{
        position: "relative",
        marginTop: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: "var(--ink-2)",
        fontSize: 14,
      }}
    >
      <span aria-hidden="true" style={{ display: "inline-flex", gap: 8 }}>
        <StarRating rating={summary.ratingValue} />
        <span>{rating}</span>
        <span style={{ color: "var(--ink-soft)" }}>{countLabel}</span>
      </span>
    </a>
  );
}

export function ProductReviews({
  summary,
}: {
  summary: ProductReviewSummary | null;
}) {
  if (!summary || summary.reviews.length < 1) return null;

  return (
    <section
      id="reviews"
      aria-labelledby="product-reviews-heading"
      className="bal-product-reviews-section"
      style={{ padding: "28px 56px 8px", scrollMarginTop: 96 }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <h2
          id="product-reviews-heading"
          className="serif"
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "var(--ink)",
            letterSpacing: 0,
          }}
        >
          Reviews
        </h2>
        <div
          className="bal-product-reviews-grid"
          style={{
            marginTop: 14,
            display: "grid",
            gap: 12,
            maxWidth: 760,
          }}
        >
          {summary.reviews.map((review) => (
            <article
              key={review.id}
              style={{
                position: "relative",
                padding: 18,
                border: "1px solid rgba(77,56,36,0.16)",
                borderRadius: 10,
                background: "rgba(255,252,246,0.74)",
              }}
            >
              <span style={visuallyHidden}>Rated {review.rating} out of 5</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <StarRating rating={review.rating} />
                <time
                  dateTime={review.publishedAt.slice(0, 10)}
                  style={{ fontSize: 12, color: "var(--ink-soft)" }}
                >
                  {formatReviewDate(review.publishedAt)}
                </time>
              </div>
              {review.title ? (
                <h3
                  className="serif"
                  style={{
                    marginTop: 10,
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--ink)",
                  }}
                >
                  {review.title}
                </h3>
              ) : null}
              {review.body ? (
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 14.5,
                    lineHeight: 1.55,
                    color: "var(--ink-2)",
                  }}
                >
                  {review.body}
                </p>
              ) : null}
              <p
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  color: "var(--ink-soft)",
                }}
              >
                {review.reviewerName}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarRating({ rating }: { rating: number }) {
  const prefix = useId().replace(/:/g, "");
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(1, rating - index));
        const id = `${prefix}-star-${index}`;
        return (
          <svg key={id} width="15" height="15" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={id}>
                <stop offset={`${fill * 100}%`} stopColor="#73743b" />
                <stop
                  offset={`${fill * 100}%`}
                  stopColor="rgba(77,56,36,0.22)"
                />
              </linearGradient>
            </defs>
            <path d={STAR_PATH} fill={`url(#${id})`} />
          </svg>
        );
      })}
    </span>
  );
}

function formatReviewDate(iso: string) {
  const day = iso.slice(0, 10);
  const date = new Date(`${day}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return day;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
