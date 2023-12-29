import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from './config';
import { Accordion, Card } from 'react-bootstrap';
import { Layout, Menu } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { Sider } = Layout;

const CasCliniquesComponent = () => {
    const location = useLocation();
    const sousMatiereId = location.state && location.state.sousMatiereId;
    const [casCliniques, setCasCliniques] = useState([]);
    const [selectedCas, setSelectedCas] = useState(null);

    useEffect(() => {
    console.log('ID de la sous-matière:', sousMatiereId); 
    axios.get(`${server}/api/cas-cliniques?populate=*&filters[sous_matiere][id][$eq]=${sousMatiereId}`)
        .then(response => {
            console.log('Données des cas cliniques :', response.data); // Affichage des données
            if (response.data && response.data.data) {
                setCasCliniques(response.data.data);
            }
        })
        .catch(error => console.error('Erreur de récupération des cas cliniques:', error));
}, [sousMatiereId]); 

    // Préparer les éléments du menu pour Ant Design
    const menuItems = casCliniques.map(cas => ({
        key: cas.id.toString(),
        icon: <FileTextOutlined />,
        label: cas.attributes.titre,
        onClick: () => setSelectedCas(cas),
    }));

    return (
        <div className="d-flex" style={{ height: '90vh', width: '100vw', padding: 0 }}>
            {/* Menu de navigation à gauche avec Ant Design */}
            <Sider 
    width="25vw" 
    style={{ 
        flex: '0 0 20vw', 
        maxWidth: '20vw', 
        minWidth: '20vw', 
        background: '#fff', 
        borderRight: '1px solid #ddd' 
    }}
>
    <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={[selectedCas ? selectedCas.id.toString() : '']}
        style={{ height: '100%', borderRight: 0 }}
    />
</Sider>


            {/* Documentation à droite avec Bootstrap */}
            <div className="flex-grow-1" style={{ overflowY: 'auto', width: '60vw', padding: '50px' }}>
                {selectedCas && (
                    <>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>{selectedCas.attributes.titre}</Card.Title>
                            </Card.Body>
                            <Card.Img
                                variant="top"
                                src={`${server}${selectedCas.attributes.image.data.attributes.url}`}
                                style={{ objectFit: 'contain', maxWidth: '50%', maxHeight: '50%' }}
                            />
                            <Card.Body>
                                <Card.Text>{selectedCas.attributes.enonce}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Accordion defaultActiveKey="">
                            {selectedCas.attributes.question.map((q, index) => (
                                <Accordion.Item eventKey={index.toString()} key={index}>
                                    <Accordion.Header>{q.question}</Accordion.Header>
                                    <Accordion.Body>
                                        {selectedCas.attributes.correction.find(c => c.id === q.id).correction}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </>
                )}
            </div>
        </div>
    );
};

export default CasCliniquesComponent;
