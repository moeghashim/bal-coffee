type SeedProps = {
  roast?: number;
  size?: number;
  detail?: boolean;
};

export function Seed({ roast = 0.35, size = 520, detail = true }: SeedProps) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const hex = (r: number, g: number, b: number) =>
    `rgb(${r | 0},${g | 0},${b | 0})`;

  let r: number, g: number, b: number;
  if (roast < 0.5) {
    const t = roast / 0.5;
    r = lerp(210, 178, t);
    g = lerp(188, 132, t);
    b = lerp(138, 78, t);
  } else {
    const t = (roast - 0.5) / 0.5;
    r = lerp(178, 70, t);
    g = lerp(132, 42, t);
    b = lerp(78, 24, t);
  }
  const base = hex(r, g, b);
  const shadow = hex(r * 0.55, g * 0.55, b * 0.55);
  const highlight = hex(
    Math.min(255, r * 1.25),
    Math.min(255, g * 1.25),
    Math.min(255, b * 1.25),
  );
  const crease = hex(r * 0.28, g * 0.28, b * 0.28);

  return (
    <svg
      viewBox="-260 -320 520 640"
      width={size}
      height={size * 1.23}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="seedGrad" cx="-0.1" cy="-0.25" r="1.15">
          <stop offset="0" stopColor={highlight} />
          <stop offset="0.5" stopColor={base} />
          <stop offset="1" stopColor={shadow} />
        </radialGradient>
        <radialGradient id="seedShadow" cx="0.5" cy="1" r="0.8">
          <stop offset="0" stopColor="rgba(42,31,23,0.25)" />
          <stop offset="1" stopColor="rgba(42,31,23,0)" />
        </radialGradient>
        <linearGradient id="grooveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={crease} stopOpacity="0.3" />
          <stop offset="0.15" stopColor={crease} stopOpacity="0.95" />
          <stop offset="0.85" stopColor={crease} stopOpacity="0.95" />
          <stop offset="1" stopColor={crease} stopOpacity="0.3" />
        </linearGradient>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <ellipse cx="0" cy="298" rx="110" ry="14" fill="url(#seedShadow)" />

      <g>
        <g transform="rotate(-6)">
          <path
            d="M 0,-295
               C 70,-295 105,-240 108,-140
               C 112,-40 112,50 108,150
               C 105,235 70,292 0,292
               C -70,292 -105,235 -108,150
               C -112,50 -112,-40 -108,-140
               C -105,-240 -70,-295 0,-295 Z"
            fill="url(#seedGrad)"
          />

          <path
            d="M 2,-282 C -4,-180 6,-60 -2,60 C 4,170 -4,260 0,280"
            stroke="url(#grooveGrad)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 2,-275 C -3,-180 5,-60 -1,60 C 3,170 -3,258 0,272"
            stroke={crease}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M -4,-265 C -9,-170 0,-60 -7,55 C -2,165 -9,252 -6,265"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />

          <ellipse cx="0" cy="-250" rx="4" ry="6" fill={crease} opacity="0.7" />

          {detail && (
            <>
              <g opacity="0.28" fill={crease}>
                {Array.from({ length: 34 }).map((_, i) => {
                  const side = i % 2 === 0 ? 1 : -1;
                  const y = -240 + (i / 34) * 500 + Math.sin(i * 2.3) * 18;
                  const x = side * (24 + Math.abs(Math.sin(i * 1.7)) * 68);
                  const rr = 0.9 + Math.abs(Math.cos(i * 1.3)) * 1.8;
                  return (
                    <ellipse key={i} cx={x} cy={y} rx={rr} ry={rr * 0.7} />
                  );
                })}
              </g>

              <g
                opacity="0.18"
                stroke={crease}
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
              >
                <path d="M 34,-240 C 42,-120 38,0 30,130 C 26,230 30,268 24,280" />
                <path d="M 60,-220 C 72,-100 68,20 58,140 C 52,220 56,258 48,270" />
                <path d="M 86,-180 C 96,-60 92,60 84,160 C 78,220 80,248 74,258" />
                <path d="M -34,-240 C -42,-120 -38,0 -30,130 C -26,230 -30,268 -24,280" />
                <path d="M -60,-220 C -72,-100 -68,20 -58,140 C -52,220 -56,258 -48,270" />
                <path d="M -86,-180 C -96,-60 -92,60 -84,160 C -78,220 -80,248 -74,258" />
              </g>

              <ellipse
                cx="-55"
                cy="-120"
                rx="32"
                ry="110"
                fill="rgba(255,255,255,0.13)"
                filter="url(#softBlur)"
              />
              <ellipse
                cx="60"
                cy="140"
                rx="20"
                ry="80"
                fill="rgba(42,31,23,0.18)"
                filter="url(#softBlur)"
              />

              <ellipse
                cx="0"
                cy="-275"
                rx="70"
                ry="28"
                fill={shadow}
                opacity="0.35"
                filter="url(#softBlur)"
              />
              <ellipse
                cx="0"
                cy="275"
                rx="70"
                ry="28"
                fill={shadow}
                opacity="0.35"
                filter="url(#softBlur)"
              />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}
