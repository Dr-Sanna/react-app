import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toUrlFriendly } from "./config";

const CoursItem = ({ cours, parties, onCoursSelect, onPartieSelect, expanded, onToggleExpand }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const matiere = pathSegments[0];
  const sousMatiere = pathSegments[1];

  const handleCoursClick = (event) => {
    event.preventDefault();
    navigate(`/${matiere}/${sousMatiere}/${toUrlFriendly(cours.label)}`);
    onCoursSelect(cours);
  };

  const handlePartieClick = (partie, event) => {
    event.preventDefault();
    navigate(`/${matiere}/${sousMatiere}/${toUrlFriendly(cours.label)}/${toUrlFriendly(partie.attributes.titre)}`);
    onPartieSelect(partie, cours.label);
  };

  const isCoursSelected = location.pathname.includes(toUrlFriendly(cours.label));
  const isExpanded = expanded[cours.key];

  return (
    <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item">
      <div className={`menu__list-item-collapsible ${isExpanded ? 'menu__list-item-collapsible--expanded' : ''}`}>
        <a
          href={`/${matiere}/${sousMatiere}/${toUrlFriendly(cours.label)}`}
          className={`menu__link ${isCoursSelected ? 'menu__link--active' : ''}`}
          onClick={handleCoursClick}
          aria-current={isCoursSelected ? 'page' : undefined}
        >
          {cours.label}
        </a>
        {parties && (
          <button
            aria-label={`Toggle ${cours.label}`}
            aria-expanded={isExpanded}
            type="button"
            className="clean-btn menu__caret"
            onClick={(e) => onToggleExpand(cours.key, e)}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        )}
      </div>
      {isExpanded && parties && (
        <ul className="menu__list" style={{ display: 'block', overflow: 'visible', height: 'auto' }}>
          {parties.map((partie) => (
            <li
              key={partie.id}
              className={`theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item`}
            >
              <a
                href={`/${matiere}/${sousMatiere}/${toUrlFriendly(cours.label)}/${toUrlFriendly(partie.attributes.titre)}`}
                className={`menu__link ${location.pathname.includes(toUrlFriendly(partie.attributes.titre)) ? 'menu__link--active' : ''}`}
                onClick={(event) => handlePartieClick(partie, event)}
                aria-current={location.pathname.includes(toUrlFriendly(partie.attributes.titre)) ? 'page' : undefined}
              >
                {partie.attributes.titre}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default CoursItem;
