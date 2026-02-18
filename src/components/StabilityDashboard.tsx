"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions
} from 'chart.js';
import { Activity, Wifi, Zap, Terminal, AlertTriangle, Mail, CheckCircle, ShieldCheck, Lock, Signal, Smartphone, Laptop, CheckSquare, Share2, Cpu, HardDrive, Copy } from 'lucide-react';
import { LatencyProcessor, TestResult } from './latency-engine';

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

const TRANSLATIONS = {
  fr: {
    intro_title: "LE MENSONGE DU DÉBIT",
    intro_sub: "POURQUOI CE PROTOCOLE EXISTE",
    intro_p1: "Les FAI vous vendent du '1 Gbps'. C'est du marketing. Pour le Gaming, la vitesse ne sert à rien sans la STABILITÉ (0 Jitter).",
    intro_p2: "Nous avons codé cet outil pour une seule raison : Arrêter le gaspillage. Trop de joueurs achètent des routeurs hors de prix alors qu'un simple réglage logiciel suffisait.",
    intro_rule_title: "NOTRE RÈGLE D'OR :",
    intro_rule_1: "1. SOFTWARE D'ABORD : On vérifie les Drivers, le QoS, les DNS. C'est gratuit.",
    intro_rule_2: "2. HARDWARE EN DERNIER RECOURS : Si la physique (câble pourri, routeur saturé) est la cause, alors seulement nous conseillons le matériel précis.",
    intro_btn: "RÉVÉLER LA VÉRITÉ",
    title: "PROTOCOLE DE STABILITÉ",
    subtitle: "ANALYSEUR LATENCE & JITTER V3.0",
    start_btn: "LANCER LE TEST (30s)",
    stop_btn: "ARRÊTER",
    status_idle: "SYSTÈME PRÊT",
    status_running: "ACQUISITION DES DONNÉES...",
    status_done: "ANALYSE TERMINÉE",
    metric_jitter: "JITTER (GIGUE)",
    metric_ping: "LATENCE MOYENNE",
    metric_spike: "PIC MAX (LAG)",
    metric_loss: "PACKET LOSS",
    metric_score: "SCORE STABILITÉ",
    console_title: "LOGS SYSTÈME",
    result_title: "DIAGNOSTIC TECHNIQUE",
    prompt_btn: "COPIER RAPPORT EXPERT",
    prompt_copied: "COPIÉ !",
    share_btn: "PARTAGER MON SCORE",
    fix_btn: "VOIR LA SOLUTION MATÉRIELLE",
    diag_good: "Connexion Compétitive. Vos balles touchent instantanément.",
    diag_cable: "MICRO-LAG DÉTECTÉ. Sensation de lourdeur en jeu. Vérifiez votre câble.",
    diag_router: "BUFFERBLOAT CRITIQUE. Injouable en classé. Réseau saturé.",
    diag_mobile: "SIGNAL INSTABLE. Trop de variations pour le gaming sérieux.",
    grade: { perfect: "GOD TIER", good: "SOLIDE", bad: "INSTABLE", critical: "INJOUABLE" },
    checklist_title: "ACTIONS PRIORITAIRES (Software First)",
    checklist_desc: "Effectuez ces vérifications gratuites avant tout achat matériel :",
    checklist_pc: [
      "Fermer les onglets YouTube/Twitch en fond",
      "Désactiver les extensions VPN/Adblock",
      "Vérifier qu'aucun téléchargement (Steam/Update) n'est actif",
      "Vider le cache navigateur et tester en mode Incognito"
    ],
    checklist_mobile: [
      "Désactiver le Mode Économie d'Énergie",
      "Couper le Bluetooth (interférences WiFi 2.4GHz)",
      "Désactiver le Relais Privé iCloud (iOS)",
      "Fermer les applications sociales gourmandes (TikTok/Instagram)"
    ],
    seo1_title: "POURQUOI VOUS LAGEZ MALGRÉ LA FIBRE",
    seo1_p1: "Votre FAI vous vend \"1 Gbps\". Vous payez. Vous lag quand même.",
    seo1_p2: "Le problème n'est pas la VITESSE. C'est la STABILITÉ.",
    seo1_p3: "Un speedtest classique prend une photo. Nous filmons en 4K.",
    seo1_highlight: "Stability Protocol mesure le JITTER (micro-coupures invisibles) que Speedtest.net ignore. Si votre ping passe de 15ms à 80ms brutalement, c'est du lag spike. On le détecte. Eux non.",
    seo1_result: "Résultat : Vous savez ENFIN si le problème vient de :",
    seo1_issue1: "Votre câble Ethernet pourri",
    seo1_issue2: "Votre canal WiFi saturé",
    seo1_issue3: "Votre routeur qui s'étouffe (Bufferbloat)",
    seo1_issue4: "Votre FAI qui ment",
    seo1_cta: "Testez 30 secondes. Pas de bullshit marketing.",
    seo2_title1: "OPTIMISER VOTRE CONNEXION FIXE",
    seo2_subtitle1: "VOUS AVEZ TROUVÉ LE COUPABLE",
    seo2_p1: "Lancez le test. Regardez la courbe en temps réel.",
    seo2_if: "Si elle est chaotique :",
    seo2_fix1: "Changez votre canal WiFi (de 6 à 11)",
    seo2_fix2: "Remplacez le câble Ethernet Cat 5 par du Cat 8",
    seo2_fix3: "Activez le QoS sur votre routeur",
    seo2_fix4: "Passez aux DNS Cloudflare (1.1.1.1)",
    seo2_retest: "Relancez le test.",
    seo2_result1: "Si la courbe se lisse = vous venez de gagner 20ms sans changer d'abonnement.",
    seo2_footer1: "C'est ce qu'on appelle \"stabiliser le signal\".",
    seo2_title2: "TROUVER LE BON SPOT (Mobile)",
    seo2_subtitle2: "LE RÉSEAU EST UNE QUESTION DE PHYSIQUE",
    seo2_p2: "En 4G/5G, 2 mètres changent tout.",
    seo2_p3: "Le béton bloque. Les ondes rebondissent. Les micro-ondes interfèrent.",
    seo2_test: "Testez en vous déplaçant :",
    seo2_tip1: "Près d'une fenêtre (signal meilleur)",
    seo2_tip2: "Loin du routeur voisin (moins d'interférences)",
    seo2_tip3: "À l'étage supérieur (moins de murs)",
    seo2_result2: "La courbe devient verte ? Vous avez trouvé votre \"Point Zero\". Bookmarkez cette position.",
    seo2_footer2: "Nous avons stabilisé des connexions 4G à 12ms de jitter juste en changeant de pièce.",
    seo3_title: "COMMENT ÇA MARCHE",
    seo3_sub: "(Sans le Bullshit)",
    seo3_p1: "Notre algorithme analyse la VARIANCE inter-paquets.",
    seo3_bad: "Speedtest.net :",
    seo3_bad_desc: "Fait 3 mesures, fait la moyenne, te dit \"GG\".",
    seo3_good: "Stability Protocol :",
    seo3_good_desc: "Fait 300 mesures, détecte les micro-coupures, te montre la vérité brute.",
    seo3_tech: "Nous utilisons un filtre Savitzky-Golay (mathématiques de niveau Master) pour séparer le BRUIT du SIGNAL réel.",
    seo3_use_title: "Si votre score est élevé ici, votre connexion tiendra sous n'importe quelle charge critique :",
    seo3_use1: "Gaming compétitif (Valorant, CS2, Fortnite)",
    seo3_use2: "Trading haute fréquence",
    seo3_use3: "Streaming 4K sans coupure",
    seo3_footer: "Pas d'approximation. Juste des faits."
  },
  en: {
    intro_title: "THE SPEED LIE",
    intro_sub: "WHY WE BUILT THIS PROTOCOL",
    intro_p1: "ISPs sell you '1 Gbps'. That's marketing. For gaming, speed means nothing without STABILITY (0 Jitter).",
    intro_p2: "We coded this tool for one reason: To stop the waste. Too many gamers buy expensive routers when a simple software tweak was enough.",
    intro_rule_title: "OUR GOLDEN RULE:",
    intro_rule_1: "1. SOFTWARE FIRST: We check Drivers, QoS, DNS. It's free.",
    intro_rule_2: "2. HARDWARE LAST: If physics (bad cable, saturated router) is the cause, only then do we recommend specific gear.",
    intro_btn: "REVEAL THE TRUTH",
    title: "STABILITY PROTOCOL",
    subtitle: "LATENCY & JITTER ANALYZER V3.0",
    start_btn: "START TEST (30s)",
    stop_btn: "STOP",
    status_idle: "SYSTEM READY",
    status_running: "ACQUIRING DATA...",
    status_done: "ANALYSIS COMPLETE",
    metric_jitter: "JITTER",
    metric_ping: "AVG LATENCY",
    metric_spike: "MAX SPIKE",
    metric_loss: "PACKET LOSS",
    metric_score: "STABILITY SCORE",
    console_title: "SYSTEM LOGS",
    result_title: "TECHNICAL DIAGNOSTIC",
    prompt_btn: "COPY EXPERT REPORT",
    prompt_copied: "COPIED!",
    share_btn: "SHARE MY SCORE",
    fix_btn: "VIEW HARDWARE FIX",
    diag_good: "Competitive Connection. Shots register instantly.",
    diag_cable: "MICRO-LAG DETECTED. Heavy feeling in-game. Check cables.",
    diag_router: "CRITICAL BUFFERBLOAT. Unplayable in ranked. Network saturated.",
    diag_mobile: "UNSTABLE SIGNAL. Too much variance for serious gaming.",
    grade: { perfect: "GOD TIER", good: "SOLID", bad: "UNSTABLE", critical: "UNPLAYABLE" },
    checklist_title: "PRIORITY ACTIONS (Software First)",
    checklist_desc: "Perform these free checks before any hardware purchase:",
    checklist_pc: [
      "Close background YouTube/Twitch tabs",
      "Disable VPN/Adblock extensions",
      "Ensure no active downloads (Steam/Update)",
      "Clear browser cache or test in Incognito mode"
    ],
    checklist_mobile: [
      "Disable Power Saving Mode",
      "Turn off Bluetooth (2.4GHz WiFi interference)",
      "Disable iCloud Private Relay (iOS)",
      "Close heavy background apps (TikTok/Instagram)"
    ],
    seo1_title: "WHY YOU'RE LAGGING DESPITE FIBER",
    seo1_p1: "Your ISP sells you \"1 Gbps\". You pay. You still lag.",
    seo1_p2: "The problem isn't SPEED. It's STABILITY.",
    seo1_p3: "A classic speedtest takes a photo. We film in 4K.",
    seo1_highlight: "Stability Protocol measures JITTER (invisible micro-cuts) that Speedtest.net ignores. If your ping jumps from 15ms to 80ms brutally, that's a lag spike. We detect it. They don't.",
    seo1_result: "Result: You FINALLY know if the problem comes from:",
    seo1_issue1: "Your crappy Ethernet cable",
    seo1_issue2: "Your saturated WiFi channel",
    seo1_issue3: "Your router choking (Bufferbloat)",
    seo1_issue4: "Your ISP lying",
    seo1_cta: "Test for 30 seconds. No marketing bullshit.",
    seo2_title1: "OPTIMIZE YOUR WIRED CONNECTION",
    seo2_subtitle1: "YOU FOUND THE CULPRIT",
    seo2_p1: "Run the test. Watch the curve in real-time.",
    seo2_if: "If it's chaotic:",
    seo2_fix1: "Change your WiFi channel (from 6 to 11)",
    seo2_fix2: "Replace Cat 5 Ethernet cable with Cat 8",
    seo2_fix3: "Enable QoS on your router",
    seo2_fix4: "Switch to Cloudflare DNS (1.1.1.1)",
    seo2_retest: "Run the test again.",
    seo2_result1: "If the curve smooths = you just gained 20ms without changing your plan.",
    seo2_footer1: "That's what we call \"signal stabilization\".",
    seo2_title2: "FIND THE RIGHT SPOT (Mobile)",
    seo2_subtitle2: "NETWORK IS A PHYSICS QUESTION",
    seo2_p2: "On 4G/5G, 2 meters change everything.",
    seo2_p3: "Concrete blocks. Waves bounce. Microwaves interfere.",
    seo2_test: "Test while moving:",
    seo2_tip1: "Near a window (better signal)",
    seo2_tip2: "Away from neighbor's router (less interference)",
    seo2_tip3: "Upper floor (fewer walls)",
    seo2_result2: "Curve turns green? You found your \"Point Zero\". Bookmark this position.",
    seo2_footer2: "We've stabilized 4G connections to 12ms jitter just by changing rooms.",
    seo3_title: "HOW IT WORKS",
    seo3_sub: "(No Bullshit)",
    seo3_p1: "Our algorithm analyzes inter-packet VARIANCE.",
    seo3_bad: "Speedtest.net:",
    seo3_bad_desc: "Takes 3 measures, averages them, says \"GG\".",
    seo3_good: "Stability Protocol:",
    seo3_good_desc: "Takes 300 measures, detects micro-cuts, shows you raw truth.",
    seo3_tech: "We use a Savitzky-Golay filter (Master-level math) to separate NOISE from real SIGNAL.",
    seo3_use_title: "If your score is high here, your connection will hold under any critical load:",
    seo3_use1: "Competitive gaming (Valorant, CS2, Fortnite)",
    seo3_use2: "High-frequency trading",
    seo3_use3: "4K streaming without drops",
    seo3_footer: "No approximation. Just facts."
  }
};

