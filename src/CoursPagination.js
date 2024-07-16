import React, { useEffect, useState } from 'react';
import { toUrlFriendly } from './config';

const CoursPagination = ({ selectedItem, allItems, onNavigatePrev, onNavigateNext }) => {
  const [prevItem, setPrevItem] = useState(null);
  const [nextItem, setNextItem] = useState(null);

  useEffect(() => {
    if (!selectedItem || !allItems || allItems.length === 0) return;

    const currentItemIndex = allItems.findIndex(item => item.id === selectedItem.id);
    const currentParts = selectedItem.attributes?.test?.parts || [];
    const currentPartIndex = currentParts.findIndex(part => toUrlFriendly(part.titre) === selectedItem.currentPart);

    // Logique pour l'élément suivant
    if (currentPartIndex > -1 && currentPartIndex < currentParts.length - 1) {
      setNextItem({ ...selectedItem, currentPart: currentParts[currentPartIndex + 1].titre });
    } else if (currentItemIndex < allItems.length - 1) {
      const nextCours = allItems[currentItemIndex + 1];
      const nextCoursParts = nextCours.attributes.test?.parts || [];
      setNextItem({ ...nextCours, currentPart: nextCoursParts.length > 0 ? nextCoursParts[0].titre : null });
    } else {
      setNextItem(null);
    }

    // Logique pour l'élément précédent
    if (currentPartIndex > 0) {
      setPrevItem({ ...selectedItem, currentPart: currentParts[currentPartIndex - 1].titre });
    } else if (currentItemIndex > 0) {
      const prevCours = allItems[currentItemIndex - 1];
      const prevCoursParts = prevCours.attributes.test?.parts || [];
      setPrevItem({ ...prevCours, currentPart: prevCoursParts.length > 0 ? prevCoursParts[prevCoursParts.length - 1].titre : null });
    } else {
      setPrevItem(null);
    }
  }, [selectedItem, allItems]);

  const handleClick = (item, e, isPrev) => {
    e.preventDefault();
    if (isPrev) {
      onNavigatePrev(item);
    } else {
      onNavigateNext(item);
    }
    window.scrollTo(0, 0);
  };

  const getHref = (item) => {
    if (item.currentPart) {
      return `/cours/${item.id}/${toUrlFriendly(item.currentPart)}`;
    }
    return `/cours/${item.id}`;
  };

  const getLabel = (item) => {
    if (item.currentPart) {
      return item.currentPart;
    }
    return item.attributes.test.titre;
  };

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Pages de documentation">
      {prevItem && (
        <a 
          href={getHref(prevItem)} 
          className="pagination-nav__link pagination-nav__link--prev" 
          onClick={(e) => handleClick(prevItem, e, true)}
        >
          <div className="pagination-nav__sublabel">Précédent</div>
          <div className="pagination-nav__label">{getLabel(prevItem)}</div>
        </a>
      )}
      {nextItem && (
        <a 
          href={getHref(nextItem)} 
          className="pagination-nav__link pagination-nav__link--next" 
          onClick={(e) => handleClick(nextItem, e, false)}
        >
          <div className="pagination-nav__sublabel">Suivant</div>
          <div className="pagination-nav__label">{getLabel(nextItem)}</div>
        </a>
      )}
    </nav>
  );
};

export default CoursPagination;
