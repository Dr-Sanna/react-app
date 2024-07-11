import React, { useState, useEffect } from 'react';
import { CollapseIcon, ExpandIcon } from "./IconComponents";
import { useSidebarContext } from './SidebarContext';
import { toUrlFriendly } from "./config";
import { useLocation, useNavigate } from 'react-router-dom';

const LeftMenu = ({ menuItems, selectedKey, parties, onSelectionChange }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const { isSidebarVisible, setIsSidebarVisible } = useSidebarContext();
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const matiere = pathSegments[0];
  const sousMatiere = pathSegments[1];
  const cours = pathSegments[2];
  const partie = pathSegments[3];

  const toggleSidebarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleMenuItemClick = (item, event) => {
    event.preventDefault();
    const newPath = `/${matiere}/${sousMatiere}/${toUrlFriendly(item.label)}`;
    if (location.pathname !== newPath) {
      navigate(newPath);
      onSelectionChange(item.label, null);  // Mise à jour des props avec le cours sélectionné
    }
    window.scrollTo(0, 0);
  };

  const handlePartieClick = (partie, parentCoursLabel, event) => {
    event.preventDefault();
    const newPath = `/${matiere}/${sousMatiere}/${toUrlFriendly(parentCoursLabel)}/${toUrlFriendly(partie.attributes.titre)}`;
    if (location.pathname !== newPath) {
      navigate(newPath);
      onSelectionChange(parentCoursLabel, partie.attributes.test.titre);  // Mise à jour des props avec le cours et la partie sélectionnée
    }
    window.scrollTo(0, 0);
  };

  const toggleExpand = (key, event) => {
    event.stopPropagation();
    event.preventDefault();
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isPartieSelected = (partieTitre) => {
    return partie === toUrlFriendly(partieTitre);
  };

  const isSelectedCoursOrPartie = (item) => {
    const itemKey = toUrlFriendly(item.label);
    return selectedKey === item.key || (cours === itemKey && !partie);
  };

  const isExpanded = (key) => !!expandedItems[key];

  useEffect(() => {
    if (selectedKey) {
      setExpandedItems((prev) => ({
        ...prev,
        [selectedKey]: true,
      }));
    }
  }, [selectedKey]);

  return (
    <aside className={`theme-doc-sidebar-container docSidebarContainer_S51O ${isSidebarVisible ? '' : 'docSidebarContainerHidden_gbDM'}`}>
      <div className={"sidebarViewport_K3q9"}>
        <div className={`sidebar_vtcw sidebarWithHideableNavbar_tZ9s ${isSidebarVisible ? '' : 'sidebarHidden_PrHU'}`}>
          <a tabIndex="-1" className="sidebarLogo_UK0N" href="/">
            <img 
              src="/logo.svg" 
              alt="Sanna Logo" 
              className="themedComponent_bJGS"
              height="32" width="32" 
            />
            <b>Dr Sanna</b>
          </a>
          <nav aria-label="Barre latérale des docs" className="menu thin-scrollbar menu_rWGR">
            <ul className="theme-doc-sidebar-menu menu__list">
              {menuItems.map((item) => {
                const isItemSelected = isSelectedCoursOrPartie(item);
                const isItemExpanded = isExpanded(item.key);
                return (
                  <li
                    key={item.key}
                    className={`theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item`}
                  >
                    <div className={`menu__list-item-collapsible ${isItemExpanded ? 'menu__list-item-collapsible' : ''} ${isItemSelected ? 'menu__list-item-collapsible--active' : ''}`}>
                      <a 
                        href={`/${matiere}/${sousMatiere}/${toUrlFriendly(item.label)}`}
                        className={`menu__link ${isItemSelected ? 'menu__link--active' : ''}`}
                        onClick={(event) => handleMenuItemClick(item, event)}
                        aria-current={isItemSelected ? 'page' : undefined}
                      >
                        {item.label}
                      </a>
                      {item.hasParts && (
                        <button
                          aria-label={`Toggle ${item.label}`}
                          aria-expanded={isItemExpanded}
                          type="button"
                          className="clean-btn menu__caret"
                          onClick={(e) => toggleExpand(item.key, e)}
                        />
                      )}
                    </div>
                    {item.hasParts && isItemExpanded && parties[item.key] && (
                      <ul className="menu__list" style={{ display: 'block', overflow: 'visible', height: 'auto' }}>
                        {parties[item.key].map((partie) => {
                          const isPartieSelectedFlag = isPartieSelected(partie.attributes.test.titre);
                          return (
                            <li
                              key={partie.id}
                              className={`theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item ${isPartieSelectedFlag ? 'menu__link--active' : ''}`}
                            >
                              <a
                                href={`/${matiere}/${sousMatiere}/${toUrlFriendly(item.label)}/${toUrlFriendly(partie.attributes.test.titre)}`}
                                className={`menu__link ${isPartieSelectedFlag ? 'menu__link--active' : ''}`}
                                onClick={(event) => handlePartieClick(partie, item.label, event)}
                                aria-current={isPartieSelectedFlag ? 'page' : undefined}
                              >
                                {partie.attributes.test.titre}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <button
            type="button"
            title="Réduire la barre latérale"
            aria-label="Réduire la barre latérale"
            className="button button--secondary button--outline collapseSidebarButton_PUyN"
            onClick={toggleSidebarVisibility}
          >
            {isSidebarVisible ? <CollapseIcon /> : <ExpandIcon />}
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
