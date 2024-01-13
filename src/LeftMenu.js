import React, { useState, useEffect } from 'react';
import { CollapseIcon, ExpandIcon } from "./IconComponents";
import { useSidebarContext } from './SidebarContext'; // Importez le hook

const LeftMenu = ({ menuItems, selectedKey }) => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme'));
  const { isSidebarVisible, setIsSidebarVisible } = useSidebarContext();

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

    // Faire défiler le conteneur principal vers le haut
    window.scrollTo(0, 0);
  };

  return (
    <aside className={`theme-doc-sidebar-container docSidebarContainer_S51O ${isSidebarVisible ? '' : 'docSidebarContainerHidden_gbDM'}`}>
      <div className={"sidebarViewport_K3q9"}>
        <div className={`sidebar_vtcw sidebarWithHideableNavbar_tZ9s ${isSidebarVisible ? '' : 'sidebarHidden_PrHU'}`}>
          {/* Ajout du logo Docusaurus et du bouton pour réduire la barre latérale */}
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
  href={item.url} 
  
      className={`menu__link ${selectedKey === item.key ? 'menu__link--active' : ''}`}
      onClick={(event) => handleMenuItemClick(item, event)}
      aria-current={selectedKey === item.key ? 'page' : undefined}
    >
      {item.label}
    </a>
  </li>
))}

              {/* Ajoutez ici les éléments pour les catégories ou sous-menus, si nécessaire */}
            </ul>
          </nav>
          {/* Bouton pour réduire la barre latérale */}
          <button
        type="button"
        title="Réduire la barre latérale"
        aria-label="Réduire la barre latérale"
        className="button button--secondary button--outline collapseSidebarButton_PUyN"
        onClick={toggleSidebarVisibility}
      >
            <CollapseIcon /> {/* Utilisation de l'icône importée ici */}
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