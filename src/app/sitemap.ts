import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await prisma.vehicle.findMany({ where: { status: "ACTIVE" }, select: { id: true, updatedAt: true } });
  const urls: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: new Date() },
    { url: absoluteUrl("/catalogo"), lastModified: new Date() },
  ];
  for (const v of vehicles) {
    urls.push({ url: absoluteUrl(`/catalogo/${v.id}`), lastModified: v.updatedAt ?? new Date() });
  }
  return urls;
}
