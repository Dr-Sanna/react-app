import React from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';

const CasDetailComponent = ({ selectedCas }) => {
  if (!selectedCas || !selectedCas.attributes || !selectedCas.attributes.test) {
    return <div>Aucun cas clinique sélectionné.</div>;
  }

  const { test } = selectedCas.attributes;
  const corrections = test.test.map(t => t.correction);
  const questions = test.test.map(t => t.question);

  const imgStyle = {
    maxHeight: '60vh', // 3/4 de la hauteur de l'écran
    width: 'auto', // Pour conserver le ratio d'aspect
    marginBottom: 'var(--ifm-leading)',
  };

  return (
    <div className="markdown">
      <h1>{test.titre}</h1>
      <CustomMarkdown markdownText={test.enonce} imageStyle={imgStyle} />
      <div style={{ margin: '20px 0' }}></div>
      
      {questions && questions.length > 0 && (
        <>
          <h3>Questions</h3>
          {questions.map((q, index) => (
            <Accordion 
              key={index}
              selectedCas={selectedCas}
              title={<p><strong>{q}</strong></p>}
              content={
                <CustomMarkdown 
                  markdownText={corrections[index] || 'Pas de correction disponible.'} 
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
