// i18n configuration
export const defaultLang = 'en';
export const languages = ['en', 'es', 'fr', 'ar'] as const;
export type Language = (typeof languages)[number];

export const rtlLanguages: Language[] = ['ar'];

export function isRtl(lang: Language): boolean {
  return rtlLanguages.includes(lang);
}

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (languages.includes(lang as Language)) {
    return lang as Language;
  }
  return defaultLang;
}

export function useTranslatedPath(lang: Language) {
  return function translatePath(path: string, l: Language = lang) {
    return `/${l}${path}`;
  };
}

// Type-safe translation keys
export type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    'nav.platform': 'Platform',
    'nav.solutions': 'Solutions',
    'nav.impact': 'Global Impact',
    'nav.company': 'Company',
    'nav.resources': 'Resources',
    'cta.systemOnline': 'System Online',
    'hero.eyebrow': 'Digital Infrastructure',
    'hero.subtitle': 'Bridging the digital divide through sovereign infrastructure for governments, education, and enterprise.',
    'hero.cta': 'Explore Platform',
    'footer.quote': '"Connectivity is not a luxury. It is the foundation of opportunity."',
    'footer.copyright': 'TrueLeap Inc. All rights reserved.',
  },
  es: {
    'nav.platform': 'Plataforma',
    'nav.solutions': 'Soluciones',
    'nav.impact': 'Impacto Global',
    'nav.company': 'Empresa',
    'nav.resources': 'Recursos',
    'cta.systemOnline': 'Sistema En Linea',
    'hero.eyebrow': 'Infraestructura Digital',
    'hero.subtitle': 'Cerrando la brecha digital a traves de infraestructura soberana para gobiernos, educacion y empresas.',
    'hero.cta': 'Explorar Plataforma',
    'footer.quote': '"La conectividad no es un lujo. Es la base de la oportunidad."',
    'footer.copyright': 'TrueLeap Inc. Todos los derechos reservados.',
  },
  fr: {
    'nav.platform': 'Plateforme',
    'nav.solutions': 'Solutions',
    'nav.impact': 'Impact Global',
    'nav.company': 'Entreprise',
    'nav.resources': 'Ressources',
    'cta.systemOnline': 'Systeme En Ligne',
    'hero.eyebrow': 'Infrastructure Numerique',
    'hero.subtitle': 'Combler le fosse numerique grace a une infrastructure souveraine pour les gouvernements, l\'education et les entreprises.',
    'hero.cta': 'Explorer la Plateforme',
    'footer.quote': '"La connectivite n\'est pas un luxe. C\'est le fondement de l\'opportunite."',
    'footer.copyright': 'TrueLeap Inc. Tous droits reserves.',
  },
  ar: {
    'nav.platform': 'المنصة',
    'nav.solutions': 'الحلول',
    'nav.impact': 'التأثير العالمي',
    'nav.company': 'الشركة',
    'nav.resources': 'الموارد',
    'cta.systemOnline': 'النظام متصل',
    'hero.eyebrow': 'البنية التحتية الرقمية',
    'hero.subtitle': 'سد الفجوة الرقمية من خلال البنية التحتية السيادية للحكومات والتعليم والمؤسسات.',
    'hero.cta': 'استكشف المنصة',
    'footer.quote': '"الاتصال ليس رفاهية. إنه أساس الفرصة."',
    'footer.copyright': 'TrueLeap Inc. جميع الحقوق محفوظة.',
  },
} as const;

export function t(key: TranslationKey, lang: Language = defaultLang): string {
  return translations[lang]?.[key] ?? translations[defaultLang][key] ?? key;
}

export function getTranslations(lang: Language) {
  return (key: TranslationKey) => t(key, lang);
}
