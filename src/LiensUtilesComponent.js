import React from 'react';
import './LiensUtiles.css';

const LiensUtilesComponent = ({ liens }) => {
    return (
        <div className="item-menu-container">
        <div className="liens-utiles-container">
            <ul className="liens-utiles-list">
                {liens.map(lien => (
                    <li 
                        key={lien.id} // Assurez-vous que chaque lien a un ID unique
                        className="liens-utiles-item"
                    >
                        <a href={lien.url} target="_blank" rel="noopener noreferrer" className="liens-utiles-link">
                            <h4>{lien.titre}</h4>
                            <p>{lien.description}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default LiensUtilesComponent;
