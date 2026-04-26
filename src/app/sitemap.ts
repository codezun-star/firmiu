import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://firmiu.com";
  const now = new Date();

  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/register", priority: 0.9, changeFrequency: "monthly" },
    { path: "/login", priority: 0.8, changeFrequency: "monthly" },
    { path: "/nosotros", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contacto", priority: 0.6, changeFrequency: "monthly" },
    { path: "/terminos", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacidad", priority: 0.4, changeFrequency: "yearly" },
    { path: "/reembolsos", priority: 0.5, changeFrequency: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // Spanish (default — no prefix)
    entries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
    // English
    entries.push({
      url: `${baseUrl}/en${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority * 0.9,
    });
  }

  return entries;
}
