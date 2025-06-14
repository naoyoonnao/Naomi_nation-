import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './LanguageSwitcher.scss';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // читаємо з localStorage одразу, щоб мати правильний первинний стан
  const getInitialLang = () => localStorage.getItem('language') || i18n.language || 'en';
  const [language, setLanguage] = useState(getInitialLang);

  // На маунт переконуємось, що i18n синхронізовано
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, []); // одноразово

  // Функція для перекладу тексту через DeepL API
  const translateText = async (text, langCode) => {
    try {
      const response = await axios.post('http://localhost:8080/api/translate', {
        text,
        langCode,
      });

      // Оновлюємо текст на сторінці
      document.querySelectorAll(`[data-translate="${text}"]`).forEach((element) => {
        element.innerText = response.data.translatedText;
      });

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Функція для перемикання мов
  const switchLanguage = (langCode) => {
    i18n.changeLanguage(langCode);  // Зміна мови через i18next
    setLanguage(langCode);  // Оновлення стану мови
    localStorage.setItem('language', langCode);  // Зберігаємо мову в localStorage

    // Додаємо клас до <html> для CSS-адаптацій
    document.documentElement.classList.remove('lang-en', 'lang-ua');
    document.documentElement.classList.add(`lang-${langCode}`);

    // Перевірка всіх текстів на сторінці
    document.body.querySelectorAll('*').forEach((element) => {
      const text = element.innerText.trim();  // Отримуємо текст елемента
      if (text) {  // Перекладаємо тільки текстові елементи
        translateText(text, langCode);  // Перекладаємо цей текст
      }
    });
  };

  return (
    <div className="lang-switcher">
      <span
        className={`option en ${language === 'en' ? 'active' : ''}`}
        onClick={() => switchLanguage('en')}
      >
        ENG
      </span>
      <span
        className={`option ua ${language === 'ua' ? 'active' : ''}`}
        onClick={() => switchLanguage('ua')}
      >
        UA
      </span>
      <span className="indicator" />
    </div>
  );
};

export default LanguageSwitcher;
