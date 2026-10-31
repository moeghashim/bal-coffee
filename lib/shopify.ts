// Shared Storefront data shapes used across the app. The hand-rolled fetch
// layer that used to live here was retired in the Hydrogen migration — reads and
// cart now go through lib/commerce (see HYDROGEN_MIGRATION.md). Only the types
// consumed by lib/products, lib/catalog, and the product/cart UI remain.

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string | null;
  price: ShopifyMoney;
  selectedOptions?: ShopifySelectedOption[];
  image?: ShopifyImage | null;
};

export type ShopifyProductOption = {
  name: string;
  optionValues?: { name: string }[];
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  vendor?: string | null;
  description: string;
  productType?: string | null;
  tags?: string[];
  availableForSale: boolean;
  updatedAt?: string | null;
  featuredImage?: ShopifyImage | null;
  images: {
    nodes: ShopifyImage[];
  };
  options?: ShopifyProductOption[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  variants: {
    nodes: ShopifyVariant[];
  };
};
