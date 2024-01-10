// Détermination de l'environnement de développement ou de production
const dev = process.env.NODE_ENV !== 'production';

// Configuration de l'URL du serveur en fonction de l'environnement
export const server = dev ? process.env.REACT_APP_STRAPI_URL : 'https://your-production-url.com';

// Fonction pour transformer un titre en format URL amical
export const toUrlFriendly = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Vous pouvez ajouter ici d'autres configurations ou fonctions utilitaires
// Par exemple, si vous avez des paramètres API récurrents ou des configurations de thèmes


