import React, { useRef, useEffect } from 'react';
import VoiceReader from './VoiceReader';
import PartiePagination from './PartiePagination';
import { useToggle } from './ToggleContext';

const PartieDetailComponent = ({ selectedPartie, prevPartie, nextPartie, onNavigatePartie, onNavigatePrev, parentCours }) => {
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

    return cleanUp; // Clean up on component unmount
  }, [selectedPartie]);

  return (
    <div className="markdown">
      <h1>{selectedPartie.attributes.titre}</h1>
      {showVoiceReader && <VoiceReader contentRef={contentRef} />}
      <div ref={contentRef}>
        <div dangerouslySetInnerHTML={{ __html: selectedPartie.attributes.enonce }} />
      </div>
      <PartiePagination 
        prevPartie={prevPartie} 
        nextPartie={nextPartie} 
        onNavigatePartie={onNavigatePartie} 
        onNavigatePrev={onNavigatePrev}
        parentCours={parentCours}
      />
    </div>
  );
};

export default React.memo(PartieDetailComponent);
