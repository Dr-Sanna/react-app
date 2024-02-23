import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HomePage.css";
import DisplayItems from "./DisplayItems";
import Matiere from "./Matiere";
import LiensUtilesWithData from "./LiensUtilesWithData";
import CasCliniquesComponent from "./CasCliniquesComponent";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toUrlFriendly } from "./config";
import CustomNavbar from "./CustomNavbar";

const HomePage = () => {
  const [matieres, setMatieres] = useState([]);
  const [casCliniques, setCasCliniques] = useState([]);
  const navigate = useNavigate();

  // Chargement des données des matières au montage du composant.
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_STRAPI_URL}/api/matieres?populate=*`)
      .then((response) => {
        if (response.data && response.data.data) {
          setMatieres(response.data.data);
        }
      })
      .catch((error) =>
        console.error("Erreur de récupération des données:", error)
      );
  }, []);

  // Chargement des données des cas cliniques au montage du composant.
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*`)
      .then((response) => {
        if (response.data && response.data.data) {
          setCasCliniques(response.data.data);
        }
      })
      .catch((error) =>
        console.error("Erreur de récupération des cas cliniques:", error)
      );
  }, []);


  // Fonction pour gérer le clic sur une matière et naviguer vers son URL.
  const handleMatiereClick = (matiere) => {
    const matiereTitleUrl = toUrlFriendly(matiere.attributes.titre);
    navigate(`/${matiereTitleUrl}`);
  };

    // Rendu de la structure générale de la page avec un Header, un Layout et des Routes.
  return (
    
    <div id="__docusaurus_skipToContent_fallback" className="main-wrapper mainWrapper_PEsc">
      <CustomNavbar />

      <Routes>
        <Route
          path="/"
          element={
            <DisplayItems items={matieres} onClickItem={handleMatiereClick} />
          }
        />
        <Route
          path="/:matiereTitle"
          element={<Matiere matieres={matieres} casCliniques={casCliniques} />}
        />
        <Route
          path="/ressources-utiles/:lienUtileTitle"
          element={<LiensUtilesWithData />}
        />
        <Route
          path="/moco/cas-cliniques-du-cneco/*"
          element={<CasCliniquesComponent />}
        />
        <Route
          path="/guide-clinique-d-odontologie/bilans-sanguins/*"
          element={<CasCliniquesComponent />}
        />
        <Route
          path="/guide-clinique-d-odontologie/foyers-infectieux-buccodentaires/*"
          element={<CasCliniquesComponent />}
        />
      </Routes>
    </div>
  );
};

export default HomePage;
