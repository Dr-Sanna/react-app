import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

const DisplayItems = ({ items, onClickItem }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

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
            <div className="circle-icon" style={{ position: 'relative', width: '100%', height: '100px' }}>
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
