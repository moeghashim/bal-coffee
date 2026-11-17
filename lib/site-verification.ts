/**
 * Bing Webmaster meta (`msvalidate.01`). Renders nothing when the env value
 * is missing or blank. This app has no Google site-verification tag to sit
 * beside; add `verification.google` here if one is introduced.
 */
export function siteVerification(bing: string | undefined) {
  const value = bing?.trim();
  if (!value) return undefined;
  return {
    other: {
      "msvalidate.01": value,
    },
  };
}
