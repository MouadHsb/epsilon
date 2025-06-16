import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Minus, Plus, Truck, ShieldCheck, RefreshCw, Heart, Share, Check } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Layout from '../components/Layout';
import { fetchProductById } from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product data
  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(parseInt(id));
        setProduct(productData);
        
        // Get related products from the same category
        if (productData?.category) {
          const fetchRelatedProducts = async () => {
            try {
              const allProducts = await fetchProducts();
              const related = allProducts
                .filter(p => p.category === productData.category && p.id !== productData.id)
                .slice(0, 4);
              setRelatedProducts(related);
            } catch (err) {
              console.error('Failed to fetch related products:', err);
            }
          };
          fetchRelatedProducts();
        }
        
        setLoading(false);
      } catch (err) {
        setError('Product not found');
        setLoading(false);
      }
    };

    getProductData();
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [id]);

  // Track scroll position for sticky elements
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check if product is in favorites
  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isFav = favorites.some(favId => favId === product.id);
      setIsFavorite(isFav);
    }
  }, [product]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newValue = prev + delta;
      return newValue > 0 ? newValue : 1;
    });
  };

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Simulate a network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find(item => item.id === product.id);
      
      let newCart;
      if (existingItem) {
        newCart = existingCart.map(item => 
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Only add essential data to cart
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images[0]
        };
        newCart = [...existingCart, cartItem];
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      
      // Show success animation
      setShowNotification(true);
      
      // Show toast notification
      toast.success(`${quantity} ${product.name} added to cart`, {
        description: 'Item successfully added to your cart',
        duration: 3000,
      });
      
      // Reset quantity
      setQuantity(1);
      
      // Hide notification after animation
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to add item to cart', {
        description: 'Please try again',
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity]);

  const toggleFavorite = () => {
    if (!product) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(favId => favId !== product.id);
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast('Link copied to clipboard');
    }
  };

  const nextImage = () => {
    if (!product) return;
    setActiveImage(current => (current + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product) return;
    setActiveImage(current => (current - 1 + product.images.length) % product.images.length);
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="bg-gradient-to-br from-[#F4F7F4] to-white min-h-screen py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-gray-200 rounded-2xl h-96"></div>
                <div>
                  <div className="h-8 w-full bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-8"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-8"></div>
                  <div className="h-12 w-full bg-gray-200 rounded mb-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Layout>
        <div className="bg-gradient-to-br from-[#F4F7F4] to-white min-h-screen py-20">
          <div className="container mx-auto px-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-4xl font-light text-[#2A462B] mb-6">
                <span className="text-[#3C6C3F]">Product</span> Not Found
              </h2>
              <p className="text-[#2A462B]/70 mb-8">
                We couldn't find the product you were looking for. It may have been removed or the URL might be incorrect.
              </p>
              <button 
                onClick={() => navigate('/products')}
                className="bg-[#3C6C3F] text-white px-8 py-4 rounded-full
                  hover:bg-[#2A462B] transition-all duration-300 shadow-md 
                  hover:shadow-lg font-medium"
              >
                Browse All Products
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Format for image URL 
  const getImageUrl = (path) => {
    // Check if the path is a full URL
    if (path.startsWith('http')) {
      return path;
    }
    
    // Otherwise assume it's a local path and prefix with base URL 
    // If in production, use the dynamic base URL, otherwise use development URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:5000';
      
    return `${baseUrl}${path}`;
  };

  return (
    <Layout>
      <Toaster richColors position="bottom-right" />
      <div className="bg-gradient-to-br from-[#F4F7F4] to-white min-h-screen py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-[#2A462B]/60">
              <button 
                onClick={() => navigate('/products')}
                className="hover:text-[#3C6C3F] transition-colors"
              >
                Products
              </button>
              <span className="mx-2">/</span>
              <button 
                onClick={() => navigate(`/products/category/${product.category.toLowerCase()}`)}
                className="hover:text-[#3C6C3F] transition-colors"
              >
                {product.category}
              </button>
              <span className="mx-2">/</span>
              <span className="font-medium text-[#2A462B]">{product.name}</span>
            </nav>
          </div>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden relative aspect-square">
                <img 
                  src={getImageUrl(product.images[activeImage])} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 
                        bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md
                        hover:bg-white transition-all duration-300"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#2A462B]" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 
                        bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md
                        hover:bg-white transition-all duration-300"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-[#2A462B]" />
                    </button>
                  </>
                )}

                {/* Featured badge if applicable */}
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-[#3C6C3F] text-white px-3 py-1 
                    rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all
                        ${activeImage === index ? 'border-[#3C6C3F] shadow-md' : 'border-transparent opacity-70'}`}
                    >
                      <img 
                        src={getImageUrl(image)} 
                        alt={`${product.name} - view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className={`${scrollPosition > 300 ? 'lg:sticky lg:top-24' : ''}`}>
                <span className="text-sm text-[#3C6C3F] font-medium inline-block px-2 py-1 
                  bg-[#3C6C3F]/10 rounded-full mb-2">
                  {product.category}
                </span>
                
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl md:text-4xl font-semibold text-[#2A462B] mb-2">{product.name}</h1>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={toggleFavorite}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite 
                          ? 'bg-red-50 text-red-500' 
                          : 'bg-gray-100 text-[#2A462B]/70 hover:bg-gray-200'
                      }`}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        className="w-5 h-5" 
                        fill={isFavorite ? '#ef4444' : 'none'} 
                      />
                    </button>
                    
                    <button 
                      onClick={handleShare}
                      className="p-2 bg-gray-100 rounded-full text-[#2A462B]/70 hover:bg-gray-200 transition-colors"
                      aria-label="Share product"
                    >
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#2A462B]/70">86 reviews</span>
                </div>
                
                <div className="text-2xl md:text-3xl font-bold text-[#2A462B] mb-6">
                  {product.price.toFixed(2)} DH
                </div>
                
                <p className="text-[#2A462B]/80 mb-8 leading-relaxed">
                  {product.longDescription}
                </p>
                
                {/* Quantity Selector and Add to Cart */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm mb-8 border border-[#3C6C3F]/10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-[#2A462B] mr-3">Quantity</span>
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button 
                          onClick={() => handleQuantityChange(-1)}
                          className="w-10 h-10 flex items-center justify-center text-[#3C6C3F] hover:bg-[#F4F7F4] rounded-l-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(1)}
                          className="w-10 h-10 flex items-center justify-center text-[#3C6C3F] hover:bg-[#F4F7F4] rounded-r-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-[#2A462B]/70 text-sm">
                      {(product.price * quantity).toFixed(2)} DH
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-[#3C6C3F] text-white py-4 rounded-full font-medium 
                      hover:bg-[#2A462B] transition-all duration-300 shadow-md 
                      hover:shadow-lg relative overflow-hidden"
                  >
                    <span className={`transition-opacity duration-200 ${isAddingToCart ? 'opacity-0' : 'opacity-100'}`}>
                      Add to Cart
                    </span>
                    
                    {isAddingToCart && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    )}
                    
                    {showNotification && (
                      <span className="absolute inset-0 flex items-center justify-center bg-green-600 text-white">
                        <Check className="w-5 h-5 mr-2" />
                        Added to Cart
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Product Features */}
                <div className="border-t border-b border-gray-200 py-6 mb-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <Truck className="w-5 h-5 text-[#3C6C3F]" />
                    <div>
                      <h3 className="font-medium text-[#2A462B]">Free Shipping</h3>
                      <p className="text-sm text-[#2A462B]/70">Free standard shipping on orders over 500 DH</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-[#3C6C3F]" />
                    <div>
                      <h3 className="font-medium text-[#2A462B]">Money Back Guarantee</h3>
                      <p className="text-sm text-[#2A462B]/70">30-day satisfaction guarantee</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <RefreshCw className="w-5 h-5 text-[#3C6C3F]" />
                    <div>
                      <h3 className="font-medium text-[#2A462B]">Easy Returns</h3>
                      <p className="text-sm text-[#2A462B]/70">Hassle-free return process</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs Section */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button className="px-6 py-3 border-b-2 border-[#3C6C3F] text-[#3C6C3F] font-medium">
                  Details
                </button>
                <button className="px-6 py-3 text-[#2A462B]/70 hover:text-[#2A462B]">
                  How to Use
                </button>
                <button className="px-6 py-3 text-[#2A462B]/70 hover:text-[#2A462B]">
                  Ingredients
                </button>
                <button className="px-6 py-3 text-[#2A462B]/70 hover:text-[#2A462B]">
                  Reviews
                </button>
              </div>
            </div>

            <div className="py-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold text-[#2A462B] mb-6">Product Details</h2>
                  <p className="text-[#2A462B]/80 leading-relaxed mb-6">
                    {product.longDescription}
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 border-t border-gray-200 pt-6">
                    <div className="text-sm text-[#2A462B]/70">Size</div>
                    <div className="text-sm text-[#2A462B]">{product.size}</div>
                    
                    <div className="text-sm text-[#2A462B]/70">Category</div>
                    <div className="text-sm text-[#2A462B]">{product.category}</div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold text-[#2A462B] mb-6">How to Use</h2>
                  <p className="text-[#2A462B]/80 leading-relaxed mb-6">
                    {product.usage}
                  </p>
                  <h3 className="font-medium text-[#2A462B] mb-3">Ingredients</h3>
                  <p className="text-[#2A462B]/80 leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-8 border border-[#3C6C3F]/10">
            <h2 className="text-2xl font-semibold text-[#2A462B] mb-8 text-center">Key Benefits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-[#F4F7F4]/50 rounded-xl p-6
                    shadow-sm hover:shadow-md transition-all duration-300
                    border border-[#3C6C3F]/5 text-center"
                >
                  <div className="h-12 w-12 bg-[#3C6C3F]/10 rounded-full flex items-center 
                    justify-center mx-auto mb-4">
                    <span className="text-xl font-semibold text-[#3C6C3F]">{index + 1}</span>
                  </div>
                  <p className="text-[#2A462B] font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-[#2A462B] mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    onClick={() => navigate(`/product/${relProduct.id}`)}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4
                      shadow-md hover:shadow-lg transition-all duration-300
                      border border-[#3C6C3F]/10 hover:bg-white/95 group cursor-pointer"
                  >
                    <div className="bg-[#F4F7F4] rounded-lg mb-3 aspect-square relative overflow-hidden">
                      <img
                        src={getImageUrl(relProduct.image || relProduct.images[0])}
                        alt={relProduct.name}
                        className="w-full h-full object-cover rounded-lg
                          transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-[#2A462B] truncate group-hover:text-[#3C6C3F] transition-colors">
                      {relProduct.name}
                    </h3>
                    <p className="text-[#3C6C3F] font-semibold text-sm mt-1">
                      {relProduct.price.toFixed(2)} DH
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;