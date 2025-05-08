import products from '../../../data/product.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const category = req.query.category;
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
  
  res.status(200).json(productsList);
}