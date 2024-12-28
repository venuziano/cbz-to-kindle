"use client";
import { ReactNode, useEffect, useState } from "react";

import I18nProvider from "./i18n-provider";
import { initI18n } from "./i18n-client";

export default function I18nClientWrapper({ children, userLanguage }: { children: ReactNode; userLanguage: string; }) {
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  useEffect(() => {
    // Initialize i18n (or switch language) once we're on the client
    initI18n(userLanguage).then((instance) => {
      setI18nInstance(instance);
    });
  }, [userLanguage]);

   // Render nothing until i18n is ready
   if (!i18nInstance) return null;

  return (
    <I18nProvider i18n={i18nInstance}>
      {children}
    </I18nProvider>
  );
}