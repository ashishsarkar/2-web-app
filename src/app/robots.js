const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/checkout/', '/booking/confirmation/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
