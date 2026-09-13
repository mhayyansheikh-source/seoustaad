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
export const opinly = createOpinlyClient({
  site: {
    siteUrl: opinlyConfig.siteUrl,
    blogPrefix: opinlyConfig.blogPrefix,
  },
});
