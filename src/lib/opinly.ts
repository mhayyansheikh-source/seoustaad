import 'dotenv/config';
import { createOpinlyClient } from '@opinly/backend';

export const opinlyConfig = {
  imagesPrefix: 'https://cdn.opinly.ai/ozhfDnikUmgcL3vBIKKn4',
  cdnNamespace: 'ozhfDnikUmgcL3vBIKKn4',
  siteUrl: 'https://www.seoustaad.com',
  blogPrefix: '/blog',
  companyName: 'SEO Ustaad',
  siteName: 'SEO Ustaad Blog',
  categoryPrefix: 'category',
  authorPrefix: 'authors',
};

// Singleton Opinly client configured with site details
// Uses process.env.OPINLY_API_KEY with a safe fallback to prevent build crashes in CI if not set
const apiKey = process.env.OPINLY_API_KEY || 'sk-build-placeholder';

export const opinly = createOpinlyClient({
  apiKey,
  site: {
    siteUrl: opinlyConfig.siteUrl,
    blogPrefix: opinlyConfig.blogPrefix,
  },
});

