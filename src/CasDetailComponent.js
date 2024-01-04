import React, { useState, useEffect } from 'react';
import { Image } from 'antd';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails } from './CustomAccordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { server } from './config';
import CustomListWithEmojis from './CustomListWithEmojis';
import { preloadImage } from './utils'; // Assurez-vous que preloadImage est défini dans utils.js
import { motion } from 'framer-motion';

const CasDetailComponent = ({ selectedCas }) => {
  const [openAccordions, setOpenAccordions] = useState({});
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    const initializeContent = async () => {
      setIsContentReady(false);

      if (selectedCas && selectedCas.attributes) {
        const imageUrl = selectedCas.attributes.image ? `${server}${selectedCas.attributes.image.data.attributes.url}` : '';
        await preloadImage(imageUrl); // Preload the image

        // Initialize the accordions based on the questions
        if (selectedCas.attributes && Array.isArray(selectedCas.attributes.question)) {
          const initialAccordionState = {};
          selectedCas.attributes.question.forEach((q, index) => {
            initialAccordionState[index] = false; // All accordions are closed by default
          });
          setOpenAccordions(initialAccordionState);
        } else {
          setOpenAccordions({});
        }
      }

      setIsContentReady(true);
    };

    initializeContent();
  }, [selectedCas]);

  if (!isContentReady) {
    return <div></div>; //loader
  }

  const handleAccordionToggle = (accordionId) => {
    setOpenAccordions(prevState => ({
      ...prevState,
      [accordionId]: !prevState[accordionId]
    }));
  };
  
  const corrections = selectedCas.attributes.correction;

  return (
    <motion.div 
    key={selectedCas.id}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.5 }}
>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2), 0 3px 4px -2px rgba(0,0,0,0.2)',
      maxWidth: '1000px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <h3>{selectedCas.attributes.titre}</h3>
      <Image
  width='50%'
  style={{ maxWidth: '50vw', maxHeight: '50vh', objectFit: 'contain' }}
  src={selectedCas.attributes.image ? `${server}${selectedCas.attributes.image.data.attributes.url}` : ''}
  preview={true}
/>
      <div style={{ margin: '20px 0' }}>
        <CustomListWithEmojis markdownText={selectedCas.attributes.enonce} />
      </div>
      {selectedCas.attributes.question.map((q, index) => (
        <CustomAccordion 
          key={index}
          expanded={openAccordions[index] ?? false}
          onChange={() => handleAccordionToggle(index)}
        >
          <CustomAccordionSummary
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
            expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
          >
            <h6 style={{ margin: 0, padding: 0, fontFamily: 'Poppins', fontWeight: 700 }}>
              {q.question}
            </h6>
          </CustomAccordionSummary>
          <CustomAccordionDetails style={{ paddingBottom: '16px' }}>
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

export default CasDetailComponent;
