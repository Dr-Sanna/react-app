import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "./DataContext";
import LeftMenu from "./LeftMenu";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import CasCardComponent from "./CasCardComponent";
import CoursDetailComponent from "./CoursDetailComponent";
import { toUrlFriendly } from "./config";
import PaginationComponent from './PaginationComponent';
import { CustomToothLoader } from "./CustomToothLoader";
import { useSidebarContext } from './SidebarContext';
import { fetchSousMatiereByPath, fetchCoursData } from "./api";
import { preloadImage } from './utils';
import { server } from './config';

const CoursComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cours, setCours, isCoursLoading, setIsCoursLoading } = useContext(DataContext);
  const [selectedCours, setSelectedCours] = useState(null);
  const { isSidebarVisible } = useSidebarContext();
  const [selectedSousMatiere, setSelectedSousMatiere] = useState(null);

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const sousMatierePath = pathSegments.length >= 2 ? pathSegments[1] : "";
  console.log(`Sous-matiere path extracted from URL: ${sousMatierePath}`);

  const updateSelectedCours = useCallback(
    (titre, coursList) => {
      if (Array.isArray(coursList)) {
        const foundCours = coursList.find(
          (c) => c.attributes && toUrlFriendly(c.attributes.titre) === titre
        );
        setSelectedCours(foundCours || null);
        console.log(`Selected cours: ${foundCours ? foundCours.attributes.titre : 'none'}`);
      } else {
        console.error("coursList n'est pas un tableau:", coursList);
      }
    },
    []
  );

  useEffect(() => {
    const titre = pathSegments[pathSegments.length - 1]; // Dernier segment de l'URL
    updateSelectedCours(titre, cours);
  }, [pathSegments, cours, updateSelectedCours]);

  useEffect(() => {
    const updateSousMatiere = async () => {
      try {
        if (sousMatierePath) {
          const response = await fetchSousMatiereByPath(sousMatierePath);
          console.log(`Fetched sous-matiere: `, response);
          if (response) {
            setSelectedSousMatiere({ id: response.id, path: location.pathname });
          }
        }
      } catch (error) {
        console.error("Erreur de récupération de la sous-matière:", error);
      }
    };

    updateSousMatiere();
  }, [sousMatierePath, location.pathname]);

  useEffect(() => {
    const fetchCours = async () => {
      if (selectedSousMatiere && selectedSousMatiere.path) {
        setIsCoursLoading(true);
        try {
          const coursData = await fetchCoursData(selectedSousMatiere.path);
          // Précharger les images des cours
          await Promise.all(coursData.map(async (cour) => {
            const imageUrls = cour.attributes.images ? cour.attributes.images.map(img => `${server}${img.url}`) : [];
            await Promise.all(imageUrls.map(preloadImage));
          }));
          setCours(coursData);
        } catch (error) {
          console.error("Erreur de récupération des cours:", error);
        } finally {
          setIsCoursLoading(false);
        }
      } else {
        setCours([]);
      }
    };

    fetchCours();
  }, [selectedSousMatiere, setCours, setIsCoursLoading]);

  const currentIndex = cours.findIndex(c => c.id === selectedCours?.id);
  console.log(`Current cours index: ${currentIndex}`);

  const prevItem = currentIndex > 0 ? { ...cours[currentIndex - 1], label: cours[currentIndex - 1]?.attributes?.titre } : null;
  const nextItem = currentIndex < cours.length - 1 ? { ...cours[currentIndex + 1], label: cours[currentIndex + 1]?.attributes?.titre } : null;

  const handleSelection = (cours) => {
    const pathSegments = location.pathname.split('/');
    const newPath = `${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(cours.attributes.titre)}`;
    navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
    console.log(`Navigating to: ${newPath}`);
  };

  const menuItems = cours.map(c => ({
    key: c.id.toString(),
    label: c.attributes?.titre || '',
    url: `${location.pathname.split('/').slice(0, 3).join('/')}/${toUrlFriendly(c.attributes.titre)}`,
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
                  sousMatiereId={sousMatierePath}
                />
                {isCoursLoading ? (
                  <CustomToothLoader />
                ) : (
                  <CasCardComponent
                    items={cours}
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
