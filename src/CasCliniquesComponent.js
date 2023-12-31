import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Menu, Image } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { server } from './config';
import ReactMarkdown from 'react-markdown';
import CustomList from './CustomList';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import './App.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails } from './CustomAccordion';


const { Sider, Content } = Layout;

const markdownComponents = {
  ul: ({ children }) => {
    const listItems = React.Children.toArray(children).filter(child => child.type === 'li').map(child => child.props.children);
    return <CustomList items={listItems} />;
  },
  h4: ({ children }) => <h4 style={{ marginBottom: 0 }}>{children}</h4>, // Remplacez par <Typography> si nécessaire
};

const CasCliniquesComponent = () => {
  const location = useLocation();
  const sousMatiereId = location.state && location.state.sousMatiereId;
  const [casCliniques, setCasCliniques] = useState([]);
  const [selectedCas, setSelectedCas] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*&filters[sous_matiere][id][$eq]=${sousMatiereId}`)
      .then(response => {
        if (response.data && response.data.data) {
          setCasCliniques(response.data.data);
        }
      })
      .catch(error => console.error('Erreur de récupération des cas cliniques:', error));
  }, [sousMatiereId]);

  const menuItems = casCliniques.map(cas => ({
    key: cas.id.toString(),
    icon: <FileTextOutlined />,
    label: cas.attributes.titre,
    onClick: () => setSelectedCas(cas),
  }));

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width="20vw" style={{ borderRight: '1px solid #e8e8e8' }}>
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[selectedCas ? selectedCas.id.toString() : '']}
          style={{ height: '100%' }}
        />
      </Sider>

      <PerfectScrollbar style={{ width: '65vw', padding: '2rem', backgroundColor: 'white' }}>
        <Content>
        {selectedCas && (
          <>
            <h3>
              {selectedCas.attributes.titre}
            </h3>
            <Image
              width='50%'
              style={{ maxWidth: '50vw', maxHeight: '50vh', objectFit: 'contain' }}
              src={selectedCas.attributes.image ? `${server}${selectedCas.attributes.image.data.attributes.url}` : ''}
              preview={true}
            />
<div style={{ height: '20px' }}></div> 
            <div><ReactMarkdown>{selectedCas.attributes.enonce}</ReactMarkdown></div>

{selectedCas.attributes.question.map((q, index) => (
              <CustomAccordion key={String(index)}>
                <CustomAccordionSummary
                  aria-controls={`panel${index}a-content`}
                  id={`panel${index}a-header`}
                  expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                >
                    <h6 style={{ margin: 0, padding: 0, fontFamily: 'Poppins', fontWeight: 700 }}>
    {q.question}
  </h6>
                </CustomAccordionSummary>
                <CustomAccordionDetails style={{ paddingBottom: '-80px' }}>
                  <div>
                    {/* Ici, vous pouvez insérer la réponse ou tout autre contenu associé à la question */}
                    <ReactMarkdown components={{...markdownComponents, paragraph: 'p'}}>
                      {selectedCas.attributes.correction[index]?.correction}
                    </ReactMarkdown>
                  </div>
                </CustomAccordionDetails>
              </CustomAccordion>
            ))}
          </>
        )}
      </Content>
    </PerfectScrollbar>

<Sider width="15vw" style={{ borderLeft: '1px solid #e8e8e8', background: 'white' }}>
        {/* Vous pouvez placer ici un contenu ou le laisser vide pour l'effet de symétrie */}
    </Sider>

    </Layout>

  );
};

export default CasCliniquesComponent;