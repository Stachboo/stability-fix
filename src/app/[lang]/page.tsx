import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import StabilityDashboard from '@/components/StabilityDashboard';
import { Zap, ShieldAlert, Layers, ArrowRight, Info, CheckCircle } from 'lucide-react';
import { getDictionary } from '@/get-dictionaries';

const TrustBox = dynamic(() => import('@/components/TrustBox'), {
  loading: () => <div className="h-32 bg-white/5 animate-pulse rounded-xl" />,
});

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'fr' | 'en');

  return (
    <main className="min-h-screen bg-[#0B0F14] flex flex-col font-mono">
      
      {/* HEADER SECTION */}
      <section className="pt-20 pb-10 px-4 text-center">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 italic uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-white">
            {dict.home.title}
          </span>
          <br />
          <span className="text-white text-3xl md:text-5xl">{dict.home.subtitle}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 font-mono text-lg uppercase tracking-widest">
          {dict.home.description}
        </p>
      </section>

      {/* THE TOOL */}
      <div className="relative mb-20">
        <StabilityDashboard dict={dict} lang={lang as 'fr' | 'en'} />
      </div>

      {/* SECTION SEO 1: POURQUOI LAGER */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="bg-black/40 border border-[#10B981]/20 p-10 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-4 mb-8">
            <Info className="text-[#F59E0B] w-10 h-10" />
            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
              {dict.home.seo1.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 text-gray-400">
            <div className="space-y-4 text-lg">
              <p className="text-white font-bold">{dict.home.seo1.p1}</p>
              <p>{dict.home.seo1.p2}</p>
              <div className="bg-[#10B981]/5 border-l-4 border-[#10B981] p-6 text-sm italic text-gray-300">
                {dict.home.seo1.highlight}
              </div>
            </div>
            <div>
              <p className="text-white font-bold mb-6 uppercase tracking-widest underline decoration-[#F59E0B]">
                {dict.home.seo1.result}
              </p>
              <ul className="space-y-3">
                {dict.home.seo1.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-[#10B981]" />
                    <span className="text-sm font-bold uppercase">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION SEO 2: OPTIMISATION GRID */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-8">
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:border-[#10B981]/30 transition-all">
          <h3 className="text-2xl font-black text-white mb-4 uppercase">{dict.home.seo2.fix_title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{dict.home.seo2.fix_desc}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:border-[#F59E0B]/30 transition-all">
          <h3 className="text-2xl font-black text-white mb-4 uppercase">{dict.home.seo2.mobile_title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{dict.home.seo2.mobile_desc}</p>
        </div>
      </section>

      {/* FOOTER & ADS */}
      <div className="mt-auto">
        <div className="bg-black/80 py-10 border-t border-white/5 grayscale hover:grayscale-0 transition-all">
          <TrustBox lang={lang as 'fr' | 'en'} />
        </div>
        
        <section className="bg-black py-12 flex justify-center border-t border-white/5">
            <a href="https://rollercoin.com/?r=l06hf4yu" target="_blank" rel="nofollow noreferrer">
                <Image src="https://static.rollercoin.com/static/img/ref/gen2/w970h250.gif" alt="Ad" width={970} height={250} className="max-w-full h-auto opacity-50 hover:opacity-100 transition-opacity" unoptimized />
            </a>
        </section>

        <footer className="bg-[#050505] py-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest">
            <span>{dict.common.algorithm_by}</span>
            <div className="flex gap-4">
              <Link href="/fr" className={lang === 'fr' ? 'text-[#10B981]' : ''}>FR</Link>
              <Link href="/en" className={lang === 'en' ? 'text-[#10B981]' : ''}>EN</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
