import React from 'react';
import CustomAccordion from './CustomAccordion';
import CustomMarkdown from './CustomMarkdown';
import { useToggle } from './ToggleContext';

const CoursDetailComponent = ({ selectedCas }) => {
  const { showQuestions } = useToggle(); // Déplacez l'appel du hook ici

  if (!selectedCas || !selectedCas.attributes) {
    return <div>Loading...</div>;
  }

  const corrections = selectedCas.attributes.correction;
  const questions = selectedCas.attributes.question;
  const enonce = selectedCas.attributes.enonce;
  const carouselImages = selectedCas.carousel; // Assurez-vous que ceci contient bien les images

  const imgStyle = {
    maxHeight: '60vh',
    width: 'auto'
  };

  return (
    <div className="markdown">
      <h1>{selectedCas.attributes.titre}</h1>
      {showQuestions ? (
        <>
          <h2>Questions</h2>
          {questions && questions.length > 0 ? (
            questions.map((q, index) => (
              <CustomAccordion 
                key={index}
                title={<p><strong>{q.question}</strong></p>} 
                content={
                  <div className="collapsibleContent_EoA1">
                    <CustomMarkdown 
                      markdownText={corrections[index]?.correction || 'Pas de correction disponible.'} 
                      imageStyle={imgStyle}
                    />
                  </div>
                }
              />
            ))
          ) : (
            <p>Pas de questions disponibles.</p>
          )}
        </>
      ) : (
        <CustomMarkdown 
          markdownText={enonce} 
          imageStyle={imgStyle} 
          carouselImages={carouselImages} // Passez les images du carrousel
        />
      )}
    </div>
  );
};

export default React.memo(CoursDetailComponent);
