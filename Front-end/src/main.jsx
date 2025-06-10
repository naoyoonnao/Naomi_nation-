import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';  // Імпортуємо i18n для налаштування мов
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);