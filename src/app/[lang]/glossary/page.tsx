import Link from 'next/link';
import { Activity, Layers, Server, ArrowRight } from 'lucide-react';

export default function GlossaryIndex() {
  return (
    <div className="space-y-8">
      <header className="border-b border-white/10 pb-8">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
          PROTOCOL <span className="text-[#22D3EE]">KNOWLEDGE_BASE</span>
        </h1>
        <p className="text-xl text-gray-400 font-mono">
          Documentation technique des anomalies réseau.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CARTE JITTER */}
        <Link href="/glossary/jitter" className="group block bg-[#050505] border border-white/5 p-6 rounded-xl hover:border-[#22D3EE]/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-[#22D3EE]" />
            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Jitter (Gigue)</h2>
          <p className="text-sm text-gray-500">La variance du temps de latence. L'ennemi n°1 du gaming compétitif.</p>
        </Link>

        {/* CARTE BUFFERBLOAT */}
        <Link href="/glossary/bufferbloat" className="group block bg-[#050505] border border-white/5 p-6 rounded-xl hover:border-[#22D3EE]/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Layers className="w-8 h-8 text-[#22D3EE]" />
            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Bufferbloat</h2>
          <p className="text-sm text-gray-500">Quand votre routeur s'étouffe sous la charge. La cause des lags quand quelqu'un regarde Netflix.</p>
        </Link>

        {/* CARTE PACKET LOSS */}
        <Link href="/glossary/packet-loss" className="group block bg-[#050505] border border-white/5 p-6 rounded-xl hover:border-[#22D3EE]/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Server className="w-8 h-8 text-[#22D3EE]" />
            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Packet Loss</h2>
          <p className="text-sm text-gray-500">Des données perdues en route. Provoque téléportations et déconnexions.</p>
        </Link>
      </div>
    </div>
  );
}
