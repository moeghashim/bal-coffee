import type { Product } from "lib/products";

type ProductVisualProps = {
  product: Product;
  compact?: boolean;
};

function DatesBowl({ x = 72, y = 218 }: { x?: number; y?: number }) {
  return (
    <g>
      <ellipse
        cx={x}
        cy={y + 34}
        rx="48"
        ry="10"
        fill="#351c10"
        opacity="0.2"
      />
      <ellipse cx={x} cy={y} rx="44" ry="18" fill="#c9a37a" />
      <path
        d={`M${x - 42} ${y} Q ${x} ${y + 34} ${x + 42} ${y}`}
        fill="#8a5a33"
        opacity="0.55"
      />
      {[0, 1, 2, 3, 4].map((item) => (
        <ellipse
          key={item}
          cx={x - 24 + item * 12}
          cy={y - 4 + (item % 2) * 7}
          rx="10"
          ry="15"
          fill="#6c351b"
          transform={`rotate(${-24 + item * 12} ${x - 24 + item * 12} ${y})`}
        />
      ))}
    </g>
  );
}

function Cup({ x = 300, y = 226 }: { x?: number; y?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 56} rx="54" ry="9" fill="#2a160d" opacity="0.2" />
      <path
        d={`M${x - 42} ${y} L ${x + 42} ${y} L ${x + 34} ${y + 52} Q ${x + 28} ${y + 62} ${x - 28} ${y + 62} Q ${x - 34} ${y + 62} ${x - 42} ${y} Z`}
        fill="#efe3cf"
        stroke="#7a5434"
        strokeWidth="1.5"
      />
      <ellipse cx={x} cy={y} rx="42" ry="8" fill="#2b1309" />
      <path
        d={`M${x + 42} ${y + 12} Q ${x + 78} ${y + 20} ${x + 62} ${y + 44} Q ${x + 54} ${y + 56} ${x + 32} ${y + 48}`}
        fill="none"
        stroke="#7a5434"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}

function ProductBag({ product }: { product: Product }) {
  const isLight = product.kind === "bag-light";
  const bagFill =
    product.kind === "bag-dark"
      ? "#2b170f"
      : product.kind === "bag-green"
        ? "#323b1e"
        : "#e8d8bd";
  const labelColor = isLight ? "#2c180f" : "#f2dfbd";
  const subColor = isLight ? "#7c5d3b" : "#c9a46b";

  return (
    <g>
      <path
        d="M148 46 L 264 46 Q 276 46 276 60 L 276 248 Q 276 264 260 264 L 152 264 Q 136 264 136 248 L 136 60 Q 136 46 148 46 Z"
        fill={bagFill}
        stroke="#6f4d2f"
        strokeWidth="2"
      />
      <path d="M148 46 L 206 34 L 264 46" fill="#b88a56" opacity="0.6" />
      <text
        x="206"
        y="100"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="28"
        letterSpacing="8"
        fill={labelColor}
      >
        BAL
      </text>
      <text
        x="206"
        y="124"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="9"
        letterSpacing="5"
        fill={labelColor}
      >
        COFFEE
      </text>
      <text
        x="206"
        y="166"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="18"
        letterSpacing="2"
        fill={subColor}
      >
        {product.name.toUpperCase()}
      </text>
      <text
        x="206"
        y="188"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="8"
        letterSpacing="1.6"
        fill={subColor}
      >
        ROASTED DATE SEED COFFEE
      </text>
      <text
        x="206"
        y="218"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="11"
        fill={labelColor}
        opacity="0.9"
      >
        {product.notes.join(" · ")}
      </text>
    </g>
  );
}

