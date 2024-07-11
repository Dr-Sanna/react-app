import React from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';

const QuestionsPartiesComponent = ({ questions, corrections, title }) => {
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
    </div>
  );
};

export default QuestionsPartiesComponent;
