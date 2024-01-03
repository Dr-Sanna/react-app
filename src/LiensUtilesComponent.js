import React from 'react';
import { ListGroup } from 'react-bootstrap';

const LiensUtilesComponent = ({ liens }) => {
    console.log('LiensUtilesComponent liens:', liens); // Log pour vérifier les données reçues
    return (
        <div className="d-flex justify-content-center"> {/* Centrer la liste sur la page */}
            <ListGroup className="w-75"> {/* Limiter la largeur à 75% de l'écran */}
                {liens.map(lien => (
                    <ListGroup.Item 
                        key={lien.id} // Utilisez l'ID comme clé unique
                        action 
                        href={lien.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mb-2" // Ajoute une marge en bas pour chaque élément
                    >
                        <h4>{lien.titre}</h4>
                        <p>{lien.description}</p>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default LiensUtilesComponent;
