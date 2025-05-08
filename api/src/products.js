// /api/products.js
import products from '../api/src/models/product.js';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle different API endpoints based on the URL path
  const { url, method } = req;
  
  // GET all products
  if (method === 'GET' && (url === '/api/products' || url === '/api/products/')) {
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
    
    return res.status(200).json(productsList);
  }
  
  // GET product by ID
  if (method === 'GET' && url.match(/\/api\/products\/\d+$/)) {
    const productId = parseInt(url.split('/').pop());
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json(product);
  }
  
  // GET products by category
  if (method === 'GET' && url.match(/\/api\/products\/category\/[^/]+$/)) {
    const category = url.split('/').pop();
    const filteredProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    
    if (filteredProducts.length === 0) {
      return res.status(404).json({ message: 'No products found in this category' });
    }
    
    const productsList = filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.images[0],
      featured: product.featured
    }));
    
    return res.status(200).json(productsList);
  }
  
  // GET featured products
  if (method === 'GET' && (url === '/api/products/featured/items' || url === '/api/products/featured/items/')) {
    const featuredProducts = products.filter(p => p.featured);
    
    const productsList = featuredProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.images[0],
      featured: true
    }));
    
    return res.status(200).json(productsList);
  }
  
  // If no route matches, return 404
  return res.status(404).json({ message: 'Endpoint not found' });
}