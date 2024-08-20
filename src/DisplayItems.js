import React from 'react';
import { useMediaQuery } from 'react-responsive';

const DisplayItems = ({ items, onClickItem, isMatiere, sousMatiereTitle }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  const sortedItems = items.sort((a, b) => a.attributes.order - b.attributes.order);

  const getItemStyle = () => {
    if (isDesktop) {
      return { flex: '1 0 18%', maxWidth: '18%' };
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
        <h1 style={{  marginBottom: '20px' }}>
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
              borderRadius: '5px',
              width: '180px',
              height: '180px',
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
                height: '120px',
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
