// CasCliniquesComponent.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { FileTextOutlined } from '@ant-design/icons';
import CustomLayout from './CustomLayout';
import LeftMenu from './LeftMenu';
import CasCardComponent from './CasCardComponent';
import CasDetailComponent from './CasDetailComponent';
import { server } from './config';
import { preloadImage } from './utils'; // Importez depuis utils.js
import { CustomToothLoader } from './CustomToothLoader'; // Importez CustomToothLoader en tant qu'exportation nommée


const CasCliniquesComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { titreCas } = useParams();
  const [casCliniques, setCasCliniques] = useState([]);
  const [selectedCas, setSelectedCas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatTitleForUrl = useCallback((title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }, []);

  const updateSelectedCas = useCallback((titre, casList) => {
    if (Array.isArray(casList)) {
      const foundCas = casList.find(c => formatTitleForUrl(c.attributes.titre) === titre);
      setSelectedCas(foundCas || null);
    } else {
      console.error("casList n'est pas un tableau:", casList);
    }
  }, [formatTitleForUrl]);
  
  useEffect(() => {
    setIsLoading(true);  // Commencer à afficher le loader global
  
    axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*`)
      .then(async (response) => {
        const data = response.data && response.data.data;
        
        // Précharger toutes les images des cas
        const preloadedData = await Promise.all(data.map(async (cas) => {
          const imageUrl = cas.attributes.image ? `${server}${cas.attributes.image.data.attributes.url}` : '';
          // Précharge chaque image
          await preloadImage(imageUrl); 
          return { ...cas, preloaded: true }; // Marquez le cas comme préchargé
        }));
  
        setCasCliniques(preloadedData || []);
        updateSelectedCas(titreCas, preloadedData);
        setIsLoading(false);  // Masquer le loader global une fois toutes les images chargées
      })
      .catch(error => {
        console.error('Erreur de récupération des cas cliniques:', error);
        setIsLoading(false);
      });
  }, [titreCas, updateSelectedCas]);
  

  useEffect(() => {
    if (location.pathname === "/moco/cas-cliniques-du-cneco") {
      setSelectedCas(null);
    } else {
      const titre = location.pathname.split("/").pop();
      updateSelectedCas(titre, casCliniques);
    }
  }, [location, casCliniques, updateSelectedCas]);

  const handleSelection = async (cas) => {
    if (selectedCas && cas.id === selectedCas.id) {
      return;
    }
    setSelectedCas(cas); // Met à jour le cas sélectionné
    const formattedTitle = formatTitleForUrl(cas.attributes.titre);
    navigate(`/moco/cas-cliniques-du-cneco/${formattedTitle}`);
  };

  const menuItems = casCliniques.map(cas => ({
    key: cas.id.toString(),
    icon: <FileTextOutlined />,
    label: cas.attributes.titre,
    onClick: () => handleSelection(cas),
  }));
  

  return (
    <CustomLayout leftSider={<LeftMenu menuItems={menuItems} selectedKey={selectedCas?.id?.toString() || ''} />}>
      <PerfectScrollbar style={{ width: '65vw', padding: '1rem', backgroundColor: '#f5f5f5' }}>
        {isLoading ? (
          <CustomToothLoader /> 
        ) : !selectedCas ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
             {casCliniques.map(cas => (
    <CasCardComponent
      key={cas.id} // Chaque cas doit avoir un identifiant unique
      cas={cas}
      onSelection={handleSelection}
    />
  ))}
          </div>
        ) : (
          
  <CasDetailComponent selectedCas={selectedCas} />

        )}
      </PerfectScrollbar>
    </CustomLayout>
  );
};

export default CasCliniquesComponent;