import type { MetadataRoute } from "next";
import { canonicalUrl, publicSitemapRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSitemapRoutes.map((route) => ({
    url: canonicalUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
