import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://svarthull.dev";

// Rotte e sezioni pubbliche del portfolio con rispettive priorità e changefreq
const routes = [
  {
    loc: "/",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    loc: "/#projects",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    loc: "/#about",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/#contact",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/#music",
    priority: "0.5",
    changefreq: "monthly",
  },
];

const today = new Date().toISOString().split("T")[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const publicPath = path.resolve(__dirname, "../public/sitemap.xml");
fs.writeFileSync(publicPath, sitemapXml.trim() + "\n", "utf-8");

console.log(`[SEO] sitemap.xml generated successfully at: ${publicPath}`);
