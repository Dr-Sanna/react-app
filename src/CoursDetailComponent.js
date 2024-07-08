import React, { useRef, useEffect } from 'react';
import CustomMarkdown from './CustomMarkdown';
import VoiceReader from './VoiceReader';
import { useToggle } from './ToggleContext';
import CoursPagination from './CoursPagination';
import './CoursDetailComponent.css'; // Assurez-vous d'inclure votre feuille de style

const CoursDetailComponent = ({ selectedCas, parties, selectedPartie, setSelectedPartie, onNavigatePartie, prevItem, nextItem, onNavigate, onNavigatePrev, onNavigateNext }) => {
  const contentRef = useRef(null);
  const { showVoiceReader } = useToggle();

  useEffect(() => {
    const cleanUp = () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('p, li');
        elements.forEach((el) => {
          if (el.parentNode) {
            const newElement = el.cloneNode(true);
            el.parentNode.replaceChild(newElement, el);
          }
        });
      }
    };

    cleanUp(); // Clean up on component mount

    return cleanUp(); // Clean up on component unmount
  }, [selectedCas]);

  const handlePartieClick = (partie) => {
    setSelectedPartie(partie);
    onNavigatePartie(partie);
    console.log("Navigating to partie:", partie);
  };

  const firstPartie = parties.length > 0 ? parties[0] : null;
  const nextItemWithParts = nextItem && nextItem.attributes.hasParts ? nextItem : null;

  return (
    <div className="markdown">
      <h1>{selectedCas.attributes.titre}</h1>
      {!selectedCas.attributes.hasParts && showVoiceReader && <VoiceReader contentRef={contentRef} />}
      <div ref={contentRef}>
        <CustomMarkdown
          markdownText={selectedCas.attributes.enonce}
          imageStyle={{ maxHeight: '60vh', width: 'auto', marginBottom: 'var(--ifm-leading)' }}
          carouselImages={selectedCas.attributes.carousel}
        />
        {parties.length > 0 && (
          <div className="cards-container">
            {parties.map(partie => (
              <a key={partie.id} className="card padding--lg cardContainer_Uewx" onClick={() => handlePartieClick(partie)}>
                <h2 className="text--truncate cardTitle_dwRT" title={partie.attributes.titre}>{partie.attributes.titre}</h2>
                <p className="text--truncate cardDescription_mCBT" title={partie.attributes.enonce}>{partie.attributes.enonce}</p>
              </a>
            ))}
          </div>
        )}
      </div>
      <CoursPagination 
        prevItem={prevItem} 
        nextItem={firstPartie || nextItemWithParts || nextItem} // Utiliser la première partie si le cours a des parties
        onNavigatePrev={onNavigatePrev}
        onNavigateNext={firstPartie ? handlePartieClick : onNavigateNext} // Naviguer vers la première partie si elle existe
      />
    </div>
  );
};

export default React.memo(CoursDetailComponent);
