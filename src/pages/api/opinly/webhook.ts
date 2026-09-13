import type { APIRoute } from 'astro';
import { Webhook } from 'svix';
import type { OpinlyWebhookEvent } from '@opinly/backend';

export const POST: APIRoute = async ({ request }) => {
  const svix_id = request.headers.get('svix-id');
  const svix_timestamp = request.headers.get('svix-timestamp');
  const svix_signature = request.headers.get('svix-signature');

  const secret = process.env.OPINLY_WEBHOOK_SIGNING_SECRET;

  let evt: OpinlyWebhookEvent;

  // If secret is set, verify cryptographic Svix signature
  if (secret) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response(JSON.stringify({ error: 'Missing svix headers' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const payload = await request.text();
      const wh = new Webhook(secret);
      wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
      evt = JSON.parse(payload) as OpinlyWebhookEvent;
    } catch (err: any) {
      console.error('Webhook verification failed:', err);
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    // Development or unconfigured secret fallback
    try {
      evt = (await request.json()) as OpinlyWebhookEvent;
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  console.log(`[Opinly Webhook] Received event: ${evt.type}`);

  // When content changes, invalidate / purge caches (e.g. Cloudflare / CDN cache)
  if (evt.type === 'content.routes-changed') {
    const changed = evt.data?.changed || [];
    console.log('[Opinly Webhook] Content routes changed:', changed);

    // If Cloudflare Cache Purge credentials exist in environment, purge the URLs
    const cfZoneId = process.env.CLOUDFLARE_ZONE_ID;
    const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (cfZoneId && cfApiToken) {
      try {
        const urlsToPurge = [
          'https://www.seoustaad.com/blog/',
          'https://www.seoustaad.com/blog/sitemap.xml',
          'https://www.seoustaad.com/blog/rss.xml',
          ...changed.map((r: any) => {
            if (r.type === 'post') return `https://www.seoustaad.com/blog/${r.slug}/`;
            if (r.type === 'category') return `https://www.seoustaad.com/blog/category/${r.slug}/`;
            if (r.type === 'author') return `https://www.seoustaad.com/blog/authors/${r.slug}/`;
            return `https://www.seoustaad.com/blog/${r.slug}/`;
          }),
        ];

        console.log('[Cloudflare Purge] Purging URLs:', urlsToPurge);
        await fetch(`https://api.cloudflare.com/client/v4/zones/${cfZoneId}/purge_cache`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cfApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files: urlsToPurge }),
        });
      } catch (purgeErr) {
        console.error('[Cloudflare Purge] Error triggering purge:', purgeErr);
      }
    }
  }

  return new Response(JSON.stringify({ success: true, received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
