import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "./DataContext";
import LeftMenu from "./LeftMenu";
import BreadcrumbsCC from "./BreadcrumbsCC";
import CasCardComponent from "./CasCardComponent";
import CasDetailComponent from "./CasDetailComponent";
import { CustomToothLoader } from "./CustomToothLoader";
import { useSidebarContext } from './SidebarContext';
import { toUrlFriendly } from "./config";
import PaginationComponent from './PaginationComponent';
import { fetchCasCliniques } from './api'; // Importer l'API corrigée

const CasCliniquesComponent = ({ fontSize }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sousMatieres, casCliniques, isLoading, setCasCliniques, setIsLoading } = useContext(DataContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const { isSidebarVisible } = useSidebarContext();
  
  // Récupérer sousMatiereId depuis l'état de navigation ou à partir du pathname
  let sousMatiereId = location.state?.sousMatiereId;

  // Si sousMatiereId est undefined, on le cherche à partir du pathname
  useEffect(() => {
    if (!sousMatiereId) {
      const currentPathname = location.pathname.split("/").pop(); // On récupère la dernière partie du pathname
      const matchingSousMatiere = sousMatieres.find(sousMatiere => toUrlFriendly(sousMatiere.attributes.titre) === currentPathname);

      if (matchingSousMatiere) {
        sousMatiereId = matchingSousMatiere.id;
      }
    }

    // Si on ne trouve pas sousMatiereId, on log une erreur et on arrête l'exécution
    if (!sousMatiereId) {
      console.error("Impossible de déterminer sousMatiereId depuis pathname.");
      return;
    }

    // Avant de charger les nouveaux cas, on vide la liste des anciens cas
    setCasCliniques([]); // Vider immédiatement la liste pour éviter l'apparition des anciens cas
    setIsLoading(true);

    // Appel à fetchCasCliniques avec sousMatiereId
    fetchCasCliniques(sousMatiereId).then((data) => {
      setCasCliniques(data); // Mise à jour des cas cliniques dans le contexte
    }).catch((error) => {
      console.error("Erreur lors de la récupération des cas cliniques :", error);
    }).finally(() => {
      setIsLoading(false); // Arrêt du chargement une fois les données récupérées
    });
  }, [location.pathname, sousMatieres, sousMatiereId, setCasCliniques, setIsLoading]);

  const updateSelectedItem = useCallback(
    (titre, itemList) => {
      if (Array.isArray(itemList)) {
        const foundItem = itemList.find(
          (c) => c.attributes.test && toUrlFriendly(c.attributes.test.titre) === titre
        );
        setSelectedItem(foundItem || null);
      } else {
        console.error("itemList n'est pas un tableau:", itemList);
      }
    },
    []
  );

  useEffect(() => {
    const titre = location.pathname.split("/").pop();
    updateSelectedItem(titre, casCliniques);
  }, [location.pathname, casCliniques, updateSelectedItem]);

  const handleSelectionChange = (cours, partie) => {
    console.log(`Selected cours: ${cours}, Selected partie: ${partie}`);
  };

  const handleNavigatePrev = (item) => {
    const pathSegments = location.pathname.split('/');
    const newPath = `${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(item.attributes.test.titre)}`;
    navigate(newPath, { state: { sousMatiereId } });
  };

  const handleNavigateNext = (item) => {
    const pathSegments = location.pathname.split('/');
    const newPath = `${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(item.attributes.test.titre)}`;
    navigate(newPath, { state: { sousMatiereId } });
  };

  const currentIndex = casCliniques.findIndex(item => item.id === selectedItem?.id);

  const prevItem = currentIndex > 0 ? { ...casCliniques[currentIndex - 1], label: casCliniques[currentIndex - 1]?.attributes?.test?.titre } : null;
  const nextItem = currentIndex < casCliniques.length - 1 ? { ...casCliniques[currentIndex + 1], label: casCliniques[currentIndex + 1]?.attributes?.test?.titre } : null;

  const handleSelection = (item) => {
    const pathSegments = location.pathname.split('/');
    const newPath = `${pathSegments.slice(0, 3).join('/')}/${toUrlFriendly(item.attributes.test.titre)}`;
    navigate(newPath, { state: { sousMatiereId } });
  };

  const menuItems = casCliniques.map(item => ({
    key: item.id.toString(),
    label: item.attributes?.test?.titre || '',
    url: `${location.pathname.split('/').slice(0, 3).join('/')}/${toUrlFriendly(item.attributes.test.titre)}`,
    onClick: () => handleSelection(item),
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
          selectedKey={selectedItem?.id?.toString() || ""}
          onSelectionChange={handleSelectionChange}
        />
        <main className={`docMainContainer_EfwR ${isSidebarVisible ? '' : 'docMainContainerEnhanced_r8nV'}`} style={{ fontSize: `${fontSize}%` }}>
          <div className={`container padding-top--md padding-bottom--lg ${isSidebarVisible ? '' : 'docItemWrapperEnhanced_nA1F'}`}>
            {isLoading ? ( // Indicateur de chargement pendant que les cas cliniques sont récupérés
              <CustomToothLoader />
            ) : selectedItem ? (
              <div className="docItemContainer_RhpI" style={{ marginRight: '10px' }}>
                <article>
                  <BreadcrumbsCC
                    currentPath={location.pathname}
                    selectedItemTitle={selectedItem ? selectedItem.attributes.test.titre : ''}
                  />
                  {selectedItem.attributes && (
                    <CasDetailComponent
                      selectedCas={selectedItem}
                      imageUrl={selectedItem.attributes.test.image ? selectedItem.attributes.test.image.data.attributes.url : ''}
                    />
                  )}
                  {Array.isArray(selectedItem.attributes.test.test) && selectedItem.attributes.test.test.length > 0 && (
                    <div>
                      {selectedItem.attributes.test.test.map((testItem) => (
                        <div key={testItem.id}>
                          <h4>{testItem.titre}</h4>
                          <p>{testItem.enonce}</p>
                          {testItem.image && (
                            <img src={testItem.image.url} alt={testItem.titre} />
                          )}
                          {Array.isArray(testItem.test) && testItem.test.length > 0 && testItem.test.map((nestedTestItem) => (
                            <div key={nestedTestItem.id}>
                              <p>Question: {nestedTestItem.question}</p>
                              <p>Correction: {nestedTestItem.correction}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </article>
                {selectedItem && (
                  <PaginationComponent
                    prevItem={prevItem ? { ...prevItem } : null}
                    nextItem={nextItem ? { ...nextItem } : null}
                    onNavigatePrev={handleNavigatePrev}
                    onNavigateNext={handleNavigateNext}
                  />
                )}
              </div>
            ) : (
              <div className="docItemContainer_RhpI">
                <BreadcrumbsCC
                  currentPath={location.pathname}
                  selectedItem={selectedItem}
                />
                <CasCardComponent
                  items={casCliniques}
                  onSelection={handleSelection}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CasCliniquesComponent;
