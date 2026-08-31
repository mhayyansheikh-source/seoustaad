# Implementation Plan — Keyword Strategy for SEO Ustaad

> **Based on:** Google Trends analysis from `keywords28july.md`  
> **Stack:** Astro 4 (static), gigs.json-driven pages, no blog infrastructure  
> **Total actions:** 12 (5 P0, 4 P1, 3 P2)

---

## Phase 0 — Add New Gigs to gigs.json

These gigs auto-generate 26 city pages each via `getStaticPaths()`. Add them to the `web` category.

### 1. Custom Web App Development
```json
{ "name": "Custom Web App Development", "price": "30,000 PKR", "category": "web", "slug": "custom-web-app-development" }
```
**Targets:** `custom web app development` (100, +10%), `web application development` (83, -20%)  
**City pages generated:** 26 (`/services/custom-web-app-development-in-karachi/`, etc.)

### 2. React / Next.js Development
```json
{ "name": "React & Next.js Development", "price": "30,000 PKR", "category": "web", "slug": "react-nextjs-development" }
```
**Targets:** `react development` (9, +190%), aligns with existing `custom-nextjs-website` gig  
**City pages generated:** 26

### 3. Custom Software Development
```json
{ "name": "Custom Software Development", "price": "30,000 PKR", "category": "web", "slug": "custom-software-development" }
```
**Targets:** `custom software development` (60, +50%)  
**City pages generated:** 26

### 4. Web Application Development Services
```json
{ "name": "Web Application Development Services", "price": "25,000 PKR", "category": "web", "slug": "web-application-development-services" }
```
**Targets:** `web application development services` (18, -40%), `custom web application development services` (18, -40%)  
**City pages generated:** 26

### 5. Custom Web Development Agency
```json
{ "name": "Custom Web Development Agency", "price": "20,000 PKR", "category": "web", "slug": "custom-web-development-agency" }
```
**Targets:** `custom web development agency` (35, +40%), `web development agency` (35, +40%)  
**City pages generated:** 26

---

## Phase 1 — Blog Infrastructure (P0)

The site has **no blog**. Build from scratch.

### Files to create:

#### `src/pages/blog/index.astro`
Blog listing page at `/blog/`. Lists all posts by date, newest first.
- Title: `Web Development News & Best Practices | SEO Ustaad Blog`
- Description: `Latest web development news, best practices, React tips, and digital insights from SEO Ustaad.`
- Canonical: `https://www.seoustaad.com/blog/`
- Layout: Same `Layout` + `Header`/`Footer`/`WhatsappWidget`
- Each post card shows: title, excerpt, date, category badge, read more link

#### `src/pages/blog/[...slug].astro`
Dynamic blog post template using Astro content collections or a `blog-posts.json` data file.

**Option A (Recommended — matches existing pattern):** Create `blog-posts.json` and use `getStaticPaths()`:
```astro
export function getStaticPaths() {
  const posts = await fetch('blog-posts.json');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post }
  }));
}
```

#### `blog-posts.json`
Data file with post metadata and content. Schema:
```json
[
  {
    "slug": "web-development-best-practices-2026",
    "title": "Web Development Best Practices for 2026: Core Web Vitals, AEO, and Performance",
    "excerpt": "A comprehensive guide to modern web development best practices...",
    "date": "2026-07-28",
    "category": "best-practices",
    "author": "SEO Ustaad Team",
    "tags": ["web development", "core web vitals", "performance", "AEO", "best practices"],
    "keywords": ["web development best practices", "web development", "core web vitals"],
    "contentMd": "..." // Markdown content
  }
]
```

#### `src/pages/blog/web-development-best-practices/index.astro`
**Pillar page** — the single most important content page. Targets `web development best practices` (+700%).
- URL: `/blog/web-development-best-practices/`
- Title: `Web Development Best Practices 2026: Core Web Vitals, GEO & Performance | SEO Ustaad`
- Description: `Master web development best practices for 2026. Learn Core Web Vitals optimization, Generative Engine Optimization (GEO), semantic HTML, and performance tuning from Pakistan's top dev agency.`
- Sections:
  1. **Core Web Vitals** — LCP, FID, CLS optimization (links to `/services/advanced-core-web-vitals/`)
  2. **Semantic HTML & Structured Data** (links to `/services/premium-schema-markup/`)
  3. **Generative Engine Optimization (GEO)** — making sites AI-search ready
  4. **Performance Budgeting** — JS/CSS optimization, lazy loading
  5. **Security Best Practices** — HTTPS, CSP, input validation
  6. **Mobile-First Responsive Design**
  7. **CTA section** — "Need help implementing these? Hire SEO Ustaad"
- Internal links to: Core Web Vitals gig, Schema Markup gig, Technical SEO Audit gig, Web Dev gigs
- FAQ section at bottom referencing `web` category FAQs

