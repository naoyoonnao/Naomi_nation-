import React, { useState, useEffect } from 'react';
import './Header.scss';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import AnimatedSearchBar from '../AnimatedSearchBar/AnimatedSearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // Callback to update search open state from AnimatedSearchBar
  const handleSearchToggle = (open) => {
    setIsSearchOpen(open);
  };

  // Закриваємо меню при розширенні екрану
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMenuOpen && <div className="menu-backdrop"></div>}
      <header>
        <div className="burger" onClick={toggleMenu}>
          <svg width="35" height="30" viewBox="0 0 63 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H58.6667M4 24.5H38.1667M4 45H21.0833" stroke="#E4B14D" strokeWidth="6.83333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <nav className={`menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About us</a></li>
            <li><a href="/kittens">Kittens</a></li>
            <li><a href="/breeding">In breeding</a></li>
            <li><a href="/shows">Shows</a></li>
            <li><a href="/contacts">Contacts</a></li>
          </ul>
        </nav>

        <div className={`right-block`}>
          <div className={`header-interactive ${isSearchOpen ? 'active' : ''}`}>
            <AnimatedSearchBar onSearchToggle={handleSearchToggle} />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
}
