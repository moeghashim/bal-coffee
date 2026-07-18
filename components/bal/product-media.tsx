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
  const sizes = compact
    ? "(max-width: 768px) 50vw, 360px"
    : "(max-width: 768px) 100vw, 600px";

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
