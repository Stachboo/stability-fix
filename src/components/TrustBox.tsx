"use client";

import { useEffect, useRef } from "react";

interface TrustBoxProps {
  lang: 'fr' | 'en';
}

export default function TrustBox({ lang }: TrustBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const trustLocale = lang === 'fr' ? 'fr-FR' : 'en-US';

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(ref.current, true);
    }
  }, [lang]);

  return (
    <div className="w-full flex justify-center my-8">
      <div
        ref={ref}
        className="trustpilot-widget w-full max-w-[400px] transition-all duration-500"
        data-locale={trustLocale}
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id="6990792845c20b813450a662"
        data-style-height="52px"
        data-style-width="100%"
        data-theme="dark"
        data-token="a45e1256-44f2-408b-8f5a-98f3cdb72ff8"
      >
        <a
          href="https://www.trustpilot.com/review/www.stabilityprotocol.space"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot
        </a>
      </div>
    </div>
  );
}
