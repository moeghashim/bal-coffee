export const DRINK_TEMPERATURES = ["Iced", "Hot"] as const;
export const ICE_LEVELS = ["Regular ice", "Less ice"] as const;
export const SWEETNESS_LEVELS = [
  "Regular",
  "Less sweet",
  "More sweet",
] as const;

export type DrinkTemperature = (typeof DRINK_TEMPERATURES)[number];
export type DrinkIce = (typeof ICE_LEVELS)[number];
export type DrinkSweetness = (typeof SWEETNESS_LEVELS)[number];

export const DEFAULT_TEMPERATURE: DrinkTemperature = "Iced";
export const DEFAULT_ICE: DrinkIce = "Regular ice";
export const DEFAULT_SWEETNESS: DrinkSweetness = "Regular";

const TEMPERATURE_LABELS: Record<DrinkTemperature, string> = {
  Iced: "Iced (recommended)",
  Hot: "Hot",
};

export function temperatureLabel(temperature: DrinkTemperature) {
  return TEMPERATURE_LABELS[temperature];
}

export function parseTemperature(value: unknown): DrinkTemperature | null {
  return matchChoice(value, DRINK_TEMPERATURES);
}

export function parseIce(value: unknown): DrinkIce | null {
  return matchChoice(value, ICE_LEVELS);
}

export function parseSweetness(value: unknown): DrinkSweetness | null {
  return matchChoice(value, SWEETNESS_LEVELS);
}

export function lineAttributes(choice: {
  temperature: DrinkTemperature;
  ice?: DrinkIce;
  sweetness: DrinkSweetness;
}) {
  const attributes: { key: string; value: string }[] = [
    { key: "Temperature", value: choice.temperature },
    { key: "Sweetness", value: choice.sweetness },
  ];
  if (choice.temperature === "Iced") {
    attributes.splice(1, 0, {
      key: "Ice",
      value: choice.ice ?? DEFAULT_ICE,
    });
  }
  return attributes;
}

function matchChoice<T extends string>(
  value: unknown,
  choices: readonly T[],
): T | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return choices.find((choice) => choice.toLowerCase() === normalized) ?? null;
}
