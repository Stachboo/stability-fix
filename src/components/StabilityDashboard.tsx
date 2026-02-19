"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from '@formspree/react';
import { Line } from 'react-chartjs-2';
import { useRouter, usePathname } from 'next/navigation';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions
} from 'chart.js';
import { Activity, Wifi, Zap, Terminal, AlertTriangle, Mail, CheckCircle, ShieldCheck, Lock, Signal, Smartphone, Laptop, CheckSquare, Share2, Cpu, HardDrive, Copy } from 'lucide-react';
import { LatencyProcessor, TestResult } from './latency-engine';
import TrustBox from './TrustBox'; // RÉINTÉGRATION CHIRURGICALE

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DONATION_URL = "https://paypal.me/abdus84";
const SITE_URL = "https://www.stabilityprotocol.space/";
const AMZ_LINKS = {
  cable: "https://amzn.to/4a6Tpyf",
  router: "https://amzn.to/4bDAlZv",
};

const REPAIR_MATRIX = {
  win_scan: {
    title: "PROTOCOLE #WLAN-SCAN",
    desc: "Signature de scan cyclique détectée (WlanSvc). Windows gèle votre connexion toutes les 60s pour chercher d'autres réseaux.",
    action: "netsh wlan set autoconfig enabled=no interface=\"Wi-Fi\"",
    warning: "Réactiver avec 'enabled=yes' pour voir de nouveaux réseaux."
  },
  linux_pwr: {
    title: "PROTOCOLE #PWR-MGMT",
    desc: "Le Power Management du Kernel Linux met votre carte Wi-Fi en veille entre les paquets, créant du jitter.",
    action: "sudo iw dev wlan0 set power_save off",
    warning: "Remplacez wlan0 par le nom de votre interface."
  },
  ios_relay: {
    title: "PROTOCOLE #IP-RELAY",
    desc: "Le Relais Privé iCloud détourne vos paquets via des proxys Apple, augmentant artificiellement la latence.",
    action: "Réglages > WiFi > (i) > Désactiver 'Limiter le suivi de l'adresse IP'",
    warning: "Affecte la confidentialité de navigation."
  },
  android_bt: {
    title: "PROTOCOLE #BT-INTERFERENCE",
    desc: "Interférence 2.4GHz détectée. Le contrôleur Bluetooth sature l'antenne partagée avec le Wi-Fi.",
    action: "Désactivez le Bluetooth ou basculez sur une bande Wi-Fi 5GHz.",
    warning: "Incompatible avec les écouteurs sans fil."
  }
};

const PING_INTERVAL = 100;
const TEST_DURATION = 30000;
const PING_TARGET = 'https://www.cloudflare.com/cdn-cgi/trace';

interface StabilityDashboardProps {
  dict: any;
  lang: 'fr' | 'en';
}

