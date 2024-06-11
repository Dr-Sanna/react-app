import React from 'react';
import { useLocation } from 'react-router-dom';

const PaginationComponent = ({ prevItem, nextItem, onNavigate }) => {
  const location = useLocation();

  const construireUrl = (item) => {
    const baseUrl = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
    const segments = baseUrl.split('/').filter(Boolean);
    if (segments.length > 0) {
      segments.pop();
    }
    return `/${segments.join('/')}/${item.urlFriendlyTitre}`;
  };

  // Adjust the onClick handler to also scroll to the top
  const handleClick = (item, e) => {
    e.preventDefault();
    onNavigate(item); // Assuming `onNavigate` will navigate to the item
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Pages de documentation">
      {prevItem && (
        <a 
          href={construireUrl(prevItem)} 
          className="pagination-nav__link pagination-nav__link--prev" 
          onClick={(e) => handleClick(prevItem, e)}
        >
          <div className="pagination-nav__sublabel">Précédent</div>
          <div className="pagination-nav__label">{prevItem.label}</div>
        </a>
      )}
      {nextItem && (
        <a 
          href={construireUrl(nextItem)} 
          className="pagination-nav__link pagination-nav__link--next" 
          onClick={(e) => handleClick(nextItem, e)}
        >
          <div className="pagination-nav__sublabel">Suivant</div>
          <div className="pagination-nav__label">{nextItem.label}</div>
        </a>
      )}
    </nav>
  );
};

export default PaginationComponent;
