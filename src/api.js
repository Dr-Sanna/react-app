import axios from 'axios';

const sousMatierePathToIdMap = {
  "bilans-sanguins": 4,
  "risque-infectieux": 5,
  "risque-hemorragique": 11,
  "therapeutiques-pulpaires-des-dt": 10,
  "medecine-orale": 9,
  "occlusion-et-manducation": 7,
  // "occlusion-et-fonctions" retiré car il s'agit d'une matière
  // Ajoutez d'autres mappages si nécessaire
};

export const fetchMatieres = async () => {
  const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/matieres?populate=*`);
  return response.data.data;
};

export const fetchSousMatieres = async () => {
  const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/sous-matieres?populate=*`);
  return response.data.data;
};

export const fetchCasCliniques = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/cas-cliniques?populate[test][populate]=image,test,test.image`);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des cas cliniques:', error);
    throw error;
  }
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
  } else if (pathname.includes('occlusion-et-fonction')) {
    url = `${process.env.REACT_APP_STRAPI_URL}/api/occlusion-et-fonctions?populate[test][populate]=sous_matiere,image,test,test.image`;
    if (pathname.includes('occlusion-et-manducation')) {
      url += `&filters[test][sous_matiere][id][$eq]=7`;
    }
  } else if (pathname.includes('moco') && pathname.includes('medecine-orale')) {
    url = `${process.env.REACT_APP_STRAPI_URL}/api/medecine-orales?populate=*&filters[sous_matiere][id][$eq]=9`;
  }
  if (!url) return [];

  const response = await axios.get(url);
  return response.data.data;
};

export const fetchSousMatiereByPath = async (path) => {
  const id = sousMatierePathToIdMap[path];
  console.log(`Fetching sous-matiere for path: ${path}, resolved ID: ${id}`);
  if (!id) throw new Error(`No ID found for path: ${path}`);

  const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/sous-matieres/${id}`);
  return response.data.data;
};

export const fetchPartiesData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_STRAPI_URL}/api/occlusion-et-fonction-parties?populate[test][populate]=sous_matiere,image,test,test.image`);
  return response.data.data;
};
