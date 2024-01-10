import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails } from './CustomAccordion';
import { server } from './config';
import CustomListWithEmojis from './CustomListWithEmojis';
import { preloadImage } from './utils'; // Assurez-vous que preloadImage est défini dans utils.js
import { motion } from 'framer-motion';

const CasDetailComponent = ({ selectedCas }) => {
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    const initializeContent = async () => {
      setIsContentReady(false);

      if (selectedCas && selectedCas.attributes) {
        const imageUrl = selectedCas.attributes.image ? `${server}${selectedCas.attributes.image.data.attributes.url}` : '';
        await preloadImage(imageUrl); // Preload the image
      }

      setIsContentReady(true);
    };

    initializeContent();
  }, [selectedCas]);

  if (!isContentReady) {
    return <div>Chargement...</div>; // Vous pouvez mettre ici un loader plus élaboré si vous le souhaitez
  }

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
        <Image
          width='50%'
          style={{ maxWidth: '50vw', maxHeight: '50vh', objectFit: 'contain' }}
          src={selectedCas.attributes.image ? `${server}${selectedCas.attributes.image.data.attributes.url}` : ''}
          preview={true}
        />
        <div style={{ margin: '20px 0' }}></div>
        
        <h2>Questions</h2>
        {selectedCas.attributes.question.map((q, index) => (
          <CustomAccordion key={index}>
            <CustomAccordionSummary>
              <p>{q.question}</p>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <div>
                <CustomListWithEmojis markdownText={corrections[index]?.correction || 'Pas de correction disponible.'} />
              </div>
            </CustomAccordionDetails>
          </CustomAccordion>
        ))}
      </div>
    </motion.div>
  );
}

export default React.memo(CasDetailComponent);
