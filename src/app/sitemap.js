
export default function sitemap() {
  const base = 'https://www.aarogyaaadhar.com';
  const pages = [
    '',
    '/healthcard',
    '/appointment',
    '/ambulance',
    '/bed-booking',
    '/contact-us',
    ``  ];

  return pages.map((path) => ({
    url: base + path,
    lastModified: new Date().toISOString(),
  }));
}
