// src/utils/priceUtils.js

/**
 * Formats a price value for display
 * @param {number} price - The price value
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  if (price === 0) {
    return "Depends on size";
  }
  return `${price.toFixed(2)} DH`;
};

/**
 * Calculates the discount percentage between original and current price
 * @param {number} originalPrice - The original price
 * @param {number} currentPrice - The current price
 * @returns {number} - Discount percentage
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) {
    return 0;
  }
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Determines if a product has a price reduction
 * @param {Object} product - Product object with originalPrice and price
 * @returns {boolean} - True if product has a discount
 */
export const hasDiscount = (product) => {
  return product.originalPrice && product.originalPrice > product.price;
};

/**
 * Checks if a product has a custom price (price = 0)
 * @param {Object} product - Product object
 * @returns {boolean} - True if product has custom pricing
 */
export const hasCustomPrice = (product) => {
  return product.price === 0;
};