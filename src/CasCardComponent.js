import React from 'react';
import MaterialCard from './MaterialCard';
import { server } from './config';

const CasCardComponent = ({ casCliniques, onSelection }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {casCliniques.map(cas => (
        <MaterialCard
          key={cas.id}
          title={cas.attributes.titre}
          image={cas.attributes.image ? `${server}${cas.attributes.image.data.attributes.url}` : ''}
          onClick={() => onSelection(cas)}
        />
      ))}
    </div>
  );
};

export default CasCardComponent;
