// src/routes/products.js
const express = require('express');
const router = express.Router();
const products = require('../models/product');

// Get all products (with basic info)
router.get('/', (req, res) => {
  // Return a simplified version of products for listing pages
  const productsList = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.images[0], // Just return the first image for listings
    featured: product.featured
  }));
  
  res.json(productsList);
});

// Get a specific product by ID
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

// Get products by category
router.get('/category/:category', (req, res) => {
  const category = req.params.category;
  const filteredProducts = products.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
  
  if (filteredProducts.length === 0) {
    return res.status(404).json({ message: 'No products found in this category' });
  }
  
  // Return simplified product data for category listings
  const productsList = filteredProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.images[0],
    featured: product.featured
  }));
  
  res.json(productsList);
});

// Get featured products
router.get('/featured/items', (req, res) => {
  const featuredProducts = products.filter(p => p.featured);
  
  // Return simplified featured products
  const productsList = featuredProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.images[0],
    featured: true
  }));
  
  res.json(productsList);
});

module.exports = router;