import { NextResponse, type NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

let locales = ['en', 'fr'];
let defaultLocale = 'fr';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore - Les types de Negotiator peuvent varier selon la version
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, defaultLocale);
  return locale;
}

// Changement crucial : "middleware" devient "proxy"
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Détection de l'absence de locale dans l'URL
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirection intelligente vers la langue détectée
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}

export const config = {
  // On protège les fichiers techniques et les assets de la redirection
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.txt|.*\\.xml|.*\\.html).*)'],
};