export default function StabilityDashboard({ dict, lang }: StabilityDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const t = {
    ...dict.dashboard,
    ...dict.home,
    intro_title: dict.dashboard.hero_title,
    intro_sub: dict.dashboard.hero_subtitle,
    intro_p1: dict.dashboard.warning,
    intro_p2: dict.dashboard.mission,
    intro_rule_title: dict.dashboard.rules.title,
    intro_rule_1: dict.dashboard.rules.one,
    intro_rule_2: dict.dashboard.rules.two,
    intro_btn: dict.dashboard.intro_btn,
    title: dict.dashboard.analyzer_title,
    subtitle: dict.dashboard.analyzer_version,
    metric_jitter: dict.dashboard.stats.jitter,
    metric_ping: dict.dashboard.stats.latency,
    metric_score: dict.dashboard.stats.stability,
    metric_spike: dict.dashboard.stats.max_pic,
    metric_loss: dict.dashboard.stats.loss,
    status_idle: lang === 'fr' ? "SYSTÈME PRÊT" : "SYSTEM READY",
    status_running: lang === 'fr' ? "ACQUISITION DES DONNÉES..." : "ACQUIRING DATA...",
    status_done: lang === 'fr' ? "ANALYSE TERMINÉE" : "ANALYSIS COMPLETE",
    result_title: lang === 'fr' ? "DIAGNOSTIC TECHNIQUE" : "TECHNICAL DIAGNOSTIC",
    prompt_btn: lang === 'fr' ? "COPIER RAPPORT EXPERT" : "COPY EXPERT REPORT",
    prompt_copied: lang === 'fr' ? "COPIÉ !" : "COPIED!",
    share_btn: lang === 'fr' ? "PARTAGER MON SCORE" : "SHARE MY SCORE",
    fix_btn: lang === 'fr' ? "VOIR LA SOLUTION MATÉRIELLE" : "VIEW HARDWARE FIX",
    diag_good: lang === 'fr' ? "Connexion Compétitive. Vos balles touchent instantanément." : "Competitive Connection. Shots register instantly.",
    diag_cable: lang === 'fr' ? "MICRO-LAG DÉTECTÉ. Sensation de lourdeur en jeu. Vérifiez votre câble." : "MICRO-LAG DETECTED. Heavy feeling in-game. Check cables.",
    diag_router: lang === 'fr' ? "BUFFERBLOAT CRITIQUE. Injouable en classé. Réseau saturé." : "CRITICAL BUFFERBLOAT. Unplayable in ranked. Network saturated.",
    diag_mobile: lang === 'fr' ? "SIGNAL INSTABLE. Trop de variations pour le gaming sérieux." : "UNSTABLE SIGNAL. Too much variance for serious gaming.",
    grade: lang === 'fr' ? { perfect: "GOD TIER", good: "SOLIDE", bad: "INSTABLE", critical: "INJOUABLE" } : { perfect: "GOD TIER", good: "SOLID", bad: "UNSTABLE", critical: "UNPLAYABLE" },
    checklist_title: lang === 'fr' ? "ACTIONS PRIORITAIRES (Software First)" : "PRIORITY ACTIONS (Software First)",
    checklist_desc: lang === 'fr' ? "Effectuez ces vérifications gratuites avant tout achat matériel :" : "Perform these free checks before any hardware purchase:",
    checklist_pc: lang === 'fr' ? ["Fermer YouTube", "Désactiver VPN", "Arrêter Steam", "Cache Incognito"] : ["Close YouTube", "Disable VPN", "Stop Steam", "Incognito Cache"],
    checklist_mobile: lang === 'fr' ? ["Éco Énergie OFF", "Bluetooth OFF", "Relais iCloud OFF", "Apps Sociales OFF"] : ["Power Save OFF", "Bluetooth OFF", "iCloud Relay OFF", "Social Apps OFF"],
  };

  const [showIntro, setShowIntro] = useState(true);
  const [state, handleSubmit] = useForm("xqedabdl");
  const [isTesting, setIsTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(4).fill(false));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [os, setOs] = useState('unknown');
  const [repairStep, setRepairStep] = useState<'idle' | 'question' | 'fiche'>('idle');
  const [activeFix, setActiveFix] = useState<keyof typeof REPAIR_MATRIX | null>(null);

  const [results, setResults] = useState<TestResult>({
    avgPing: 0, jitter: 0, spikeMax: 0, packetLoss: 0, stabilityScore: 100,
    samples: [], smoothed: [], hardwareGuess: 'ethernet'
  });

  const [diagnosis, setDiagnosis] = useState<'cable' | 'router' | 'mobile' | 'good'>('good');
  const processorRef = useRef<LatencyProcessor>(new LatencyProcessor());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const switchLang = useCallback((newLang: 'fr' | 'en') => {
    const segments = pathname.split('/');
    segments[1] = newLang;
    router.push(segments.join('/'));
  }, [pathname, router]);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobileDevice(/iPhone|iPad|iPod|Android/i.test(ua));
    if (ua.includes('Win')) setOs('windows');
    else if (ua.includes('Linux') && !ua.includes('Android')) setOs('linux');
    else if (ua.includes('iPhone') || ua.includes('iPad')) setOs('ios');
    else if (ua.includes('Android')) setOs('android');
  }, []);

  const addLog = (msg: string) => setLogs(prev => [`> ${msg}`, ...prev].slice(0, 4));

  const runDiagnosis = (res: TestResult) => {
    if (res.packetLoss > 0.5) { setDiagnosis('router'); }
    else if (isMobileDevice) {
      if (res.jitter > 10) setDiagnosis('mobile');
      else setDiagnosis('good');
    } else {
      if (res.jitter > 4) setDiagnosis('cable');
      else if (res.spikeMax > 80) setDiagnosis('router');
      else setDiagnosis('good');
    }

    if (res.stabilityScore < 95) {
      if (os === 'windows' && res.spikeMax > 150) setActiveFix('win_scan');
      else if (os === 'linux' && res.jitter > 8) setActiveFix('linux_pwr');
      else if (os === 'ios' && res.avgPing > 80) setActiveFix('ios_relay');
      else if (os === 'android' && res.jitter > 12) setActiveFix('android_bt');
      setRepairStep('question');
    }
  };

  const stopTest = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setIsTesting(false);
    setTestComplete(true);
    setProgress(100);
    addLog(t.status_done);
    const finalResults = processorRef.current.getResults();
    setResults(finalResults);
    runDiagnosis(finalResults);
  }, [t.status_done]);

  const startTest = useCallback(() => {
    if (isTesting) return;
    setIsTesting(true); setTestComplete(false); setElapsedTime(0); setProgress(0); setLogs([]); setDiagnosis('good');
    setRepairStep('idle'); setActiveFix(null);
    addLog(t.status_running);
    processorRef.current.reset();
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(async () => {
      const now = Date.now();
      const elapsedMs = now - startTimeRef.current;
      setElapsedTime(Math.floor(elapsedMs / 1000));
      setProgress(Math.min((elapsedMs / TEST_DURATION) * 100, 100));

      try {
        const start = performance.now();
        await fetch(`${PING_TARGET}?t=${now}`, { mode: 'no-cors', cache: 'no-store', priority: 'high' });
        processorRef.current.addSample(performance.now() - start);
      } catch (e) {
        processorRef.current.addSample(null);
        addLog("Packet Loss Detected");
      }
      
      setResults(processorRef.current.getResults());
      if (elapsedMs >= TEST_DURATION) stopTest();
    }, PING_INTERVAL);
  }, [isTesting, stopTest, t.status_running]);

  const toggleCheck = (index: number) => {
    const newItems = [...checkedItems];
    newItems[index] = !newItems[index];
    setCheckedItems(newItems);
  };

  const shareScore = () => {
    const isGood = results.stabilityScore > 80;
    const tags = isGood ? "#NoLag #Gaming" : "#CheckYourConnection #NetTest";
    const text = lang === 'fr' 
      ? `Stabilité Gaming : ${results.stabilityScore}/100 ${isGood ? '🚀' : '⚠️'} Jitter : ${results.jitter}ms. Teste ta connexion sur ${SITE_URL} ${tags}`
      : `Gaming Stability: ${results.stabilityScore}/100 ${isGood ? '🚀' : '⚠️'} Jitter: ${results.jitter}ms. Test your connection on ${SITE_URL} ${tags}`;
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const generatePrompt = () => {
    return `Act as an Elite Network Engineer. OS: ${os}. Score ${results.stabilityScore}/100, Jitter ${results.jitter}ms, Loss ${results.packetLoss}%. Fix: ${activeFix || 'Hardware'}`;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const chartData = {
    labels: results.samples.map((_: number, i: number) => i),
    datasets: [
      { label: 'Stabilized', data: results.smoothed, borderColor: '#06b6d4', borderWidth: 2, pointRadius: 0, tension: 0.4 }
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
    scales: { x: { display: false }, y: { display: false } }, plugins: { legend: { display: false } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 relative overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {showIntro && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl border border-white/10 bg-black/90 rounded-2xl p-6 md:p-12 shadow-2xl my-auto">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button onClick={() => switchLang('fr')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === 'fr' ? 'bg-cyan-500 text-black scale-110' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>🇫🇷</button>
              <button onClick={() => switchLang('en')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-cyan-500 text-black scale-110' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>🇺🇸</button>
            </div>
            <div className="text-center mb-4">
              <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-cyan-500 mx-auto mb-3 animate-pulse" />
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">{t.intro_title}</h1>
              <p className="text-cyan-400 font-bold tracking-widest text-xs uppercase">{t.intro_sub}</p>
            </div>
            <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed mb-4">
              <p><span className="text-white font-bold">WARNING:</span> {t.intro_p1}</p>
              <p>{t.intro_p2}</p>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><Lock size={14}/> {t.intro_rule_title}</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><span className="text-cyan-500 font-bold">01.</span> {t.intro_rule_1}</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold">02.</span> {t.intro_rule_2}</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <button onClick={() => setShowIntro(false)} className="w-full bg-cyan-600 py-4 font-bold text-white rounded-lg hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase">
                {t.intro_btn}
              </button>
              
              {/* RESTAURATION DU SIGNAL DE CONFIANCE DANS LE MANIFESTO */}
              <div className="pt-4 border-t border-white/5">
                <TrustBox lang={lang} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Le reste du code reste identique à la version validée pour le build */}
      <div className={`max-w-6xl mx-auto relative z-10 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        {/* ... (Contenu du Dashboard identique) ... */}
        <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{t.title}</h2>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium"><Activity size={16} /> {t.subtitle}</div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button onClick={() => switchLang('fr')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'fr' ? 'bg-cyan-500 text-black' : 'text-slate-500'}`}>FR</button>
              <button onClick={() => switchLang('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-cyan-500 text-black' : 'text-slate-500'}`}>EN</button>
            </div>
            <button onClick={isTesting ? stopTest : startTest} className={`px-8 py-3 rounded-lg font-bold text-sm ${isTesting ? 'bg-red-500/10 text-red-400 border border-red-500' : 'bg-cyan-600 text-white'}`}>{isTesting ? t.stop_btn : t.start_btn}</button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2"><span>{t.metric_jitter}</span><Wifi size={16} /></div>
            <div className="text-4xl font-black text-white">{results.jitter.toFixed(1)}<span className="text-lg text-slate-500 font-medium">ms</span></div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-xs font-bold text-slate-400 mb-2">{t.metric_ping}</div>
            <div className="text-3xl font-bold text-white">{results.avgPing.toFixed(0)}<span className="text-sm text-slate-500">ms</span></div>
          </div>
          <div className={`border border-white/10 rounded-2xl p-6 ${results.stabilityScore > 80 ? 'bg-emerald-900/10' : 'bg-red-900/10'}`}>
            <div className="text-xs font-bold text-slate-400 mb-2">{t.metric_score}</div>
            <div className="text-3xl font-black text-white">{results.stabilityScore}/100</div>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {isTesting && (
            <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{elapsedTime >= 30 ? "FINALISATION DES DONNÉES..." : "ANALYSE EN COURS"}</span>
                <span className="text-xl font-mono font-black text-white">00:{elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime} <span className="text-xs text-slate-500">/ 30s</span></span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${elapsedTime >= 30 ? 'bg-amber-500' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`} style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-64"><Line data={chartData} options={chartOptions} /></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 p-3 rounded-lg border border-white/5"><div className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_spike}</div><div className="text-xl font-bold text-red-400">{results.spikeMax.toFixed(0)}ms</div></div>
            <div className="bg-black/30 p-3 rounded-lg border border-white/5"><div className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_loss}</div><div className="text-xl font-bold text-emerald-500">{results.packetLoss.toFixed(1)}%</div></div>
            <div className="col-span-2 bg-black/40 p-3 rounded-xl font-mono text-xs text-emerald-500/80 h-16 overflow-hidden border border-white/5">{logs.map((l: string, i: number) => <div key={i}>{l}</div>)}</div>
          </div>
{/* FIN DU DIAGNOSTIC & RÉSULTATS */}
          {testComplete && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className={`p-6 border rounded-xl flex flex-col md:flex-row gap-6 ${diagnosis === 'good' ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-400 mb-2"><Zap size={14}/> {t.result_title}</div>
                  <div className="text-xl font-black text-white mb-2 uppercase">
                    {diagnosis === 'good' ? t.grade.perfect : (diagnosis === 'cable' ? t.grade.bad : t.grade.critical)}
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    {diagnosis === 'good' ? t.diag_good : (diagnosis === 'cable' ? t.diag_cable : diagnosis === 'mobile' ? t.diag_mobile : t.diag_router)}
                  </p>
                  <button onClick={shareScore} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold border border-white/5 transition-all">
                    <Share2 size={14} /> {shareCopied ? (lang === 'fr' ? "COPIÉ !" : "COPIED!") : t.share_btn}
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 min-w-[140px]">
                  {diagnosis === 'good' ? (
                    <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center transition-transform hover:scale-110">
                      <img src="/chat.png" alt="Coffee" className="w-20 h-20 object-contain drop-shadow-[0_0_10px_#10b981]" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase mt-2 group-hover:animate-pulse">
                        {lang === 'fr' ? "Offre-moi un café ☕" : "Buy me a coffee ☕"}
                      </span>
                    </a>
                  ) : (
                    <>
                      <button onClick={copyPrompt} className="w-full bg-slate-800 p-3 rounded-lg text-xs font-bold text-white flex items-center gap-2 border border-white/10 hover:bg-slate-700 transition-all">
                        <Terminal size={14}/> {promptCopied ? t.prompt_copied : t.prompt_btn}
                      </button>
                      <a href={diagnosis === 'cable' ? AMZ_LINKS.cable : AMZ_LINKS.router} target="_blank" rel="noopener" className="w-full bg-amber-600 p-3 rounded-lg text-xs font-bold text-white flex items-center gap-2 hover:bg-amber-500 transition-all text-center">
                        <AlertTriangle size={14} className="inline mr-1"/> {t.fix_btn}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BLOC FEEDBACK (FORMSPREE) RESTAURÉ */}
      <div className="max-w-4xl mx-auto w-full mt-20 pt-12 border-t border-white/5 bg-black/20 rounded-3xl p-8 mb-20">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4"><Mail className="text-cyan-500" size={24} /></div>
          {state.succeeded ? (
            <div className="text-emerald-400 font-bold animate-in zoom-in uppercase tracking-tighter italic">
              {lang === 'fr' ? "Merci pour votre retour !" : "Thank you for your feedback!"}
            </div>
          ) : (
            <div className="text-left">
              <h3 className="text-white font-black text-center text-xl mb-1 uppercase tracking-tighter italic">
                {lang === 'fr' ? "Un avis sur le diagnostic ?" : "Feedback on the diagnostic?"}
              </h3>
              <p className="text-slate-500 text-[10px] text-center mb-6 uppercase tracking-widest font-bold">
                {lang === 'fr' ? "Aidez-nous à améliorer l'algorithme" : "Help us improve the algorithm"}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea id="message" name="message" required placeholder={lang === 'fr' ? "Suggestions, bugs ou expérience..." : "Suggestions, bugs or experience..."} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 min-h-[100px]" />
                <div className="flex gap-2">
                  <input id="email" type="email" name="email" placeholder="Email (Opt.)" className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <button type="submit" disabled={state.submitting} className="bg-cyan-600 px-6 py-2 rounded-lg text-xs font-black text-white hover:bg-cyan-500 uppercase tracking-widest">
                    {state.submitting ? '...' : 'OK'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER BAS DE PAGE */}
      <footer className="py-10 border-t border-white/5 flex flex-col items-center gap-2 mt-auto">
        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em]">
          {lang === 'fr' ? "Stability Protocol - Système Certifié" : "Stability Protocol - Certified System"}
        </p>
      </footer>
    </div>
  );
}
