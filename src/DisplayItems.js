import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { server } from './config';

const DisplayItems = ({ items, onClickItem }) => {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  useEffect(() => {
    const imageSources = items.map(item => `${server}${item.attributes.image.data.attributes.url}`);
    preloadImages(imageSources).then(() => setAllImagesLoaded(true));
  }, [items]);

  const preloadImages = (srcArray) => {
    return Promise.all(srcArray.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    }));
  };

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
    transition: allImagesLoaded ? 'opacity 1s ease' : 'none',
    visibility: allImagesLoaded ? 'visible' : 'hidden',
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
                <img
                  src={`${server}${item.attributes.image.data.attributes.url}`}
                  alt={item.attributes.titre}
                  style={{
                    opacity: 1,
                    transition: 'opacity 0.5s ease, filter 0.5s ease',
                    filter: 'blur(0)',
                  }}
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
