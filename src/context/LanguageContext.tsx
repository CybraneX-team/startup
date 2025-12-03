"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages
export const languages = {
  en: { name: 'English', nativeName: 'English', code: 'en' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', code: 'bn' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', code: 'te' },
  mr: { name: 'Marathi', nativeName: 'मराठी', code: 'mr' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', code: 'ta' },
  ur: { name: 'Urdu', nativeName: 'اردو', code: 'ur' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'kn' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', code: 'or' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', code: 'ml' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', code: 'pa' },
  as: { name: 'Assamese', nativeName: 'অসমীয়া', code: 'as' },
  sa: { name: 'Sanskrit', nativeName: 'संस्कृतम्', code: 'sa' },
  kok: { name: 'Konkani', nativeName: 'कोंकणी', code: 'kok' },
  mni: { name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', code: 'mni' },
  ne: { name: 'Nepali', nativeName: 'नेपाली', code: 'ne' },
  brx: { name: 'Bodo', nativeName: 'बड़ो', code: 'brx' },
  doi: { name: 'Dogri', nativeName: 'डोगरी', code: 'doi' },
  mai: { name: 'Maithili', nativeName: 'मैथिली', code: 'mai' },
  sat: { name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', code: 'sat' },
  ks: { name: 'Kashmiri', nativeName: 'कॉशुर', code: 'ks' },
  sd: { name: 'Sindhi', nativeName: 'سنڌي', code: 'sd' },
} as const;

export type LanguageCode = keyof typeof languages;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as LanguageCode;
    if (savedLanguage && languages[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  // Translation function with nested key support (e.g., "sidebar.businessIdea")
  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      // Dynamically import translation file - using require for client-side
      let translations: any;
      try {
        translations = require(`@/translations/${language}.json`);
      } catch (importError) {
        // Fallback to English if language file not found
        console.warn(`Translation file not found for ${language}, falling back to English`);
        translations = require(`@/translations/en.json`);
      }
      
      // Support nested keys like "sidebar.businessIdea"
      const keys = key.split('.');
      let translation: any = translations;
      
      for (const k of keys) {
        translation = translation?.[k];
        if (translation === undefined) break;
      }
      
      // If translation not found, try English as fallback
      if (typeof translation !== 'string') {
        if (language !== 'en') {
          try {
            const enTranslations = require(`@/translations/en.json`);
            let enTranslation: any = enTranslations;
            for (const k of keys) {
              enTranslation = enTranslation?.[k];
              if (enTranslation === undefined) break;
            }
            if (typeof enTranslation === 'string') {
              translation = enTranslation;
            }
          } catch (e) {
            // Ignore fallback error
          }
        }
        
        if (typeof translation !== 'string') {
          console.warn(`Translation missing for key: ${key} in language: ${language}`);
          return key;
        }
      }

      // Replace parameters in translation
      if (params) {
        Object.keys(params).forEach((paramKey) => {
          translation = translation.replace(
            new RegExp(`{{${paramKey}}}`, 'g'),
            String(params[paramKey])
          );
        });
      }

      return translation;
    } catch (error) {
      console.warn(`Translation error for key: ${key} in language: ${language}`, error);
      return key;
    }
  };

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

