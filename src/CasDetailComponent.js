import React, { useState, useEffect } from 'react';
import CustomAccordion from './CustomAccordion';
import CustomMarkdown from './CustomMarkdown';

const CasDetailComponent = ({ selectedCas }) => {
  const corrections = selectedCas.attributes.correction;
  const questions = selectedCas.attributes.question;

  const imgStyle = {
    maxHeight: '60vh', // 3/4 de la hauteur de l'écran
    width: 'auto', // Pour conserver le ratio d'aspect
    marginBottom: 'var(--ifm-leading)'
  };

  // État local pour garder la trace des accordéons ouverts
  const [openAccordions, setOpenAccordions] = useState([]);

  // Réinitialiser l'état lorsque le cas clinique change
  useEffect(() => {
    setOpenAccordions([]);
  }, [selectedCas]);

  const toggleAccordion = (index) => {
    setOpenAccordions((prevOpenAccordions) => {
      const newOpenAccordions = [...prevOpenAccordions];
      if (newOpenAccordions.includes(index)) {
        newOpenAccordions.splice(newOpenAccordions.indexOf(index), 1);
      } else {
        newOpenAccordions.push(index);
      }
      return newOpenAccordions;
    });
  };

  return (
    <div className="markdown">
      <h1>{selectedCas.attributes.titre}</h1>
      <CustomMarkdown markdownText={selectedCas.attributes.enonce} imageStyle={imgStyle} />
      <div style={{ margin: '20px 0' }}></div>
      
      {questions && questions.length > 0 && (
        <>
          <h2>Questions</h2>
          {questions.map((q, index) => (
            <CustomAccordion 
              key={index}
              isOpen={openAccordions.includes(index)}
              title={<p><strong>{q.question}</strong></p>}
              onToggle={() => toggleAccordion(index)}
              content={
                <CustomMarkdown 
                  markdownText={corrections[index]?.correction || 'Pas de correction disponible.'} 
                  imageStyle={imgStyle}
                />
              }
            />
          ))}
        </>
      )}
    </div>
  );
}

export default React.memo(CasDetailComponent);
