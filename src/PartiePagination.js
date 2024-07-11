import React, { useEffect } from 'react';
import { toUrlFriendly } from "./config";

const PartiePagination = ({ prevPartie, nextPartie, onNavigatePartie, onNavigatePrev, parentCours, matierePath, sousMatierePath }) => {
  const handleClick = (item, e, isPrev) => {
    e.preventDefault();
    if (isPrev) {
      onNavigatePrev(item);
    } else {
      onNavigatePartie(item);
    }
    window.scrollTo(0, 0);
  };

  const prevLabel = prevPartie && prevPartie.attributes ? prevPartie.attributes.test.titre : (parentCours && parentCours.attributes ? parentCours.attributes.test.titre : "Retour aux cours");

  useEffect(() => {
    console.log("Matiere Path in Pagination:", matierePath);
    console.log("Sous Matiere Path in Pagination:", sousMatierePath);
  }, [matierePath, sousMatierePath]);

  const prevHref = prevPartie 
    ? `/${matierePath}/${sousMatierePath}/${toUrlFriendly(parentCours.attributes.test.titre)}/${toUrlFriendly(prevPartie.attributes.test.titre)}`
    : (parentCours ? `/${matierePath}/${sousMatierePath}/${toUrlFriendly(parentCours.attributes.test.titre)}` : "#");

  const nextHref = nextPartie 
    ? `/${matierePath}/${sousMatierePath}/${toUrlFriendly(parentCours.attributes.test.titre)}/${toUrlFriendly(nextPartie.attributes.test.titre)}`
    : "#";

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Pages de documentation">
      {prevPartie || parentCours ? (
        <a 
          href={prevHref} 
          className="pagination-nav__link pagination-nav__link--prev" 
          onClick={(e) => handleClick(prevPartie || parentCours, e, true)}
        >
          <div className="pagination-nav__sublabel">Précédent</div>
          <div className="pagination-nav__label">{prevLabel}</div>
        </a>
      ) : null}
      {nextPartie && (
        <a 
          href={nextHref} 
          className="pagination-nav__link pagination-nav__link--next" 
          onClick={(e) => handleClick(nextPartie, e, false)}
        >
          <div className="pagination-nav__sublabel">Suivant</div>
          <div className="pagination-nav__label">{nextPartie.attributes.test.titre}</div>
        </a>
      )}
    </nav>
  );
};

export default PartiePagination;
