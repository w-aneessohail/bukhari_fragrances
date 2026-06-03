import { Router } from "express";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";

const router = Router();

router.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(`User-agent: *\nAllow: /\nSitemap: ${env.FRONTEND_URL}/sitemap.xml\n`);
});

router.get("/sitemap.xml", async (_req, res) => {
  const [products, posts] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    }),
    prisma.blogPost.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, updatedAt: true }
    })
  ]);

  const urls = [
    { loc: env.FRONTEND_URL, lastmod: new Date().toISOString() },
    { loc: `${env.FRONTEND_URL}/shop`, lastmod: new Date().toISOString() },
    { loc: `${env.FRONTEND_URL}/about`, lastmod: new Date().toISOString() },
    { loc: `${env.FRONTEND_URL}/blog`, lastmod: new Date().toISOString() },
    ...products.map((product) => ({
      loc: `${env.FRONTEND_URL}/product/${product.slug}`,
      lastmod: product.updatedAt.toISOString()
    })),
    ...posts.map((post) => ({
      loc: `${env.FRONTEND_URL}/blog/${post.slug}`,
      lastmod: post.updatedAt.toISOString()
    }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.type("application/xml").send(body);
});

export default router;
