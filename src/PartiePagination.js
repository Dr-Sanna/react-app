import React from 'react';

const PartiePagination = ({ prevPartie, nextPartie, onNavigatePartie, onNavigatePrev, parentCours }) => {
  const handleClick = (item, e, isPrev) => {
    e.preventDefault();
    if (isPrev) {
      onNavigatePrev(item);
    } else {
      onNavigatePartie(item);
    }
    window.scrollTo(0, 0);
  };

  const prevLabel = prevPartie && prevPartie.attributes ? prevPartie.attributes.titre : (parentCours && parentCours.attributes ? parentCours.attributes.titre : "Retour aux cours");

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Pages de documentation">
      {prevPartie || parentCours ? (
        <a 
          href="#" 
          className="pagination-nav__link pagination-nav__link--prev" 
          onClick={(e) => handleClick(prevPartie || parentCours, e, true)}
        >
          <div className="pagination-nav__sublabel">Précédent</div>
          <div className="pagination-nav__label">{prevLabel}</div>
        </a>
      ) : null}
      {nextPartie && (
        <a 
          href="#" 
          className="pagination-nav__link pagination-nav__link--next" 
          onClick={(e) => handleClick(nextPartie, e, false)}
        >
          <div className="pagination-nav__sublabel">Suivant</div>
          <div className="pagination-nav__label">{nextPartie.attributes.titre}</div>
        </a>
      )}
    </nav>
  );
};

export default PartiePagination;
