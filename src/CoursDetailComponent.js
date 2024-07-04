import React, { useRef, useEffect } from 'react';
import CustomAccordion from './CustomAccordion';
import CustomMarkdown from './CustomMarkdown';
import { useToggle } from './ToggleContext';
import VoiceReader from './VoiceReader';

const CoursDetailComponent = ({ selectedCas }) => {
  const { showQuestions, showVoiceReader } = useToggle();
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
  }, [selectedCas]);

  if (!selectedCas || !selectedCas.attributes) {
    return <div>Loading...</div>;
  }

  const corrections = selectedCas.attributes.correction;
  const questions = selectedCas.attributes.question;
  const enonce = selectedCas.attributes.enonce;
  const carouselImages = selectedCas.attributes.carousel;

  const imgStyle = {
    maxHeight: '60vh',
    width: 'auto',
    marginBottom: 'var(--ifm-leading)',
  };

  return (
    <div className="markdown">
      <h1>{selectedCas.attributes.titre}</h1>
      {showVoiceReader && <VoiceReader contentRef={contentRef} />}
      <div ref={contentRef}>
        {showQuestions ? (
          <>
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
                        imageStyle={imgStyle}
                      />
                    </div>
                  }
                />
              ))
            ) : (
              <p>Pas de questions disponibles.</p>
            )}
          </>
        ) : (
          <CustomMarkdown
            markdownText={enonce}
            imageStyle={imgStyle}
            carouselImages={carouselImages}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(CoursDetailComponent);
