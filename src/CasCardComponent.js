// CasCardComponent.js
import React from 'react';
import MaterialCard from './MaterialCard';
import { server } from './config';
import { motion } from 'framer-motion'; // Assurez-vous d'importer motion de Framer Motion

const CasCardComponent = ({ casCliniques, onSelection }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {casCliniques.map(cas => (
        <motion.div 
          key={cas.id} 
          layoutId={`card-container-${cas.id}`} // Attribuer une layoutId unique
          initial={{ opacity: 0 }} // Vous pouvez personnaliser cette animation
          animate={{ opacity: 1 }} // Vous pouvez personnaliser cette animation
          exit={{ opacity: 0 }} // Vous pouvez personnaliser cette animation
        >
          <MaterialCard
            title={cas.attributes.titre}
            image={cas.attributes.image ? `${server}${cas.attributes.image.data.attributes.url}` : ''}
            onClick={() => onSelection(cas)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default CasCardComponent;
