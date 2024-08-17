import React from 'react';
import { useMediaQuery } from 'react-responsive';

const DisplayItems = ({ items, onClickItem }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

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

  return (
    <div 
    className="item-menu-container">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '-10px 0', // Assure un espacement uniforme
        }}
      >
        {sortedItems.map(item => (
          <div
          className="item-menu"
            style={{
              ...getItemStyle(),
              textAlign: 'center',
              margin: '10px', // Espacement entre les cases
              boxSizing: 'border-box',
              padding: '0px',
              borderRadius: '5px',
              width: '180px', // Taille fixe des cases
              height: '180px', // Hauteur fixe des cases
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between', // Espace entre l'image et le texte
            }}
            key={item.id}
            onClick={() => onClickItem(item)}
          >
            <div
              className="image-menu"
              style={{
                width: '100%',
                height: '130px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
              }}
            >
              {item.attributes.image && item.attributes.image.data && (
                <img
                  src={item.attributes.image.data.attributes.url}
                  alt={item.attributes.titre}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                  }}
                />
              )}
            </div>
            <div
              className="text-menu"
              style={{
                flex: 1, // Assure que le texte prend l'espace restant
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1.1',
                
              }}
            >
              <p style={{ margin: 0 }}>
                {item.attributes.titre}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  
};

export default DisplayItems;
