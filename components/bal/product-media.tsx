import { ProductVisual } from "components/bal/product-visual";
import {
  shopifyImageSrcSet,
  shopifyImageUrl,
  shopifyLayoutSize,
} from "lib/images";
import { productImageAlt, type Product } from "lib/products";
import type { ShopifyImage } from "lib/shopify";

type ProductMediaProps = {
  product: Product;
  compact?: boolean;
  image?: ShopifyImage;
  fill?: boolean;
  priority?: boolean;
};

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
  if (!image?.url) return null;
  return (
    <link
      rel="preload"
      as="image"
      href={shopifyImageUrl(image.url, 1200)}
      imageSrcSet={shopifyImageSrcSet(image.url)}
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
  const targetWidth = compact ? 600 : 1200;
  const layout = shopifyLayoutSize(productImage, targetWidth);
  const sizes = compact ? COMPACT_SIZES : NON_COMPACT_SIZES;

  return (
    <img
      src={shopifyImageUrl(url, targetWidth)}
      srcSet={shopifyImageSrcSet(url)}
      sizes={sizes}
      alt={productImageAlt(product, productImage)}
      width={layout.width}
      height={layout.height}
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
