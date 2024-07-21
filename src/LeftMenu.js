import React, { useState, useEffect, useRef } from 'react';
import { useSidebarContext } from './SidebarContext';
import { toUrlFriendly } from "./config";
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomExpandIcon, BottomCollapseIcon } from './IconComponents';

const LeftMenu = ({ menuItems, selectedKey, onSelectionChange }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const { isSidebarVisible, setIsSidebarVisible } = useSidebarContext();
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const listRef = useRef({});
  const [heights, setHeights] = useState({});

  const matiere = pathSegments[0];
  const sousMatiere = pathSegments[1];
  const cours = pathSegments[2];

  const toggleSidebarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleMenuItemClick = (item, event) => {
    event.preventDefault();
    const newPath = `/${matiere}/${sousMatiere}/${toUrlFriendly(item.label)}`;
    if (location.pathname !== newPath) {
      navigate(newPath);
      onSelectionChange(item.label, null); // Mise à jour des props avec le cours sélectionné
    }
    window.scrollTo(0, 0);
  };

  const handlePartClick = (part, item, event) => {
    event.preventDefault();
    const newPath = `/${matiere}/${sousMatiere}/${toUrlFriendly(item.label)}/${toUrlFriendly(part)}`;
    if (location.pathname !== newPath) {
      navigate(newPath);
    }
    window.scrollTo(0, 0);
  };

  const toggleExpand = (key, event) => {
    event.stopPropagation();
    event.preventDefault();
    setExpandedItems((prev) => {
      const newExpandedItems = { ...prev, [key]: !prev[key] };
      if (newExpandedItems[key]) {
        const listElement = listRef.current[key];
        setHeights((prevHeights) => ({
          ...prevHeights,
          [key]: listElement.scrollHeight,
        }));
      }
      return newExpandedItems;
    });
  };

  const isSelectedCoursOrPartie = (item) => {
    const itemKey = toUrlFriendly(item.label);
    return selectedKey === item.key || cours === itemKey;
  };

  const isSelectedPart = (part) => {
    const partKey = toUrlFriendly(part);
    return pathSegments.length > 3 && pathSegments[3] === partKey;
  };

  useEffect(() => {
    if (selectedKey) {
      setExpandedItems((prev) => ({
        ...prev,
        [selectedKey]: true,
      }));
    }
  }, [selectedKey]);

  useEffect(() => {
    // Set the height for the expanded items based on selection
    Object.keys(expandedItems).forEach(key => {
      const listElement = listRef.current[key];
      if (expandedItems[key] && listElement) {
        setHeights((prevHeights) => ({
          ...prevHeights,
          [key]: listElement.scrollHeight,
        }));
      }
    });
  }, [expandedItems, selectedKey]);

  return (
    <aside className={`theme-doc-sidebar-container docSidebarContainer_S51O ${isSidebarVisible ? '' : 'docSidebarContainerHidden_gbDM'}`}>
      <div className={"sidebarViewport_K3q9"}>
        <div className={`sidebar_vtcw sidebarWithHideableNavbar_tZ9s ${isSidebarVisible ? '' : 'sidebarHidden_PrHU'}`}>
          <a tabIndex="-1" className="sidebarLogo_UK0N" href="/">
            <img 
              src="/logo.svg" 
              alt="Sanna Logo" 
              height="32" width="32" 
            />
            <b>Dr Sanna</b>
          </a>
          <nav aria-label="Barre latérale des docs" className="menu thin-scrollbar menu_rWGR">
            <ul className="theme-doc-sidebar-menu menu__list">
              {menuItems.map((item) => {
                const isItemSelected = isSelectedCoursOrPartie(item);
                const isItemExpanded = expandedItems[item.key];
                const partsTitles = item.partsTitles || [];
                const height = heights[item.key] || 0;

                return (
                  <li
                    key={item.key}
                    className={`theme-doc-sidebar-item-category theme-doc-sidebar-item-category-level-1 menu__list-item ${isItemExpanded ? 'menu__list-item--expanded' : 'menu__list-item--collapsed'}`}
                  >
                    <div className={`menu__list-item-collapsible ${isItemSelected ? 'menu__list-item-collapsible--active' : ''}`}>
                      <a 
                        href={`/${matiere}/${sousMatiere}/${toUrlFriendly(item.label)}`}
                        className={`menu__link ${isItemSelected ? 'menu__link--active' : ''}`}
                        onClick={(event) => handleMenuItemClick(item, event)}
                        aria-current={isItemSelected ? 'page' : undefined}
                      >
                        {item.label}
                      </a>
                      {partsTitles.length > 0 && (
                        <button
                          aria-label={`Toggle ${item.label}`}
                          aria-expanded={isItemExpanded ? 'true' : 'false'}
                          type="button"
                          className="clean-btn menu__caret"
                          onClick={(e) => toggleExpand(item.key, e)}
                        >
                          <span className={`menu__caret-icon ${isItemExpanded ? 'expanded' : 'collapsed'}`} />
                        </button>
                      )}
                    </div>
                    {partsTitles.length > 0 && (
                      <ul
                        className="menu__list"
                        ref={(el) => (listRef.current[item.key] = el)}
                        style={{
                          height: isItemExpanded ? `${height}px` : '0',
                          overflow: 'hidden',
                          willChange: 'height',
                          transition: 'height 357ms ease-in-out',
                        }}
                      >
                        {partsTitles.map((part, index) => (
                          <li
                            key={`${item.key}-${index}`}
                            className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item"
                          >
                            <a 
                              href={`/${matiere}/${sousMatiere}/${toUrlFriendly(item.label)}/${toUrlFriendly(part)}`}
                              className={`menu__link ${isSelectedPart(part) ? 'menu__link--active' : ''}`}
                              onClick={(event) => handlePartClick(part, item, event)}
                              aria-current={isSelectedPart(part) ? 'page' : undefined}
                            >
                              {part}
                            </a>
                          </li>
                        ))}
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
            {isSidebarVisible ? <BottomCollapseIcon /> : <BottomExpandIcon />}
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
            <BottomExpandIcon />
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftMenu;
