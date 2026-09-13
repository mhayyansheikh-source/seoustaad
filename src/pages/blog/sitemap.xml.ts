import type { APIRoute } from 'astro';
import { opinly, opinlyConfig } from '../../lib/opinly';
import { buildSitemapEntries, toSitemapXml } from '@opinly/shared';

export const GET: APIRoute = async () => {
  try {
    const routes = await opinly.routes();
    const entries = buildSitemapEntries(routes, opinlyConfig);
    const xml = toSitemapXml(entries);

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    // Return empty fallback valid sitemap
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`;
    return new Response(emptyXml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
};
