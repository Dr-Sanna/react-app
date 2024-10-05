import React, { useState, useEffect, useContext } from 'react';
import './RandomisationComponent.css';
import BackgroundWrapper from './BackgroundWrapper';
import { DataContext } from './DataContext';
import CustomMarkdown from './CustomMarkdown';  // Import du composant CustomMarkdown

const RandomisationComponent = () => {
  const { casRandomisations, totalCases, isLoading } = useContext(DataContext);
  const [cases, setCases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (casRandomisations.length > 0) {
      const shuffledCases = [...casRandomisations].sort(() => Math.random() - 0.5);
      setCases(shuffledCases);

      const firstCase = shuffledCases[0];
      const imageUrl = firstCase?.attributes?.image?.data?.attributes?.url;
      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
      }
    }
  }, [casRandomisations]);

  const handleNextCase = () => {
    setShowAnswer(false);
    const nextIndex = (currentIndex + 1) % cases.length;
    setCurrentIndex(nextIndex);

    const nextCase = cases[nextIndex];
    const nextImageUrl = nextCase?.attributes?.image?.data?.attributes?.url;
    if (nextImageUrl) {
      const img = new Image();
      img.src = nextImageUrl;
    }
  };

  if (!hasStarted) {
    return (
      <BackgroundWrapper>
        <div className="item-menu-container">
        <div className="randomisation-start-screen">
          <h3>
            Randomisez une pathologie ou un cas clinique parmi {totalCases} images
          </h3>
          {isLoading || cases.length === 0 ? (
            <p>Randomisation en cours...</p>
          ) : (
            <button
              className="button-randomisation"
              onClick={() => setHasStarted(true)}
            >
              C'est parti !
            </button>
          )}
        </div>
        </div>
      </BackgroundWrapper>
    );
  }

  if (cases.length === 0) {
    return <div>Chargement...</div>;
  }

  const currentCase = cases[currentIndex];
  const caseAttributes = currentCase.attributes;
  const pathology = caseAttributes.pathologie?.data?.attributes || {};

  const imageUrl = caseAttributes.image?.data
    ? caseAttributes.image.data.attributes.url
    : null;

  const explanationContent = caseAttributes.explicationspecifique || pathology.description;

  return (
<div className="randomisation-component">
  <div className="content-container">
    
    <div className="image-display">
      <div className="image-counter">Image {currentIndex + 1}/{totalCases}</div>
      {imageUrl ? (
        <img src={imageUrl} alt="Cas clinique" />
      ) : (
        <div>Aucune image disponible pour ce cas.</div>
      )}
    </div>

    <div className="text-content">
      <div className="clinical-info">
        
        {caseAttributes.affichercontexte && caseAttributes.contexte && (
          <div className="clinical-context">
            <h3>Contexte Clinique :</h3>
            <CustomMarkdown markdownText={caseAttributes.contexte} />
          </div>
        )}
        
        <div className="diagnostic">
          <h3>Diagnostic :</h3>
          <h4 className={showAnswer ? "visible-answer" : "hidden-answer"}>
            {caseAttributes.diagnosticspecifique || pathology.diagnostic}
          </h4>
          {explanationContent && (
            <div className={showAnswer ? "visible-answer" : "hidden-answer"}>
              <h3>Explication :</h3>
              <CustomMarkdown markdownText={explanationContent} />
            </div>
          )}
        </div>
      </div>

      <div className="button-section">
        {showAnswer ? (
          <button className="button-randomisation" onClick={handleNextCase}>
            Image Suivante
          </button>
        ) : (
          <button className="button-randomisation" onClick={() => setShowAnswer(true)}>
            Afficher la Réponse
          </button>
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default RandomisationComponent;
