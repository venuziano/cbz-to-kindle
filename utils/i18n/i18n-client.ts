"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translations (or dynamically load them)
// import enCommon from '../../app/translations/en/common.json';
// import ptCommon from '../../app/translations/pt/common.json';

// const resources = {
//   en: {
//     common: enCommon,
//   },
//   pt: {
//     common: ptCommon,
//   },
// };

// Dynamically import the correct common.json
async function loadCommonNamespace(lang: string) {
  try {
    // Example path: /app/translations/en/common.json
    const { default: common } = await import(`../../app/translations/${lang}/common.json`);
    return { common };
  } catch (error) {
    console.log('error', error)
    // If language folder doesn't exist, fallback to en
    const { default: common } = await import(`../../app/translations/en/common.json`);
    return { common };
  }
}

export async function initI18n(lang: string) {
  console.log('lang', lang)
  const resources = await loadCommonNamespace(lang);
  console.log('resources', resources)

  // If i18n isn't initialized yet, do a full init
  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .init({
        resources: {
          [lang]: resources,
        },
        lng: lang,
        fallbackLng: 'en',
        // If you have multiple namespaces, set defaultNS or handle them accordingly
        defaultNS: 'common',
        interpolation: {
          escapeValue: false,
        },
      });
  } else {
    // If i18n is already initialized, just update the language & resources
    i18n.addResourceBundle(lang, 'common', resources.common, true, true);
    i18n.changeLanguage(lang);
  }

  return i18n;
}

// if (!i18n.isInitialized) {
//   i18n.use(initReactI18next).init({
//     resources,
//     // Fallback language in case user's language is not available
//     fallbackLng: 'en',
//     // Default namespace if you organize translations into multiple namespaces
//     defaultNS: 'common',
//     // React i18next options
//     interpolation: { escapeValue: false },
//     lng: 'en', // Set initial language (can be changed on the fly)
//   });
// }

// export default i18n;