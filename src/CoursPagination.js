import React from 'react';

const CoursPagination = ({ prevItem, nextItem, onNavigatePrev, onNavigateNext }) => {
  const handleClick = (item, e, isPrev) => {
    e.preventDefault();
    if (isPrev) {
      onNavigatePrev(item);
    } else {
      onNavigateNext(item);
    }
    window.scrollTo(0, 0);
  };

  const prevLabel = prevItem && prevItem.attributes ? prevItem.attributes.test.titre : "Retour aux cours";

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Pages de documentation">
      {prevItem && (
        <a 
          href={`/cours/${prevItem.id}`} 
          className="pagination-nav__link pagination-nav__link--prev" 
          onClick={(e) => handleClick(prevItem, e, true)}
        >
          <div className="pagination-nav__sublabel">Précédent</div>
          <div className="pagination-nav__label">{prevLabel}</div>
        </a>
      )}
      {nextItem && (
        <a 
          href={`/cours/${nextItem.id}`} 
          className="pagination-nav__link pagination-nav__link--next" 
          onClick={(e) => handleClick(nextItem, e, false)}
        >
          <div className="pagination-nav__sublabel">Suivant</div>
          <div className="pagination-nav__label">{nextItem.attributes.test.titre}</div>
        </a>
      )}
    </nav>
  );
};

export default CoursPagination;
