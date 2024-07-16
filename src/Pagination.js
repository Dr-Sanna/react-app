import React from 'react';
import { toUrlFriendly } from "./config";
import { useNavigate } from 'react-router-dom';

const Pagination = ({ prevItem, nextItem, parentCours, matierePath, sousMatierePath }) => {
  const navigate = useNavigate();

  const getHref = (item, parent) => {
    if (item.attributes.occlusion_et_fonction) {
      return `/${matierePath}/${sousMatierePath}/${toUrlFriendly(parent.attributes.test.titre)}/${toUrlFriendly(item.attributes.test.titre)}`;
    }
    return `/${matierePath}/${sousMatierePath}/${toUrlFriendly(item.attributes.test.titre)}`;
  };

  const handleNavigation = (href) => {
    navigate(href);
    window.scrollTo(0, 0);
  };

  const prevHref = prevItem ? getHref(prevItem, parentCours) : "#";
  const nextHref = nextItem ? getHref(nextItem, parentCours) : "#";

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Pages de documentation">
      {prevItem && (
        <a 
          href={prevHref} 
          className="pagination-nav__link pagination-nav__link--prev"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(prevHref);
          }}
        >
          <div className="pagination-nav__sublabel">Précédent</div>
          <div className="pagination-nav__label">{prevItem.attributes.test.titre}</div>
        </a>
      )}
      {nextItem && (
        <a 
          href={nextHref} 
          className="pagination-nav__link pagination-nav__link--next"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(nextHref);
          }}
        >
          <div className="pagination-nav__sublabel">Suivant</div>
          <div className="pagination-nav__label">{nextItem.attributes.test.titre}</div>
        </a>
      )}
    </nav>
  );
};

export default Pagination;
