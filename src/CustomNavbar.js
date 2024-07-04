import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { DarkModeIcon, LightModeIcon } from "./IconComponents";
import Search from "./Search";
import { useToggle } from "./ToggleContext";

const CustomNavbar = () => {
  const [logoUrl] = useState("/logo.svg");
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [navbarClass, setNavbarClass] = useState("navbar navbar--fixed-top navbarHideable_uAgx");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const { showQuestions, setShowQuestions } = useToggle();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const lastScrollY = useRef(window.scrollY);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", !isDarkMode ? "dark" : "light");
  };

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleNavbar = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
    const baseClass = "navbar navbar--fixed-top navbarHideable_uAgx";
    setNavbarClass(isNavbarExpanded ? baseClass : `${baseClass} navbar-sidebar--show`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setNavbarClass(currentScrollY < lastScrollY.current ? "navbar navbar--fixed-top navbarHideable_uAgx" : "navbar navbar--fixed-top navbarHideable_uAgx navbarHidden_QgM6");
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleQuestions = () => setShowQuestions(prev => !prev);

  return (
    <nav aria-label="Principale" className={navbarClass}>
      <div className="navbar__inner">
        <div className="navbar__items">
          <button aria-label="Ouvrir/fermer la barre de navigation" aria-expanded={isNavbarExpanded} className="navbar__toggle clean-btn" type="button" onClick={toggleNavbar}>
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
          <div className="toggle-container" style={{ marginLeft: '10px' }}>
            <button 
              onClick={toggleQuestions} 
              className="clean-btn toggleButtonCustom"
              title="Basculer entre Cours et Questions"
            >
              {showQuestions ? (
                <>
                  <span role="img" aria-label="Questions">❓</span> Questions
                </>
              ) : (
                <>
                  <span role="img" aria-label="Cours">📚</span> Cours
                </>
              )}
            </button>
          </div>
        </div>
        <div className="navbar__items navbar__items--right">
          <a href="https://github.com/Dr-Sanna/react-app" target="_blank" rel="noopener noreferrer" className="navbar__item navbar__link">GitHub</a>
          <div className="colorModeToggle_UolE">
            <button onClick={toggleTheme} className="clean-btn toggleButton_x9TT" title={`Basculer entre le mode sombre et le mode clair (actuellement mode ${isDarkMode ? "sombre" : "clair"})`}>
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </button>
          </div>
        </div>
      </div>
      <div role="presentation" className="navbar-sidebar__backdrop"></div>
      <div className="navbar-sidebar">
        <div className="navbar-sidebar__brand">
          <NavLink className="navbar__brand" to="/">
            <div className="navbar__logo">
              <img src="/logo.svg" alt="" className="themedComponent_bJGS themedComponent--light_LEkC" height="32" width="32" />
            </div>
            <b className="navbar__title text--truncate">Dr Sanna</b>
          </NavLink>
          <div className="colorModeToggle_UolE margin-right--md">
            <button onClick={toggleTheme} className="clean-btn toggleButton_x9TT" title={`Basculer entre le mode sombre et le mode clair (actuellement mode ${isDarkMode ? "sombre" : "clair"})`}>
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </button>
          </div>
          <button type="button" aria-label="Fermer la barre de navigation" className="clean-btn navbar-sidebar__close" onClick={toggleNavbar}>
            <svg viewBox="0 0 15 15" width="21" height="21">
              <g stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.2">
                <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"></path>
              </g>
            </svg>
          </button>
        </div>
        <div className="navbar-sidebar__items">
          <div className="navbar-sidebar__item menu">
            <ul className="menu__list"></ul>
          </div>
          <div className="navbar-sidebar__item menu">
            <button type="button" className="clean-btn navbar-sidebar__back">← Retour au menu principal</button>
          </div>
        </div>
      </div>
      <Search />
    </nav>
  );
};

export default CustomNavbar;
