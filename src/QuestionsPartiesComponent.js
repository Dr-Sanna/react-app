import React from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';
import PartiePagination from './PartiePagination';

const QuestionsPartiesComponent = ({ questions, corrections, title, prevPartie, nextPartie, onNavigatePartie, onNavigatePrev, parentCours }) => {
  const imgStyle = {
    maxHeight: '60vh',
    width: 'auto',
    marginBottom: 'var(--ifm-leading)',
  };

  return (
    <div className="markdown">
      <h1>{title}</h1>
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

export default QuestionsPartiesComponent;
