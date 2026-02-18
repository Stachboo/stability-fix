import { getDictionary } from '@/get-dictionaries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';

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
  
  // Transformation du slug pour correspondre aux clés JSON (ex: packet-loss -> packet_loss)
  const key = slug.replace(/-/g, '_') as keyof typeof dict.glossary;
  const article = dict.glossary[key];

  if (!article) notFound();

  return (
    <article className="max-w-3xl animate-in fade-in duration-700">
      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-12">
        <Link href={`/${lang}`} className="hover:text-[#22D3EE]">Home</Link>
        <span>/</span>
        <span className="text-white">{slug}</span>
      </div>

      <header className="mb-12">
        <h1 className="text-5xl font-black text-white mb-6 tracking-tighter italic uppercase">
          {article.title}
        </h1>
        <div className="h-1 w-20 bg-[#22D3EE]"></div>
      </header>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-[#22D3EE]/10 rounded-2xl blur opacity-20 transition duration-1000"></div>
        <div className="relative bg-[#050505] border border-white/5 p-10 rounded-2xl">
          <p className="text-xl text-gray-300 leading-relaxed font-medium italic">
            "{article.content}"
          </p>

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#22D3EE]/5 flex items-center justify-center border border-[#22D3EE]/20">
                <Activity className="w-5 h-5 text-[#22D3EE] animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-gray-500 uppercase">System_State: Verified</p>
            </div>
            <Link 
              href={`/${lang}`}
              className="text-[10px] font-mono text-[#22D3EE] border border-[#22D3EE]/30 px-4 py-2 rounded hover:bg-[#22D3EE] hover:text-black transition-all"
            >
              RUN_DIAGNOSTIC
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
