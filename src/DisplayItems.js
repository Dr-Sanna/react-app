import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { server } from './config';
import { CustomToothLoader } from './CustomToothLoader'; // Assurez-vous que le chemin d'importation est correct

const DisplayItems = ({ items, onClickItem }) => {
  const [contentReady, setContentReady] = useState(false); // Nouvel état pour gérer la disponibilité du contenu
  const [showLoader, setShowLoader] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  useEffect(() => {
    let imagesLoaded = 0;
    const loadingTimeout = setTimeout(() => {
      setShowLoader(true); // Affiche le loader si le contenu n'est pas chargé rapidement
    }, 300); // Délai avant d'afficher le loader

    items.forEach(item => {
      const img = new Image();
      img.src = `${server}${item.attributes.image.data.attributes.url}`;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === items.length) {
          clearTimeout(loadingTimeout); // Annule l'affichage du loader si le chargement est rapide
          setShowLoader(false); // Assurez-vous de masquer le loader
          setContentReady(true); // Indique que le contenu est prêt à être affiché
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

  // Condition pour gérer l'affichage du loader ou du contenu
  if (!contentReady) {
    if (showLoader) {
      return <CustomToothLoader />; // Affiche le loader si déterminé nécessaire
    }
    return null; // Ne rien afficher pendant l'attente, évite l'affichage fugace du texte
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