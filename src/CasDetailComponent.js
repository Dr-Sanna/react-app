import React, { useState, useEffect } from 'react';
import { Image } from 'antd';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails } from './CustomAccordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { server } from './config';
import CustomListWithEmojis from './CustomListWithEmojis';

const CasDetailComponent = ({ selectedCas, onImageLoaded }) => {
  const [openAccordions, setOpenAccordions] = useState({});

  useEffect(() => {
    if (selectedCas && selectedCas.attributes && Array.isArray(selectedCas.attributes.question)) {
      const initialAccordionState = {};
      selectedCas.attributes.question.forEach((q, index) => {
        initialAccordionState[index] = false; // Tous les accordéons sont fermés par défaut
      });
      setOpenAccordions(initialAccordionState);
    } else {
      setOpenAccordions({});
    }
  }, [selectedCas]);

  if (!selectedCas || !selectedCas.attributes) {
    return <div>Chargement du cas clinique, ou cas introuvable...</div>;
  }

  const handleAccordionToggle = (accordionId) => {
    setOpenAccordions(prevState => ({
      ...prevState,
      [accordionId]: !prevState[accordionId]
    }));
  };

  const corrections = selectedCas.attributes.correction;

  return (
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
        onLoad={onImageLoaded}  // Appelé lorsque l'image est complètement chargée
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
  );
};

export default CasDetailComponent;
