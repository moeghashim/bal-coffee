import type { ShopifyImage } from "lib/shopify";

// Shopify's CDN resizes on the fly via a `width` query param. The stored files
// are the original camera exports (about 4000×6000). Always request a display
// size instead of the original.
export function isShopifyCdn(url: string) {
  return url.includes("cdn.shopify.com");
}

export function shopifyImageUrl(url: string, width: number) {
  if (!isShopifyCdn(url)) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("width", String(width));
    return parsed.toString();
  } catch {
    return url;
  }
}

const SRCSET_WIDTHS = [320, 480, 640, 828, 1080, 1200];

export function shopifyImageSrcSet(url: string) {
  if (!isShopifyCdn(url)) return undefined;
  return SRCSET_WIDTHS.map(
    (width) => `${shopifyImageUrl(url, width)} ${width}w`,
  ).join(", ");
}

// Intrinsic width/height for the resized file, preserving the source aspect
// ratio. These are the dimensions we ask Shopify to serve, not the original.
export function shopifyLayoutSize(
  image: Pick<ShopifyImage, "width" | "height">,
  targetWidth: number,
) {
  const naturalWidth =
    image.width && image.width > 0 ? image.width : targetWidth;
  const naturalHeight =
    image.height && image.height > 0 ? image.height : targetWidth;
  const width = Math.min(targetWidth, naturalWidth);
  const height = Math.max(
    1,
    Math.round((width * naturalHeight) / naturalWidth),
  );
  return { width, height };
}
