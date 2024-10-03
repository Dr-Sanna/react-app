// HomePage.js
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { DataContext } from './DataContext';
import './HomePage.css';
import DisplayItems from './DisplayItems';
import Matiere from './Matiere';
import LiensUtilesWithData from './LiensUtilesWithData';
import CasCliniquesComponent from './CasCliniquesComponent';
import CoursComponent from './CoursComponent';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { toUrlFriendly } from './config';
import CoursDetailLoader from './CoursDetailLoader';
import { CustomToothLoader } from './CustomToothLoader';
import MainSections from './MainSections';
import HeroBanner from './HeroBanner';
import RandomisationComponent from './RandomisationComponent';
import BackgroundWrapper from './BackgroundWrapper'; // Importation du BackgroundWrapper

const HomePage = ({ fontSize }) => {
  const { matieres, sousMatieres, isLoading } = useContext(DataContext);
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);

  const handleMatiereClick = (matiere) => {
    const matiereTitleUrl = toUrlFriendly(matiere.attributes.titre);
    navigate(`/${matiereTitleUrl}`);
  };

  const getComponentByActionType = useMemo(
    () => (actionType) => {
      switch (actionType) {
        case 'cours':
          return CoursComponent;
        case 'cas_cliniques':
          return CasCliniquesComponent;
        case 'liens_utiles':
          return LiensUtilesWithData;
        default:
          return CoursComponent;
      }
    },
    []
  );

  useEffect(() => {
    if (!isLoading && matieres.length > 0) {
      setInitialLoad(false);
    }
  }, [isLoading, matieres]);

  return (
    <div
      id="__docusaurus_skipToContent_fallback"
      className="main-wrapper mainWrapper_PEsc"
    >
      {/* Supprimez le HeroBanner d'ici pour éviter la duplication */}
      {/* {location.pathname === '/' && <HeroBanner />} */}
      <Routes>
        {/* Page d'accueil */}
        <Route
          path="/"
          element={
            <BackgroundWrapper>
              <HeroBanner />
              {initialLoad ? (
                <CustomToothLoader />
              ) : (
                <MainSections />
              )}
            </BackgroundWrapper>
          }
        />
        {/* Page de documentation */}
        <Route
          path="/documentation"
          element={
            <BackgroundWrapper>
              {matieres ? (
                <DisplayItems
                  items={matieres}
                  onClickItem={handleMatiereClick}
                  isMatiere={true}
                />
              ) : (
                <div>Loading...</div>
              )}
            </BackgroundWrapper>
          }
        />
        {/* Liens Utiles */}
        <Route
          path="/liens-utiles/:lienUtileTitle"
          element={
            <BackgroundWrapper>
              <LiensUtilesWithData />
            </BackgroundWrapper>
          }
        />
        <Route
          path="/liens-utiles"
          element={
            <BackgroundWrapper>
              <LiensUtilesWithData />
            </BackgroundWrapper>
          }
        />
        {/* Application de Randomisation */}
        <Route 
          path="/randomisation" 
         element={
           <RandomisationComponent />
          } 
        />

        {/* Détails des cours */}
        <Route
          path="/:matiereTitle/:sousMatiereTitle/:coursTitle"
          element={<CoursDetailLoader />}
        />
        {/* Sous-matières */}
        {sousMatieres &&
          sousMatieres.map((sousMatiere) => {
            const Component = getComponentByActionType(
              sousMatiere.attributes.actionType
            );
            const matiereTitleUrl = toUrlFriendly(
              sousMatiere.attributes.matiere.data.attributes.titre
            );
            const sousMatiereTitleUrl = toUrlFriendly(
              sousMatiere.attributes.titre
            );
            return (
              <Route
                key={sousMatiere.id}
                path={`/${matiereTitleUrl}/${sousMatiereTitleUrl}/*`}
                element={<Component fontSize={fontSize} />}
              />
            );
          })}
        {/* Matières */}
        <Route
          path="/:matiereTitle"
          element={
            <BackgroundWrapper>
              <Matiere />
            </BackgroundWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default React.memo(HomePage);
