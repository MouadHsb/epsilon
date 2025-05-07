// src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
  // Just use the path directly, or prepend with / if needed
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
};