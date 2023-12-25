import React from 'react';

const LiensUtilesComponent = ({ liens }) => {
    return (
        <div className="list-group">
            {liens.map(lien => (
                <a key={lien.id} href={lien.url} target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <h4 className="list-group-item-heading">{lien.titre}</h4>
                    <p className="list-group-item-text">{lien.description}</p>
                </a>
            ))}
        </div>
    );
};

export default LiensUtilesComponent;
