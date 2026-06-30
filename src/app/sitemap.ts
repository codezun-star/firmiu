import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/seo";
import { COUNTRY_SLUGS } from "@/lib/countries";
import { USE_CASE_SLUGS } from "@/lib/usecases";
import { BLOG_SLUGS } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/precios", priority: 0.9, changeFrequency: "monthly" },
    { path: "/register", priority: 0.9, changeFrequency: "monthly" },
    { path: "/login", priority: 0.8, changeFrequency: "monthly" },
    { path: "/firma-electronica", priority: 0.8, changeFrequency: "monthly" },
    { path: "/firma-digital-para", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/nosotros", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contacto", priority: 0.6, changeFrequency: "monthly" },
    { path: "/terminos", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacidad", priority: 0.4, changeFrequency: "yearly" },
    { path: "/reembolsos", priority: 0.5, changeFrequency: "yearly" },
    // Programmatic country landing pages (firma electrónica por país)
    ...COUNTRY_SLUGS.map((slug) => ({
      path: `/firma-electronica/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    // Programmatic profession landing pages (firma digital para …)
    ...USE_CASE_SLUGS.map((slug) => ({
      path: `/firma-digital-para/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    // Blog articles
    ...BLOG_SLUGS.map((slug) => ({
      path: `/blog/${slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const esUrl = `${APP_URL}${route.path}`;
    const enUrl = `${APP_URL}/en${route.path}`;
    // Each <url> lists every language version (Google's recommended i18n sitemap shape).
    const languages = { es: esUrl, en: enUrl, "x-default": esUrl };

    entries.push({
      url: esUrl,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    });
    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: Number((route.priority * 0.9).toFixed(2)),
      alternates: { languages },
    });
  }

  return entries;
}
