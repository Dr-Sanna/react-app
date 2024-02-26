import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { server } from './config';

const DisplayItems = ({ items, onClickItem }) => {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  useEffect(() => {
    if (loadedCount === items.length) {
      setTimeout(() => setAllImagesLoaded(true), 100); // Un petit délai pour s'assurer que tout est prêt
    }
  }, [loadedCount, items.length]);

  const getItemStyle = () => {
    if (isDesktop) {
      return { flex: '1 0 20%', maxWidth: '20%' };
    } else if (isTablet) {
      return { flex: '1 0 33%', maxWidth: '33%' };
    } else {
      return { flex: '1 0 50%', maxWidth: '50%' };
    }
  };

  const containerStyle = {
    padding: 0,
    margin: 0,
    maxWidth: '100%',
    opacity: allImagesLoaded ? 1 : 0,
    transition: 'opacity 1s ease',
    visibility: allImagesLoaded ? 'visible' : 'hidden', // Ajout pour contrôler la visibilité
  };

  const handleImageLoaded = () => {
    setLoadedCount((count) => count + 1);
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 0 }}>
        {items.map(item => (
          <div
            style={{
              ...getItemStyle(),
              textAlign: 'center',
              marginTop: '16px',
              boxSizing: 'border-box',
              padding: '0 15px',
            }}
            key={item.id}
            onClick={() => onClickItem(item)}
          >
            <div className="circle-icon" style={{ position: 'relative', width: '100%', height: 'auto' }}>
              {item.attributes.image && item.attributes.image.data && (
                <ImageWithTransition
                  src={`${server}${item.attributes.image.data.attributes.url}`}
                  alt={item.attributes.titre}
                  onLoad={handleImageLoaded}
                />
              )}
            </div>
            <p>{item.attributes.titre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageWithTransition = ({ src, alt, onLoad }) => {
  return (
    <img
      src={src}
      alt={alt}
      onLoad={onLoad}
      style={{
        transition: 'opacity 0.5s ease, filter 0.5s ease',
        opacity: 1,
        filter: 'blur(0)',
      }}
    />
  );
};

export default DisplayItems;
