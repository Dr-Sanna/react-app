import React from 'react';

const PaginationComponent = ({ prevItem, nextItem, onNavigatePrev, onNavigateNext, parentCours }) => {
  const handleClick = (item, e, isPrev) => {
    e.preventDefault();
    if (isPrev) {
      onNavigatePrev(item);
    } else {
      onNavigateNext(item);
    }
    window.scrollTo(0, 0);
  };

  const prevLabel = prevItem && prevItem.attributes ? prevItem.attributes.test.titre : (parentCours && parentCours.attributes ? parentCours.attributes.titre : "Retour aux cours");

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Pages de documentation">
      {prevItem ? (
        <a 
          href={`/cours/${prevItem.id}`} 
          className="pagination-nav__link pagination-nav__link--prev" 
          onClick={(e) => handleClick(prevItem, e, true)}
        >
          <div className="pagination-nav__sublabel">Précédent</div>
          <div className="pagination-nav__label">{prevLabel}</div>
        </a>
      ) : parentCours ? (
        <a 
          href={`/cours/${parentCours.id}`} 
          className="pagination-nav__link pagination-nav__link--prev" 
          onClick={(e) => handleClick(parentCours, e, true)}
        >
          <div className="pagination-nav__sublabel">Précédent</div>
          <div className="pagination-nav__label">{parentCours.attributes.titre}</div>
        </a>
      ) : null}
      {nextItem && (
        <a 
          href={`/cours/${nextItem.id}`} 
          className="pagination-nav__link pagination-nav__link--next" 
          onClick={(e) => handleClick(nextItem, e, false)}
        >
          <div className="pagination-nav__sublabel">Suivant</div>
          <div className="pagination-nav__label">{nextItem.label || nextItem.attributes.test.titre}</div>
        </a>
      )}
    </nav>
  );
};

export default PaginationComponent;
