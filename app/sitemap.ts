import type { MetadataRoute } from "next";
import { getProducts } from "lib/catalog";
import { baseUrl } from "lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    "",
    "/products",
    "/journal",
    "/about",
    "/faq",
    "/shipping",
    "/returns",
    "/contact",
    "/privacy",
    "/terms",
  ];
  let productRoutes: string[] = [];
  try {
    productRoutes = (await getProducts()).map(
      (product) => `/products/${product.slug}`,
    );
  } catch {
    productRoutes = [];
  }

  return [...staticRoutes, ...productRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority:
      path === ""
        ? 1
        : path === "/products"
          ? 0.8
          : path.startsWith("/products/")
            ? 0.7
            : 0.5,
  }));
}
