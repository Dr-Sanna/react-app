import React, { useContext, useEffect, useState, useMemo } from 'react';
import { DataContext } from './DataContext';
import "./HomePage.css";
import DisplayItems from "./DisplayItems";
import Matiere from "./Matiere";
import LiensUtilesWithData from "./LiensUtilesWithData";
import CasCliniquesComponent from "./CasCliniquesComponent";
import CoursComponent from "./CoursComponent";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toUrlFriendly } from "./config";
import CustomNavbar from "./CustomNavbar";
import CoursDetailLoader from './CoursDetailLoader';
import { CustomToothLoader } from './CustomToothLoader';

const HomePage = () => {
  const { matieres, sousMatieres } = useContext(DataContext); // Supprimez `isLoading` ici
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);

  const handleMatiereClick = (matiere) => {
    const matiereTitleUrl = toUrlFriendly(matiere.attributes.titre);
    navigate(`/${matiereTitleUrl}`);
  };

  const getComponentByActionType = useMemo(() => (actionType) => {
    switch(actionType) {
      case 'cours':
        return CoursComponent;
      case 'cas_cliniques':
        return CasCliniquesComponent;
      case 'liens_utiles':
        return LiensUtilesWithData;
      default:
        return CoursComponent;
    }
  }, []);

  useEffect(() => {
    if (matieres && matieres.length > 0) {
      setInitialLoad(false);
    }
  }, [matieres]);

  return (
    <div id="__docusaurus_skipToContent_fallback" className="main-wrapper mainWrapper_PEsc">
      <CustomNavbar />
      <Routes>
        <Route
          path="/"
          element={
            initialLoad ? (
              <CustomToothLoader />
            ) : (
              matieres ? (
                <DisplayItems items={matieres} onClickItem={handleMatiereClick} />
              ) : (
                <div>Loading...</div>
              )
            )
          }
        />
        <Route
          path="/:matiereTitle"
          element={<Matiere />}
        />
        <Route
          path="/ressources-utiles/:lienUtileTitle"
          element={<LiensUtilesWithData />}
        />
        {sousMatieres && sousMatieres.map((sousMatiere) => {
          const Component = getComponentByActionType(sousMatiere.attributes.actionType);
          const matiereTitleUrl = toUrlFriendly(sousMatiere.attributes.matiere.data.attributes.titre);
          const sousMatiereTitleUrl = toUrlFriendly(sousMatiere.attributes.titre);
          return (
            <Route
              key={sousMatiere.id}
              path={`/${matiereTitleUrl}/${sousMatiereTitleUrl}/*`}
              element={<Component />}
            />
          );
        })}
        <Route
          path="/:matiereTitle/:sousMatiereTitle/:coursTitle"
          element={<CoursDetailLoader />}
        />
      </Routes>
    </div>
  );
};

export default React.memo(HomePage);
