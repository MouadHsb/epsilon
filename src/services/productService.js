// src/services/productService.js
import products from '../data/products.js';

/**
 * Optional network delay simulation for development
 * Helps test loading states and spinners
 */
const simulateDelay = (ms = 200) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Format product for listing (removes heavy data like full descriptions)
 */
const formatProductForListing = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  category: product.category,
  image: product.images[0],
  featured: product.featured
});

/**
 * Fetch all products for product listing
 * @returns {Promise<Array>} Array of products with basic information
 */
export const fetchProducts = async () => {
  try {
    await simulateDelay();
    const productsList = products.map(formatProductForListing);
    console.log(`✅ Loaded ${productsList.length} products (local data)`);
    return productsList;
  } catch (error) {
    console.error('Failed to fetch products:', error);
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
    await simulateDelay();
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    console.log(`✅ Loaded product: ${product.name} (local data)`);
    return product;
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
    await simulateDelay();
    const filteredProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    const productsList = filteredProducts.map(formatProductForListing);
    console.log(`✅ Loaded ${productsList.length} products in category "${category}" (local data)`);
    return productsList;
  } catch (error) {
    console.error(`Failed to fetch products in category ${category}:`, error);
    return [];
  }
};

/**
 * Fetch featured products for homepage display
 * @returns {Promise<Array>} Array of featured products
 */
export const fetchFeaturedProducts = async () => {
  try {
    await simulateDelay();
    const featuredProducts = products.filter(p => p.featured);
    const productsList = featuredProducts.map(formatProductForListing);
    console.log(`✅ Loaded ${productsList.length} featured products (local data)`);
    return productsList;
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
};

console.log('🔧 Product Service: Using local static data');