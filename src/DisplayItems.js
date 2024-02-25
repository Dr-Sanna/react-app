import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { server } from './config'; // Assurez-vous d'avoir un fichier config.js

const DisplayItems = ({ items, onClickItem }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

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
                                <LazyLoadImage
                                    alt={item.attributes.titre}
                                    src={`${server}${item.attributes.image.data.attributes.url}`} // Utilisation de la variable `server`
                                    effect="opacity"
                                    placeholderSrc="https://img.freepik.com/vecteurs-libre/illustration-icone-galerie_53876-27002.jpg"
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
