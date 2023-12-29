import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import './HomePage.css';
import LiensUtilesComponent from './LiensUtilesComponent';
import AccordeonComponent from './AccordeonComponent';
import CasCliniquesComponent from './CasCliniquesComponent';
import { server } from './config';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate, useParams, useLocation, Link } from 'react-router-dom';

const { Header } = Layout;

const DisplayItems = ({ items, onClickItem }) => (
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

const toUrlFriendly = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const HomePage = () => {
    const [matieres, setMatieres] = useState([]);
    const [casCliniques, setCasCliniques] = useState([]); // Ajout de l'état pour les cas cliniques
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/matieres?populate=*`)
            .then(response => {
                if (response.data && response.data.data) {
                    setMatieres(response.data.data);
                }
            })
            .catch(error => console.error('Erreur de récupération des données:', error));
    }, []);

    useEffect(() => {
        axios.get(`${server}/api/cas-cliniques?populate=*`)
            .then(response => {
                if (response.data && response.data.data) {
                    setCasCliniques(response.data.data);
                }
            })
            .catch(error => console.error('Erreur de récupération des cas cliniques:', error));
    }, []); // Chargez les cas cliniques au chargement de la page

    const handleMatiereClick = (matiere) => {
        const matiereTitleUrl = toUrlFriendly(matiere.attributes.titre);
        navigate(`/${matiereTitleUrl}`);
    };

    const selectedKeys = location.pathname === '/' ? ['1'] : [];
    const menuItems = [
        {
            key: '1',
            label: (<NavLink to="/">Accueil</NavLink>),
        },
        // Ajoutez d'autres éléments de menu ici si nécessaire
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ height: '10vh', padding: 0, display: 'flex', alignItems: 'center', backgroundColor: '#001529' }}>
                <div className="logo" />
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
    const { matiereTitle } = useParams();
    const [sousMatieres, setSousMatieres] = useState([]);
    const navigate = useNavigate();

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
    const { lienUtileTitle } = useParams(); // Utilisé si vous avez besoin de filtrer par titre

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
