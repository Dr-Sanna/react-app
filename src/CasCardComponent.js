import React from 'react';
import MaterialCard from './MaterialCard';
import { server } from './config';
import styled from 'styled-components';

const CasCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  
  padding-top: 8px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);  // 4 cartes par ligne
  }
  > div {
    max-width: 280px;  // Largeur maximale pour les cartes
    margin: 0 auto;  // Centre les cartes dans leurs cellules de grille
  }
`;

const CasCardComponent = ({ casCliniques, onSelection }) => {
  return (
    <CasCardContainer>
      {casCliniques.map(cas => {
        const imageUrl = cas?.attributes?.image?.data?.attributes?.url
          ? `${server}${cas.attributes.image.data.attributes.url}`
          : '/defaultImage.jpg';

        return (
          <div key={cas.id} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
          }}>
            <MaterialCard
              title={cas?.attributes?.titre || 'Titre inconnu'}
              imageUrl={imageUrl}
              onClick={() => onSelection(cas)}
            />
          </div>
        );
      })}
    </CasCardContainer>
  );
};

export default React.memo(CasCardComponent);
