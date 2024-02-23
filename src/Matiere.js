import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DisplayItems from './DisplayItems';
import { toUrlFriendly } from './config'; // Assurez-vous d'avoir cette fonction dans config.js

const Matiere = ({ matieres }) => {
    const [sousMatieres, setSousMatieres] = useState([]);
    const navigate = useNavigate();
    const { matiereTitle } = useParams();

    useEffect(() => {
        const matiere = matieres.find(m => toUrlFriendly(m.attributes.titre) === matiereTitle);
        if (matiere) {
            axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/sous-matieres?populate=*&filters[matiere][id][$eq]=${matiere.id}`)
                .then(response => {
                    if (response.data && response.data.data) {
                        setSousMatieres(response.data.data);
                    }
                })
                .catch(error => console.error('Erreur de récupération des sous-matières:', error));
        }
    }, [matiereTitle, matieres]);

    const handleSousMatiereClick = (sousMatiere) => {
        const titleUrl = toUrlFriendly(sousMatiere.attributes.titre); // Le titre formaté pour l'URL
        const sousMatiereId = sousMatiere.id;  // Récupération de l'ID de la sous-matière
        
        switch (sousMatiere.attributes.actionType) {
            case 'cas_cliniques':
                // Utilisez `matiereTitle` pour construire le chemin dynamiquement
                navigate(`/${matiereTitle}/${titleUrl}`, { state: { sousMatiereId: sousMatiereId } });
                break;
            case 'liens_utiles':
                // Ici aussi, ajustez si nécessaire en fonction de la matière
                navigate(`/ressources-utiles/${titleUrl}`, { state: { lienId: sousMatiere.id } });
                break;
            default:
                console.log("Type d'action non reconnu");
        }
    };
    

    return <DisplayItems items={sousMatieres} onClickItem={handleSousMatiereClick} />;
};

export default Matiere;