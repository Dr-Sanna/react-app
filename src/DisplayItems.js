import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { server } from './config';
import { CustomToothLoader } from './CustomToothLoader'; // Assurez-vous que le chemin d'importation est correct

const DisplayItems = ({ items, onClickItem }) => {
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  useEffect(() => {
    // Précharge toutes les images avant d'afficher les composants
    const imageUrls = items.map(item => item.attributes.image && item.attributes.image.data ? `${server}${item.attributes.image.data.attributes.url}` : null).filter(url => url !== null);
    Promise.all(imageUrls.map(url => new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = resolve;
      img.onerror = reject;
    }))).then(() => setIsLoading(false)); // Toutes les images sont chargées
  }, [items]);

  const getItemStyle = () => {
    if (isDesktop) {
      return { flex: '1 0 20%', maxWidth: '20%' };
    } else if (isTablet) {
      return { flex: '1 0 33%', maxWidth: '33%' };
    } else {
      return { flex: '1 0 50%', maxWidth: '50%' };
    }
  };

  if (isLoading) {
    return <CustomToothLoader />; // Affiche le loader pendant le chargement
  }

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
                <img
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

export default DisplayItems;
