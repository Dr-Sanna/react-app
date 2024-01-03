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
import { motion, AnimatePresence } from 'framer-motion';

const CasCliniquesComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { titreCas } = useParams();
  const [casCliniques, setCasCliniques] = useState([]);
  const [selectedCas, setSelectedCas] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);  // Suivre le chargement de l'image

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
      setIsImageLoaded(false);  // Réinitialiser lorsqu'on revient à la liste des cas
    } else {
      const titre = location.pathname.split("/").pop();
      updateSelectedCas(titre, casCliniques);
    }
  }, [location, casCliniques, updateSelectedCas]);

  const simpleVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const handleSelection = (cas) => {
    setSelectedCas(cas);
    setIsImageLoaded(false);  // Réinitialiser à chaque sélection d'un nouveau cas
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
        <AnimatePresence mode="wait">
          {!selectedCas
            ? (
                <motion.div
                  key="card"
                  variants={simpleVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                >
                  <CasCardComponent casCliniques={casCliniques} onSelection={handleSelection} />
                </motion.div>
              )
            : (
                <motion.div
                  key={selectedCas.id}
                  variants={simpleVariants}
                  initial="initial"
                  animate={isImageLoaded ? "enter" : "initial"}  // Animer seulement lorsque l'image est chargée
                  exit="exit"
                >
                  <CasDetailComponent selectedCas={selectedCas} onImageLoaded={() => setIsImageLoaded(true)} />
                </motion.div>
              )
          }
        </AnimatePresence>
      </PerfectScrollbar>
    </CustomLayout>
  );
};

export default CasCliniquesComponent;
