import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { server } from './config'; // Assurez-vous d'avoir un fichier config.js

const DisplayItems = ({ items, onClickItem }) => {
    // Media queries
    const isDesktop = useMediaQuery({ minWidth: 992 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
    
    // Styles pour les différents écrans
    const getItemStyle = () => {
        if (isDesktop) {
            return { flex: '1 0 20%', maxWidth: '20%' }; // Style pour les écrans de bureau
        } else if (isTablet) {
            return { flex: '1 0 33%', maxWidth: '33%' }; // Style pour les tablettes
        } else {
            return { flex: '1 0 50%', maxWidth: '50%' }; // Style pour les mobiles
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
                        <div className="circle-icon">
                            {item.attributes.image && item.attributes.image.data && (
                                <img
                                    src={`${server}${item.attributes.image.data.attributes.url}`}
                                    alt={item.attributes.titre}
                                    style={{ width: '100%', height: 'auto' }}
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
