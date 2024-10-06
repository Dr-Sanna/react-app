import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa'; // Importation de l'icône GitHub
import './NewNavbar.css';

const NewNavbar = () => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const logoUrl = '/logo.svg'; // Conserve l'ancien logo et nom de classe

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0 || window.oldScrollY > currentScrollY) {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(false);
      }

      window.oldScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`new-navbar ${isNavbarVisible ? 'new-navbar--visible' : 'new-navbar--hidden'}`}>
      <div className="new-navbar__container">
        <NavLink to="/" className="navbar__brand">
          <div className="navbar__logo">
            <img src={logoUrl} alt="Logo" />
          </div>
          <b className="navbar__title">Dr Sanna</b>
        </NavLink>

        <nav className="navbar__items">
        <NavLink to="/cas-cliniques" className={({ isActive }) => isActive ? "navbar__item navbar__link navbar__link--active" : "navbar__item navbar__link"}>
            Cas Cliniques
          </NavLink>
          <NavLink to="/randomisation" className={({ isActive }) => isActive ? "navbar__item navbar__link navbar__link--active" : "navbar__item navbar__link"}>
            Randomisation
          </NavLink>
          <NavLink to="/documentation" className={({ isActive }) => isActive ? "navbar__item navbar__link navbar__link--active" : "navbar__item navbar__link"}>
            Documentation
          </NavLink>
         <NavLink to="/liens-utiles" className={({ isActive }) => isActive ? "navbar__item navbar__link navbar__link--active" : "navbar__item navbar__link"}>
            Liens Utiles
          </NavLink>
        </nav>

        <div className="new-navbar__actions">
          <a
            href="https://github.com/Dr-Sanna/react-app"
            target="_blank"
            rel="noopener noreferrer"
            className="new-navbar__github-link"
          >
            <FaGithub size={24} />
          </a>
          <button onClick={toggleTheme} className="new-navbar__theme-toggle">
            {isDarkMode ? '🌕' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default NewNavbar;
