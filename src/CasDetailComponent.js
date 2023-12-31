import React from 'react';
import { Image } from 'antd';
import ReactMarkdown from 'react-markdown';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails } from './CustomAccordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { server } from './config';

const CasDetailComponent = ({ selectedCas }) => {
  if (!selectedCas || !selectedCas.attributes) {
    return <div>Chargement du cas clinique, ou cas introuvable...</div>;
  }

  // Les corrections sont indexées de la même manière que les questions
  const corrections = selectedCas.attributes.correction;

  return (
    <>
      <h3>{selectedCas.attributes.titre}</h3>
      <Image
        width='50%'
        style={{ maxWidth: '50vw', maxHeight: '50vh', objectFit: 'contain' }}
        src={selectedCas.attributes.image ? `${server}${selectedCas.attributes.image.data.attributes.url}` : ''}
        preview={true}
      />
      <div style={{ margin: '20px 0' }}>
        <ReactMarkdown>{selectedCas.attributes.enonce}</ReactMarkdown>
      </div>
      {selectedCas.attributes.question.map((q, index) => (
        <CustomAccordion key={index}>
          <CustomAccordionSummary
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
            expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
          >
            <h6 style={{ margin: 0, padding: 0, fontFamily: 'Poppins', fontWeight: 700 }}>
              {q.question}
            </h6>
          </CustomAccordionSummary>
          <CustomAccordionDetails style={{ paddingBottom: '10px' }}>
            <div>
              {/* Utiliser l'index pour trouver la correction correspondante */}
              <ReactMarkdown>
                {corrections[index]?.correction || 'Pas de correction disponible.'}
              </ReactMarkdown>
            </div>
          </CustomAccordionDetails>
        </CustomAccordion>
      ))}
    </>
  );
};

export default CasDetailComponent;
