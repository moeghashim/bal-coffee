import { ProductVisual } from "components/bal/product-visual";
import type { Product } from "lib/products";
import type { ShopifyImage } from "lib/shopify";

type ProductMediaProps = {
  product: Product;
  compact?: boolean;
  image?: ShopifyImage;
  fill?: boolean;
};

export function ProductMedia({
  product,
  compact = false,
  image,
  fill = false,
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

  return (
    <img
      src={productImage.url}
      alt={productImage.altText || `${product.name} product image`}
      width={productImage.width || undefined}
      height={productImage.height || undefined}
      loading="lazy"
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
