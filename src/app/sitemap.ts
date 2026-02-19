import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.stabilityprotocol.space';
  const locales = ['en', 'fr'];
  const glossarySlugs = ['jitter', 'bufferbloat', 'packet-loss'];

  // 1. Génération des URLs de base (Homepage)
  const homeRoutes = locales.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
  }));

  // 2. Génération des Index du Glossaire
  const glossaryIndexRoutes = locales.map((lang) => ({
    url: `${baseUrl}/${lang}/glossary`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/glossary`])
      ),
    },
  }));

  // 3. Génération dynamique des termes du Glossaire
  const glossaryTermsRoutes = locales.flatMap((lang) =>
    glossarySlugs.map((slug) => ({
      url: `${baseUrl}/${lang}/glossary/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/glossary/${slug}`])
        ),
      },
    }))
  );

  return [...homeRoutes, ...glossaryIndexRoutes, ...glossaryTermsRoutes];
}
