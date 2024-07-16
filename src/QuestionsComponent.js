import React from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';

const QuestionsComponent = ({ courseQuestions, partQuestions, title, isPart }) => {
  const imgStyle = {
    maxHeight: '60vh',
    width: 'auto',
    marginBottom: 'var(--ifm-leading)',
  };

  const questions = isPart ? partQuestions : courseQuestions;

  return (
    <>
      <h2>Questions</h2>
      {Array.isArray(questions) && questions.length > 0 ? (
        <>
          {questions.map((item, index) => (
            <Accordion
              key={index}
              title={<p><strong>{item.question}</strong></p>}
              content={
                <CustomMarkdown
                  markdownText={item.correction || 'Pas de correction disponible.'}
                  imageStyle={imgStyle}
                />
              }
            />
          ))}
        </>
      ) : (
        <p>Pas de questions disponibles.</p>
      )}
    </>
  );
};

export default QuestionsComponent;
