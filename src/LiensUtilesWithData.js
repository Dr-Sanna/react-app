// LiensUtilesWithData.js : Composant pour charger et afficher les liens utiles
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LiensUtilesComponent from './LiensUtilesComponent';

const LiensUtilesWithData = () => {
    const [liens, setLiens] = useState(null);
    const { lienUtileTitle } = useParams();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/liens-utiles`)
            .then(response => {
                const liensData = response.data.data.map(item => ({
                    ...item.attributes,
                    id: item.id
                }));
                setLiens(liensData);
            })
            .catch(error => {
                console.error("Erreur lors du chargement des liens utiles:", error);
            });
    }, [lienUtileTitle]);
    

    if (!liens) {
        return <div>Chargement des liens utiles...</div>;
    }

    return <LiensUtilesComponent liens={liens} />;
};

export default LiensUtilesWithData;
