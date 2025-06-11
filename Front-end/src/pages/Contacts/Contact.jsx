import React, { useState } from 'react';
import axios from 'axios';

// Поверніть імпорти ваших локальних файлів та компонентів
import Header from '../../components/Header/Header';
import PowCatImage from '../../assets/pow.png';
import Logo from '../../assets/logo.svg';
import Oriental from '../../assets/Oriental.svg'; // Повернено імпорт вашого SVG

import styles from './Contacts.module.scss';

// Компонент з іконками соцмереж
const SocialIcons = () => (
  <div className={styles.socials}>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8A3.6 3.6 0 0 0 20 16.4V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"/></svg>
        <span>Instagram</span>
    </a>
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.7c-.85 0-1.3.65-1.3 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
        <span>Facebook</span>
    </a>
  </div>
);

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    setStatus('sending');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className={styles.contactsPage}>
      <Header />
      <main className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.info}>
            <img className={styles.logo} src={Logo} alt="Naomi Nation logo" />
            <p><strong>Email:</strong> arn.iryna@gmai.com</p>
            <p><strong>Phone:</strong> +1 (123) 456-7890</p>
            <p><strong>Address:</strong> Ukraine, Lviv</p>
            <SocialIcons />
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                placeholder="name/surname"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                name="message"
                placeholder="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send'}
            </button>
            {status === 'success' && <p className={styles.statusMsgSuccess}>Message sent successfully!</p>}
            {status === 'error' && <p className={styles.statusMsgError}>Failed to send message. Please fill all fields.</p>}
          </form>
        </div>
        
        <div className={styles.imageWrapper}>
          <img src={PowCatImage} alt="Oriental cat with a raised paw" className={styles.catImage} />
        </div>
      </main>
      {/* Повернено вашу реалізацію фону через img */}
      <img className={styles.oriental} src={Oriental} alt="" />
    </div>
  );
}