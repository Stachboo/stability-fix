import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }];
}

// Nouvelle norme Next.js 16 pour le Viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0F14',
};

export const metadata: Metadata = {
  title: 'Stability Protocol | THE SPEED LIE : Jitter & Bufferbloat Test',
  description: 'Diagnostic de stabilité réseau haute précision 2026. Débusquez le lag, le jitter et le bufferbloat.',
  robots: 'index, follow',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className="scroll-smooth">
      <body className={`${inter.className} bg-[#0B0F14] text-white antialiased selection:bg-[#22D3EE] selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
