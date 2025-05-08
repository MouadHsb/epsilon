import products from '../data/product.js';

// This handles the GET /api/products request
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
  
  res.status(200).json(productsList);
}