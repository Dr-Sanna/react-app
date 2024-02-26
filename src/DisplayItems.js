import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { server } from './config';
import { CustomToothLoader } from './CustomToothLoader'; // Assurez-vous que le chemin d'importation est correct

const DisplayItems = ({ items, onClickItem }) => {
  const [allLoaded, setAllLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  useEffect(() => {
    let imagesLoaded = 0;
    const loadingTimeout = setTimeout(() => setShowLoader(true), 300); // Délai avant d'afficher le loader

    items.forEach(item => {
      const img = new Image();
      img.src = `${server}${item.attributes.image.data.attributes.url}`;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === items.length) {
          clearTimeout(loadingTimeout); // Annule l'affichage du loader si le chargement est rapide
          setShowLoader(false); // Assurez-vous de masquer le loader
          setAllLoaded(true); // Tout est chargé, on peut afficher le contenu
        }
      };
    });
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

  if (!allLoaded && showLoader) {
    return <CustomToothLoader />; // Affiche le loader uniquement si showLoader est vrai
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

