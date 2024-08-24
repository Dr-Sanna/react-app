import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toUrlFriendly } from './config';
import { useLocation } from 'react-router-dom';
import './CasCardComponent.css'; // Assurez-vous que ce fichier existe

const CasCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  column-gap: 16px;
  row-gap: 16px;  /* Espace entre les colonnes */


  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  > div {
    margin: 0 auto;
  }
`;

const CasCardComponent = ({ items = [], onSelection }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const matiere = pathSegments[0];
  const sousMatiere = pathSegments[1];

  const [imageLoadedStates, setImageLoadedStates] = useState(
    new Array(items.length).fill(false)
  );

  useEffect(() => {
    console.log('Items:', items); // Debugging line
  }, [items]);

  const handleImageLoad = (index) => {
    setImageLoadedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = true;
      return newStates;
    });
  };

  return (
    <div>
      <CasCardContainer>
        {items.map((item, index) => {
          console.log('Rendering item:', item); // Debugging line
          const imageUrl = item?.attributes?.test?.image?.data?.attributes?.url
            ? item.attributes.test.image.data.attributes.url
            : 'https://res.cloudinary.com/dvxgbyc6k/image/upload/v1720714800/pas_d_image_2b57135506.svg';
          const urlPourPrevisualisation = `/${matiere}/${sousMatiere}/${toUrlFriendly(item.attributes.test.titre)}`;

          return (
            <div
              key={item.id}
              className="cas-card-container"
              style={{ opacity: imageLoadedStates[index] ? 1 : 0 }}
            >
              <a href={urlPourPrevisualisation} onClick={(e) => { e.preventDefault(); onSelection(item); }}>
                <div className="cas-card">
                  <div
                    className={`image-container ${imageLoadedStates[index] ? 'image-loaded' : 'image-loading'}`}
                  >
                    <img
                      src={imageUrl}
                      alt={item?.attributes?.test?.titre || 'Titre inconnu'}
                      onLoad={() => handleImageLoad(index)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-content">
                    <h5>{item?.attributes?.test?.titre || 'Titre inconnu'}</h5>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </CasCardContainer>
    </div>
  );
};

export default React.memo(CasCardComponent);
