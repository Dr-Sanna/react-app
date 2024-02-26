import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { server } from './config';

// ImageWithTransition Component
const ImageWithTransition = ({ src, alt, onLoad }) => {
  const [loaded, setLoaded] = useState(false);
  
  const imageStyle = {
    transition: 'opacity 0.5s ease, filter 0.5s ease',
    filter: loaded ? 'blur(0)' : 'blur(8px)',
    opacity: loaded ? 1 : 0.5
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoad(); // Appelle le callback onLoad passé en prop
  };

  return (
    <img
      src={src}
      alt={alt}
      style={imageStyle}
      onLoad={handleLoad}
    />
  );
};

// DisplayItems Component
const DisplayItems = ({ items, onClickItem }) => {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoaded = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  const getItemStyle = () => {
    if (isDesktop) {
      return { flex: '1 0 20%', maxWidth: '20%' };
    } else if (isTablet) {
      return { flex: '1 0 33%', maxWidth: '33%' };
    } else {
      return { flex: '1 0 50%', maxWidth: '50%' };
    }
  };

  return (
    <div style={{ padding: 0, margin: 0, maxWidth: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 0 }}>
        {items.map(item => (
          <div
            style={{
              ...getItemStyle(),
              textAlign: 'center',
              marginTop: '16px',
              boxSizing: 'border-box',
              padding: '0 15px',
              display: loadedImages[item.id] ? 'block' : 'none' // Affiche l'item uniquement si son image est chargée
            }}
            key={item.id}
            onClick={() => onClickItem(item)}
          >
            <div className="circle-icon" style={{ position: 'relative', width: '100%', height: 'auto' }}>
              {item.attributes.image && item.attributes.image.data && (
                <ImageWithTransition
                  src={`${server}${item.attributes.image.data.attributes.url}`}
                  alt={item.attributes.titre}
                  onLoad={() => handleImageLoaded(item.id)}
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

export default DisplayItems;