#### `src/pages/blog/web-dev-news-monthly/index.astro`
Monthly news roundup page. Targets `web development news` (+800%).
- URL: `/blog/web-dev-news-monthly/`
- Title: `Web Development News — July 2026 Roundup | SEO Ustaad`
- Description: `Stay updated with the latest web development news. July 2026 roundup covers React 19, Next.js updates, new Core Web Vitals metrics, and AI search changes.`
- Sections: Latest framework releases, SEO/Google updates, security vulnerabilities, industry trends
- Monthly cadence: Create `/blog/web-dev-news-{month}-{year}/` for each edition
- Can reuse `blog-posts.json` with `category: "news"`

### Files to modify:

#### `src/components/Header.astro`
Add "Blog" nav item after "Portfolio":
```html
<li class="nav-item">
  <a class="nav-link" href="/blog/">Blog</a>
</li>
```

#### `src/pages/services/index.astro`
Add "Custom Web App Development", "React & Next.js Development", "Custom Software Development" — these auto-appear from gigs.json thanks to the `rootGigs.filter()` logic already in place.

---

## Phase 2 — Optimisation of Existing Pages (P1)

### Adjust existing gig SEO metadata

#### `src/pages/services/[service].astro`
Modify the `title` and `description` generation logic to use keyword-optimized templates for key gigs:

```astro
// Add keyword-rich descriptions per slug
const keywordDescriptions = {
  'website-development': 'Get professional website development services by SEO Ustaad. Custom web development, responsive design, and SEO-optimized sites starting at 20,000 PKR.',
  'custom-website-development': 'Custom website development services tailored to your business. SEO Ustaad builds high-performance, GEO-optimized custom websites starting at 30,000 PKR.',
  'custom-web-app-development': 'Custom web app development by SEO Ustaad. Build scalable, performant web applications with React, Next.js & Node.js. Starting at 30,000 PKR.',
  'react-nextjs-development': 'React & Next.js development services. Modern, fast, and SEO-friendly web applications built by Pakistan\'s top dev agency. Starting at 30,000 PKR.',
  'custom-software-development': 'Custom software development services — web apps, APIs, and enterprise solutions. SEO Ustaad delivers ROI-driven software at affordable prices.',
};

const description = keywordDescriptions[gig.slug] || (isMatrix
    ? `Looking for ${gig.name} in ${city}? SEO Ustaad offers premium ${gig.category} services in ${city} starting at ${gig.price}. Dominate your local market today!`
    : `Get professional ${gig.name} services by SEO Ustaad. We specialize in ROI-driven ${gig.category} and custom solutions for startups to boost your rankings. Premium quality starting at ${gig.price}. Order directly on WhatsApp!`);
```

### Create "How to Choose" guide (P1)

#### `src/pages/blog/how-to-choose-web-development-company/index.astro`
- URL: `/blog/how-to-choose-web-development-company/`
- Title: `How to Choose a Web Development Company in 2026 | SEO Ustaad`
- Description: `Learn how to choose the right web development company. Compare portfolios, evaluate technical expertise, and find the best web development partner for your business.`
- Targets: `custom web development companies` (34, +70%)
- Sections:
  1. **Portfolio & Case Studies**
  2. **Technical Expertise** (WordPress vs Shopify vs Next.js)
  3. **SEO Knowledge** (why it matters)
  4. **Pricing Models** (fixed vs hourly)
  5. **Communication & Support**
  6. **Why SEO Ustaad** — internal links to web dev gigs
  7. **FAQ**

### Add FAQ entries in faqs.json (P1)

Add to `faqs.json` under `"web"`:

```json
{
  "q": "What is custom web app development?",
  "a": "Custom web app development is the process of building tailored web applications from scratch to meet specific business needs — unlike pre-built templates. SEO Ustaad specializes in custom web app development using React, Next.js, and Node.js for scalable, high-performance results."
},
{
  "q": "What are the latest web development best practices?",
  "a": "In 2026, web development best practices focus on Core Web Vitals optimization, Generative Engine Optimization (GEO), semantic HTML, mobile-first responsive design, and security-first architecture. SEO Ustaad integrates all these practices into every project. Read our full guide: <a href='/blog/web-development-best-practices/'>Web Development Best Practices 2026</a>."
},
{
  "q": "Why choose React or Next.js for web development?",
  "a": "React and Next.js offer exceptional performance, SEO-friendliness (SSR/SSG), and scalability. As a leading <a href='/services/custom-web-development-agency/'>custom web development agency</a>, SEO Ustaad builds modern, blazing-fast web applications with Next.js that rank well on both traditional and AI-powered search engines."
},
{
  "q": "How much does custom software development cost in Pakistan?",
  "a": "Custom software development costs in Pakistan typically range from 30,000 PKR to 150,000 PKR depending on complexity. SEO Ustaad's <a href='/services/custom-software-development/'>custom software development services</a> start at 30,000 PKR with transparent, upfront pricing."
},
{
  "q": "How to choose between a web development agency and freelancer?",
  "a": "A <a href='/services/custom-web-development-agency/'>custom web development agency</a> offers team-based accountability, diverse expertise, and long-term support — ideal for complex or business-critical projects. Freelancers work best for smaller, well-defined tasks. SEO Ustaad combines agency reliability with freelancer-level pricing."
}
```

