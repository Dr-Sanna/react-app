import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardMedia, Skeleton } from '@mui/material';
import styled from 'styled-components';
import { server } from './config';
import { useLocation } from 'react-router-dom';

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
    grid-template-columns: repeat(4, 1fr);
  }

  > div {
    margin: 0 auto;
  }
`;

const CasCardComponent = ({ casCliniques, isLoading, onSelection }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const matiere = pathSegments[0];
  const sousMatiere = pathSegments[1];

  const [imageLoadedStates, setImageLoadedStates] = useState(
    new Array(casCliniques.length).fill(false)
  );

  const handleImageLoad = (index) => {
    setImageLoadedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = true;
      return newStates;
    });
  };

  return (
    <CasCardContainer style={{ backgroundColor: isLoading ? 'violet' : 'transparent' }}>
      {isLoading ? (
        Array.from(new Array(8)).map((_, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Skeleton variant="rectangular" width="100%" height={0} style={{ paddingTop: '75%' }} />
            <Skeleton variant="text" width="60%" height={30} style={{ margin: '10px auto' }} />
          </div>
        ))
      ) : (
        casCliniques.map((cas, index) => {
          const imageUrl = cas?.attributes?.image?.data?.attributes?.url
            ? `${server}${cas.attributes.image.data.attributes.url}`
            : '/defaultImage.jpg';
          const urlPourPrevisualisation = `/${matiere}/${sousMatiere}/${cas.urlFriendlyTitre}`;

          return (
            <div key={cas.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
                <a href={urlPourPrevisualisation} onClick={(e) => { e.preventDefault(); onSelection(cas); }}>
                  <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '0',
                    paddingTop: '75%',
                    position: 'relative',
                    bgcolor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2), 0 3px 4px -2px rgba(0,0,0,0.2)'
                  }}>
                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      animate={{ opacity: imageLoadedStates[index] ? 1 : 0, filter: imageLoadedStates[index] ? 'blur(0px)' : 'blur(10px)' }}
                      transition={{ duration: 0.5 }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    >
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={cas?.attributes?.titre || 'Titre inconnu'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                        onLoad={() => handleImageLoad(index)}
                      />
                    </motion.div>
                    <CardContent style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      height: '60px',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px',
                    }}>
                      <h6 style={{
                        margin: '0',
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'normal',
                      }}>
                        {cas?.attributes?.titre || 'Titre inconnu'}
                      </h6>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            </div>
          );
        })
      )}
    </CasCardContainer>
  );
};

export default React.memo(CasCardComponent);
