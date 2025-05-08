import products from '../../../data/product.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
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
  
  res.status(200).json(productsList);
}