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

const CasCliniquesComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { titreCas } = useParams();
  const [casCliniques, setCasCliniques] = useState([]);
  const [selectedCas, setSelectedCas] = useState(null);

  const formatTitleForUrl = useCallback((title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }, []);

  // Définir ensuite updateSelectedCas avec useCallback
  const updateSelectedCas = useCallback((titre, casList) => {
    if (Array.isArray(casList)) {
      const foundCas = casList.find(c => formatTitleForUrl(c.attributes.titre) === titre);
      setSelectedCas(foundCas || null);
    } else {
      console.error("casList n'est pas un tableau:", casList);
    }
  }, [formatTitleForUrl]); // Dépendances ici

  // Maintenant, vous pouvez utiliser updateSelectedCas dans useEffect
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*`)
      .then(response => {
        const data = response.data && response.data.data;
        setCasCliniques(data || []);
        updateSelectedCas(titreCas, data);
      })
      .catch(error => console.error('Erreur de récupération des cas cliniques:', error));
  }, [titreCas, updateSelectedCas]);

  useEffect(() => {
    if (location.pathname === "/moco/cas-cliniques-du-cneco") {
      setSelectedCas(null);
    } else {
      const titre = location.pathname.split("/").pop();
      updateSelectedCas(titre, casCliniques);
    }
  }, [location, casCliniques, updateSelectedCas]);

  const handleSelection = (cas) => {
    setSelectedCas(cas);
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
      <PerfectScrollbar style={{ width: '65vw', padding: '2rem', backgroundColor: 'white' }}>
        {!selectedCas
          ? <CasCardComponent casCliniques={casCliniques} onSelection={handleSelection} />
          : <CasDetailComponent selectedCas={selectedCas} />}
      </PerfectScrollbar>
    </CustomLayout>
  );
};

export default CasCliniquesComponent;
