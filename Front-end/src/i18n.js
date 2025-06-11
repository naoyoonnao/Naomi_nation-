// /frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import legacy from './i18nLegacy';

const API = import.meta.env.VITE_API_URL || '';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    resources: legacy, // резерв, якщо ключа нема у файлі
    backend: {
      loadPath: `${API}/api/i18n/file/{{lng}}`,
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
