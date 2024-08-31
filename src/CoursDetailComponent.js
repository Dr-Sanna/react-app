import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomMarkdown from './CustomMarkdown';
import { useToggle } from './ToggleContext';
import { toUrlFriendly } from './config';
import QuestionsComponent from './QuestionsComponent';
import CoursPagination from './CoursPagination'; // Importez le nouveau composant
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
            questions: part.attributes.test.test || [],
            qcms: part.attributes.QCM || [] // Ajoutez les QCM ici
          }))
        : [];
      setPartsTitles(titles);
    }
  }, [selectedItem]);

  // Ajoutez la logique pour rendre les td cliquables avec navigate ici
  useEffect(() => {
    const handleClick = (event) => {
      event.preventDefault();
      navigate(event.currentTarget.getAttribute('href'));
    };

    const tdElements = document.querySelectorAll('td');

    tdElements.forEach(td => {
      const link = td.querySelector('a');
      if (link) {
        td.style.cursor = 'pointer';
        td.addEventListener('click', handleClick);
      }
    });

    return () => {
      tdElements.forEach(td => {
        const link = td.querySelector('a');
        if (link) {
          td.removeEventListener('click', handleClick);
        }
      });
    };
  }, [navigate]);

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
                  qcms={selectedPart.qcms} // Passez les QCM ici
                  title={selectedPart.titre}
                  isPart={true}
                />
              ) : (
                <CustomMarkdown
                markdownText={selectedPart.enonce}
                imageClass="custom-image"
                />
              )}
            </>
          ) : (
            <>
              <h1>{selectedItem?.attributes?.test?.titre}</h1>
              {showQuestions ? (
                <QuestionsComponent
                  courseQuestions={selectedItem?.attributes?.test?.test}
                  qcms={selectedItem?.attributes?.QCM} // Passez les QCM ici
                  title={selectedItem?.attributes?.test?.titre}
                  isPart={false}
                />
              ) : (
                <CustomMarkdown
                  markdownText={selectedItem?.attributes?.test?.enonce}
                  imageClass="custom-image"
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
                      <h2 className="cardTitle_dwRT" title={part.titre}>{part.titre}</h2>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </article>
      <CoursPagination
        pathSegments={pathSegments}
        selectedItem={selectedItem}
        allItems={allItems}
        partsTitles={partsTitles}
        handleNavigatePrevCourse={handleNavigatePrevCourse}
        handleNavigateNextCourse={handleNavigateNextCourse}
        handleNavigatePrevPart={handleNavigatePrevPart}
        handleNavigateNextPart={handleNavigateNextPart}
        handleNavigateToLastPartPrevCourse={handleNavigateToLastPartPrevCourse}
        handleBackToCourse={handleBackToCourse}
      />
    </>
  );
};

export default React.memo(CoursDetailComponent);
