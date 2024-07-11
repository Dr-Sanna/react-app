import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toUrlFriendly } from "./config";

const PartieItem = ({ partie, parentCoursLabel, onPartieSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const matiere = pathSegments[0];
  const sousMatiere = pathSegments[1];

  const handlePartieClick = (event) => {
    event.preventDefault();
    navigate(`/${matiere}/${sousMatiere}/${toUrlFriendly(parentCoursLabel)}/${toUrlFriendly(partie.attributes.titre)}`);
    onPartieSelect(partie, parentCoursLabel);
  };

  const isPartieSelected = location.pathname.includes(toUrlFriendly(partie.attributes.titre));

  return (
    <li className={`theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item ${isPartieSelected ? 'menu__link--active' : ''}`}>
      <a
        href={`/${matiere}/${sousMatiere}/${toUrlFriendly(parentCoursLabel)}/${toUrlFriendly(partie.attributes.titre)}`}
        className={`menu__link ${isPartieSelected ? 'menu__link--active' : ''}`}
        onClick={handlePartieClick}
        aria-current={isPartieSelected ? 'page' : undefined}
      >
        {partie.attributes.titre}
      </a>
    </li>
  );
};

export default PartieItem;
