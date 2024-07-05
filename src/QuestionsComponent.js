import React from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';

const QuestionsComponent = ({ questions, corrections, title }) => {
  const imgStyle = {
    maxHeight: '60vh', // 3/4 de la hauteur de l'écran
    width: 'auto', // Pour conserver le ratio d'aspect
    marginBottom: 'var(--ifm-leading)',
  };

  return (
    <div className="markdown">
      <h1>{title}</h1> {/* Ajout du titre h1 */}
      <h2>Questions</h2>
      {questions && questions.length > 0 ? (
        questions.map((q, index) => (
          <Accordion
            key={index}
            title={<p><strong>{q.question}</strong></p>}
            content={
              <CustomMarkdown
                markdownText={corrections[index]?.correction || 'Pas de correction disponible.'}
                imageStyle={imgStyle}
              />
            }
          />
        ))
      ) : (
        <p>Pas de questions disponibles.</p>
      )}
    </div>
  );
};

export default QuestionsComponent;
