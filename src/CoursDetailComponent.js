import React, { useRef, useEffect, useState } from 'react';
import CustomMarkdown from './CustomMarkdown';
import VoiceReader from './VoiceReader';

const CoursDetailComponent = ({ selectedCas }) => {
  const contentRef = useRef(null);
  const [showVoiceReader, setShowVoiceReader] = useState(false);

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
      <button onClick={() => setShowVoiceReader(!showVoiceReader)}>
        {showVoiceReader ? 'Hide Voice Reader' : 'Show Voice Reader'}
      </button>
      {showVoiceReader && <VoiceReader contentRef={contentRef} />}
      <div ref={contentRef}>
        <CustomMarkdown
          markdownText={enonce}
          imageStyle={imgStyle}
          carouselImages={carouselImages}
        />
      </div>
    </div>
  );
};

export default React.memo(CoursDetailComponent);
