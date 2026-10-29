import type { MetadataRoute } from "next";
import { availableExtensions, siteUrl } from "@/lib/extensions";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...availableExtensions.map((e) => ({ url: `${base}/extensions/${e.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
