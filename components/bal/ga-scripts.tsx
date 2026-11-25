import {
  gaMeasurementId,
  gtagBootstrapSource,
  gtagDeferredLoaderSource,
} from "lib/ga";

/**
 * Queues the gtag stub plus `js` and `config` while the document parses, then
 * fetches gtag.js after the first user interaction or a short timeout.
 * Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset.
 *
 * The library is deferred so it does not compete with first paint or first
 * input. The inline bootstrap still runs immediately: `@next/third-parties`
 * GoogleAnalytics and next/script afterInteractive inject config from a parent
 * effect, and product/cart view effects can then push ecommerce events ahead
 * of config, which gtag.js drops.
 */
export function GaScripts() {
  const gaId = gaMeasurementId();
  if (!gaId) return null;
  return (
    <>
      <script
        id="_next-ga-init"
        dangerouslySetInnerHTML={{ __html: gtagBootstrapSource(gaId) }}
      />
      <script
        id="_next-ga-loader"
        dangerouslySetInnerHTML={{ __html: gtagDeferredLoaderSource(gaId) }}
      />
    </>
  );
}
