import React from 'react';
import { useMediaQuery } from 'react-responsive';

const DisplayItems = ({ items, onClickItem, isMatiere, sousMatiereTitle }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  // Filtrer les éléments dont l'ordre est différent de 0 avant de les trier
  const sortedItems = items
    .filter(item => item.attributes.order !== 0) // Masquer les items avec un ordre de 0
    .sort((a, b) => a.attributes.order - b.attributes.order);

  const getItemStyle = () => {
    if (isDesktop) {
      return { flex: '1 0 19%', maxWidth: '19%' };
    } else if (isTablet) {
      return { flex: '1 0 33%', maxWidth: '33%' };
    } else {
      return { flex: '1 0 50%', maxWidth: '50%' };
    }
  };

  return (
    <div className="item-menu-container">
      {/* Titre de la sous-matière */}
      {sousMatiereTitle && (
        <h1 style={{ marginBottom: '20px' }}>
          {sousMatiereTitle}
        </h1>
      )}
      
      <div
        className={`quadrillage-${isMatiere ? 'matiere' : 'sous-matiere'}`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {sortedItems.map(item => (
          <div
            className={`item-menu-${isMatiere ? 'matiere' : 'sous-matiere'}`}
            style={{
              ...getItemStyle(),
              textAlign: 'center',
              boxSizing: 'border-box',
              padding: '0px',
              borderRadius: '20px',
              margin: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            key={item.id}
            onClick={() => onClickItem(item)}
          >
            <div
              className={`image-menu-${isMatiere ? 'matiere' : 'sous-matiere'}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
              className={`text-menu-${isMatiere ? 'matiere' : 'sous-matiere'}`}
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <p>
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

