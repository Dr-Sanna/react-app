import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "./DataContext";
import LeftMenu from "./LeftMenu";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import CasCardComponent from "./CasCardComponent";
import CoursDetailComponent from "./CoursDetailComponent";
import PartieDetailComponent from "./PartieDetailComponent";
import QuestionsComponent from "./QuestionsComponent";
import QuestionsPartiesComponent from "./QuestionsPartiesComponent";
import { toUrlFriendly } from "./config";
import { CustomToothLoader } from "./CustomToothLoader";
import { useSidebarContext } from './SidebarContext';
import { useToggle } from './ToggleContext';
import { fetchSousMatiereByPath, fetchCoursData, fetchPartiesData } from "./api";
import { preloadImage } from './utils';

const CoursComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cours, setCours, setIsCoursLoading } = useContext(DataContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPartie, setSelectedPartie] = useState(null);
  const [parties, setParties] = useState({});
  const { isSidebarVisible } = useSidebarContext();
  const { showQuestions } = useToggle();
  const [selectedSousMatiere, setSelectedSousMatiere] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const matierePath = pathSegments[0];
  const sousMatierePath = pathSegments[1];
  const coursTitre = pathSegments.length >= 3 ? pathSegments[2] : "";
  const partieTitre = pathSegments.length === 4 ? pathSegments[3] : "";

  useEffect(() => {
    const updateSousMatiere = async () => {
      if (!sousMatierePath) return;
      try {
        const response = await fetchSousMatiereByPath(sousMatierePath);
        if (response) {
          setSelectedSousMatiere({ id: response.id, path: location.pathname });
        }
      } catch (error) {
        console.error("Erreur de récupération de la sous-matière:", error);
      }
    };
    updateSousMatiere();
  }, [sousMatierePath, location.pathname]);

  useEffect(() => {
    const fetchCours = async () => {
      if (!selectedSousMatiere || !selectedSousMatiere.path) {
        setCours([]);
        setIsCoursLoading(false);
        setInitialLoading(false);
        return;
      }
      try {
        const coursData = await fetchCoursData(selectedSousMatiere.path);
        await Promise.all(coursData.map(async (cour) => {
          const imageUrls = cour.attributes.test?.images ? cour.attributes.test.images.map(img => `${img.url}`) : [];
          await Promise.all(imageUrls.map(preloadImage));
        }));
        setCours(coursData);
        const partsPromises = coursData.map(async (cour) => {
          if (cour.attributes.test?.hasParts) {
            const partiesData = await fetchPartiesData(cour.id);
            return { [cour.id]: partiesData };
          }
          return null;
        });
        const partsResults = await Promise.all(partsPromises);
        const partsMap = partsResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setParties(partsMap);
      } catch (error) {
        console.error("Erreur de récupération des cours:", error);
      } finally {
        setIsCoursLoading(false);
        setInitialLoading(false);
      }
    };
    if (selectedSousMatiere) {
      fetchCours();
    }
  }, [selectedSousMatiere, setCours, setIsCoursLoading]);

  useEffect(() => {
    if (!initialLoading && cours.length > 0) {
      const foundCours = cours.find(c => toUrlFriendly(c.attributes.test?.titre) === coursTitre);
      setSelectedItem(foundCours || null);

      if (foundCours && foundCours.attributes.test?.hasParts) {
        const foundPartie = (parties[foundCours.id] || []).find(p => toUrlFriendly(p.attributes.test?.titre) === partieTitre);
        setSelectedPartie(foundPartie || null);
      } else {
        setSelectedPartie(null);
      }
    }
  }, [cours, parties, initialLoading, coursTitre, partieTitre]);

  const handleSelectionChange = (selectedCoursTitle, selectedPartieTitle, replace = false) => {
    const newCours = cours.find(c => toUrlFriendly(c.attributes.test?.titre) === toUrlFriendly(selectedCoursTitle));
    const newPartie = newCours ? (parties[newCours.id] || []).find(p => toUrlFriendly(p.attributes.test?.titre) === toUrlFriendly(selectedPartieTitle)) : null;
    setSelectedItem(newCours);
    setSelectedPartie(newPartie);
    const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(selectedCoursTitle)}${selectedPartieTitle ? `/${toUrlFriendly(selectedPartieTitle)}` : ''}`;
    navigate(newPath, { replace });
  };

  const currentIndex = cours.findIndex(c => c.id === selectedItem?.id);
  const prevPartieIndex = selectedItem && selectedPartie ? (parties[selectedItem.id] || []).findIndex(p => p.id === selectedPartie.id) - 1 : -1;
  const nextPartieIndex = selectedItem && selectedPartie ? (parties[selectedItem.id] || []).findIndex(p => p.id === selectedPartie.id) + 1 : -1;
  const prevPartie = selectedItem && prevPartieIndex >= 0 ? (parties[selectedItem.id] || [])[prevPartieIndex] : null;
  const nextPartie = selectedItem && nextPartieIndex < (parties[selectedItem.id] || []).length ? (parties[selectedItem.id] || [])[nextPartieIndex] : null;

  const prevItem = currentIndex > 0 ? cours[currentIndex - 1] : null;
  const nextItem = currentIndex < cours.length - 1 ? cours[currentIndex + 1] : null;

  const menuItems = cours.map(c => ({
    key: c.id.toString(),
    label: c.attributes?.test?.titre || '',
    url: `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(c.attributes?.test?.titre || '')}`,
    hasParts: c.attributes?.test?.hasParts
  }));

  const handleNavigatePrev = (item) => {
    handleSelectionChange(item.attributes.test?.titre, null);
  };

  const handleNavigateNext = (item) => {
    handleSelectionChange(item.attributes.test?.titre, null);
  };

  const handleNavigatePartie = (partie, isPrev) => {
    if (isPrev) {
      handleSelectionChange(selectedItem?.attributes?.test?.titre, partie.attributes.test?.titre);
    } else {
      handleSelectionChange(selectedItem?.attributes?.test?.titre, partie.attributes.test?.titre);
    }
  };

  if (initialLoading) {
    return <CustomToothLoader />;
  }

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
          parties={parties}
          onSelectionChange={(selectedCoursTitle, selectedPartieTitle) => handleSelectionChange(selectedCoursTitle, selectedPartieTitle, true)}
        />
        <main className={`docMainContainer_EfwR ${isSidebarVisible ? '' : 'docMainContainerEnhanced_r8nV'}`}>
          <div className={`container padding-top--md padding-bottom--lg ${isSidebarVisible ? '' : 'docItemWrapperEnhanced_nA1F'}`}>
            <BreadcrumbsComponent
              currentPath={location.pathname}
              selectedCasTitle={selectedItem?.attributes?.test?.titre || ''}
              selectedPartieTitle={selectedPartie?.attributes?.test?.titre || ''}
              sousMatiereId={sousMatierePath}
            />
            {selectedItem && !selectedPartie ? (
              <div className="docItemContainer_RhpI" style={{ marginRight: '10px' }}>
                <article>
                  {showQuestions ? (
                    <QuestionsComponent 
                      questions={selectedItem?.attributes?.test?.nestedTestItem?.question} 
                      corrections={selectedItem?.attributes?.test?.nestedTestItem?.correction}
                      title={selectedItem?.attributes?.test?.titre}
                    />
                  ) : (
                    <CoursDetailComponent
                      key={selectedItem.id}
                      selectedItem={selectedItem}
                      parties={parties[selectedItem?.id] || []}
                      selectedPartie={selectedPartie}
                      setSelectedPartie={setSelectedPartie}
                      onNavigatePartie={(partie) => handleSelectionChange(selectedItem?.attributes?.test?.titre, partie.attributes.test?.titre)}
                      prevItem={prevItem}
                      nextItem={nextItem}
                      onNavigatePrev={handleNavigatePrev}
                      onNavigateNext={handleNavigateNext}
                      imageUrl={selectedItem?.attributes?.test?.image?.data?.attributes?.url || ''}
                    />
                  )}
                </article>
              </div>
            ) : selectedPartie ? (
              <div className="docItemContainer_RhpI" style={{ marginRight: '10px' }}>
                <article>
                  {showQuestions ? (
                    <QuestionsPartiesComponent
                      questions={selectedPartie?.attributes?.test?.question}
                      corrections={selectedPartie?.attributes?.test?.correction}
                      title={selectedPartie?.attributes?.test?.titre}
                    />
                  ) : (
                    <PartieDetailComponent 
                      key={selectedPartie.id}
                      selectedPartie={selectedPartie}
                      parentCours={selectedItem}
                      prevPartie={prevPartie}
                      nextPartie={nextPartie}
                      onNavigatePartie={(partie) => handleNavigatePartie(partie, false)}
                      onNavigatePrev={(partie) => handleNavigatePartie(partie, true)}
                      matierePath={matierePath}
                      sousMatierePath={sousMatierePath}
                      imageUrl={selectedPartie?.attributes?.test?.image?.data?.attributes?.url || ''}
                    />
                  )}
                </article>
              </div>
            ) : (
              <CasCardComponent
                items={cours}
                onSelection={(cour) => handleSelectionChange(cour.attributes?.test?.titre, null)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursComponent;
