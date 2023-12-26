import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import LiensUtilesComponent from './LiensUtilesComponent';
import AccordeonComponent from './AccordeonComponent';

const HomePage = () => {
    const [matieres, setMatieres] = useState([]);
    const [sousMatieres, setSousMatieres] = useState([]);
    const [currentMatiere, setCurrentMatiere] = useState(null);
    const [previousMatiere, setPreviousMatiere] = useState(null);  // Nouvel état pour la sous-matière précédente
    const [currentAction, setCurrentAction] = useState(null);
    const [actionData, setActionData] = useState(null);
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/matieres?populate=*`)
            .then(response => {
                if (response.data && response.data.data) {
                    setMatieres(response.data.data);
                }
            })
            .catch(error => console.error('Erreur de récupération des données:', error));

        axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/designs?populate=*`)
            .then(response => {
console.log('Designs data:', response.data);
                const designs = response.data.data;
                designs.forEach(design => {
                    if (design.attributes.titre === 'header') {
                        setHeader(design.attributes.image.data.attributes.url);
                    } else if (design.attributes.titre === 'footer') {
                        setFooter(design.attributes.image.data.attributes.url);
                    }
                });
            })
            .catch(error => console.error('Erreur de récupération des données de design:', error));
    }, []);

    const handleMatiereClick = (matiereId) => {
        if (matiereId === currentMatiere) {
            handleBackClick();
        } else {
            axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/sous-matieres?populate=*&filters[matiere][id][$eq]=${matiereId}`)
                .then(response => {
                    setSousMatieres(response.data.data);
                    setCurrentMatiere(matiereId);
                    setCurrentAction(null); // Réinitialiser l'action actuelle
                })
                .catch(error => console.error('Erreur de récupération des sous-matières:', error));
        }
    };

    const handleSousMatiereClick = (sousMatiere) => {
 setPreviousMatiere(currentMatiere);
        switch (sousMatiere.attributes.actionType) {
            case 'liens_utiles':
axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/liens-utiles`)
    .then(response => {
        const liens = response.data.data.map(item => ({
            id: item.id,
            ...item.attributes  // Cela va extraire Titre, URL, et Description de attributes
        }));
        setActionData(liens);
        setCurrentAction('liens_utiles');
    })
    .catch(error => console.error('Erreur de récupération des liens utiles:', error));
break;
            case 'accordeon':
                // Charger les données nécessaires pour l'accordéon
                // setActionData(lesDonnéesDeLAccordeon);
                setCurrentAction('accordeon');
                break;
            // Ajoutez d'autres cas au besoin
            default:
                console.log("Action non reconnue ou sous-matière sans action spécifique.");
                break;
        }
    };

const handleBackClick = () => {
    if (previousMatiere) {
        // S'il y a une sous-matière précédente, revenez à celle-ci
        setCurrentMatiere(previousMatiere);
        setPreviousMatiere(null);  // Réinitialiser la sous-matière précédente
        setCurrentAction(null);  // Réinitialiser l'action actuelle
    } else {
        // Sinon, revenez à l'accueil
        setSousMatieres([]);
        setCurrentMatiere(null);
        setCurrentAction(null);
    }
};


    const renderMatiereItem = (item, isSousMatiere = false) => (
        <div key={item.id} className="col-6 col-md-4 col-lg-2 text-center">
            <div className="circle-icon" onClick={() => isSousMatiere ? handleSousMatiereClick(item) : handleMatiereClick(item.id)}>
                {item.attributes.image && item.attributes.image.data && (
<img
  src={item.attributes.image.data.attributes.url}
  alt={item.attributes.titre}
  className="matiere-image"
/>


                )}
            </div>
            <p>{item.attributes.titre}</p>
        </div>
    );

    return (
        <div>
            {header && (
                <header className="header">
                    <img src={`${process.env.REACT_APP_STRAPI_URL}${header}`} alt="Header" />
                </header>
            )}

            <div className="welcome-banner">
                <h1>Bienvenue dans le monde du dentaire</h1>
            </div>

            <div className="container mt-4">
                <div className="row justify-content-center">
                    {currentMatiere === null ? (
                        matieres.map(matiere => renderMatiereItem(matiere))
                    ) : (
                        currentAction === 'liens_utiles' ? (
                            <LiensUtilesComponent liens={actionData} />
                        ) : currentAction === 'accordeon' ? (
                            <AccordeonComponent contenu={actionData} />
                        ) : (
                            sousMatieres.map(sousMatiere => renderMatiereItem(sousMatiere, true))
                        )
                    )}
                </div>
                {currentMatiere && <button onClick={handleBackClick} className="btn-retour">Retour</button>}
            </div>

            {footer && (
                <footer className="footer">
                    <img src={`${process.env.REACT_APP_STRAPI_URL}${footer}`} alt="Footer" />
                </footer>
            )}
        </div>
    );
};

export default HomePage;