function DrinkVisual({ product }: { product: Product }) {
  if (product.kind === "dessert") {
    return (
      <g>
        <ellipse
          cx="210"
          cy="270"
          rx="84"
          ry="12"
          fill="#351c10"
          opacity="0.18"
        />
        <path
          d="M128 124 H292 L276 270 Q274 286 258 286 H162 Q146 286 144 270 Z"
          fill="#f0dec6"
          stroke="#75482b"
          strokeWidth="2"
        />
        <rect x="142" y="174" width="136" height="28" fill="#6b351b" />
        <rect x="144" y="210" width="132" height="36" fill="#fff3dc" />
        <ellipse cx="210" cy="124" rx="82" ry="18" fill="#6b351b" />
        <ellipse cx="210" cy="119" rx="76" ry="13" fill="#c99462" />
        <circle cx="108" cy="256" r="18" fill="#5b2c16" />
        <circle cx="82" cy="266" r="14" fill="#3b1d10" />
      </g>
    );
  }

  if (product.kind === "iced") {
    return (
      <g>
        <ellipse
          cx="212"
          cy="278"
          rx="78"
          ry="11"
          fill="#351c10"
          opacity="0.15"
        />
        <path
          d="M138 112 H286 L268 278 Q266 292 250 292 H174 Q158 292 156 278 Z"
          fill="#ead7bd"
          stroke="#90582e"
          strokeWidth="2"
        />
        <path d="M154 160 H270 L260 258 H164 Z" fill="#c98c52" opacity="0.75" />
        <path
          d="M166 118 Q202 152 180 190 M226 118 Q258 150 236 190"
          stroke="#8d4f27"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.65"
        />
        <rect
          x="166"
          y="134"
          width="34"
          height="28"
          rx="5"
          fill="#f5ead9"
          opacity="0.75"
        />
        <rect
          x="222"
          y="138"
          width="34"
          height="28"
          rx="5"
          fill="#f5ead9"
          opacity="0.75"
        />
        <DatesBowl x={86} y={236} />
      </g>
    );
  }

  return (
    <g>
      <ellipse
        cx="212"
        cy="278"
        rx="94"
        ry="12"
        fill="#351c10"
        opacity="0.14"
      />
      <ellipse
        cx="212"
        cy="168"
        rx="108"
        ry="104"
        fill="#e5c19b"
        stroke="#7c5436"
        strokeWidth="2"
      />
      <ellipse cx="212" cy="160" rx="84" ry="76" fill="#b77e4d" />
      <path
        d="M150 156 C 180 116 244 120 272 154 C 244 188 182 190 150 156 Z"
        fill="#f6ead4"
      />
      <path
        d="M170 154 C 196 144 226 148 250 160"
        stroke="#d09a67"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </g>
  );
}

export function ProductVisual({
  product,
  compact = false,
}: ProductVisualProps) {
  const isDrink = ["latte", "dessert", "iced"].includes(product.kind);

  return (
    <svg
      viewBox="0 0 420 320"
      width="100%"
      height="100%"
      role="img"
      aria-label={`${product.name} product image`}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`${product.slug}-bg`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#e7d5bd" />
          <stop offset="0.55" stopColor="#b08b64" />
          <stop offset="1" stopColor="#f2e8d8" />
        </linearGradient>
        <filter
          id={`${product.slug}-shadow`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="22"
            stdDeviation="18"
            floodColor="#321a0e"
            floodOpacity="0.22"
          />
        </filter>
      </defs>
      <rect width="420" height="320" fill={`url(#${product.slug}-bg)`} />
      <path
        d="M0 258 C 92 226 162 292 256 252 C 328 222 374 232 420 214 L420 320 H0 Z"
        fill="#d8c2a4"
        opacity="0.62"
      />
      <g filter={`url(#${product.slug}-shadow)`}>
        {isDrink ? (
          <DrinkVisual product={product} />
        ) : (
          <>
            {product.kind === "bag-green" ? <DatesBowl x={84} y={222} /> : null}
            <ProductBag product={product} />
            {product.kind === "bag-dark" ? <DatesBowl x={72} y={224} /> : null}
            {product.kind === "bag-light" ? (
              <DatesBowl x={312} y={230} />
            ) : null}
            {product.kind === "bag-green" ? (
              <Cup x={318} y={226} />
            ) : (
              <Cup x={318} y={230} />
            )}
          </>
        )}
      </g>
      {!compact ? (
        <g opacity="0.4">
          <path
            d="M310 42 C 342 36 368 45 396 30"
            stroke="#6f7a3b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M334 56 C 360 58 384 70 410 58"
            stroke="#6f7a3b"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      ) : null}
    </svg>
  );
}
