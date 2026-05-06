import { ProductVisual } from "components/bal/product-visual";
import type { Product } from "lib/products";
import type { ShopifyImage } from "lib/shopify";

type ProductMediaProps = {
  product: Product;
  compact?: boolean;
  image?: ShopifyImage;
};

export function ProductMedia({
  product,
  compact = false,
  image,
}: ProductMediaProps) {
  const productImage = image || product.images?.[0];

  if (!productImage?.url) {
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
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  );
}
