import { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ks_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('ks_language', language);
    if (language === 'hi') {
      document.documentElement.lang = 'hi';
      document.body.classList.add('lang-hindi');
    } else {
      document.documentElement.lang = 'en';
      document.body.classList.remove('lang-hindi');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const defaultDict = TRANSLATIONS.en;
    return defaultDict[key] !== undefined ? defaultDict[key] : (fallback || key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isHindi: language === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: 'en',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key, fallback = '') => fallback || key,
      isHindi: false
    };
  }
  return ctx;
}
