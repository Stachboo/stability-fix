import { getDictionary } from '@/get-dictionaries';
import Link from 'next/link';
import { Activity, Layers, Server } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  jitter:      <Activity className="w-5 h-5 text-[#22D3EE]" />,
  bufferbloat: <Layers className="w-5 h-5 text-red-400" />,
  packet_loss: <Server className="w-5 h-5 text-orange-400" />,
};

const slugMap: Record<string, string> = {
  jitter:      'jitter',
  bufferbloat: 'bufferbloat',
  packet_loss: 'packet-loss',
};

export default async function GlossaryIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'fr' | 'en');

  const entries = Object.entries(dict.glossary) as [string, any][];

  return (
    <div className="max-w-3xl animate-in fade-in duration-700">

      {/* HEADER */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
          PROTOCOL{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#10B981]">
            KNOWLEDGE_BASE
          </span>
        </h1>
        <p className="text-gray-500 font-mono text-sm">
          {lang === 'fr'
            ? 'Documentation technique des anomalies réseau.'
            : 'Technical documentation of network anomalies.'}
        </p>
        <div className="h-px w-full bg-white/5 mt-8" />
      </header>

      {/* CARDS GRID */}
      <div className="grid md:grid-cols-2 gap-4">
        {entries.map(([key, article]) => (
          <Link
            key={key}
            href={`/${lang}/glossary/${slugMap[key]}`}
            className="group bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-[#22D3EE]/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                {icons[key]}
              </div>
              <span className="text-[#22D3EE] text-lg group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <h2 className="text-white font-black text-lg mb-2">{article.title}</h2>
            <p className="text-gray-500 text-xs leading-relaxed">{article.summary}</p>
          </Link>
        ))}
      </div>

    </div>
  );
}
