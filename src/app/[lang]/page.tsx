import Image from 'next/image';
import Link from 'next/link';
import StabilityDashboard from '@/components/StabilityDashboard';
import TrustBox from '@/components/TrustBox';
import { Info, CheckCircle, Terminal } from 'lucide-react';
import { getDictionary } from '@/get-dictionaries';

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

      {/* SECTION SEO 1 */}
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
              <p className="text-gray-500 italic">{dict.home.seo1.p3}</p>
              <div className="bg-[#10B981]/5 border-l-4 border-[#10B981] p-6 text-sm italic text-gray-300">
                {dict.home.seo1.highlight}
              </div>
            </div>
            <div>
              <p className="text-white font-bold mb-6 uppercase tracking-widest underline decoration-[#F59E0B]">
                {dict.home.seo1.result}
              </p>
              <ul className="space-y-3 mb-8">
                {dict.home.seo1.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-[#10B981]" />
                    <span className="text-sm font-bold uppercase">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#F59E0B] font-black text-sm uppercase tracking-widest border border-[#F59E0B]/30 px-4 py-3 rounded-xl inline-block">
                {dict.home.seo1.cta}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTBOX */}
      <div className="bg-[#0B0F14] py-16 border-t border-white/5 flex justify-center">
        <TrustBox lang={lang as 'fr' | 'en'} />
      </div>

      {/* SECTION SEO 2 */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-white/5 grid md:grid-cols-2 gap-8">

        {/* Fix card */}
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:border-[#10B981]/30 transition-all">
          <h3 className="text-2xl font-black text-white mb-2 uppercase">{dict.home.seo2.fix_title}</h3>
          <p className="text-[#10B981] text-xs font-bold uppercase tracking-widest mb-6">{dict.home.seo2.fix_subtitle}</p>
          <p className="text-gray-400 text-sm mb-2">{dict.home.seo2.fix_intro}</p>
          <p className="text-gray-500 text-xs italic mb-3">{dict.home.seo2.fix_condition}</p>
          <ul className="space-y-2 mb-6">
            {dict.home.seo2.fix_steps.map((step: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle size={12} className="text-[#10B981] shrink-0" />
                {step}
              </li>
            ))}
          </ul>
          <p className="text-gray-500 text-xs italic mb-2">{dict.home.seo2.fix_retest}</p>
          <p className="text-[#10B981] text-xs font-bold mb-2">{dict.home.seo2.fix_result}</p>
          <p className="text-gray-600 text-xs italic">{dict.home.seo2.fix_outro}</p>
        </div>

        {/* Mobile card */}
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:border-[#F59E0B]/30 transition-all">
          <h3 className="text-2xl font-black text-white mb-2 uppercase">{dict.home.seo2.mobile_title}</h3>
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-6">{dict.home.seo2.mobile_subtitle}</p>
          <p className="text-gray-400 text-sm mb-2">{dict.home.seo2.mobile_intro}</p>
          <p className="text-gray-500 text-xs italic mb-3">{dict.home.seo2.mobile_physics}</p>
          <p className="text-gray-500 text-xs mb-3">{dict.home.seo2.mobile_condition}</p>
          <ul className="space-y-2 mb-6">
            {dict.home.seo2.mobile_steps.map((step: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                <span className="text-[#F59E0B]">→</span>
                {step}
              </li>
            ))}
          </ul>
          <p className="text-[#F59E0B] text-xs font-bold mb-2">{dict.home.seo2.mobile_result}</p>
          <p className="text-gray-600 text-xs italic">{dict.home.seo2.mobile_outro}</p>
        </div>
      </section>

      {/* SECTION SEO 3 */}
      <section className="max-w-4xl mx-auto px-4 py-20 border-t border-white/5 text-center">
        <Terminal className="w-12 h-12 text-[#10B981] mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4 tracking-tighter italic">
          {dict.home.seo3.title}
        </h2>
        <p className="text-gray-400 text-lg mb-10">{dict.home.seo3.intro}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-10 text-left">
          <div className="bg-red-950/20 border border-red-500/20 p-6 rounded-2xl">
            <p className="text-red-400 font-black text-sm mb-2">❌ {dict.home.seo3.bad_label}</p>
            <p className="text-gray-400 text-sm">{dict.home.seo3.bad_desc}</p>
          </div>
          <div className="bg-[#10B981]/5 border border-[#10B981]/30 p-6 rounded-2xl">
            <p className="text-[#10B981] font-black text-sm mb-2">✅ {dict.home.seo3.good_label}</p>
            <p className="text-gray-400 text-sm">{dict.home.seo3.good_desc}</p>
          </div>
        </div>

        <p className="text-gray-300 text-sm italic mb-10 border border-white/5 px-6 py-4 rounded-xl">
          {dict.home.seo3.filter}
        </p>

        <p className="text-gray-400 text-sm mb-4">{dict.home.seo3.use_case_intro}</p>
        <ul className="space-y-2 mb-10">
          {dict.home.seo3.use_cases.map((uc: string, i: number) => (
            <li key={i} className="text-[#10B981] text-sm font-bold">▸ {uc}</li>
          ))}
        </ul>

        <p className="text-white font-black uppercase tracking-widest text-sm mb-8">{dict.home.seo3.outro}</p>

        <Link
          href={`/${lang}/glossary/jitter`}
          className="inline-flex items-center gap-2 text-[#10B981] font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          {dict.common.read_more}
        </Link>
      </section>

      {/* ADS & FOOTER */}
      <div className="mt-auto">
        <section className="bg-black py-12 flex justify-center border-t border-white/5">
          <a href="https://rollercoin.com/?r=l06hf4yu" target="_blank" rel="nofollow noreferrer">
            <Image
              src="https://static.rollercoin.com/static/img/ref/gen2/w970h250.gif"
              alt="Ad"
              width={970}
              height={250}
              className="max-w-full h-auto opacity-50 hover:opacity-100 transition-opacity"
              unoptimized
            />
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
