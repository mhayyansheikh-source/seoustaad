import type { APIRoute } from 'astro';
import { opinly } from '../../lib/opinly';
import { escapeHtml } from '@opinly/shared';

export const GET: APIRoute = async () => {
  try {
    const items = await opinly.rss({ limit: 50 });

    const rssItemsXml = (items || []).map((item: any) => `
    <item>
      <title><![CDATA[${item.title || ''}]]></title>
      <link>https://www.seoustaad.com/blog/${item.slug}/</link>
      <guid isPermaLink="true">https://www.seoustaad.com/blog/${item.slug}/</guid>
      <description><![CDATA[${item.description || ''}]]></description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      ${item.categories ? item.categories.map((c: string) => `<category>${escapeHtml(c)}</category>`).join('\n      ') : ''}
    </item>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SEO Ustaad Blog</title>
    <link>https://www.seoustaad.com/blog/</link>
    <description>Latest web development news, SEO best practices, React tips, and digital insights from SEO Ustaad.</description>
    <language>en</language>
    <atom:link href="https://www.seoustaad.com/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItemsXml}
  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>SEO Ustaad Blog</title>\n    <link>https://www.seoustaad.com/blog/</link>\n    <description>SEO Ustaad Blog</description>\n  </channel>\n</rss>`;
    return new Response(fallbackXml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
};
