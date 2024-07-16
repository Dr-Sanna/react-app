import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "./DataContext";
import LeftMenu from "./LeftMenu";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import CasCardComponent from "./CasCardComponent";
import CoursDetailComponent from "./CoursDetailComponent";
import { toUrlFriendly } from "./config";
import { CustomToothLoader } from "./CustomToothLoader";
import { useSidebarContext } from './SidebarContext';
import { fetchSousMatiereByPath, fetchCoursData } from "./api";
import { preloadImage } from './utils';

const CoursComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cours, setCours, setIsCoursLoading } = useContext(DataContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const { isSidebarVisible } = useSidebarContext();
  const [selectedSousMatiere, setSelectedSousMatiere] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const matierePath = pathSegments[0];
  const sousMatierePath = pathSegments[1];
  const coursTitre = pathSegments.length >= 3 ? pathSegments[2] : "";
  const partieTitre = pathSegments.length >= 4 ? pathSegments[3] : "";

  useEffect(() => {
    const updateSousMatiere = async () => {
      if (!sousMatierePath) return;
      try {
        const response = await fetchSousMatiereByPath(location.pathname);
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
      if (foundCours) {
        if (partieTitre) {
          const foundPart = foundCours.attributes.test?.parts?.find(part => toUrlFriendly(part.titre) === partieTitre);
          if (foundPart) {
            setSelectedItem({ ...foundCours, currentPart: foundPart.titre });
          } else {
            setSelectedItem(foundCours);
          }
        } else {
          setSelectedItem(foundCours);
        }
      }
    }
  }, [cours, initialLoading, coursTitre, partieTitre]);

  const handleSelectionChange = (selectedCoursTitle, replace = false) => {
    const newCours = cours.find(c => toUrlFriendly(c.attributes.test?.titre) === toUrlFriendly(selectedCoursTitle));
    setSelectedItem(newCours);
    const newPath = `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(selectedCoursTitle)}`;
    navigate(newPath, { replace });
  };

  const fetchPartsTitles = (cour) => {
    const partsRelationName = Object.keys(cour.attributes).find(key => key.endsWith('_parties'));
    if (!partsRelationName) {
      return [];
    }

    const partsRelation = cour.attributes[partsRelationName]?.data;

    return partsRelation 
      ? partsRelation.map(part => {
          const testArray = part.attributes.test;
          if (Array.isArray(testArray)) {
            return testArray.map(t => t.titre);
          }
          return part.attributes.test?.titre ? [part.attributes.test.titre] : [];
        }).flat()
      : [];
  };

  const selectedPart = selectedItem ? fetchPartsTitles(selectedItem).find(part => toUrlFriendly(part) === partieTitre) : null;

  const sortedCours = cours ? [...cours].sort((a, b) => a.id - b.id) : [];

  const menuItems = sortedCours.map(c => ({
    key: c.id.toString(),
    label: c.attributes?.test?.titre || '',
    url: `/${pathSegments.slice(0, 2).join('/')}/${toUrlFriendly(c.attributes?.test?.titre || '')}`,
    partsTitles: fetchPartsTitles(c)
  }));

  if (initialLoading) {
    return <CustomToothLoader />;
  }

  const showCasCardComponent = !coursTitre && !partieTitre;

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
          onSelectionChange={(selectedCoursTitle) => handleSelectionChange(selectedCoursTitle, true)}
        />
        <main className={`docMainContainer_EfwR ${isSidebarVisible ? '' : 'docMainContainerEnhanced_r8nV'}`}>
          <div className={`container padding-top--md padding-bottom--lg ${isSidebarVisible ? '' : 'docItemWrapperEnhanced_nA1F'}`}>
            <BreadcrumbsComponent
              currentPath={location.pathname}
              selectedCasTitle={selectedItem?.attributes?.test?.titre || ''}
              selectedPartieTitle={selectedPart ? selectedPart.titre : null}
            />
            {showCasCardComponent ? (
              <CasCardComponent
                items={sortedCours}
                onSelection={(cour) => handleSelectionChange(cour.attributes?.test?.titre, null)}
              />
            ) : selectedItem ? (
              <div className="docItemContainer_RhpI" style={{ marginRight: '10px' }}>
                <CoursDetailComponent
                  key={selectedItem.id}
                  selectedItem={selectedItem}
                  allItems={sortedCours}
                  imageUrl={selectedItem?.attributes?.test?.image?.data?.attributes?.url || ''}
                />
              </div>
            ) : (
              <CasCardComponent
                items={sortedCours}
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
