import { GoogleAnalytics } from "@next/third-parties/google";
import { gaMeasurementId } from "lib/ga";

/**
 * Loads gtag.js with next/script's default afterInteractive strategy.
 * Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset.
 */
export function GaScripts() {
  const gaId = gaMeasurementId();
  if (!gaId) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
