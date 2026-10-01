import { ProductVisual } from "components/bal/product-visual";
import type { Product } from "lib/products";
import type { ShopifyImage } from "lib/shopify";

type ProductMediaProps = {
  product: Product;
  compact?: boolean;
  image?: ShopifyImage;
  fill?: boolean;
  priority?: boolean;
};

// Shopify's CDN resizes on the fly via a `width` query param. Serving a
// viewport-appropriate size instead of the multi-MB original is the single
// biggest mobile-LCP win (originals were up to 2.5 MB). No-op for non-Shopify
// URLs (local assets).
function isShopifyCdn(url: string) {
  return url.includes("cdn.shopify.com");
}

function sized(url: string, width: number) {
  if (!isShopifyCdn(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

const SRCSET_WIDTHS = [320, 480, 640, 828, 1080, 1200];

function srcSet(url: string) {
  if (!isShopifyCdn(url)) return undefined;
  return SRCSET_WIDTHS.map((w) => `${sized(url, w)} ${w}w`).join(", ");
}

// Display-size hints. Non-compact = PDP main image + products hero, which sit in
// a padded column (~90vw on mobile, not full-bleed); compact = cards,
// thumbnails, cart lines.
const NON_COMPACT_SIZES = "(max-width: 768px) 90vw, 600px";
const COMPACT_SIZES = "(max-width: 768px) 50vw, 360px";

/**
 * Preload link for an above-the-fold product image, matching the `<img>` the
 * `priority` ProductMedia renders (same srcset + sizes) so the browser fetches
 * the LCP image immediately — before it discovers the <img> in the DOM — with no
 * double-download. React 19 hoists this <link> into <head>. Render it once per
 * page for the LCP image only.
 */
export function ProductImagePreload({ image }: { image?: ShopifyImage }) {
  if (!image?.url || !isShopifyCdn(image.url)) return null;
  return (
    <link
      rel="preload"
      as="image"
      href={sized(image.url, 1200)}
      imageSrcSet={srcSet(image.url)}
      imageSizes={NON_COMPACT_SIZES}
      fetchPriority="high"
    />
  );
}

export function ProductMedia({
  product,
  compact = false,
  image,
  fill = false,
  priority = false,
}: ProductMediaProps) {
  const productImage = image || product.images?.[0];

  if (!productImage?.url) {
    if (fill) {
      return (
        <div style={{ position: "absolute", inset: 0 }}>
          <ProductVisual product={product} compact={compact} />
        </div>
      );
    }

    return <ProductVisual product={product} compact={compact} />;
  }

  const url = productImage.url;
  // Rough display widths: compact contexts (cards, thumbnails, cart lines) show
  // ~half the viewport on mobile and a fixed column on desktop; the main/hero
  // image fills its column.
  const sizes = compact ? COMPACT_SIZES : NON_COMPACT_SIZES;

  return (
    <img
      src={sized(url, compact ? 600 : 1200)}
      srcSet={srcSet(url)}
      sizes={sizes}
      alt={productImage.altText || `${product.name} product image`}
      width={productImage.width || undefined}
      height={productImage.height || undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={{
        display: "block",
        position: fill ? "absolute" : undefined,
        inset: fill ? 0 : undefined,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  );
}
