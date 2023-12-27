const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? process.env.REACT_APP_STRAPI_URL : '';
