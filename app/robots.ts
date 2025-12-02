import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // ห้าม Bot เข้ามายุ่งกับหลังบ้าน
    },
    sitemap: 'https://savvyapp.cc/sitemap.xml',
  };
}