---

## Phase 3 — Advanced Pages (P2)

These use lower-volume but rising keywords. Create after Phase 1-2 is live.

### Backend Development Guide
- URL: `/blog/backend-development-guide/`
- Targets: `backend development` (4, +20%)
- Content: Backend technologies overview (Node.js, PHP, Python), API development, database design
- Internal links to WordPress/Shopify dev pages

### Python Web Framework Introduction
- URL: `/blog/python-web-framework-guide/`
- Targets: `python web framework` (2, Breakout)
- Content: Django vs Flask vs FastAPI comparison, use cases
- Only if expanding service offerings to Python

### Custom Web Development India — Pakistan Alternative Page
- URL: `/blog/pakistan-vs-india-web-development/`
- Targets: `custom web development india` (35, +140%)
- Title: `Pakistan vs India for Web Development: Why Pakistan Is the Better Choice in 2026`
- Description: `Comparing India vs Pakistan for custom web development. Discover why Pakistani agencies like SEO Ustaad offer better value, quality, and communication at lower costs.`
- Content: Cost comparison, quality comparison, time zone, cultural alignment
- Internal links to web dev gigs

---

## Phase 4 — Meta & Technical SEO Updates

### `src/layouts/Layout.astro`
Update the static `<meta name="keywords">` to include new keyword themes:
```html
<meta name="keywords" content="SEO Ustaad, SEO Pakistan, Web Development Pakistan, Custom Web App Development, React Development, Next.js Development, Custom Software Development, Web Development Best Practices, Shopify Expert Pakistan, Meta Ads Agency Karachi, AEO Services, Web Development Agency Pakistan">
```

### `robots.txt`
Verify no blog URLs are blocked. Current `robots.txt` allows all — no changes needed.

### Sitemap
The `@astrojs/sitemap` plugin auto-generates sitemaps for all static routes. New gigs and blog posts will appear automatically after build.

---

## Phase 5 — Navigation & Cross-Linking Updates

### `src/components/Header.astro`
Add "Blog" link between Portfolio and ROI Calculator:
```html
<li class="nav-item">
  <a class="nav-link" href="/blog/">Blog</a>
</li>
```

### `src/components/Footer.astro`
1. Add "Blog" link in the Quick Links or Resources section
2. Add "Web Development Best Practices" link in Resources
3. Add "Custom Web App Development" link in the Web Development silo

### Cross-linking strategy
Every new blog post should link to relevant gig pages and vice versa:
- Blog post "Web Development Best Practices" → links to Core Web Vitals, Schema Markup, Technical SEO Audit gig pages
- Blog post "How to Choose a Web Dev Company" → links to Custom Web Dev Agency, Web Dev Company gigs
- FAQ entries → link to new blog posts AND gig pages
- New gig pages → link to blog posts for deeper reading

---

## Summary — File Change Log

| File | Action | Phase |
|---|---|---|
| `gigs.json` | Add 5 new gigs | P0 |
| `blog-posts.json` | **Create** — data file | P0 |
| `src/pages/blog/index.astro` | **Create** — blog listing | P0 |
| `src/pages/blog/[...slug].astro` | **Create** — dynamic blog template | P0 |
| `src/pages/blog/web-development-best-practices/index.astro` | **Create** — pillar page | P0 |
| `src/pages/blog/web-dev-news-monthly/index.astro` | **Create** — news roundup | P0 |
| `src/pages/blog/how-to-choose-web-development-company/index.astro` | **Create** — guide | P1 |
| `src/pages/services/[service].astro` | Modify title/description for keyword slugs | P1 |
| `src/layouts/Layout.astro` | Update meta keywords tag | P0 |
| `src/components/Header.astro` | Add Blog nav link | P0 |
| `src/components/Footer.astro` | Add Blog + new service links | P0 |
| `faqs.json` | Add 5 new FAQ entries under `web` | P1 |
| `src/pages/blog/backend-development-guide/index.astro` | **Create** (P2) | P2 |
| `src/pages/blog/python-web-framework-guide/index.astro` | **Create** (P2) | P2 |
| `src/pages/blog/pakistan-vs-india-web-development/index.astro` | **Create** (P2) | P2 |

---

## Build & Deploy

```bash
npm run build   # Astro builds all pages + sitemap
```

Vercel auto-deploys from the repository with `cleanUrls: true` — no additional config needed. New pages will be live at their canonical URLs.

---

## Expected Traffic Impact

| Action | Est. Monthly Search Volume Captured | Keyword |
|---|---|---|
| Custom Web App Dev gig | High (100 search interest) | `custom web app development` |
| React/Next.js gig | Medium (9, +190% growth) | `react development` |
| Best Practices pillar | Medium (38, +700% growth) | `web development best practices` |
| Web Dev News blog | Medium (35, +800% growth) | `web development news` |
| Software Dev gig | Medium (60, +50% growth) | `custom software development` |
| How-to-choose guide | Low-Medium (34, +70% growth) | `custom web development companies` |
| Backend/Python content | Low (2-4 interest) | Long-tail growth |