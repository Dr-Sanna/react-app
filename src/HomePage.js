import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import './HomePage.css';
import LiensUtilesComponent from './LiensUtilesComponent';
import CasCliniquesComponent from './CasCliniquesComponent';
import { server } from './config';
import { Layout, Menu } from 'antd';
import { Route, Routes, NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';

const { Header } = Layout;

// HeaderWithLogo : Composant pour afficher l'en-tête avec le logo.
const HeaderWithLogo = () => {
    // État pour stocker l'URL du logo.
    const [logoUrl, setLogoUrl] = useState('');

    // Effet pour charger le logo depuis Strapi au montage du composant.
useEffect(() => {
    const fetchLogo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/designs?filters[titre][$eq]=logo&populate=*`);
            if (response.data && response.data.data && response.data.data.length > 0) {
                // Extraction de l'URL du logo depuis la réponse de l'API et mise à jour de l'état.
                // Utilisez directement logoPath car il est déjà formaté correctement.
                const logoPath = response.data.data[0].attributes.image.data.attributes.url;
                setLogoUrl(logoPath);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du logo :', error);
        }
    };
    fetchLogo();
}, []);

    // Rendu du Header avec le logo.
    return (
        <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001529' }}>
            {logoUrl && <img src={logoUrl} alt="Logo" style={{ height: '50px' }} />}
            {/* Reste de votre code pour le menu... */}
        </Header>
    );
};

// DisplayItems : Composant pour afficher des items comme des matières ou des cas cliniques.
const DisplayItems = ({ items, onClickItem }) => (
    // Rendu des items dans un layout de grille avec une image et un titre.
    <Container fluid style={{ padding: 0, margin: 0 }}>
        <Row className="justify-content-center" style={{ margin: 0 }}>
            {items.map(item => (
                <Col md={4} lg={2} className="text-center mt-4" key={item.id} onClick={() => onClickItem(item)}>
                    <div className="circle-icon">
                        {item.attributes.image && item.attributes.image.data && (
                            <img
                                src={`${server}${item.attributes.image.data.attributes.url}`}
                                alt={item.attributes.titre}
                                className="matiere-image"
                            />
                        )}
                    </div>
                    <p>{item.attributes.titre}</p>
                </Col>
            ))}
        </Row>
    </Container>
);

// toUrlFriendly : Fonction pour transformer un titre en format URL amical.
const toUrlFriendly = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// HomePage : Composant principal de la page d'accueil.
const HomePage = () => {
    // États pour stocker les données des matières et des cas cliniques.
    const [matieres, setMatieres] = useState([]);
    const [casCliniques, setCasCliniques] = useState([]);

    // Hooks pour la navigation et l'accès à l'emplacement actuel de la route.
    const navigate = useNavigate();
    const location = useLocation();

    // Chargement des données des matières au montage du composant.
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/matieres?populate=*`)
            .then(response => {
                if (response.data && response.data.data) {
                    setMatieres(response.data.data);
                }
            })
            .catch(error => console.error('Erreur de récupération des données:', error));
    }, []);

    // Chargement des données des cas cliniques au montage du composant.
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*`)
            .then(response => {
                if (response.data && response.data.data) {
                    setCasCliniques(response.data.data);
                }
            })
            .catch(error => console.error('Erreur de récupération des cas cliniques:', error));
    }, []);

    // Fonction pour gérer le clic sur une matière et naviguer vers son URL.
    const handleMatiereClick = (matiere) => {
        const matiereTitleUrl = toUrlFriendly(matiere.attributes.titre);
        navigate(`/${matiereTitleUrl}`);
    };

    // Configuration du menu de navigation et de son état sélectionné.
    const selectedKeys = location.pathname === '/' ? ['1'] : [];
    const menuItems = [
        {
            key: '1',
            label: (<NavLink to="/">Accueil</NavLink>),
        },
        // Ajoutez d'autres éléments de menu ici si nécessaire.
    ];

    // Rendu de la structure générale de la page avec un Header, un Layout et des Routes.
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ height: '10vh', padding: 0, display: 'flex', alignItems: 'center', backgroundColor: '#001529' }}>
                <HeaderWithLogo />  {/* Utilisation du composant HeaderWithLogo ici */}
                <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} items={menuItems} style={{ lineHeight: '10vh' }} />
            </Header>

            <Layout style={{ height: '90vh', overflow: 'auto' }}>
                <Routes>
                    <Route exact path="/" element={<DisplayItems items={matieres} onClickItem={handleMatiereClick} />} />
                    <Route path="/:matiereTitle" element={<Matiere matieres={matieres} casCliniques={casCliniques} />} />
                    <Route path="/ressources-utiles/:lienUtileTitle" element={<LiensUtilesWithData />} />
<Route path="/moco/:sousMatiereId" element={<CasCliniquesComponent />} />
                </Routes>
            </Layout>
        </Layout>
    );
};

const Matiere = ({ matieres, casCliniques }) => {
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
            navigate(`/moco/${titleUrl}`, { state: { sousMatiereId: sousMatiereId } });
            break;
        case 'liens_utiles':
            navigate(`/ressources-utiles/${titleUrl}`, { state: { lienId: sousMatiere.id } }); // Assurez-vous que `sousMatiere.id` représente l'ID correct du lien utile.
            break;
        default:
            console.log("Type d'action non reconnu");
    }
};


    return <DisplayItems items={sousMatieres} onClickItem={handleSousMatiereClick} />;
};

// Composant pour charger et afficher les liens utiles
const LiensUtilesWithData = () => {
    const [liens, setLiens] = useState(null);
    const { lienUtileTitle } = useParams(); // Récupération de lienUtileTitle de l'URL


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/liens-utiles`)
            .then(response => {
                const liensData = response.data.data.map(item => item.attributes);
                setLiens(liensData);
            })
            .catch(error => {
                console.error("Erreur lors du chargement des liens utiles:", error);
            });
    }, [lienUtileTitle]); // Ajoutez lienUtileTitle dans le tableau de dépendances si nécessaire

    if (!liens) {
        return <div>Chargement des liens utiles...</div>;
    }

    return <LiensUtilesComponent liens={liens} />;
};

export default HomePage;
