import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';
import styled from 'styled-components';
import { server } from './config';
import { useLocation } from 'react-router-dom';
import { CustomToothLoader } from './CustomToothLoader';
import './CasCardComponent.css'; // Import the CSS for opacity

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

const CasCardComponent = ({ casCliniques, onSelection }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const matiere = pathSegments[0];
  const sousMatiere = pathSegments[1];

  const [imageLoadedStates, setImageLoadedStates] = useState(
    new Array(casCliniques.length).fill(false)
  );
  const [imageDisplayedStates, setImageDisplayedStates] = useState(
    new Array(casCliniques.length).fill(false)
  );
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const observerRef = useRef(null);

  useEffect(() => {
    if (imageLoadedStates.every(state => state) && imageDisplayedStates.every(state => state)) {
      // Add a delay of 1 second before hiding the loader
      setTimeout(() => {
        setAllImagesLoaded(true);
        sessionStorage.setItem('allImagesLoaded', 'true');
      }, 1000); // 1 second delay
    }
  }, [imageLoadedStates, imageDisplayedStates]);

  useEffect(() => {
    const loaded = sessionStorage.getItem('allImagesLoaded') === 'true';
    if (loaded) {
      setAllImagesLoaded(true);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('image-loaded')) {
          const index = Number(entry.target.dataset.index);
          setImageDisplayedStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = true;
            return newStates;
          });
          observerRef.current.unobserve(entry.target);
        }
      });
    }, { threshold: 1.0 }); // Ensure the image is fully in view

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleImageLoad = (index) => {
    setImageLoadedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = true;
      return newStates;
    });
  };

  const registerImageRef = (index, node) => {
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  };

  return (
    <div>
      {!allImagesLoaded && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CustomToothLoader />
        </div>
      )}
      <CasCardContainer className={!allImagesLoaded ? 'hidden' : ''}>
        {casCliniques.map((cas, index) => {
          const imageUrl = cas?.attributes?.image?.data?.attributes?.url
            ? `${server}${cas.attributes.image.data.attributes.url}`
            : '/defaultImage.jpg';
          const urlPourPrevisualisation = `/${matiere}/${sousMatiere}/${cas.urlFriendlyTitre}`;

          return (
            <div key={cas.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
                  <div
                    className={imageLoadedStates[index] ? 'image-loaded' : 'image-loading'}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  >
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={cas?.attributes?.titre || 'Titre inconnu'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                      onLoad={() => handleImageLoad(index)}
                      data-index={index}
                      ref={node => registerImageRef(index, node)}
                      onTransitionEnd={(e) => {
                        // Ensure the image has fully transitioned
                        if (e.target && e.target.classList.contains('image-loaded')) {
                          setImageDisplayedStates(prevStates => {
                            const newStates = [...prevStates];
                            newStates[index] = true;
                            return newStates;
                          });
                        }
                      }}
                    />
                  </div>
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
            </div>
          );
        })}
      </CasCardContainer>
    </div>
  );
};

export default React.memo(CasCardComponent);
