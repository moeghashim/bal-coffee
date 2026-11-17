import Image from "next/image";
import { ProductVisual } from "components/bal/product-visual";
import { shopifyImageUrl, shopifyLayoutSize } from "lib/images";
import { productImageAlt, type Product } from "lib/products";
import type { ShopifyImage } from "lib/shopify";

type ProductMediaProps = {
  product: Product;
  compact?: boolean;
  image?: ShopifyImage;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  targetWidth?: number;
};

// The PDP photo and the product cards sit in a padded column. Compact covers
// thumbnails, cart lines, and horizontal cards.
const NON_COMPACT_SIZES = "(max-width: 768px) calc(100vw - 32px), 560px";
const COMPACT_SIZES = "(max-width: 768px) 46vw, 280px";

export function ProductMedia({
  product,
  compact = false,
  image,
  fill = false,
  priority = false,
  sizes,
  targetWidth,
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

  const requestedWidth = targetWidth ?? (compact ? 480 : 1200);
  const layout = shopifyLayoutSize(productImage, requestedWidth);
  const imageSizes = sizes ?? (compact ? COMPACT_SIZES : NON_COMPACT_SIZES);
  // Ask Shopify for a display-sized master. next/image then serves AVIF/WebP
  // at the `sizes` width instead of the original camera file.
  const src = shopifyImageUrl(productImage.url, Math.max(requestedWidth, 750));

  return (
    <Image
      src={src}
      alt={productImageAlt(product, productImage)}
      width={fill ? undefined : layout.width}
      height={fill ? undefined : layout.height}
      fill={fill}
      sizes={imageSizes}
      priority={priority}
      fetchPriority={priority ? "high" : "low"}
      style={{
        display: "block",
        position: fill ? "absolute" : undefined,
        inset: fill ? 0 : undefined,
        width: fill ? undefined : "100%",
        height: fill ? undefined : "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  );
}
