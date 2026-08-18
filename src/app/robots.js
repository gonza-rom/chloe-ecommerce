// src/app/robots.js
const SITE_URL = 'https://www.chloeshowroom.com.ar';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow:  '/',
      disallow: ['/admin', '/api', '/cuenta', '/checkout', '/auth'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
