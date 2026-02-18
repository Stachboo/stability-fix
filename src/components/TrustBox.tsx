"use client";
import { useEffect, useRef } from "react";

export default function TrustBox() {
  // Référence pour permettre à l'API Trustpilot de cibler cet élément précis
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si la fenêtre possède l'objet Trustpilot (chargé via layout.tsx), on initialise le widget
    if (typeof window !== "undefined" && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-8">
      <div
        ref={ref}
        className="trustpilot-widget w-full max-w-[400px] transition-all duration-500"
        data-locale="en-US"
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
