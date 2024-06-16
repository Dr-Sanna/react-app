import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [matieres, setMatieres] = useState([]);
  const [sousMatieres, setSousMatieres] = useState([]);
  const [casCliniques, setCasCliniques] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matieresResponse = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/matieres?populate=*`);
        const sousMatieresResponse = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/sous-matieres?populate=*`);
        const casCliniquesResponse = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*`);

        if (matieresResponse.data && matieresResponse.data.data) {
          setMatieres(matieresResponse.data.data);
        }
        if (sousMatieresResponse.data && sousMatieresResponse.data.data) {
          setSousMatieres(sousMatieresResponse.data.data);
        }
        if (casCliniquesResponse.data && casCliniquesResponse.data.data) {
          setCasCliniques(casCliniquesResponse.data.data);
        }
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ matieres, sousMatieres, casCliniques }}>
      {children}
    </DataContext.Provider>
  );
};
