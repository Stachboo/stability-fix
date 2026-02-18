import StabilityDashboard from '@/components/StabilityDashboard';
import TrustBox from '@/components/TrustBox'; // Importation de ton nouveau composant
import { Mail, Zap, ShieldAlert, Layers } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F14] flex flex-col">
      
      {/* 1. LE PRODUIT (DASHBOARD + FORMULAIRE INTEGRE) */}
      <StabilityDashboard />

      {/* 2. EXPLICATIONS TECHNIQUES */}
      <section className="bg-[#0B0F14] py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-[#050505] p-6 rounded-xl border border-white/5 hover:border-[#22D3EE]/20 transition-all group">
                <Zap className="w-8 h-8 text-[#22D3EE] mb-4 group-hover:text-white transition-colors" />
                <h3 className="text-white font-bold text-lg mb-2">Latence Invisible</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">Les speedtests mesurent la vitesse, pas la consistance. Une micro-coupure de 100ms est fatale pour vous.</p>
            </div>
            <div className="bg-[#050505] p-6 rounded-xl border border-white/5 hover:border-[#22D3EE]/20 transition-all group">
                <ShieldAlert className="w-8 h-8 text-[#22D3EE] mb-4 group-hover:text-white transition-colors" />
                <h3 className="text-white font-bold text-lg mb-2">Jitter Critique</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">La variance du signal (Gigue). C'est la cause mathématique des voix robotiques et des lags inexpliqués.</p>
            </div>
            <div className="bg-[#050505] p-6 rounded-xl border border-white/5 hover:border-[#22D3EE]/20 transition-all group">
                <Layers className="w-8 h-8 text-[#22D3EE] mb-4 group-hover:text-white transition-colors" />
                <h3 className="text-white font-bold text-lg mb-2">Bufferbloat</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">Quand votre routeur s'étouffe. Un goulot d'étranglement matériel que seul un audit précis peut révéler.</p>
            </div>
        </div>
      </section>

      {/* 3. SIGNAL DE CONFIANCE (TRUSTPILOT) */}
      <div className="bg-[#0B0F14] border-t border-white/5">
        <TrustBox />
      </div>
      
      {/* 4. BANNIÈRE ROLLERCOIN */}
      <section className="bg-[#111827] border-t border-[#1F2937] py-8 flex justify-center">
        <div className="container mx-auto px-4 flex justify-center">
            <a href="https://rollercoin.com/?r=l06hf4yu" target="_blank" rel="nofollow" className="hover:opacity-80 transition-opacity">
                <img 
                    src="https://static.rollercoin.com/static/img/ref/gen2/w970h250.gif" 
                    alt="Rollercoin Mining Simulator"
                    className="max-w-full h-auto rounded shadow-lg border border-white/10"
                />
            </a>
        </div>
      </section>

    </main>
  );
}
