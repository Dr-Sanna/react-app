// CasCliniquesComponent.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LeftMenu from "./LeftMenu";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import CasCardComponent from "./CasCardComponent";
import CasDetailComponent from "./CasDetailComponent";
import { server } from "./config";
import { preloadImage } from "./utils"; // Importez depuis utils.js
import { CustomToothLoader } from "./CustomToothLoader"; // Importez CustomToothLoader en tant qu'exportation nommée
import { useSidebarContext } from './SidebarContext'; // Importez le hook

const CasCliniquesComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { titreCas } = useParams();
  const [casCliniques, setCasCliniques] = useState([]);
  const [selectedCas, setSelectedCas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentPath = location.pathname;
  const { isSidebarVisible } = useSidebarContext();

  const formatTitleForUrl = useCallback((title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }, []);

  const updateSelectedCas = useCallback(
    (titre, casList) => {
      if (Array.isArray(casList)) {
        const foundCas = casList.find(
          (c) => formatTitleForUrl(c.attributes.titre) === titre
        );
        setSelectedCas(foundCas || null);
      } else {
        console.error("casList n'est pas un tableau:", casList);
      }
    },
    [formatTitleForUrl]
  );

  useEffect(() => {
    setIsLoading(true); // Commencer à afficher le loader global

    axios
      .get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*`)
      .then(async (response) => {
        const data = response.data && response.data.data;

        // Précharger toutes les images des cas
        const preloadedData = await Promise.all(
          data.map(async (cas) => {
            const imageUrl = cas.attributes.image
              ? `${server}${cas.attributes.image.data.attributes.url}`
              : "";
            // Précharge chaque image
            await preloadImage(imageUrl);
            return { ...cas, preloaded: true }; // Marquez le cas comme préchargé
          })
        );

        setCasCliniques(preloadedData || []);
        updateSelectedCas(titreCas, preloadedData);
        setIsLoading(false); // Masquer le loader global une fois toutes les images chargées
      })
      .catch((error) => {
        console.error("Erreur de récupération des cas cliniques:", error);
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
    const formattedTitle = formatTitleForUrl(cas.attributes.titre);
    navigate(`/moco/cas-cliniques-du-cneco/${formattedTitle}`);
  };

  const menuItems = casCliniques.map((cas) => ({
    key: cas.id.toString(),
    label: cas.attributes.titre,
    url: `/moco/cas-cliniques-du-cneco/${formatTitleForUrl(
      cas.attributes.titre
    )}`,
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
            <div className="row">
              <div className="col docItemCol_n6xZ">
                <div className="docItemContainer_RhpI">
                  <article>
                    <BreadcrumbsComponent
                      currentPath={currentPath}
                      selectedCas={selectedCas}
                    />

                    {isLoading ? (
                      // CustomToothLoader centré dans l'espace disponible
                      <CustomToothLoader />
                    ) : !selectedCas ? (
                      <CasCardComponent
                        casCliniques={casCliniques}
                        onSelection={handleSelection}
                      />
                    ) : (
                      // Afficher les détails d'un cas sélectionné
                      <CasDetailComponent selectedCas={selectedCas} />
                    )}
                  </article>
                </div>
                </div>
                <div className="col col--3">
                  <div
                    className="tableOfContents_RLlU thin-scrollbar theme-doc-toc-desktop"
                    
                  >
                    <ul
                      className="table-of-contents table-of-contents__left-border"
                      style={{ minHeight: "50vh" }}
                    ></ul>
                  </div>
                
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CasCliniquesComponent;
