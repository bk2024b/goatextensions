import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/extensions";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/download/"] }, sitemap: `${siteUrl()}/sitemap.xml` };
}
