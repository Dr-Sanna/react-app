import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import LeftMenu from "./LeftMenu";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import CasCardComponent from "./CasCardComponent";
import CoursDetailComponent from "./CoursDetailComponent";
import { server } from "./config";
import { preloadImage } from "./utils";
import { CustomToothLoader } from "./CustomToothLoader";
import { useSidebarContext } from './SidebarContext';
import { toUrlFriendly } from "./config";
import PaginationComponent from './PaginationComponent';

const CoursComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cours, setCours] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isSidebarVisible } = useSidebarContext();
  const sousMatiereId = location.state?.sousMatiereId;
  const dataLoaded = useRef(false);

  const updateSelectedCours = useCallback(
    (titre, coursList) => {
      if (Array.isArray(coursList)) {
        const foundCours = coursList.find(
          (c) => c.attributes && toUrlFriendly(c.attributes.titre) === titre
        );
        setSelectedCours(foundCours || null);
      } else {
        console.error("coursList n'est pas un tableau:", coursList);
      }
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!dataLoaded.current) {
        setIsLoading(true);
        let queryURL = '';

        if (location.pathname.includes('odontologie-pediatrique')) {
          queryURL = `${process.env.REACT_APP_STRAPI_URL}/api/odontologie-pediatriques?populate=*`;
        
          if (location.pathname.includes('therapeutiques-pulpaires-des-dt')) {
            queryURL += `&filters[sous_matiere][id][$eq]=10`; // Assurez-vous que cet ID est correct pour la sous-matière therapeutiques pulpaires des dt
          }
        
        } else if (location.pathname.includes('guide-clinique-d-odontologie')) {
          queryURL = `${process.env.REACT_APP_STRAPI_URL}/api/guide-cliniques?populate=*`;
        
          if (location.pathname.includes('bilans-sanguins')) {
            queryURL += `&filters[sous_matiere][id][$eq]=4`;
          } else if (location.pathname.includes('risque-infectieux')) {
            queryURL += `&filters[sous_matiere][id][$eq]=5`;
          } else if (location.pathname.includes('risque-hemorragique')) {
            queryURL += `&filters[sous_matiere][id][$eq]=11`;
          }
        
        } else if (location.pathname.includes('moco') && location.pathname.includes('medecine-orale')) {
          queryURL = `${process.env.REACT_APP_STRAPI_URL}/api/medecine-orales?populate=*`;
          queryURL += `&filters[sous_matiere][id][$eq]=9`; // Assurez-vous que cet ID est correct pour la sous-matière medecine orale
        }

        try {
          const response = await axios.get(queryURL);
          const data = response.data.data || [];
          const preloadedData = await Promise.all(data.map(async (cours) => {
            if (cours && cours.attributes) {
              const imageUrls = cours.attributes.images ? cours.attributes.images.map(img => `${server}${img.url}`) : [];
              await Promise.all(imageUrls.map(preloadImage));

              const carouselImages = cours.attributes.Carousel?.data ? cours.attributes.Carousel.data.map(car => ({
                url: `${server}${car.attributes.url}`,
                caption: car.attributes.caption || ""
              })) : [];

              return {
                ...cours,
                preloaded: true,
                urlFriendlyTitre: toUrlFriendly(cours.attributes.titre),
                images: cours.attributes.images ? cours.attributes.images.map(img => ({
                  url: `${server}${img.url}`,
                  caption: img.caption
                })) : [],
                carousel: carouselImages
              };
            }
            return null;
          }).filter(cours => cours !== null));

          setCours(preloadedData);
          dataLoaded.current = true;
        } catch (error) {
          console.error("Erreur de récupération des cours:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [sousMatiereId, location.pathname]);

  useEffect(() => {
    if (location.pathname === "/moco/medecine-orale") {
      setSelectedCours(null);
    } else {
      const titre = location.pathname.split("/").pop();
      updateSelectedCours(titre, cours);
    }
  }, [location, cours, updateSelectedCours]);

  const currentIndex = cours.findIndex(c => c.id === selectedCours?.id);

  const prevItem = currentIndex > 0 ? { ...cours[currentIndex - 1], label: cours[currentIndex - 1]?.attributes?.titre } : null;
  const nextItem = currentIndex < cours.length - 1 ? { ...cours[currentIndex + 1], label: cours[currentIndex + 1]?.attributes?.titre } : null;

  const handleSelection = (cours) => {
    const pathSegments = location.pathname.split('/');
    const newPath = [...pathSegments.slice(0, 3), cours.urlFriendlyTitre].join('/');
    navigate(newPath, { state: { sousMatiereId } });
    setSelectedCours(cours);
  };

  const menuItems = cours.map(c => ({
    key: c.id.toString(),
    label: c.attributes?.titre || '',
    url: `${location.pathname}/${c.urlFriendlyTitre}`,
    onClick: () => handleSelection(c),
  }));

  return (
    <div className="docsWrapper_lLmf">
      <button
        aria-label="Retour au début de la page"
        className="clean-btn theme-back-to-top-button backToTopButton_PuQw"
        type="button"
      ></button>
      <div className="docRoot_kBZ6">
        <LeftMenu
          menuItems={menuItems}
          selectedKey={selectedCours?.id?.toString() || ""}
        />
        <main className={`docMainContainer_EfwR ${isSidebarVisible ? '' : 'docMainContainerEnhanced_r8nV'}`}>
          <div className={`container padding-top--md padding-bottom--lg ${isSidebarVisible ? '' : 'docItemWrapperEnhanced_nA1F'}`}>
            {selectedCours ? (
              <div className="docItemContainer_RhpI" style={{ marginRight: '10px' }}>
                <article>
                  <BreadcrumbsComponent
                    currentPath={location.pathname}
                    selectedCasTitle={selectedCours ? selectedCours.attributes.titre : ''}
                  />
                  <CoursDetailComponent selectedCas={selectedCours} />
                </article>
                {selectedCours && (
                  <PaginationComponent
                    prevItem={prevItem ? { ...prevItem } : null}
                    nextItem={nextItem ? { ...nextItem } : null}
                    onNavigate={handleSelection}
                  />
                )}
              </div>
            ) : (
              <div className="docItemContainer_RhpI">
                <BreadcrumbsComponent
                  currentPath={location.pathname}
                  selectedCas={selectedCours}
                  sousMatiereId={sousMatiereId}
                />
                {isLoading ? (
                  <CustomToothLoader />
                ) : (
                  <CasCardComponent
                    casCliniques={cours}
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

export default CoursComponent;
