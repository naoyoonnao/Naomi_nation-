// /frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcomeMessage: "Siamese and Oriental Shorthair cattery",
        languageSwitch: "Switch Language",
      },
    },
    ua: {
      translation: {
        welcomeMessage: "Розплідник сіамських та орієнтальних короткошерстих кішок",
        languageSwitch: "Змінити мову",
      },
    },
  },
  lng: 'en', 
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
