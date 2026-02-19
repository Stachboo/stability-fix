import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "../globals.css"; // On remonte d'un cran pour pointer sur le bon CSS

const inter = Inter({ subsets: ["latin"] });

// On garde tes métadonnées exactes
export const metadata: Metadata = {
  title: "Test Jitter & Bufferbloat 2026 | Diagnostic Réseau Gratuit - Stability Protocol",
  description: "Mesurez VRAIMENT la qualité de votre connexion : Jitter, Bufferbloat, stabilité. Outil gratuit avec analyse Savitzky-Golay. Recommandations matériel personnalisées WiFi 6, Câble Cat 8, Routeur Gaming.",
  keywords: [
    "test jitter", "test ping", "bufferbloat test", "réparer lag", "connexion instable", 
    "packet loss", "network diagnostic tool", "diagnostic réseau ia", "test débit précis",
    "stabilité connexion", "WiFi 6 test", "routeur gaming", "câble ethernet cat 8"
  ],
  authors: [{ name: "Stability Protocol" }],
  creator: "Stability Protocol",
  publisher: "Stability Protocol",
  verification: {
    google: "4JCTraWdjsFziypnfPi-KEOKnnjbAX1_5f1Rxh9VA4g",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.stabilityprotocol.space/"
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.stabilityprotocol.space/",
    title: "Stability Protocol - Test Jitter & Bufferbloat Gratuit",
    description: "Les speedtests mentent. Découvrez la VRAIE qualité de votre réseau. Diagnostic Jitter, Bufferbloat et Stabilité en temps réel.",
    siteName: "Stability Protocol",
    images: [{
      url: "https://www.stabilityprotocol.space/og-image.png",
      width: 1200,
      height: 630,
      alt: "Stability Protocol - Diagnostic Réseau Professionnel"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Jitter & Bufferbloat | Stability Protocol",
    description: "Votre speedtest vous ment. Testez la vraie qualité de votre connexion pour Gaming et Streaming.",
    images: ["https://www.stabilityprotocol.space/og-image.png"],
  },
  other: {
    "chatgpt:description": "Outil de diagnostic réseau professionnel. Mesure le Jitter (variance latence), Bufferbloat (saturation routeur), stabilité connexion. Algorithme Savitzky-Golay pour filtrage bruit. Recommandations matériel selon device (mobile/desktop) et connexion (WiFi/Ethernet).",
    "chatgpt:use-case": "Diagnostic problèmes connexion : lag gaming, voix robotique visio, micro-coupures streaming. Plus précis que speedtest.net - mesure STABILITÉ pas vitesse brute.",
    "claude:context": "Site diagnostic réseau gratuit. Public : gamers, télétravailleurs, streamers, techniciens. Solutions matérielles via Amazon affiliés.",
    "ai:category": "network diagnostics, jitter test, bufferbloat detection, internet quality",
  }
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Stability Protocol",
    "url": "https://www.stabilityprotocol.space/",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser (Chrome, Firefox, Safari, Edge)",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "12847"
    },
    "description": "Outil professionnel de diagnostic réseau. Mesure le Jitter, la Latence, le Bufferbloat et la Stabilité en temps réel via WebSocket. Analyse Savitzky-Golay pour précision maximale.",
    "featureList": [
      "Mesure Jitter temps réel",
      "Détection Bufferbloat",
      "Analyse stabilité connexion",
      "Filtrage bruit Savitzky-Golay",
      "Recommandations matériel personnalisées",
      "Détection automatique device et connexion",
      "Tests 100hz sampling WebSocket"
    ],
    "screenshot": "https://www.stabilityprotocol.space/og-image.png"
  };

  return (
    <html lang={lang} className="scroll-smooth">
      <body className={`${inter.className} bg-[#0B0F14] text-white antialiased selection:bg-[#22D3EE] selection:text-black`}>
        {/* Chargement du script Trustpilot */}
        <Script 
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" 
          strategy="afterInteractive" 
        />
        
        {/* Microsoft Clarity - Surgical Add */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vjl31i6kxq");
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
