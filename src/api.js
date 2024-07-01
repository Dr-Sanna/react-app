import axios from 'axios';

export const fetchMatieres = async () => {
  const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/matieres?populate=*`);
  return response.data.data;
};

export const fetchSousMatieres = async () => {
  const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/sous-matieres?populate=*`);
  return response.data.data;
};

export const fetchCasCliniques = async () => {
  const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate=*`);
  return response.data.data;
};

export const fetchCoursData = async (pathname) => {
  if (!pathname) throw new Error("Pathname is undefined");

  let url = '';
  if (pathname.includes('odontologie-pediatrique')) {
    url = `${process.env.REACT_APP_STRAPI_URL}/api/odontologie-pediatriques?populate=*`;
    if (pathname.includes('therapeutiques-pulpaires-des-dt')) {
      url += `&filters[sous_matiere][id][$eq]=10`;
    }
  } else if (pathname.includes('guide-clinique-d-odontologie')) {
    url = `${process.env.REACT_APP_STRAPI_URL}/api/guide-cliniques?populate=*`;
    if (pathname.includes('bilans-sanguins')) {
      url += `&filters[sous_matiere][id][$eq]=4`;
    } else if (pathname.includes('risque-infectieux')) {
      url += `&filters[sous_matiere][id][$eq]=5`;
    } else if (pathname.includes('risque-hemorragique')) {
      url += `&filters[sous_matiere][id][$eq]=11`;
    }
  } else if (pathname.includes('moco') && pathname.includes('medecine-orale')) {
    url = `${process.env.REACT_APP_STRAPI_URL}/api/medecine-orales?populate=*&filters[sous_matiere][id][$eq]=9`;
  }
  if (!url) return [];

  const response = await axios.get(url);
  return response.data.data;
};
