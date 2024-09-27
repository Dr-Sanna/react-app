import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { DarkModeIcon, LightModeIcon } from "./IconComponents";
import { FaGithub } from "react-icons/fa";  // Import de l'icône GitHub depuis react-icons
import { useToggle } from "./ToggleContext";

const CustomNavbar = ({ setFontSize }) => {
  const [logoUrl] = useState("/logo.svg");
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [navbarClass, setNavbarClass] = useState("navbar navbar--fixed-top navbarHideable_uAgx");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [sliderValue, setSliderValue] = useState(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    return savedFontSize ? parseInt(savedFontSize, 10) : 100;
  });
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const { showQuestions, setShowQuestions } = useToggle();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    setFontSize(sliderValue);
  }, [sliderValue, setFontSize]);

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

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    setFontSize(newValue);
    localStorage.setItem("fontSize", newValue);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <nav aria-label="Principale" className={navbarClass}>
      <div className="navbar__inner">
        <div className="navbar__items">
          {/* Logo et Dr Sanna */}
          <NavLink className="navbar__brand" to="/">
            <div className="navbar__logo">
              <img src={logoUrl} alt="Logo" />
            </div>
            <b className="navbar__title">Dr Sanna</b>
          </NavLink>

          {/* Liens à gauche */}
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
        </div>

        <div className="navbar__items navbar__items--right">
          {/* Gear emoji for settings */}
          <div className="settings-container" style={{ position: 'relative' }}>
            <button onClick={toggleDropdown} className="clean-btn settings-button" title="Paramètres">
              <span role="img" aria-label="Settings" className="gear-icon">⚙️</span>
            </button>
            {isDropdownVisible && (
              <div className="dropdown-menu">
                <label htmlFor="font-size-slider" className="dropdown-label">Taille du texte:</label>
                <input 
                  id="font-size-slider" 
                  type="range" 
                  min="80" 
                  max="100" 
                  step="10" 
                  value={sliderValue} 
                  onChange={handleSliderChange} 
                />
                <span>{sliderValue}%</span>
              </div>
            )}
          </div>

          {/* GitHub Icon using react-icons */}
          <a href="https://github.com/Dr-Sanna/react-app" target="_blank" rel="noopener noreferrer" className="navbar__item navbar__link icon-centered">
          <FaGithub style={{ verticalAlign: 'middle' }} size={26} />
          </a>

          {/* Dark Mode Toggle */}
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
    </nav>
  );
};

export default CustomNavbar;
