import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Sécurité préventive
    },
    sitemap: 'https://www.stabilityprotocol.space/sitemap.xml',
  };
}
