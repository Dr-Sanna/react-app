import React, { useState, useEffect } from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';

const CasDetailComponent = ({ selectedCas }) => {
  const corrections = selectedCas.attributes.correction;
  const questions = selectedCas.attributes.question;

  const imgStyle = {
    maxHeight: '60vh', // 3/4 de la hauteur de l'écran
    width: 'auto', // Pour conserver le ratio d'aspect
    marginBottom: 'var(--ifm-leading)',
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
            <Accordion 
              key={index}
              selectedCas={selectedCas}
              title={<p><strong>{q.question}</strong></p>}
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
