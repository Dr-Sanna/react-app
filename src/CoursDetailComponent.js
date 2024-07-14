import React, { useRef, useEffect } from 'react';
import CustomMarkdown from './CustomMarkdown';
import { useToggle } from './ToggleContext';
import CoursPagination from './CoursPagination';
import QuestionsComponent from './QuestionsComponent';
import './CoursDetailComponent.css';

const CoursDetailComponent = ({
  selectedItem,
  parties,
  selectedPartie,
  setSelectedPartie,
  onNavigatePartie,
  prevItem,
  nextItem,
  onNavigatePrev,
  onNavigateNext
}) => {

  const { showQuestions } = useToggle();

  useEffect(() => {
    console.log("CoursDetailComponent - selectedItem:", selectedItem);
    console.log("CoursDetailComponent - parties:", parties);
    console.log("CoursDetailComponent - selectedPartie:", selectedPartie);
  }, [selectedItem, parties, selectedPartie]);

  const handlePartieClick = (partie) => {
    setSelectedPartie(partie);
    onNavigatePartie(partie);
    console.log("Navigating to partie:", partie);
  };

  const firstPartie = parties && parties.length > 0 ? parties[0] : null;

  return (
    <div className="theme-doc-markdown markdown">
      <h1>{selectedItem?.attributes?.test?.titre}</h1>
      {showQuestions ? (
        <QuestionsComponent
          questions={selectedItem?.attributes?.test?.nestedItem?.question}
          corrections={selectedItem?.attributes?.test?.nestedItem?.correction}
          title={selectedItem?.attributes?.test?.titre}
        />
      ) : (
        <>
          <CustomMarkdown
            markdownText={selectedItem?.attributes?.test?.enonce}
            imageStyle={{ maxHeight: '60vh', width: 'auto', marginBottom: 'var(--ifm-leading)' }}
            carouselImages={selectedItem?.attributes?.test?.carousel}
          />
          {parties && parties.length > 0 && (
            <div className="cards-container">
              {parties.map(partie => (
                <a key={partie.id} href={`/partie/${partie.id}`} className="card padding--lg cardContainer_Uewx" onClick={(e) => { e.preventDefault(); handlePartieClick(partie); }}>
                  <h2 className="cardTitle_dwRT">{partie?.attributes?.test?.titre}</h2>
                </a>
              ))}
            </div>
          )}
          <CoursPagination 
            prevItem={prevItem} 
            nextItem={firstPartie || nextItem}
            onNavigatePrev={() => prevItem && onNavigatePrev(prevItem)}
            onNavigateNext={() => firstPartie ? handlePartieClick(firstPartie) : nextItem && onNavigateNext(nextItem)}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(CoursDetailComponent);
