// src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.PROD 
      ? 'https://tadefi-back.vercel.app' 
      : 'http://localhost:5000';
    return `${baseUrl}${imagePath}`;
  };