import type { APIRoute } from 'astro';
import { opinly } from '../../../lib/opinly';

/**
 * Server-side purchase & conversion recorder for Opinly
 * Following Opinly best practices:
 * - Records purchase server-side with value, currency, orderId
 * - Merges with visitor via externalEventId, anonId, and email
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, value, currency = 'USD', email, anonId, items = [] } = body;

    if (!orderId || value === undefined) {
      return new Response(JSON.stringify({ error: 'orderId and value are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Server-side purchase attribution to Opinly
    await opinly.track(
      'purchase',
      {
        value: Number(value),
        currency: currency,
        transaction_id: orderId,
        items: items,
      },
      {
        externalEventId: String(orderId),
        email: email || undefined,
        anonId: anonId || undefined,
      }
    );

    return new Response(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Failed to record server-side purchase in Opinly:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
