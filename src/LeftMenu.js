import React, { useState, useEffect } from 'react';
import { CollapseIcon, ExpandIcon } from "./IconComponents";
import { useSidebarContext } from './SidebarContext'; // Importez le hook
import { toUrlFriendly } from "./config";
import { useLocation } from 'react-router-dom'; // Importez useLocation

const LeftMenu = ({ menuItems, selectedKey }) => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme'));
  const { isSidebarVisible, setIsSidebarVisible } = useSidebarContext();
  const location = useLocation(); // Utilisez useLocation pour accéder à l'URL actuelle
  const pathSegments = location.pathname.split('/').filter(Boolean); // Extrait les segments de l'URL

  // Supposons que votre structure d'URL inclut la matière et la sous-matière comme deux premiers segments
  const matiere = pathSegments[0];
  const sousMatiere = pathSegments[1];

  const toggleSidebarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible); // Bascule l'état de visibilité
  };

  useEffect(() => {
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setTheme(document.documentElement.getAttribute('data-theme'));
        }
      });
    });

    themeObserver.observe(document.documentElement, { attributes: true });

    return () => {
      themeObserver.disconnect();
    };
  }, []);

  const handleMenuItemClick = (item, event) => {
    event.preventDefault();
    item.onClick();
    window.scrollTo(0, 0);
  };

  return (
    <aside className={`theme-doc-sidebar-container docSidebarContainer_S51O ${isSidebarVisible ? '' : 'docSidebarContainerHidden_gbDM'}`}>
      <div className={"sidebarViewport_K3q9"}>
        <div className={`sidebar_vtcw sidebarWithHideableNavbar_tZ9s ${isSidebarVisible ? '' : 'sidebarHidden_PrHU'}`}>
          <a tabIndex="-1" className="sidebarLogo_UK0N" href="/">
            <img 
              src="/logo.svg" 
              alt="Sanna Logo" 
              className={`themedComponent_bJGS ${theme === 'dark' ? 'themedComponent--dark_jnGk' : 'themedComponent--light_LEkC'}`}
              height="32" width="32" 
            />
            <b>Dr Sanna</b>
          </a>
          <nav aria-label="Barre latérale des docs" className="menu thin-scrollbar menu_rWGR">
            <ul className="theme-doc-sidebar-menu menu__list">
              {menuItems.map((item) => (
                <li
                  key={item.key}
                  className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item"
                >
                  <a 
                    href={`/${matiere}/${sousMatiere}/${toUrlFriendly(item.label)}`} // Utilisez la matière et la sous-matière extraites pour construire l'URL
                    className={`menu__link ${selectedKey === item.key ? 'menu__link--active' : ''}`}
                    onClick={(event) => handleMenuItemClick(item, event)}
                    aria-current={selectedKey === item.key ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            title="Réduire la barre latérale"
            aria-label="Réduire la barre latérale"
            className="button button--secondary button--outline collapseSidebarButton_PUyN"
            onClick={toggleSidebarVisibility}
          >
            <CollapseIcon />
          </button>
        </div>
      
        {!isSidebarVisible && (
          <div
            className="expandButton_ockD"
            title="Développer la barre latérale"
            aria-label="Développer la barre latérale"
            tabIndex="0"
            role="button"
            onClick={toggleSidebarVisibility}
          >
            <ExpandIcon />
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftMenu;
