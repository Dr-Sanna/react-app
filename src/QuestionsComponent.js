import React, { useRef, useEffect } from 'react';
import CustomAccordion from './CustomAccordion';
import CustomMarkdown from './CustomMarkdown';

const QuestionsComponent = ({ questions, corrections }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const cleanUp = () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('p, li');
        elements.forEach((el) => {
          const newElement = el.cloneNode(true);
          el.replaceWith(newElement);
        });
      }
    };

    cleanUp(); // Clean up on component mount

    return cleanUp; // Clean up on component unmount
  }, [questions]);

  return (
    <div ref={contentRef}>
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
