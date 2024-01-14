import React from 'react';
import CustomAccordion from './CustomAccordion'; // Mise à jour de l'importation
import CustomListWithEmojis from './CustomListWithEmojis';
import { motion } from 'framer-motion';
import ModalImage from "react-modal-image";

const CasDetailComponent = ({ selectedCas, imageUrl }) => {
  const corrections = selectedCas.attributes.correction;

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
        <CustomListWithEmojis markdownText={selectedCas.attributes.enonce} />
        {imageUrl && (
          <ModalImage
            small={imageUrl}
            large={imageUrl}
            alt={"Cas Image"}
          />
          )}
        <div style={{ margin: '20px 0' }}></div>
        
        <h2>Questions</h2>
        {selectedCas.attributes.question.map((q, index) => (
          <CustomAccordion 
            key={index}
            title={<p>{q.question}</p>} 
            content={
              <div className="collapsibleContent_EoA1">
                <CustomListWithEmojis markdownText={corrections[index]?.correction || 'Pas de correction disponible.'} />
              </div>
            }
          />
        ))}
      </div>
    </motion.div>
  );
}

export default React.memo(CasDetailComponent);
