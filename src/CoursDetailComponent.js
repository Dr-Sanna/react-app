import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomMarkdown from './CustomMarkdown';
import { useToggle } from './ToggleContext';
import { toUrlFriendly } from './config';
import QuestionsComponent from './QuestionsComponent';
import './CoursDetailComponent.css';

const CoursDetailComponent = ({ selectedItem, allItems }) => {
  const { showQuestions } = useToggle();
  const [partsTitles, setPartsTitles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  useEffect(() => {
    if (selectedItem) {
      const partsRelationName = Object.keys(selectedItem.attributes).find(key => key.endsWith('_parties'));
      const partsRelation = selectedItem.attributes[partsRelationName]?.data;

      const titles = partsRelation
        ? partsRelation.map(part => ({
            titre: part.attributes.test.titre,
            enonce: part.attributes.test.enonce,
            questions: part.attributes.test.test || []
          }))
        : [];
      setPartsTitles(titles);
    }
  }, [selectedItem]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleCardClick = (part, event) => {
    event.preventDefault();
    const newPath = `/${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(part.titre)}`;
    navigate(newPath);
  };

  const navigateToItem = (item) => {
    const partsRelationName = Object.keys(item.attributes).find(key => key.endsWith('_parties'));
    const partsRelation = item.attributes[partsRelationName]?.data;

    if (partsRelation && partsRelation.length > 0) {
      navigate(`/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(item.attributes.test.titre)}`);
    } else {
      navigate(`/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(item.attributes.test.titre)}`);
    }
  };

  const handleNavigatePrevCourse = () => {
    const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex > 0) {
      const prevItem = allItems[currentIndex - 1];
      navigateToItem(prevItem);
    }
  };

  const handleNavigateNextCourse = () => {
    const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex < allItems.length - 1) {
      const nextItem = allItems[currentIndex + 1];
      navigateToItem(nextItem);
    }
  };

  const handleNavigatePrevPart = () => {
    const currentPartIndex = partsTitles.findIndex(part => toUrlFriendly(part.titre) === pathSegments[3]);
    if (currentPartIndex > 0) {
      navigate(`/${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(partsTitles[currentPartIndex - 1].titre)}`);
    }
  };

  const handleNavigateNextPart = () => {
    const currentPartIndex = partsTitles.findIndex(part => toUrlFriendly(part.titre) === pathSegments[3]);
    if (currentPartIndex < partsTitles.length - 1) {
      navigate(`/${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(partsTitles[currentPartIndex + 1].titre)}`);
    }
  };

  const handleNavigateToLastPartPrevCourse = () => {
    const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex > 0) {
      const prevItem = allItems[currentIndex - 1];
      const partsRelationName = Object.keys(prevItem.attributes).find(key => key.endsWith('_parties'));
      const partsRelation = prevItem.attributes[partsRelationName]?.data;

      if (partsRelation && partsRelation.length > 0) {
        const lastPart = partsRelation[partsRelation.length - 1];
        const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(prevItem.attributes.test.titre)}/${toUrlFriendly(lastPart.attributes.test.titre)}`;
        navigate(newPath);
      }
    }
  };

  const handleBackToCourse = () => {
    navigate(`/${pathSegments.slice(0, 3).join('/')}`);
  };

  const selectedPartTitle = pathSegments.length > 3 ? pathSegments[3] : null;
  const selectedPart = partsTitles.find(part => toUrlFriendly(part.titre) === selectedPartTitle);

  const currentPartIndex = partsTitles.findIndex(part => toUrlFriendly(part.titre) === pathSegments[3]);
  const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);

  const prevItemHasParts = currentIndex > 0 && (() => {
    const prevItem = allItems[currentIndex - 1];
    const partsRelationName = Object.keys(prevItem.attributes).find(key => key.endsWith('_parties'));
    const partsRelation = prevItem.attributes[partsRelationName]?.data;
    return partsRelation && partsRelation.length > 0;
  })();

  const showBackToCourse = currentPartIndex === 0;
  const showPrevCourse = currentIndex > 0 && !showBackToCourse && currentPartIndex <= 0 && !prevItemHasParts;
  const showNextCourse = (currentIndex < allItems.length - 1) && (partsTitles.length === 0 || currentPartIndex === partsTitles.length - 1);
  const showLastPartPrevCourse = prevItemHasParts && !showBackToCourse;

  const nextCourseTitle = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1].attributes.test.titre : null;
  const prevCourseTitle = currentIndex > 0 ? allItems[currentIndex - 1].attributes.test.titre : null;
  const nextPartTitle = currentPartIndex < partsTitles.length - 1 ? partsTitles[currentPartIndex + 1].titre : null;
  const prevPartTitle = currentPartIndex > 0 ? partsTitles[currentPartIndex - 1].titre : null;
  const lastPartPrevCourseTitle = prevItemHasParts ? allItems[currentIndex - 1].attributes[Object.keys(allItems[currentIndex - 1].attributes).find(key => key.endsWith('_parties'))]?.data.slice(-1)[0]?.attributes.test.titre : null;

  return (
    <>
      <article>
        <div className="theme-doc-markdown markdown">
          {selectedPart ? (
            <>
              <h1>{selectedPart.titre}</h1>
              {showQuestions ? (
                <QuestionsComponent
                  partQuestions={selectedPart.questions}
                  title={selectedPart.titre}
                  isPart={true}
                />
              ) : (
                <CustomMarkdown
                  markdownText={selectedPart.enonce}
                  imageStyle={{ maxHeight: '60vh', width: 'auto', marginBottom: 'var(--ifm-leading)' }}
                />
              )}
            </>
          ) : (
            <>
              <h1>{selectedItem?.attributes?.test?.titre}</h1>
              {showQuestions ? (
                <QuestionsComponent
                  courseQuestions={selectedItem?.attributes?.test?.test}
                  title={selectedItem?.attributes?.test?.titre}
                  isPart={false}
                />
              ) : (
                <CustomMarkdown
                  markdownText={selectedItem?.attributes?.test?.enonce}
                  imageStyle={{ maxHeight: '60vh', width: 'auto', marginBottom: 'var(--ifm-leading)' }}
                  carouselImages={selectedItem?.attributes?.test?.carousel}
                />
              )}
              {!showQuestions && partsTitles.length > 0 && (
                <div className="cards-container margin-top--lg">
                  {partsTitles.map((part, index) => (
                    <a
                      key={index}
                      className="card padding--lg cardContainer_Uewx"
                      href={`/matiere/sous/matiere/${toUrlFriendly(part.titre)}`}
                      onClick={(event) => handleCardClick(part, event)}
                    >
                      <h2 className="cardTitle_dwRT" title={part.titre}>📄️ {part.titre}</h2>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </article>
      <nav className="pagination-nav docusaurus-mt-lg" aria-label="Navigation">
        <div className="pagination-nav__links">
          {showPrevCourse && (
            <a className="pagination-nav__link pagination-nav__link--prev" href={`/matiere/sous/matiere/${prevCourseTitle}`} onClick={(event) => { event.preventDefault(); handleNavigatePrevCourse(); }}>
              <div className="pagination-nav__sublabel">Précédent</div>
              <div className="pagination-nav__label">{prevCourseTitle}</div>
            </a>
          )}
          {showBackToCourse && (
            <a className="pagination-nav__link pagination-nav__link--prev" href={`/matiere/sous/matiere/${selectedItem?.attributes?.test?.titre}`} onClick={(event) => { event.preventDefault(); handleBackToCourse(); }}>
              <div className="pagination-nav__sublabel">Précédent</div>
              <div className="pagination-nav__label">{selectedItem?.attributes?.test?.titre}</div>
            </a>
          )}
          {prevPartTitle && (
            <a className="pagination-nav__link pagination-nav__link--prev" href={`/matiere/sous/matiere/${prevPartTitle}`} onClick={(event) => { event.preventDefault(); handleNavigatePrevPart(); }}>
              <div className="pagination-nav__sublabel">Précédent</div>
              <div className="pagination-nav__label">{prevPartTitle}</div>
            </a>
          )}
          {showLastPartPrevCourse && (
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
    </>
  );
};

export default React.memo(CoursDetailComponent);
