import { gaMeasurementId, gtagBootstrapSource } from "lib/ga";

/**
 * Loads gtag.js and queues `js` + `config` while the document parses.
 * Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset.
 *
 * `@next/third-parties` GoogleAnalytics uses next/script afterInteractive, which
 * injects config from a parent effect. Product and cart view effects run first
 * and push ecommerce events ahead of config, so gtag.js drops them.
 */
export function GaScripts() {
  const gaId = gaMeasurementId();
  if (!gaId) return null;
  return (
    <>
      <script
        async
        id="_next-ga"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        id="_next-ga-init"
        dangerouslySetInnerHTML={{ __html: gtagBootstrapSource(gaId) }}
      />
    </>
  );
}
