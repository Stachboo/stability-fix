import { getDictionary } from '@/get-dictionaries';
import GlossarySidebar from '@/components/GlossarySidebar';

export default async function GlossaryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'fr' | 'en');

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col font-mono">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row gap-16">
        <GlossarySidebar lang={lang} dict={dict} />
        <main className="flex-1 text-white border-l border-white/5 pl-16">
          {children}
        </main>
      </div>
    </div>
  );
}
