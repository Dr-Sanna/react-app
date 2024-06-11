import React from 'react';
import CustomAccordion from './CustomAccordion';
import CustomMarkdown from './CustomMarkdown';
import { motion } from 'framer-motion';

const CasDetailComponent = ({ selectedCas }) => {
  const corrections = selectedCas.attributes.correction;
  const questions = selectedCas.attributes.question;

  const imgStyle = {
    maxHeight: '60vh', // 3/4 de la hauteur de l'écran
    width: 'auto' // Pour conserver le ratio d'aspect
  };

  return (
    <motion.div 
      key={selectedCas.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.5 }}
    >
      <div className="markdown">
        <h1>{selectedCas.attributes.titre}</h1>
        <CustomMarkdown markdownText={selectedCas.attributes.enonce} imageStyle={imgStyle} />
        <div style={{ margin: '20px 0' }}></div>
        
        {/* Affichez "Questions" uniquement si il y a des questions */}
        {questions && questions.length > 0 && (
          <>
            <h2>Questions</h2>
            {questions.map((q, index) => (
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
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default React.memo(CasDetailComponent);
