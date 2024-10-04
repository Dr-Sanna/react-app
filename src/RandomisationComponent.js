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
          {imageUrl ? (
            <img src={imageUrl} alt="Cas clinique" />
          ) : (
            <div>Aucune image disponible pour ce cas.</div>
          )}
        </div>
        <div className="text-content">
          <div className="clinical-info">
            <div className="image-counter">
              Image {currentIndex + 1}/{totalCases}
            </div>
            {caseAttributes.affichercontexte && caseAttributes.contexte && (
              <div className="clinical-context">
                <h3>Contexte Clinique :</h3>
                {/* Utilisation de CustomMarkdown pour rendre le Markdown du contexte */}
                <CustomMarkdown markdownText={caseAttributes.contexte} />
                <h3>Diagnostic :</h3>
              </div>
            )}
            {showAnswer ? (
              <div className="answer-section">
                <h4>{caseAttributes.diagnosticspecifique || pathology.diagnostic}</h4>
                {(caseAttributes.source || pathology.source) && (
                  <p>
                    Source :{' '}
                    <a
                      href={caseAttributes.source || pathology.source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {caseAttributes.source || pathology.source}
                    </a>
                  </p>
                )}
                {explanationContent && (
                  <div className="explanation">
                    <h3>Explication :</h3>
                    {/* Utilisation de CustomMarkdown pour rendre le Markdown des explications */}
                    <CustomMarkdown markdownText={explanationContent} />
                  </div>
                )}
                <button className="button-randomisation" onClick={handleNextCase}>
                  Image Suivante
                </button>
              </div>
            ) : (
              <button
                className="button-randomisation"
                onClick={() => setShowAnswer(true)}
              >
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
