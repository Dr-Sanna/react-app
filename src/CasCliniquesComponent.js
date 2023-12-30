import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Accordion, Modal } from 'react-bootstrap';
import { Layout, Menu } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { server } from './config';

const { Sider } = Layout;

const CasCliniquesComponent = () => {
    const location = useLocation();
    const sousMatiereId = location.state && location.state.sousMatiereId;
    const [casCliniques, setCasCliniques] = useState([]);
    const [selectedCas, setSelectedCas] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeKey, setActiveKey] = useState(null);  // Gère l'accordéon actuellement ouvert

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*&filters[sous_matiere][id][$eq]=${sousMatiereId}`)
            .then(response => {
                if (response.data && response.data.data) {
                    setCasCliniques(response.data.data);
                }
            })
            .catch(error => console.error('Erreur de récupération des cas cliniques:', error));
    }, [sousMatiereId]);

    const toggleModal = () => setShowModal(!showModal);

    const handleAccordionClick = (index) => {
        // Définir ou effacer la clé active en fonction de l'accordéon actuellement ouvert
        setActiveKey(activeKey === index ? null : index);
    };

    const menuItems = casCliniques.map(cas => ({
        key: cas.id.toString(),
        icon: <FileTextOutlined />,
        label: cas.attributes.titre,
        onClick: () => setSelectedCas(cas),
    }));

    return (
        <div className="d-flex" style={{ height: '90vh', width: '100vw', padding: '0' }}>
            <Sider width="25vw" className="shadow-sm">
                <Menu
                    mode="inline"
                    items={menuItems}
                    selectedKeys={[selectedCas ? selectedCas.id.toString() : '']}
                    style={{ height: '100%', borderRight: 0 }}
                />
            </Sider>
            <div className="flex-grow-1 overflow-auto p-3">
                {selectedCas && (
                    <>
                       <Card className="mb-4 shadow-sm">
    <Card.Body>
        <Card.Title>{selectedCas.attributes.titre}</Card.Title>
        <div style={{ textAlign: 'center' }}> {/* Centre l'image dans la carte */}
            <img
                src={`${server}${selectedCas.attributes.image.data.attributes.url}`}
                style={{
                    maxWidth: '100%',  // S'assure que l'image n'est pas plus large que le conteneur
                    height: '200px',
                    objectFit: 'contain',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                }}
                onClick={toggleModal}
                title="Cliquez pour agrandir"
                alt={selectedCas.attributes.titre}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = '')}
            />
        </div>
        <Card.Text style={{ marginTop: '15px', fontSize: '0.95rem', lineHeight: '1.5', textAlign: 'justify' }}>
            {selectedCas.attributes.enonce}
        </Card.Text>
    </Card.Body>
</Card>


        <Accordion defaultActiveKey={activeKey}>
                            {selectedCas.attributes.question.map((q, index) => (
                                <Accordion.Item eventKey={index.toString()} key={index} style={{ marginBottom: '10px' }}>
                                    <Accordion.Header onClick={() => handleAccordionClick(index.toString())}>
                                        {q.question}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {selectedCas.attributes.correction.find(c => c.id === q.id)?.correction}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>

<Modal show={showModal} onHide={toggleModal} size="xl" centered>
    <Modal.Header closeButton>
        <Modal.Title>{selectedCas.attributes.titre}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="d-flex justify-content-center align-items-center" style={{ overflow: 'hidden', maxHeight: '90vh' }}>
        {selectedCas.attributes.image && selectedCas.attributes.image.data && (
            <img
                src={`${server}${selectedCas.attributes.image.data.attributes.url}`}  // Utilisez la variable server pour construire l'URL
                style={{
                    maxHeight: '70vh',
                    maxWidth: '100%',
                    objectFit: 'contain'
                }}
                alt="Agrandissement"
            />
        )}
    </Modal.Body>
</Modal>
                    </>
                )}
            </div>
        </div>
    );
};

export default CasCliniquesComponent;
