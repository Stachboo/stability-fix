"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Activity, Zap, ShieldAlert, Layers } from 'lucide-react';

export default function GlossarySidebar({ lang, dict }: { lang: string, dict: any }) {
  const pathname = usePathname();
  const t = dict.sidebar;

  const links = [
    { href: `/${lang}`, label: t.links.home, icon: Activity },
    { href: `/${lang}/glossary/jitter`, label: t.links.jitter, icon: ShieldAlert },
    { href: `/${lang}/glossary/bufferbloat`, label: t.links.bufferbloat, icon: Layers },
    { href: `/${lang}/glossary/packet-loss`, label: t.links.packet_loss, icon: Zap },
  ];

  return (
    <aside className="w-full md:w-64 space-y-8">
      <div className="flex items-center gap-3 mb-10">
        <BookOpen className="text-[#10B981] w-6 h-6" />
        <h2 className="text-white font-black tracking-tighter text-xl uppercase">{t.title}</h2>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs transition-all border ${
                isActive 
                ? 'bg-[#10B981]/10 border-[#10B981] text-white' 
                : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#10B981]' : ''} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
