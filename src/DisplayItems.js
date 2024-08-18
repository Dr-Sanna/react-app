import React from 'react';
import { useMediaQuery } from 'react-responsive';

const DisplayItems = ({ items, onClickItem, isMatiere }) => {
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
    <div className="item-menu-container">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '-10px 0',
        }}
      >
        {sortedItems.map(item => (
          <div
            className={`item-menu-${isMatiere ? 'matiere' : 'sous-matiere'}`}
            style={{
              ...getItemStyle(),
              textAlign: 'center',
              margin: '10px',
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
