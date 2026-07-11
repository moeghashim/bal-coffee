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

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  vendor?: string | null;
  description: string;
  availableForSale: boolean;
  featuredImage?: ShopifyImage | null;
  images: {
    nodes: ShopifyImage[];
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: ShopifyMoney;
    }[];
  };
};
