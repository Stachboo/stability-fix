import { getDictionary } from '@/get-dictionaries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Activity } from 'lucide-react';

export async function generateStaticParams() {
  const locales = ['en', 'fr'];
  const slugs = ['jitter', 'bufferbloat', 'packet-loss'];
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as 'fr' | 'en');

  const key = slug.replace(/-/g, '_') as keyof typeof dict.glossary;
  const article = dict.glossary[key];

  if (!article) notFound();

  const badgeColors: Record<string, string> = {
    jitter:      'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
    bufferbloat: 'text-red-400 border-red-400/30 bg-red-400/5',
    packet_loss: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  };

  const ctaColors: Record<string, string> = {
    jitter:      'bg-cyan-600 hover:bg-cyan-500',
    bufferbloat: 'bg-red-600 hover:bg-red-500',
    packet_loss: 'bg-orange-600 hover:bg-orange-500',
  };

  const badgeColor = badgeColors[key] ?? 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5';
  const ctaColor   = ctaColors[key]   ?? 'bg-cyan-600 hover:bg-cyan-500';

  return (
    <article className="max-w-3xl animate-in fade-in duration-700">

      {/* RETOUR INDEX */}
      <div className="mb-8">
        <Link
          href={`/${lang}/glossary`}
          className="text-[10px] font-mono text-gray-500 hover:text-[#22D3EE] transition-colors uppercase tracking-widest"
        >
          ← {lang === 'fr' ? "Retour à l'index" : 'Back to index'}
        </Link>
      </div>

      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-5xl font-black text-white mb-3 tracking-tighter italic">
          {article.title}
        </h1>
        <span className={`inline-block text-[10px] font-black uppercase tracking-widest border px-3 py-1 rounded-full ${badgeColor}`}>
          {article.badge}
        </span>
      </header>

      {/* INTRO */}
      <p className="text-gray-300 text-lg leading-relaxed mb-10">
        {article.intro}
      </p>

      {/* BLOC ENCADRÉ */}
      <div className="bg-[#0a0f1a] border-l-4 border-[#22D3EE] p-6 rounded-r-xl mb-10">
        <p className="text-white font-bold mb-3">{article.block_title}</p>
        <p className="text-gray-400 text-sm leading-relaxed">{article.block_content}</p>
      </div>

      {/* SECTION PRINCIPALE */}
      <div className="mb-10 space-y-4">
        <p className="text-white font-bold uppercase tracking-widest text-sm">{article.section_title}</p>
        {article.section_intro && (
          <p className="text-gray-400 text-sm leading-relaxed">{article.section_intro}</p>
        )}
        {article.section_items && article.section_items.length > 0 && (
          <ul className="space-y-3">
            {article.section_items.map((item: string, i: number) => (
              <li key={i} className="flex gap-3 text-sm text-gray-300">
                <span className="text-[#22D3EE] font-black shrink-0">▸</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        )}
        {article.section_outro && (
          <p className="text-gray-500 text-sm italic">{article.section_outro}</p>
        )}
      </div>

      {/* DIAGNOSTIC / FIX */}
      {article.diag_title && (
        <div className="mb-10 space-y-3">
          <p className="text-white font-bold uppercase tracking-widest text-sm">{article.diag_title}</p>
          <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{article.diag_content}</p>
          {article.diag_note && (
            <p className="text-gray-500 text-sm italic">{article.diag_note}</p>
          )}
        </div>
      )}

      {/* CTA BLOC */}
      <div className="bg-[#050505] border border-white/10 p-8 rounded-2xl mt-12">
        <p className="text-white font-bold mb-2">{article.cta_title}</p>
        <p className="text-gray-500 text-sm mb-6">{article.cta_desc}</p>
        <Link
          href={`/${lang}`}
          className={`inline-block px-6 py-3 rounded-lg text-white font-black text-sm uppercase tracking-widest transition-all ${ctaColor}`}
        >
          {article.cta_btn}
        </Link>
      </div>

      {/* FOOTER */}
      <div className="mt-10 flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-[#22D3EE]/5 flex items-center justify-center border border-[#22D3EE]/20">
          <Activity className="w-4 h-4 text-[#22D3EE] animate-pulse" />
        </div>
        <p className="text-[10px] font-mono text-gray-600 uppercase">System_State: Verified</p>
      </div>

    </article>
  );
}
