import React from 'react';
import Accordion from './Accordion';
import CustomMarkdown from './CustomMarkdown';
import CoursPagination from './CoursPagination';

const QuestionsComponent = ({ testItems, title, prevItem, nextItem, onNavigatePrev, onNavigateNext }) => {
  const imgStyle = {
    maxHeight: '60vh',
    width: 'auto',
    marginBottom: 'var(--ifm-leading)',
  };

  return (
    <div className="markdown">
      <h1>{title}</h1>
      <h2>Questions</h2>
      {Array.isArray(testItems) && testItems.length > 0 ? (
        <>
          {testItems.map((item, index) => (
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
      <CoursPagination 
        prevItem={prevItem} 
        nextItem={nextItem}
        onNavigatePrev={onNavigatePrev}
        onNavigateNext={onNavigateNext}
      />
    </div>
  );
};

export default QuestionsComponent;
