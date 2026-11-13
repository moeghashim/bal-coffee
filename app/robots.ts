import type { MetadataRoute } from "next";
import { baseUrl } from "lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/api/", "/event"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
