// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(){
  const base = 'https://www.aarogyaaadhar.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/search?*', '/admin', '/drafts'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: 'https://www.aarogyaaadhar.com',
  }
}
