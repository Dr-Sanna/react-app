// RandomisationComponent.js
import React, { useState, useEffect, useContext } from 'react';
import './RandomisationComponent.css';
import BackgroundWrapper from './BackgroundWrapper';
import { DataContext } from './DataContext';

const RandomisationComponent = () => {
  const { casRandomisations, totalCases, isLoading } = useContext(DataContext);
  const [cases, setCases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (casRandomisations.length > 0) {
      // Randomiser les cas sans muter le tableau original
      const shuffledCases = [...casRandomisations].sort(() => Math.random() - 0.5);
      setCases(shuffledCases);

      // Précharger la première image
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

    // Précharger l'image suivante
    const nextCase = cases[nextIndex];
    const nextImageUrl = nextCase?.attributes?.image?.data?.attributes?.url;
    if (nextImageUrl) {
      const img = new Image();
      img.src = nextImageUrl;
    }
  };

  // Fonction pour rendre le contenu riche (Rich Text)
  const renderRichTextContent = (richText) => {
    if (!richText) return null;
    return richText.map((block, index) => {
      if (block.type === 'paragraph') {
        const textContent = block.children.map(child => child.text).join('');
        if (textContent.trim() === '') return null; // Ne pas rendre les paragraphes vides
        return <p key={index}>{textContent}</p>;
      }
      // Gérer d'autres types de blocs si nécessaire
      return null;
    });
  };

  // Fonction pour vérifier si le contenu Rich Text est vide
  const isRichTextEmpty = (richText) => {
    if (!Array.isArray(richText) || richText.length === 0) return true;

    return !richText.some(block => {
      if (block.type === 'paragraph') {
        return block.children.some(child => child.text && child.text.trim() !== '');
      }
      // Ajouter d'autres types de blocs si nécessaire
      return false;
    });
  };

  // Gestion de l'écran d'accueil avec BackgroundWrapper
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

  // URL de l'image (l'URL est complète dans votre cas)
  const imageUrl = caseAttributes.image?.data
    ? caseAttributes.image.data.attributes.url
    : null;

  // Déterminer si une explication est disponible
  const explanationContent =
    caseAttributes.explicationspecifique || pathology.description;

  const hasExplanationContent = !isRichTextEmpty(explanationContent);

  return (
    <div className="randomisation-component">
      <div className="content-container">
        {imageUrl ? (
          <div className="image-display">
            <img src={imageUrl} alt="Cas clinique" />
          </div>
        ) : (
          <div>Aucune image disponible pour ce cas.</div>
        )}
        <div className="text-content">
          <div className="image-counter">
            Image {currentIndex + 1}/{totalCases}
          </div>
          {caseAttributes.affichercontexte && caseAttributes.contexte && (
            <div className="clinical-context">
              <h3>Contexte Clinique :</h3>
              {renderRichTextContent(caseAttributes.contexte)}
            </div>
          )}
          {showAnswer ? (
            <div className="answer-section">
              <h3>Diagnostic :</h3>
              <p>{caseAttributes.diagnosticspecifique || pathology.diagnostic}</p>
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
              {hasExplanationContent && (
                <div className="explanation">
                  <h3>Explication :</h3>
                  {renderRichTextContent(explanationContent)}
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
  );
};

export default RandomisationComponent;
