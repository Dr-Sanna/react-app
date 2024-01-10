import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { DarkModeIcon, LightModeIcon } from "./IconComponents";

const CustomNavbar = () => {
  const [logoUrl] = useState("/logo.svg");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [navbarClass, setNavbarClass] = useState("navbar navbar--fixed-top navbarHideable_uAgx");

  let lastScrollY = window.scrollY;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  }; 
  
  const toggleNavbar = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setNavbarClass("navbar navbar--fixed-top navbarHideable_uAgx");
      } else {
        // Scrolling down
        setNavbarClass("navbar navbar--fixed-top navbarHideable_uAgx navbarHidden_QgM6");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      aria-label="Principale" 
      className={navbarClass}
    >
      <div className="navbar__inner">
        <div className="navbar__items">
          <button 
            aria-label="Ouvrir/fermer la barre de navigation" 
            aria-expanded={isNavbarExpanded} 
            className="navbar__toggle clean-btn" 
            type="button" 
            onClick={toggleNavbar}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <path stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M4 7h22M4 15h22M4 23h22"></path>
            </svg>
          </button>
          <NavLink className="navbar__brand" to="/">
            <div className="navbar__logo">
              <img src={logoUrl} alt="Logo" />
            </div>
            <b className="navbar__title">Dr Sanna</b>
          </NavLink>
        </div>
        <div className="navbar__items navbar__items--right">
          <a href="https://github.com/Dr-Sanna/react-app" target="_blank" rel="noopener noreferrer" className="navbar__item navbar__link">
            GitHub
          </a>
          <div className="toggle_bT41 colorModeToggle_UolE">
            <button onClick={toggleTheme} className="clean-btn toggleButton_x9TT" title={`Switch between dark and light mode (currently ${isDarkMode ? "dark" : "light"} mode)`}>
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </button>
          </div>
        </div>
      </div>
      <div role="presentation" className="navbar-sidebar__backdrop"></div>
    </nav>
  );
};

export default CustomNavbar;
