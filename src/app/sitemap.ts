import type { MetadataRoute } from "next";
import { SITE_URL, SITE_NAV_ITEMS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_NAV_ITEMS.map((item) => ({
    url: `${SITE_URL}${item.path}`,
    lastModified: new Date(),
  }));
}
