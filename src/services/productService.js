// src/services/productService.js
import products from '../../api/data/product.js';

// Simple environment detection - only check if we're in development mode
const isDev = import.meta.env.DEV;

/**
 * Optional network delay simulation for development
 * Helps test loading states and spinners
 */
const simulateDelay = (ms = 200) => {
  return isDev ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();
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
    if (isDev) {
      // Local development - use static data
      await simulateDelay();
      const productsList = products.map(formatProductForListing);
      console.log(`✅ Loaded ${productsList.length} products (local data)`);
      return productsList;
    } else {
      // Production - use API
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      return await response.json();
    }
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
    if (isDev) {
      // Local development - use static data
      await simulateDelay();
      const product = products.find(p => p.id === parseInt(id));
      if (!product) {
        throw new Error('Product not found');
      }
      console.log(`✅ Loaded product: ${product.name} (local data)`);
      return product;
    } else {
      // Production - use API
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.statusText}`);
      }
      return await response.json();
    }
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
    if (isDev) {
      // Local development - use static data
      await simulateDelay();
      const filteredProducts = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
      const productsList = filteredProducts.map(formatProductForListing);
      console.log(`✅ Loaded ${productsList.length} products in category "${category}" (local data)`);
      return productsList;
    } else {
      // Production - use API
      const response = await fetch(`/api/products/category/${category}`);
      if (!response.ok) {
        throw new Error(`Error fetching products in category: ${response.statusText}`);
      }
      return await response.json();
    }
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
    if (isDev) {
      // Local development - use static data
      await simulateDelay();
      const featuredProducts = products.filter(p => p.featured);
      const productsList = featuredProducts.map(formatProductForListing);
      console.log(`✅ Loaded ${productsList.length} featured products (local data)`);
      return productsList;
    } else {
      // Production - use API
      const response = await fetch('/api/products/featured/items');
      if (!response.ok) {
        throw new Error(`Error fetching featured products: ${response.statusText}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
};

// Development info
if (isDev) {
  console.log('🔧 Product Service: Using local static data for development');
}