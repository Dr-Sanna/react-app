import React, { useRef, useEffect } from 'react';
import CustomMarkdown from './CustomMarkdown';
import QuestionsPartiesComponent from './QuestionsPartiesComponent';
import { useToggle } from './ToggleContext';
import PartiePagination from './PartiePagination';

const PartieDetailComponent = ({ selectedPartie, prevPartie, nextPartie, onNavigatePartie, onNavigatePrev, parentCours, matierePath, sousMatierePath }) => {
  const contentRef = useRef(null);
  const { showQuestions } = useToggle();

  useEffect(() => {
    console.log("PartieDetailComponent - selectedPartie:", selectedPartie);
    console.log("PartieDetailComponent - parentCours:", parentCours);
  }, [selectedPartie, parentCours]);

  const handleNavigate = (item, isPrev) => {
    if (isPrev) {
      onNavigatePrev(item);
    } else {
      onNavigatePartie(item);
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="markdown">
      <h1>{selectedPartie.attributes.test.titre}</h1>
      {showQuestions ? (
        <QuestionsPartiesComponent
          questions={selectedPartie.attributes.test.question}
          corrections={selectedPartie.attributes.test.correction}
          title={selectedPartie.attributes.test.titre}
        />
      ) : (
        <>
          <div ref={contentRef}>
            <CustomMarkdown
              markdownText={selectedPartie.attributes.test.enonce}
              imageStyle={{ maxHeight: '60vh', width: 'auto', marginBottom: 'var(--ifm-leading)' }}
            />
          </div>
          <PartiePagination
            prevPartie={prevPartie}
            nextPartie={nextPartie}
            onNavigatePartie={(item) => handleNavigate(item, false)}
            onNavigatePrev={(item) => handleNavigate(item, true)}
            parentCours={parentCours}
            matierePath={matierePath}
            sousMatierePath={sousMatierePath}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(PartieDetailComponent);
