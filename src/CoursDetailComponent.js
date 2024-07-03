import React from 'react';
import CustomAccordion from './CustomAccordion';
import CustomMarkdown from './CustomMarkdown';
import { useToggle } from './ToggleContext';
import { server } from './config'; // Importez la variable server

const CoursDetailComponent = ({ selectedCas }) => {
  const { showQuestions } = useToggle();

  if (!selectedCas || !selectedCas.attributes) {
    return <div>Loading...</div>;
  }

  const corrections = selectedCas.attributes.correction;
  const questions = selectedCas.attributes.question;
  const enonce = selectedCas.attributes.enonce;
  
  // Extraire les URLs des images de carousel
  const carouselImages = selectedCas.attributes.Carousel?.data?.map(image => ({
    url: `${server}${image.attributes.url}`, // Ajoutez server ici
    caption: image.attributes.caption,
  })) || [];

  console.log('Carousel Images:', carouselImages); // Vérifiez les URLs des images du carousel

  const imgStyle = {
    maxHeight: '60vh',
    width: 'auto', // Pour conserver le ratio d'aspect
    marginBottom: 'var(--ifm-leading)'
  };

  return (
    <div className="markdown">
      <h1>{selectedCas.attributes.titre}</h1>
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
          carouselImages={carouselImages} // Passez les images du carrousel
        />
      )}
    </div>
  );
};

export default React.memo(CoursDetailComponent);
