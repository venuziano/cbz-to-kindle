"use client";

import { ReactNode } from "react";
// import i18n from "./i18n-client";
import { I18nextProvider } from "react-i18next";

export default function I18nProvider({ children, i18n }: { children: ReactNode, i18n: any }) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}