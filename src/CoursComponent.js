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

const CoursComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cours, isCoursLoading } = useContext(DataContext);
  const [selectedCours, setSelectedCours] = useState(null);
  const { isSidebarVisible } = useSidebarContext();
  const sousMatiereId = location.state?.sousMatiereId;

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
    const titre = location.pathname.split("/").pop();
    updateSelectedCours(titre, cours);
  }, [location.pathname, cours, updateSelectedCours]);

  const currentIndex = cours.findIndex(c => c.id === selectedCours?.id);

  const prevItem = currentIndex > 0 ? { ...cours[currentIndex - 1], label: cours[currentIndex - 1]?.attributes?.titre } : null;
  const nextItem = currentIndex < cours.length - 1 ? { ...cours[currentIndex + 1], label: cours[currentIndex + 1]?.attributes?.titre } : null;

  const handleSelection = (cours) => {
    const pathSegments = location.pathname.split('/');
    const newPath = `${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(cours.attributes.titre)}`;
    navigate(newPath, { state: { sousMatiereId } });
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
                  sousMatiereId={sousMatiereId}
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
