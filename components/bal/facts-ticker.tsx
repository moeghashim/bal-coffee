import { HOMEPAGE_FACTS } from "lib/homepage-media";

function FactList({ id }: { id: string }) {
  return (
    <ul
      className="bal-ticker-track"
      aria-hidden={id !== "a" ? true : undefined}
    >
      {HOMEPAGE_FACTS.map((fact) => (
        <li key={`${id}-${fact}`}>
          <span className="bal-ticker-dot" aria-hidden>
            •
          </span>
          {fact}
        </li>
      ))}
    </ul>
  );
}

export function FactsTicker() {
  return (
    <div className="bal-ticker" role="region" aria-label="Product facts">
      <div className="bal-ticker-viewport">
        <FactList id="a" />
        <FactList id="b" />
      </div>
    </div>
  );
}