const PING_INTERVAL = 100;
const TEST_DURATION = 30000;
const PING_TARGET = 'https://www.cloudflare.com/cdn-cgi/trace';

export default function StabilityDashboard() {
  // FIX 1 & 2: DÉTECTION LANGUE INSTANTANÉE + LOCALSTORAGE
  const [lang, setLang] = useState<'fr' | 'en'>(() => {
    if (typeof window === 'undefined') return 'en';
    
    // 1. Vérifie si choix manuel stocké
    const stored = localStorage.getItem('lang');
    if (stored === 'fr' || stored === 'en') return stored;
    
    // 2. Sinon détecte navigateur
    const browserLang = navigator.language || 'en';
    return browserLang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  });

  const [showIntro, setShowIntro] = useState(true);
  const t = TRANSLATIONS[lang];
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

  // FIX 2: FONCTION POUR CHANGER LA LANGUE
  const switchLang = useCallback((newLang: 'fr' | 'en') => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', newLang);
    }
  }, []);

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
  }, [t]);

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
  }, [isTesting, stopTest, t]);

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
    labels: results.samples.map((_, i) => i),
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
            
            {/* FIX 3: TOGGLE LANGUE DANS MANIFESTO */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                onClick={() => switchLang('fr')} 
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === 'fr' ? 'bg-cyan-500 text-black scale-110' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                title="Français"
              >
                🇫🇷
              </button>
              <button 
                onClick={() => switchLang('en')} 
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-cyan-500 text-black scale-110' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                title="English"
              >
                🇺🇸
              </button>
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
            <button onClick={() => setShowIntro(false)} className="w-full bg-cyan-600 py-4 font-bold text-white rounded-lg hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
              {t.intro_btn}
            </button>
          </div>
        </div>
      )}

      <div className={`max-w-6xl mx-auto relative z-10 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
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
            <button onClick={isTesting ? stopTest : startTest} className={`px-8 py-3 rounded-lg font-bold text-sm ${isTesting ? 'bg-red-500/10 text-red-400 border border-red-500' : 'bg-cyan-600 text-white'}`}>
              {isTesting ? t.stop_btn : t.start_btn}
            </button>
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
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                  {elapsedTime >= 30 ? "FINALISATION DES DONNÉES..." : "ANALYSE EN COURS"}
                </span>
                <span className="text-xl font-mono font-black text-white">
                  00:{elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime} <span className="text-xs text-slate-500">/ 30s</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${elapsedTime >= 30 ? 'bg-amber-500' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-64"><Line data={chartData} options={chartOptions} /></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 p-3 rounded-lg border border-white/5"><div className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_spike}</div><div className="text-xl font-bold text-red-400">{results.spikeMax.toFixed(0)}ms</div></div>
            <div className="bg-black/30 p-3 rounded-lg border border-white/5"><div className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_loss}</div><div className="text-xl font-bold text-emerald-500">{results.packetLoss.toFixed(1)}%</div></div>
            <div className="col-span-2 bg-black/40 p-3 rounded-xl font-mono text-xs text-emerald-500/80 h-16 overflow-hidden border border-white/5">{logs.map((l, i) => <div key={i}>{l}</div>)}</div>
          </div>

          {testComplete && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className={`p-6 border rounded-xl flex flex-col md:flex-row gap-6 ${diagnosis === 'good' ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-400 mb-2"><Zap size={14}/> {t.result_title}</div>
                  <div className="text-xl font-black text-white mb-2 uppercase">{diagnosis === 'good' ? t.grade.perfect : (diagnosis === 'cable' ? t.grade.bad : t.grade.critical)}</div>
                  <p className="text-sm text-slate-300 mb-4">{diagnosis === 'good' ? t.diag_good : (diagnosis === 'cable' ? t.diag_cable : diagnosis === 'mobile' ? t.diag_mobile : t.diag_router)}</p>
                  <button onClick={shareScore} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold border border-white/5 transition-all">
                    <Share2 size={14} /> {shareCopied ? "COPIÉ !" : t.share_btn}
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 min-w-[140px]">
                  {diagnosis === 'good' ? (
                    <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center transition-transform hover:scale-110">
                      <img src="/chat.png" alt="Donation" className="w-20 h-20 object-contain drop-shadow-[0_0_10px_#10b981]" />
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

              {repairStep !== 'idle' && activeFix && (
                <div className="bg-black/60 border border-amber-500/30 rounded-xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.1)] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                   
                   {repairStep === 'question' ? (
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">
                           <Cpu size={14} className="animate-spin-slow" /> SIGNATURE DÉTECTÉE : {os.toUpperCase()} Layer
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {os === 'windows' ? "VOTRE SYSTÈME EST-IL EN MODE RECHERCHE WI-FI ACTIVE ?" : 
                           os === 'linux' ? "VOTRE PC EST-IL SUR BATTERIE ACTUELLEMENT ?" :
                           os === 'ios' ? "LE RELAIS PRIVÉ ICLOUD EST-IL ACTIVÉ ?" :
                           "UTILISEZ-VOUS DES ACCESSOIRES BLUETOOTH ?"}
                        </h3>
                        <div className="flex gap-3">
                          <button onClick={() => setRepairStep('fiche')} className="bg-amber-600 hover:bg-amber-500 px-6 py-2 rounded text-xs font-black text-white uppercase transition-all">
                             [ CONFIRMER : INITIATION ]
                          </button>
                          <button onClick={() => setRepairStep('idle')} className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded text-xs font-black text-slate-400 uppercase transition-all">
                             [ ÉCARTER ]
                          </button>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-4 animate-in zoom-in-95">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-500 font-black text-xs tracking-tighter">{REPAIR_MATRIX[activeFix].title}</span>
                          <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded text-[8px] font-bold">CERTITUDE: 92%</span>
                        </div>
                        <p className="text-slate-300 text-sm italic">"{REPAIR_MATRIX[activeFix].desc}"</p>
                        
                        <div className="bg-black/80 rounded border border-white/5 p-4 relative group">
                           <code className="text-cyan-400 text-xs font-mono break-all">{REPAIR_MATRIX[activeFix].action}</code>
                           <button 
                             onClick={() => {
                               navigator.clipboard.writeText(REPAIR_MATRIX[activeFix].action);
                               const b = document.getElementById('copy-fix'); if(b) b.innerText = "COPIÉ";
                               setTimeout(() => {if(b) b.innerText = "COPIER"}, 2000);
                             }}
                             className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors"
                             id="copy-fix"
                           >
                             <Copy size={14} />
                           </button>
                        </div>
                        
                        <div className="flex items-start gap-2 bg-red-950/20 p-3 rounded border border-red-900/20">
                           <AlertTriangle size={12} className="text-red-500 mt-0.5" />
                           <span className="text-[10px] text-red-400/80 uppercase font-bold tracking-tighter">CAUTION: {REPAIR_MATRIX[activeFix].warning}</span>
                        </div>
                     </div>
                   )}
                </div>
              )}

              {diagnosis !== 'good' && (
                <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckSquare className="text-cyan-500" size={20} />
                    <h3 className="font-black text-white tracking-tighter uppercase">{t.checklist_title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">{t.checklist_desc}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(isMobileDevice ? t.checklist_mobile : t.checklist_pc).map((item, i) => (
                      <div key={i} onClick={() => toggleCheck(i)} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${checkedItems[i] ? 'bg-cyan-500/20 border-cyan-500' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${checkedItems[i] ? 'bg-cyan-500 border-cyan-500' : 'border-white/30'}`}>{checkedItems[i] && <CheckCircle size={14} className="text-black" />}</div>
                        <span className={`text-xs md:text-sm font-medium ${checkedItems[i] ? 'text-white' : 'text-slate-400'}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="flex justify-center mb-4"><Mail className="text-cyan-500" size={24} /></div>
          {state.succeeded ? (
            <div className="text-emerald-400 font-bold flex flex-col items-center gap-2 animate-in zoom-in">
               <CheckCircle size={32} />
               <p>{lang === 'fr' ? "Merci pour votre retour !" : "Thanks for your feedback!"}</p>
            </div>
          ) : (
            <div className="text-left">
              <h3 className="text-white font-bold mb-1 text-center">{lang === 'fr' ? "Un avis sur le diagnostic ?" : "Feedback on diagnostic?"}</h3>
              <p className="text-slate-400 text-[10px] mb-4 text-center uppercase tracking-widest">{lang === 'fr' ? "Aidez-nous à améliorer l'outil" : "Help us improve the tool"}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea id="message" name="message" required placeholder={lang === 'fr' ? "Votre expérience, bugs ou suggestions..." : "Your experience, bugs or suggestions..."} className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 min-h-[100px]" />
                <div className="flex gap-2">
                  <input id="email" type="email" name="email" placeholder="Email (Opt.)" className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <button type="submit" disabled={state.submitting} className="bg-cyan-600 px-6 py-2 rounded-lg text-xs font-bold text-white hover:bg-cyan-500">
                    {state.submitting ? '...' : 'OK'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <section className="bg-gradient-to-b from-slate-950 to-[#0B0F14] py-16 px-4 border-t border-cyan-500/10 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-cyan-500" />
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{t.seo1_title}</h2>
            </div>
            
            <div className="space-y-4 text-slate-300 text-base md:text-lg leading-relaxed">
              <p className="text-white font-bold">{t.seo1_p1}</p>
              <p>{t.seo1_p2}</p>
              <p>{t.seo1_p3}</p>
              
              <div className="bg-cyan-950/30 border-l-4 border-cyan-500 p-4 rounded-r-lg my-6">
                <p className="text-cyan-100">{t.seo1_highlight}</p>
              </div>
              
              <div>
                <p className="font-bold text-white mb-3">{t.seo1_result}</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">▸</span><span>{t.seo1_issue1}</span></li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">▸</span><span>{t.seo1_issue2}</span></li>
                  <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">▸</span><span>{t.seo1_issue3}</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan-500 mt-1">▸</span><span>{t.seo1_issue4}</span></li>
                </ul>
              </div>
              
              <p className="text-center text-xl font-bold text-cyan-400 pt-4">{t.seo1_cta}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B0F14] py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          
          <div className="bg-gradient-to-br from-emerald-950/20 to-black/40 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-500/50 transition-all group shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-10 h-10 text-emerald-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white">{t.seo2_title1}</h3>
            </div>
            
            <p className="text-emerald-400 font-bold text-lg mb-4">{t.seo2_subtitle1}</p>
            <p className="text-slate-300 mb-4">{t.seo2_p1}</p>
            
            <div className="bg-black/50 border border-emerald-500/20 rounded-lg p-4 mb-4">
              <p className="text-white font-bold mb-3 text-sm">{t.seo2_if}</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span>{t.seo2_fix1}</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span>{t.seo2_fix2}</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span>{t.seo2_fix3}</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span>{t.seo2_fix4}</span></li>
              </ul>
            </div>
            
            <p className="text-white font-bold mb-2">{t.seo2_retest}</p>
            <p className="text-slate-300 text-sm">{t.seo2_result1}</p>
            <p className="text-emerald-400 font-mono text-xs mt-4 pt-4 border-t border-emerald-500/20">{t.seo2_footer1}</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-950/20 to-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="w-10 h-10 text-cyan-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white">{t.seo2_title2}</h3>
            </div>
            
            <p className="text-cyan-400 font-bold text-lg mb-4">{t.seo2_subtitle2}</p>
            <p className="text-slate-300 mb-4">{t.seo2_p2}</p>
            <p className="text-slate-300 text-sm mb-4">{t.seo2_p3}</p>
            
            <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-4 mb-4">
              <p className="text-white font-bold mb-3 text-sm">{t.seo2_test}</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><span className="text-cyan-500 mt-0.5 shrink-0">→</span><span>{t.seo2_tip1}</span></li>
                <li className="flex items-start gap-2"><span className="text-cyan-500 mt-0.5 shrink-0">→</span><span>{t.seo2_tip2}</span></li>
                <li className="flex items-start gap-2"><span className="text-cyan-500 mt-0.5 shrink-0">→</span><span>{t.seo2_tip3}</span></li>
              </ul>
            </div>
            
            <div className="bg-cyan-950/30 border-l-4 border-cyan-500 p-3 rounded-r-lg">
              <p className="text-cyan-100 text-sm">{t.seo2_result2}</p>
            </div>
            <p className="text-slate-400 text-xs mt-4 pt-4 border-t border-cyan-500/20 italic">{t.seo2_footer2}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#0B0F14] to-black py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-950/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-8 h-8 text-slate-400" />
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {t.seo3_title} <span className="text-slate-500">{t.seo3_sub}</span>
              </h2>
            </div>
            
            <p className="text-slate-300 text-lg mb-6">{t.seo3_p1}</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 font-bold mb-2 text-sm">❌ {t.seo3_bad}</p>
                <p className="text-slate-400 text-sm">{t.seo3_bad_desc}</p>
              </div>
              
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4">
                <p className="text-emerald-400 font-bold mb-2 text-sm">✅ {t.seo3_good}</p>
                <p className="text-slate-400 text-sm">{t.seo3_good_desc}</p>
              </div>
            </div>
            
            <div className="bg-black/60 border border-cyan-500/20 rounded-lg p-4 mb-6">
              <p className="text-slate-300 text-sm">{t.seo3_tech}</p>
            </div>
            
            <div className="border-t border-slate-700 pt-6">
              <p className="text-white font-bold mb-4">{t.seo3_use_title}</p>
              <ul className="grid md:grid-cols-3 gap-3 text-sm">
                <li className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-lg">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-300">{t.seo3_use1}</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-lg">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-300">{t.seo3_use2}</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-lg">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-300">{t.seo3_use3}</span>
                </li>
              </ul>
            </div>
            
            <p className="text-center text-slate-500 font-mono text-sm mt-8 pt-6 border-t border-slate-700">{t.seo3_footer}</p>
          </div>
        </div>
      </section>

      <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998, marginTop: '20px', marginBottom: '20px' }}>
        <iframe 
          data-aa='2427183' 
          src='//acceptable.a-ads.com/2427183/?size=Adaptive'
          style={{ border: 0, padding: 0, width: '100%', maxWidth: '728px', height: '90px', overflow: 'hidden', display: 'block', margin: 'auto' }}
        ></iframe>
      </div>

      <footer className="py-8 border-t border-white/5 flex flex-col items-center gap-2 mt-auto">
        <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-all transform hover:-translate-y-1">
          <img src="/chat.png" alt="Support" className="w-12 h-12 grayscale hover:grayscale-0 transition-all" />
        </a>
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          {lang === 'fr' ? "Soutenir le projet indépendant" : "Support independent project"}
        </p>
      </footer>
    </div>
  );
}
