import React from 'react';
import { server } from './config'; // Assurez-vous d'avoir un fichier config.js

const DisplayItems = ({ items, onClickItem }) => (
    <div style={{ padding: 0, margin: 0, maxWidth: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 0 }}>
            {items.map(item => (
                <div 
                    style={{
                        flex: '1 0 20%', // correspond à lg={2} dans Bootstrap
                        maxWidth: '20%',
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
                                style={{ width: '100%', height: 'auto' }} // Assurez-vous que l'image s'adapte correctement
                            />
                        )}
                    </div>
                    <p>{item.attributes.titre}</p>
                </div>
            ))}
        </div>
    </div>
);

export default DisplayItems;
