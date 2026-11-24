import type { MetadataRoute } from "next";
import { baseUrl } from "lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /cart sends noindex and is absent from the sitemap. Leave it
        // crawlable so Google can see that meta and drop the indexed URL.
        disallow: ["/api/", "/event"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
