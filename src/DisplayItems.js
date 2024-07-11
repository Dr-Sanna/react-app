import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { CustomToothLoader } from './CustomToothLoader'; // Assurez-vous que le chemin d'importation est correct

const DisplayItems = ({ items, onClickItem }) => {
  const [contentReady, setContentReady] = useState(false); // Nouvel état pour gérer la disponibilité du contenu
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  useEffect(() => {
    if (!items || items.length === 0) {
      setContentReady(false);
      return;
    }

    let imagesLoaded = 0;

    items.forEach(item => {
      if (item.attributes.image && item.attributes.image.data) {
        const imageUrl = item.attributes.image.data.attributes.url;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === items.length) {
            setContentReady(true); // Indique que le contenu est prêt à être affiché
          }
        };
        img.onerror = () => {
          imagesLoaded++;
          if (imagesLoaded === items.length) {
            setContentReady(true); // Indique que le contenu est prêt à être affiché même si certaines images ne sont pas chargées
          }
        };
      } else {
        imagesLoaded++;
        if (imagesLoaded === items.length) {
          setContentReady(true); // Indique que le contenu est prêt à être affiché
        }
      }
    });
  }, [items]);

  // Trier les matières en fonction de la propriété 'order'
  const sortedItems = items.sort((a, b) => a.attributes.order - b.attributes.order);

  const getItemStyle = () => {
    if (isDesktop) {
      return { flex: '1 0 20%', maxWidth: '20%' };
    } else if (isTablet) {
      return { flex: '1 0 33%', maxWidth: '33%' };
    } else {
      return { flex: '1 0 50%', maxWidth: '50%' };
    }
  };

  // Condition pour gérer l'affichage du loader ou du contenu
  if (!contentReady) {
    return <CustomToothLoader />; // Affiche le loader jusqu'à ce que tout le contenu soit prêt
  }

  return (
    <div style={{ padding: '15px 60px', margin: 0, maxWidth: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 0 }}>
        {sortedItems.map(item => (
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
                  src={item.attributes.image.data.attributes.url}
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
