import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { server } from './config';

const DisplayItems = ({ items, onClickItem }) => {
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
              padding: '0 15px'
            }}
            key={item.id}
            onClick={() => onClickItem(item)}
          >
            <div className="circle-icon" style={{ position: 'relative', width: '100%', height: 'auto' }}>
              {item.attributes.image && item.attributes.image.data && (
                <ImageWithTransition
                  src={`${server}${item.attributes.image.data.attributes.url}`}
                  alt={item.attributes.titre}
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

// ImageWithTransition Component
const ImageWithTransition = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  
  const imageStyle = {
    transition: 'opacity 0.5s ease, filter 0.5s ease',
    filter: loaded ? 'blur(0)' : 'blur(8px)',
    opacity: loaded ? 1 : 0.5
  };

  return (
    <img
      src={src}
      alt={alt}
      style={imageStyle}
      onLoad={() => setLoaded(true)}
    />
  );
};

export default DisplayItems;
