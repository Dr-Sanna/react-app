// utils.js
export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = resolve;
    img.onerror = reject;
  });
};

export const preloadImages = async (imageUrls) => {
  await Promise.all(imageUrls.map(preloadImage));
};
