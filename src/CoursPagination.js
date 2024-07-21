import React from 'react';
import { toUrlFriendly } from './config';

const CoursPagination = ({
  pathSegments,
  selectedItem,
  allItems,
  partsTitles,
  handleNavigatePrevCourse,
  handleNavigateNextCourse,
  handleNavigatePrevPart,
  handleNavigateNextPart,
  handleNavigateToLastPartPrevCourse,
  handleBackToCourse
}) => {
    
  const currentPartIndex = partsTitles.findIndex(part => toUrlFriendly(part.titre) === pathSegments[3]);
  const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);

  const prevPartTitle = currentPartIndex > 0 ? partsTitles[currentPartIndex - 1].titre : null;
  const prevItemHasParts = currentIndex > 0 && (() => {
    const prevItem = allItems[currentIndex - 1];
    const partsRelationName = Object.keys(prevItem.attributes).find(key => key.endsWith('_parties'));
    const partsRelation = prevItem.attributes[partsRelationName]?.data;
    return partsRelation && partsRelation.length > 0;
  })();

  const showBackToCourse = currentPartIndex === 0;
  const showPrevCourse = currentIndex > 0 && !showBackToCourse && currentPartIndex <= 0 && !prevItemHasParts;
  const showNextCourse = (currentIndex < allItems.length - 1) && (partsTitles.length === 0 || currentPartIndex === partsTitles.length - 1);
  const showLastPartPrevCourse = prevItemHasParts && !showBackToCourse && !prevPartTitle;

  const nextCourseTitle = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1].attributes.test.titre : null;
  const prevCourseTitle = currentIndex > 0 ? allItems[currentIndex - 1].attributes.test.titre : null;
  const nextPartTitle = currentPartIndex < partsTitles.length - 1 ? partsTitles[currentPartIndex + 1].titre : null;
  const lastPartPrevCourseTitle = prevItemHasParts ? allItems[currentIndex - 1].attributes[Object.keys(allItems[currentIndex - 1].attributes).find(key => key.endsWith('_parties'))]?.data.slice(-1)[0]?.attributes.test.titre : null;

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Navigation">
      <div className="pagination-nav__links">
        {showPrevCourse && (
          <a className="pagination-nav__link pagination-nav__link--prev" href={`/matiere/sous/matiere/${prevCourseTitle}`} onClick={(event) => { event.preventDefault(); handleNavigatePrevCourse(); }}>
            <div className="pagination-nav__sublabel">Précédent</div>
            <div className="pagination-nav__label">{prevCourseTitle}</div>
          </a>
        )}
        {showBackToCourse && !showPrevCourse && (
          <a className="pagination-nav__link pagination-nav__link--prev" href={`/matiere/sous/matiere/${selectedItem?.attributes?.test?.titre}`} onClick={(event) => { event.preventDefault(); handleBackToCourse(); }}>
            <div className="pagination-nav__sublabel">Précédent</div>
            <div className="pagination-nav__label">{selectedItem?.attributes?.test?.titre}</div>
          </a>
        )}
        {prevPartTitle && !showBackToCourse && !showPrevCourse && (
          <a className="pagination-nav__link pagination-nav__link--prev" href={`/matiere/sous/matiere/${prevPartTitle}`} onClick={(event) => { event.preventDefault(); handleNavigatePrevPart(); }}>
            <div className="pagination-nav__sublabel">Précédent</div>
            <div className="pagination-nav__label">{prevPartTitle}</div>
          </a>
        )}
        {showLastPartPrevCourse && !prevPartTitle && (
          <a className="pagination-nav__link pagination-nav__link--prev" href={`/matiere/sous/matiere/${lastPartPrevCourseTitle}`} onClick={(event) => { event.preventDefault(); handleNavigateToLastPartPrevCourse(); }}>
            <div className="pagination-nav__sublabel">Précédent</div>
            <div className="pagination-nav__label">{lastPartPrevCourseTitle}</div>
          </a>
        )}
      </div>
      <div className="pagination-nav__links">
        {showNextCourse && (
          <a className="pagination-nav__link pagination-nav__link--next" href={`/matiere/sous/matiere/${nextCourseTitle}`} onClick={(event) => { event.preventDefault(); handleNavigateNextCourse(); }}>
            <div className="pagination-nav__sublabel">Suivant</div>
            <div className="pagination-nav__label">{nextCourseTitle}</div>
          </a>
        )}
        {nextPartTitle && (
          <a className="pagination-nav__link pagination-nav__link--next" href={`/matiere/sous/matiere/${nextPartTitle}`} onClick={(event) => { event.preventDefault(); handleNavigateNextPart(); }}>
            <div className="pagination-nav__sublabel">Suivant</div>
            <div className="pagination-nav__label">{nextPartTitle}</div>
          </a>
        )}
      </div>
    </nav>
  );
};

export default CoursPagination;
