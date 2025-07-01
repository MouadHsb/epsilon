import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Toaster, toast } from 'sonner';
import { fetchProducts } from '../services/productService';
import { Star, Filter, ChevronDown, Loader, Search, ShoppingBag, TreePine, Palette, Heart } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Check if product is in favorites
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(product.id));
  }, [product.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(id => id !== product.id);
      toast('Removed from favorites');
    } else {
      newFavorites = [...favorites, product.id];
      toast('Added to favorites', {
        icon: <Heart className="w-4 h-4 text-red-500" fill="#ef4444" />,
      });
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden
        shadow-md hover:shadow-xl transition-all duration-300
        border border-primary/10 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative overflow-hidden cursor-pointer aspect-square"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-timber-50/20 z-10"/>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovering ? 'scale-110' : 'scale-100'
          }`}
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-primary 
            text-xs font-medium shadow-sm">
            {product.category}
          </span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-timber-700 
            font-semibold text-sm shadow-sm">
            {product.price.toFixed(0)} DH
          </span>
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute bottom-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full
            shadow-md hover:bg-white transition-all duration-200"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'text-red-500 fill-red-500' : 'text-timber-500 hover:text-red-500'
            }`}
          />
        </button>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>
      
      <div className="p-5">
        <h3 
          onClick={() => navigate(`/product/${product.id}`)}
          className="text-lg font-semibold text-timber-700 mb-2 cursor-pointer
            hover:text-primary transition-colors leading-tight h-14 line-clamp-2"
        >
          {product.name}
        </h3>
        
        <p className="text-sm text-timber-600 mb-5 line-clamp-3 h-14">
          {product.description}
        </p>
        
        {/* Material Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.keyFeatures?.slice(0, 2).map((feature, index) => (
            <span key={index} className="text-xs bg-timber-50 text-timber-600 px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-5 gap-3 mt-auto">
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="bg-primary text-white px-4 py-3 rounded-full
              hover:bg-primary-dark transition-all duration-300 shadow-sm
              hover:shadow-md font-medium text-sm col-span-3 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
          
          <button 
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white text-primary px-4 py-3 rounded-full border border-primary
              hover:bg-primary/5 transition-all duration-300 font-medium text-sm col-span-2"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize from URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        
        // Extract categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        // Find max price for range slider
        const highestPrice = Math.ceil(Math.max(...data.map(product => product.price)));
        setMaxPrice(highestPrice);
        setPriceRange([0, highestPrice]);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    getProducts();
  }, []);
  
  // Filter and sort products
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply price filter
    result = result.filter(product => {
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    });
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep default order or sort by featured
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortOption, priceRange]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search query for shareable links
    navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
  };
  
  const handleAddToCart = useCallback((product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = existingCart.find(item => item.id === product.id);
    
    let newCart;
    if (existingProduct) {
      newCart = existingCart.map(item => 
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      toast.success(`Added another ${product.name} to cart`, {
        description: `Quantity increased to ${existingProduct.quantity + 1}`,
        duration: 2500,
        position: 'bottom-right',
      });
    } else {
      // Only add essential product data to cart
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      };
      newCart = [...existingCart, cartItem];
      toast.success(`${product.name} added to cart`, {
        description: 'Your handcrafted piece has been added',
        duration: 2500,
        position: 'bottom-right',
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Also dispatch an event so other components like Header can update
    window.dispatchEvent(new Event('storage'));
  }, []);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="bg-gradient-to-br from-timber-50 to-white min-h-screen py-20">
          <div className="container mx-auto px-4 sm:px-8">
            <h2 className="text-5xl font-light text-timber-700 mb-8 tracking-tight">
              Our <span className="text-primary font-semibold">Collection</span>
            </h2>
            
            <div className="flex items-center justify-center pt-10 pb-20">
              <div className="flex flex-col items-center">
                <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-timber-600 text-lg">Loading our handcrafted collection...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="bg-gradient-to-br from-timber-50 to-white min-h-screen py-20">
          <div className="container mx-auto px-8">
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-4xl font-light text-timber-700 mb-6">
                <span className="text-primary font-semibold">Oops!</span> Something went wrong
              </h2>
              <p className="text-timber-600 mb-8">
                We couldn't load our collection. Please try again later.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-8 py-4 rounded-full
                  hover:bg-primary-dark transition-all duration-300 shadow-md 
                  hover:shadow-lg font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster richColors />
      <div className="bg-gradient-to-br from-timber-50 to-white min-h-screen py-20">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-light text-timber-700 mb-6 tracking-tight">
              Our <span className="text-primary font-semibold">Collection</span>
            </h2>
            
            <p className="text-lg text-timber-600 mb-8 max-w-3xl mx-auto">
              Discover our curated collection of handcrafted furniture and decor, where sustainable hardwoods 
              meet artistic resin flows to create functional masterpieces for your home.
            </p>

            {/* Featured Highlights */}
          </div>
          
          {/* Search & Mobile Filter Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for tables, wall art, storage..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-full border border-primary/20
                    focus:outline-none focus:ring-2 focus:ring-primary shadow-sm
                    bg-white/90 backdrop-blur-sm text-timber-700 placeholder-timber-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    bg-primary text-white px-5 py-2 rounded-full text-sm font-medium
                    hover:bg-primary-dark transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </form>
            
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center gap-2 bg-white px-5 py-4 rounded-full 
                border border-primary/20 text-timber-700 font-medium shadow-sm"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-8">
              <p className="text-timber-600 flex items-center">
                <span className="font-medium mr-2">Search results for:</span> 
                "{searchQuery}"
                <span className="ml-2 bg-primary/10 text-primary py-1 px-3 rounded-full text-sm font-medium">
                  {filteredProducts.length} pieces found
                </span>
              </p>
            </div>
          )}
          
          {/* Active Filters */}
          {(selectedCategory !== 'All' || sortOption !== 'default' || 
            priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm text-timber-600 self-center">Active filters:</span>
              
              {selectedCategory !== 'All' && (
                <div className="bg-primary/10 text-primary py-1 px-3 rounded-full text-sm font-medium flex items-center">
                  Category: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="ml-2 hover:text-primary-dark"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                <div className="bg-primary/10 text-primary py-1 px-3 rounded-full text-sm font-medium flex items-center">
                  Price: {priceRange[0]} DH - {priceRange[1]} DH
                  <button 
                    onClick={() => setPriceRange([0, maxPrice])}
                    className="ml-2 hover:text-primary-dark"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {sortOption !== 'default' && (
                <div className="bg-primary/10 text-primary py-1 px-3 rounded-full text-sm font-medium flex items-center">
                  Sort: {sortOption.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  <button 
                    onClick={() => setSortOption('default')}
                    className="ml-2 hover:text-primary-dark"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSortOption('default');
                  setPriceRange([0, maxPrice]);
                }}
                className="text-primary underline text-sm hover:text-primary-dark self-center ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-12 gap-8">
            {/* Mobile filters (collapsible) */}

            
            {/* Desktop Sidebar */}

            
            {/* Products Grid */}
            <div className="col-span-12 lg:col-span-12">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-timber-50 flex items-center justify-center">
                    <Search className="w-8 h-8 text-primary opacity-70" />
                  </div>
                  <h3 className="text-xl font-semibold text-timber-700 mb-2">No pieces found</h3>
                  <p className="text-timber-600 max-w-md mx-auto">
                    We couldn't find any furniture matching your criteria. 
                    Try adjusting your filters or explore our custom order options.
                  </p>
                  <button
                    onClick={() => navigate('/custom')}
                    className="mt-4 bg-primary text-white px-6 py-3 rounded-full
                      hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg
                      font-medium"
                  >
                    Request Custom Piece
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </Layout>
  );
};

export default Products;