import React from 'react';
import CustomAccordion from './CustomAccordion';
import CustomMarkdown from './CustomMarkdown';

const QuestionsComponent = ({ questions, corrections }) => {
  return (
    <div>
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
                />
              </div>
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
