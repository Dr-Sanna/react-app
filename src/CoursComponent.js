import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "./DataContext";
import LeftMenu from "./LeftMenu";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import CasCardComponent from "./CasCardComponent";
import CoursDetailComponent from "./CoursDetailComponent";
import PartieDetailComponent from "./PartieDetailComponent";
import QuestionsComponent from "./QuestionsComponent";
import { toUrlFriendly } from "./config";
import { CustomToothLoader } from "./CustomToothLoader";
import { useSidebarContext } from './SidebarContext';
import { useToggle } from './ToggleContext';
import { fetchSousMatiereByPath, fetchCoursData, fetchPartiesData } from "./api";
import { preloadImage } from './utils';
import { server } from './config';

const CoursComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cours, setCours, setIsCoursLoading } = useContext(DataContext);
  const [selectedCours, setSelectedCours] = useState(null);
  const [selectedPartie, setSelectedPartie] = useState(null);
  const [parties, setParties] = useState({});
  const { isSidebarVisible } = useSidebarContext();
  const { showQuestions } = useToggle();
  const [selectedSousMatiere, setSelectedSousMatiere] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const sousMatierePath = pathSegments.length >= 2 ? pathSegments[1] : "";
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
          const imageUrls = cour.attributes.images ? cour.attributes.images.map(img => `${server}${img.url}`) : [];
          await Promise.all(imageUrls.map(preloadImage));
        }));
        setCours(coursData);
        const partsPromises = coursData.map(async (cour) => {
          if (cour.attributes.hasParts) {
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
      const foundCours = cours.find(c => toUrlFriendly(c.attributes.titre) === coursTitre);
      setSelectedCours(foundCours || null);

      if (foundCours && foundCours.attributes.hasParts) {
        const foundPartie = (parties[foundCours.id] || []).find(p => toUrlFriendly(p.attributes.titre) === partieTitre);
        setSelectedPartie(foundPartie || null);
      } else {
        setSelectedPartie(null);
      }
    }
  }, [cours, parties, initialLoading, coursTitre, partieTitre]);

  const currentIndex = cours.findIndex(c => c.id === selectedCours?.id);
  const prevItem = currentIndex > 0 ? { ...cours[currentIndex - 1], label: cours[currentIndex - 1]?.attributes?.titre } : null;
  const nextItem = currentIndex < cours.length - 1 ? { ...cours[currentIndex + 1], label: cours[currentIndex + 1]?.attributes?.titre } : null;

  const handleSelection = (cours) => {
    setSelectedPartie(null);
    const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(cours.attributes.titre)}`;
    if (location.pathname !== newPath) {
      navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
      setSelectedCours(cours);
    }
  };

  const handleNavigatePartie = (partie, parentCoursLabel) => {
    const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(parentCoursLabel)}/${toUrlFriendly(partie.attributes.titre)}`;
    if (location.pathname !== newPath) {
      navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
      setSelectedPartie(partie);
    }
  };

  const handleNavigateCours = (item) => {
    setSelectedPartie(null);
    const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(item.attributes.titre)}`;
    if (location.pathname !== newPath) {
      navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
      setSelectedCours(item);
    }
  };

  const handleNavigatePrev = (item) => {
    if (selectedPartie) {
      const currentPartieIndex = parties[selectedCours.id].findIndex(p => p.id === selectedPartie.id);
      if (currentPartieIndex > 0) {
        const prevPartie = parties[selectedCours.id][currentPartieIndex - 1];
        const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(selectedCours.attributes.titre)}/${toUrlFriendly(prevPartie.attributes.titre)}`;
        if (location.pathname !== newPath) {
          navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
          setSelectedPartie(prevPartie);
        }
      } else {
        setSelectedPartie(null);
        handleNavigateCours(selectedCours);
      }
    } else {
      const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(item.attributes.titre)}`;
      if (location.pathname !== newPath) {
        navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
        setSelectedCours(item);
        setSelectedPartie(null);
      }
    }
  };

  const handleNavigateNext = (item) => {
    if (selectedPartie) {
      const currentPartieIndex = parties[selectedCours.id].findIndex(p => p.id === selectedPartie.id);
      if (currentPartieIndex < parties[selectedCours.id].length - 1) {
        const nextPartie = parties[selectedCours.id][currentPartieIndex + 1];
        const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(selectedCours.attributes.titre)}/${toUrlFriendly(nextPartie.attributes.titre)}`;
        if (location.pathname !== newPath) {
          navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
          setSelectedPartie(nextPartie);
        }
      } else {
        setSelectedPartie(null);
        const nextIndex = currentIndex + 1;
        if (nextIndex < cours.length) {
          const nextCours = cours[nextIndex];
          const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(nextCours.attributes.titre)}`;
          if (location.pathname !== newPath) {
            navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
            setSelectedCours(nextCours);
          }
        }
      }
    } else {
      const nextIndex = currentIndex + 1;
      if (nextIndex < cours.length) {
        const nextCours = cours[nextIndex];
        const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(nextCours.attributes.titre)}`;
        if (location.pathname !== newPath) {
          navigate(newPath, { state: { sousMatiereId: sousMatierePath } });
          setSelectedCours(nextCours);
        }
      }
    }
  };

  const menuItems = cours.map(c => ({
    key: c.id.toString(),
    label: c.attributes?.titre || '',
    url: `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(c.attributes.titre)}`,
    onClick: () => handleSelection(c),
    hasParts: c.attributes.hasParts
  }));

  if (initialLoading) {
    return <CustomToothLoader />;
  }

  const currentPartieIndex = selectedPartie ? parties[selectedCours?.id]?.findIndex(p => p.id === selectedPartie.id) : -1;
  const prevPartie = currentPartieIndex > 0 ? parties[selectedCours?.id][currentPartieIndex - 1] : null;
  const nextPartie = currentPartieIndex < parties[selectedCours?.id]?.length - 1 ? parties[selectedCours?.id][currentPartieIndex + 1] : null;

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
          selectedCours={selectedCours}
          parties={parties}
          onPartieClick={(partie, parentCoursLabel) => handleNavigatePartie(partie, parentCoursLabel)}
        />
        <main className={`docMainContainer_EfwR ${isSidebarVisible ? '' : 'docMainContainerEnhanced_r8nV'}`}>
          <div className={`container padding-top--md padding-bottom--lg ${isSidebarVisible ? '' : 'docItemWrapperEnhanced_nA1F'}`}>
            <BreadcrumbsComponent
              currentPath={location.pathname}
              selectedCasTitle={selectedCours ? selectedCours.attributes.titre : ''}
              selectedPartieTitle={selectedPartie ? selectedPartie.attributes.titre : ''}
              sousMatiereId={sousMatierePath}
            />
            {selectedCours && !selectedPartie ? (
              <div className="docItemContainer_RhpI" style={{ marginRight: '10px' }}>
                <article>
                  {showQuestions ? (
                    <QuestionsComponent 
                      questions={selectedCours.attributes.question} 
                      corrections={selectedCours.attributes.correction}
                      title={selectedCours.attributes.titre}
                    />
                  ) : (
                    <CoursDetailComponent
                      key={selectedCours.id}
                      selectedCas={selectedCours}
                      parties={parties[selectedCours?.id] || []}
                      selectedPartie={selectedPartie}
                      setSelectedPartie={setSelectedPartie}
                      onNavigatePartie={(partie) => handleNavigatePartie(partie, selectedCours.attributes.titre)}
                      prevItem={prevItem}
                      nextItem={nextItem}
                      onNavigate={handleSelection}
                      onNavigatePrev={handleNavigatePrev}
                      onNavigateNext={handleNavigateNext}
                    />
                  )}
                </article>
              </div>
            ) : selectedPartie ? (
              <PartieDetailComponent 
                selectedPartie={selectedPartie}
                prevPartie={prevPartie}
                nextPartie={nextPartie}
                onNavigatePartie={(partie) => handleNavigatePartie(partie, selectedCours.attributes.titre)}
                onNavigateCours={handleNavigateCours}
                parentCours={selectedCours}
                onNavigatePrev={handleNavigatePrev}
                onNavigateNext={handleNavigateNext}
              />
            ) : (
              <CasCardComponent
                items={cours}
                onSelection={handleSelection}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursComponent;
