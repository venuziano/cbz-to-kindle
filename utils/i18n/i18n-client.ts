"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Dynamically import the correct common.json
async function loadCommonNamespace(lang: string) {
  try {
    let importResult;

    switch (lang) {
      case 'pt':
        importResult = await import('../../app/translations/pt/common.json');
        break;
      case 'en':
        importResult = await import('../../app/translations/en/common.json');
        break;
      default:
        // Fallback to English
        importResult = await import('../../app/translations/en/common.json');
        break;
    }

    // Extract the JSON content
    const { default: common } = importResult;

    return { common };
  } catch (error) {
    console.log('error', error)
    // If language folder doesn't exist, fallback to en
    const { default: common } = await import(`../../app/translations/en/common.json`);
    return { common };
  }
}

export async function initI18n(lang: string) {
  const resources = await loadCommonNamespace(lang);

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