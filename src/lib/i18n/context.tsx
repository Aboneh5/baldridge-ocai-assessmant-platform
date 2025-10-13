'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, defaultLocale } from './types';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: any;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'am')) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Load translations for current locale
    loadTranslations(locale);
  }, [locale]);

  const loadTranslations = async (loc: Locale) => {
    try {
      console.log(`Loading translations for locale: ${loc}`);
      const common = await import(`@/locales/${loc}/common.json`);
      const auth = await import(`@/locales/${loc}/auth.json`);
      const ocai = await import(`@/locales/${loc}/ocai.json`);
      const baldrige = await import(`@/locales/${loc}/baldrige.json`);
      const employee = await import(`@/locales/${loc}/employee.json`);
      const facilitator = await import(`@/locales/${loc}/facilitator.json`);
      const admin = await import(`@/locales/${loc}/admin.json`);

      const loadedTranslations = {
        ...common.default,
        ...auth.default,
        ...ocai.default,
        ...baldrige.default,
        ...employee.default,
        ...facilitator.default,
        ...admin.default,
      };
      
      console.log(`Translations loaded for ${loc}:`, Object.keys(loadedTranslations));
      setTranslations(loadedTranslations);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
      return key; // Return key if translation not found
    }

    // Replace parameters
    if (params) {
      Object.keys(params).forEach(paramKey => {
        value = value.replace(`{{${paramKey}}}`, String(params[paramKey]));
      });
    }

    return value;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, translations }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
