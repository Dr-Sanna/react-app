import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "./DataContext";
import LeftMenu from "./LeftMenu";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import CasCardComponent from "./CasCardComponent";
import CasDetailComponent from "./CasDetailComponent";
import { server } from "./config";
import { CustomToothLoader } from "./CustomToothLoader";
import { useSidebarContext } from './SidebarContext';
import { toUrlFriendly } from "./config";
import PaginationComponent from './PaginationComponent';

const CasCliniquesComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { casCliniques, isLoading } = useContext(DataContext);
  const [selectedCas, setSelectedCas] = useState(null);
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
    const titre = location.pathname.split("/").pop();
    updateSelectedCas(titre, casCliniques);
  }, [location.pathname, casCliniques, updateSelectedCas]);

  const currentIndex = casCliniques.findIndex(cas => cas.id === selectedCas?.id);

  const prevItem = currentIndex > 0 ? { ...casCliniques[currentIndex - 1], label: casCliniques[currentIndex - 1]?.attributes?.titre } : null;
  const nextItem = currentIndex < casCliniques.length - 1 ? { ...casCliniques[currentIndex + 1], label: casCliniques[currentIndex + 1]?.attributes?.titre } : null;

  const handleSelection = (cas) => {
    const pathSegments = location.pathname.split('/');
    const newPath = `${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(cas.attributes.titre)}`;
    navigate(newPath, { state: { sousMatiereId } });
  };

  const menuItems = casCliniques.map(cas => ({
    key: cas.id.toString(),
    label: cas.attributes?.titre || '',
    url: `${location.pathname.split('/').slice(0, 3).join('/')}/${toUrlFriendly(cas.attributes.titre)}`,
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
        <LeftMenu
          menuItems={menuItems}
          selectedKey={selectedCas?.id?.toString() || ""}
        />
        <main className={`docMainContainer_EfwR ${isSidebarVisible ? '' : 'docMainContainerEnhanced_r8nV'}`}>
          <div className={`container padding-top--md padding-bottom--lg ${isSidebarVisible ? '' : 'docItemWrapperEnhanced_nA1F'}`}>
            {selectedCas ? (
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
                  selectedCas={selectedCas}
                />
                {isLoading ? (
                  <CustomToothLoader />
                ) : (
                  <CasCardComponent
                    items={casCliniques}
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
