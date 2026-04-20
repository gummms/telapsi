import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptLocale from './locales/pt.json';
import enLocale from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: ptLocale,
      },
      en: {
        translation: enLocale,
      },
    },
    lng: 'pt',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
