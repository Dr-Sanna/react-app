import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import LeftMenu from "./LeftMenu";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import CasCardComponent from "./CasCardComponent";
import CasDetailComponent from "./CasDetailComponent";
import { server } from "./config";
import { preloadImage } from "./utils";
import { CustomToothLoader } from "./CustomToothLoader";
import { useSidebarContext } from './SidebarContext';
import { toUrlFriendly } from "./config";
import PaginationComponent from './PaginationComponent'; // Assurez-vous que le chemin est correct

const CasCliniquesComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [casCliniques, setCasCliniques] = useState([]);
  const [selectedCas, setSelectedCas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentPath = location.pathname; // Utilisé pour la dépendance du useEffect
  const { isSidebarVisible } = useSidebarContext();
  const sousMatiereId = location.state?.sousMatiereId;

  const updateSelectedCas = useCallback(
    (titre, casList) => {
      if (Array.isArray(casList)) {
        const foundCas = casList.find(
          (c) => c.attributes && toUrlFriendly(c.attributes.titre) === titre
        );
        setSelectedCas(foundCas || null);
      } else {
        console.error("casList n'est pas un tableau:", casList);
      }
    },
    []
  );

  useEffect(() => {
    setIsLoading(true);

    let queryURL = '';

    if (currentPath.includes('guide-clinique-d-odontologie')) {
      queryURL = `${process.env.REACT_APP_STRAPI_URL}/api/guide-cliniques?populate=*`;

      if (currentPath.includes('bilans-sanguins')) {
        queryURL += `&filters[sous_matiere][id][$eq]=4`;
      } else if (currentPath.includes('risque-infectieux')) {
        queryURL += `&filters[sous_matiere][id][$eq]=5`;
      }

    } else if (currentPath.includes('cas-cliniques')) {
      queryURL = `${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*`;

      if (currentPath.includes('moco/cas-cliniques-du-cneco')) {
        queryURL += `&filters[sous_matiere][id][$eq]=3`;
      } else if (sousMatiereId) {
        queryURL += `&filters[sous_matiere][id][$eq]=${sousMatiereId}`;
      }
    }

    axios.get(queryURL)
      .then(async (response) => {
        const data = response.data.data || [];
        const preloadedData = await Promise.all(data.map(async (cas) => {
          if (cas && cas.attributes) {
            const imageUrl = cas.attributes.image ? `${server}${cas.attributes.image.data.attributes.url}` : "";
            await preloadImage(imageUrl);
            return {
              ...cas,
              preloaded: true,
              urlFriendlyTitre: toUrlFriendly(cas.attributes.titre),
            };
          }
          return null;
        }).filter(cas => cas !== null));

        setCasCliniques(preloadedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de récupération des cas cliniques:", error);
        setIsLoading(false);
      });
  }, [sousMatiereId, currentPath]);

  useEffect(() => {
    if (currentPath === "/moco/cas-cliniques-du-cneco") {
      setSelectedCas(null);
    } else {
      const titre = currentPath.split("/").pop();
      updateSelectedCas(titre, casCliniques);
    }
  }, [location, casCliniques, updateSelectedCas, currentPath]);

  const currentIndex = casCliniques.findIndex(cas => cas.id === selectedCas?.id);

  // Définir l'item précédent et suivant
  const prevItem = currentIndex > 0 ? { ...casCliniques[currentIndex - 1], label: casCliniques[currentIndex - 1]?.attributes?.titre } : null;
  const nextItem = currentIndex < casCliniques.length - 1 ? { ...casCliniques[currentIndex + 1], label: casCliniques[currentIndex + 1]?.attributes?.titre } : null;

  const handleSelection = (cas) => {
    const pathSegments = location.pathname.split('/');
    const newPath = [...pathSegments.slice(0, 3), cas.urlFriendlyTitre].join('/');
    navigate(newPath, { state: { sousMatiereId } });
    setSelectedCas(cas);
  };


  const menuItems = casCliniques.map(cas => ({
    key: cas.id.toString(),
    label: cas.attributes?.titre || '',
    url: `${location.pathname}/${cas.urlFriendlyTitre}`,
    onClick: () => handleSelection(cas),
  }));

  return (
    <div className="docsWrapper_lLmf">
      <button
        aria-label="Retour au début de la page"
        className="clean-btn theme-back-to-top-button backToTopButton_PuQw"
        type="button"
      ></button>
      <div className="docRoot_kBZ6">
        {/* Sidebar gauche */}
        <LeftMenu
          menuItems={menuItems}
          selectedKey={selectedCas?.id?.toString() || ""}
        />

        {/* Contenu principal */}
        <main className={`docMainContainer_EfwR ${isSidebarVisible ? '' : 'docMainContainerEnhanced_r8nV'}`}>
          <div className={`container padding-top--md padding-bottom--lg ${isSidebarVisible ? '' : 'docItemWrapperEnhanced_nA1F'}`}>
            {selectedCas ? (
              // Affichage quand un cas est sélectionné
              
              <div className="docItemContainer_RhpI" style={{ marginRight: '10px' }}>
                    <article>
                      <BreadcrumbsComponent
                        currentPath={location.pathname}
                        selectedCasTitle={selectedCas ? selectedCas.attributes.titre : ''}
                      />
                      <CasDetailComponent selectedCas={selectedCas} imageUrl={selectedCas?.attributes?.image ? `${server}${selectedCas.attributes.image.data.attributes.url}` : ''} />
                    </article>
                    {selectedCas && (
                      <PaginationComponent
                        prevItem={prevItem ? { ...prevItem } : null} // Assurez-vous d'inclure toutes les propriétés nécessaires
                        nextItem={nextItem ? { ...nextItem } : null}
                        onNavigate={handleSelection}
                      />
                    )}
                  
                
              </div>
            ) : (
              // Affichage initial sans colonne ni table des matières
              <div className="docItemContainer_RhpI">
                <BreadcrumbsComponent
                  currentPath={location.pathname}
                  selectedCas={selectedCas}
                  sousMatiereId={sousMatiereId}
                />
                {isLoading ? (
                  <CustomToothLoader />
                ) : (
                  <CasCardComponent
                    casCliniques={casCliniques}
                    onSelection={handleSelection}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CasCliniquesComponent;
