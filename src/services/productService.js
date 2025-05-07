// src/services/productService.js

// Get the base URL dynamically
const getBaseUrl = () => {
  // Check if we're in production (Vercel)
  if (window.location.hostname !== 'localhost') {
    // Use the same origin for API calls in production
    return '';
  }
  // In development, we're likely using the separate backend server
  return 'http://localhost:5000';
};

const API_URL = `${getBaseUrl()}/api`;


/**
 * Fetch all products for product listing
 * @returns {Promise<Array>} Array of products with basic information
 */
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // Return empty array to prevent UI errors
    return [];
  }
};

/**
 * Fetch a single product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object>} Detailed product information
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product #${id}:`, error);
    throw error;
  }
};

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products in the category
 */
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching products in category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch products in category ${category}:`, error);
    // Return empty array to prevent UI errors
    return [];
  }
};

/**
 * Fetch featured products for homepage display
 * @returns {Promise<Array>} Array of featured products
 */
export const fetchFeaturedProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products/featured/items`);
    
    if (!response.ok) {
      throw new Error(`Error fetching featured products: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    // Return empty array to prevent UI errors
    return [];
  }
};