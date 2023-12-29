import React from 'react';
import { ListGroup } from 'react-bootstrap';


const LiensUtilesComponent = ({ liens }) => {
    console.log('LiensUtilesComponent liens:', liens); // Log pour vérifier les données reçues
    return (
        <ListGroup>
            {liens.map(lien => (
                <ListGroup.Item 
                    key={lien.id} // Utilisez l'ID comme clé unique
                    action 
                    href={lien.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <h4>{lien.titre}</h4>
                    <p>{lien.description}</p>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default LiensUtilesComponent;
