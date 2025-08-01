import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Minus, Plus, Truck, ShieldCheck, RefreshCw, Heart, Share, Check, TreePine, Palette, Ruler, Award, Clock, Hammer, Settings, Home } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Layout from '../components/Layout';
import { fetchProductById, fetchProducts } from '../services/productService';
import { getImageUrl } from '../utils/imageUtils';
import { formatPrice, hasDiscount, hasCustomPrice, calculateDiscount } from '../utils/priceUtils';
import { Phone, Mail } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('features');
  

  // Fetch product data
  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(parseInt(id));
        setProduct(productData);
        
        // Set default active tab based on available data
        if (productData.features) {
          setActiveTab('features');
        } else if (productData.details) {
          setActiveTab('details');
        } else if (productData.uses) {
          setActiveTab('uses');
        } else if (productData.customization) {
          setActiveTab('customization');
        }
        
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
        description: 'Handcrafted piece added to your collection',
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

  const PricingSection = ({ product }) => {
    const discount = hasDiscount(product) ? calculateDiscount(product.originalPrice, product.price) : 0;
    const isCustomPrice = hasCustomPrice(product);

    if (isCustomPrice) {
      return (
        <div className="mb-6">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Depends on size
          </div>
          <p className="text-timber-600">
            This piece is custom-made to your specifications. Contact us for a personalized quote 
            based on your desired dimensions and finish options.
          </p>
          <div className="mt-4 p-4 bg-timber-50/50 rounded-xl">
            <h4 className="font-semibold text-timber-700 mb-2">Custom Pricing Includes:</h4>
            <ul className="text-sm text-timber-600 space-y-1">
              <li>• Consultation on design and materials</li>
              <li>• Custom sizing to fit your space</li>
              <li>• Choice of wood type and resin colors</li>
              <li>• Professional delivery and setup</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        {hasDiscount(product) && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg md:text-xl text-timber-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discount}% OFF
            </span>
          </div>
        )}
        <div className="text-2xl md:text-3xl font-bold text-timber-700">
          {formatPrice(product.price)}
        </div>
        {hasDiscount(product) && (
          <p className="text-sm text-green-600 mt-1">
            You save {formatPrice(product.originalPrice - product.price)}!
          </p>
        )}
      </div>
    );
  };

  const QuantityAndCartSection = ({ product, quantity, setQuantity, handleAddToCart, isAddingToCart, showNotification }) => {
    const isCustomPrice = hasCustomPrice(product);

    const handleQuantityChange = (delta) => {
      setQuantity(prev => {
        const newValue = prev + delta;
        return newValue > 0 ? newValue : 1;
      });
    };

    if (isCustomPrice) {
      return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm mb-8 border border-primary/10">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-timber-700 mb-4">
              Get Your Custom Quote
            </h3>
            <p className="text-timber-600 mb-6">
              This piece is made to order with your specific dimensions and preferences.
            </p>
            
            <div className="space-y-3">
              <a 
                href="tel:+212617497105"
                className="w-full bg-primary text-white py-4 rounded-full font-medium 
                  hover:bg-primary-dark transition-all duration-300 shadow-md 
                  hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call for Quote: +212 617497105
              </a>
              
              <a 
                href="mailto:contact@epsilonwoods.com?subject=Custom Quote Request - {product.name}"
                className="w-full bg-white text-primary py-4 rounded-full font-medium border border-primary
                  hover:bg-primary/5 transition-all duration-300 shadow-md 
                  hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email for Quote
              </a>
            </div>
            
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm mb-8 border border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex items-center">
            <span className="text-sm font-semibold text-timber-700 mr-4">Quantity</span>
            <div className="flex items-center bg-timber-50 border border-timber-200 rounded-full shadow-sm transition-all duration-200 hover:shadow-md">
              <button 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-timber-700 hover:text-primary hover:bg-timber-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent rounded-l-full transition-colors duration-150"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-14 text-center font-semibold text-timber-700 py-2">
                {quantity}
              </div>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 flex items-center justify-center text-primary hover:bg-timber-100 rounded-r-full transition-colors duration-150"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="text-timber-600 text-sm">
            Total: {formatPrice(product.price * quantity)}
          </div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-primary text-white py-4 rounded-full font-medium 
            hover:bg-primary-dark transition-all duration-300 shadow-md 
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
    );
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="bg-gradient-to-br from-timber-50 to-white min-h-screen py-20">
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
        <div className="bg-gradient-to-br from-timber-50 to-white min-h-screen py-20">
          <div className="container mx-auto px-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-4xl font-light text-timber-700 mb-6">
                <span className="text-primary">Piece</span> Not Found
              </h2>
              <p className="text-timber-600 mb-8">
                We couldn't find the piece you were looking for. It may have been sold or the URL might be incorrect.
              </p>
              <button 
                onClick={() => navigate('/products')}
                className="bg-primary text-white px-8 py-4 rounded-full
                  hover:bg-primary-dark transition-all duration-300 shadow-md 
                  hover:shadow-lg font-medium"
              >
                Browse Our Collection
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster richColors position="bottom-right" />
      <div className="bg-gradient-to-br from-timber-50 to-white min-h-screen py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-timber-600">
              <button 
                onClick={() => navigate('/products')}
                className="hover:text-primary transition-colors"
              >
                Collection
              </button>
              <span className="mx-2"> </span>
              <button 
                className="hover:text-primary transition-colors"
              >
                {product.name}
              </button>
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
                      <ChevronLeft className="w-5 h-5 text-timber-700" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 
                        bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md
                        hover:bg-white transition-all duration-300"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-timber-700" />
                    </button>
                  </>
                )}

                {/* Featured badge if applicable */}
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 
                    rounded-full text-xs font-medium">
                    Featured Creation
                  </div>
                )}
              </div>
              
              {/* Quality Assurance Badge */}
              <div className="bg-gradient-to-r from-primary/5 to-timber-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-timber-700">Master Crafted Guarantee</span>
                </div>
                <p className="text-sm text-timber-600">
                  Handcrafted by master artisans with lifetime craftsmanship warranty. 
                  Each piece is unique and made with sustainable materials.
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className={`${scrollPosition > 300 ? 'lg:sticky lg:top-24' : ''}`}>
                <span className="text-sm text-primary font-medium inline-block px-3 py-1 
                  bg-primary/10 rounded-full mb-3">
                  {product.category}
                </span>
                
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl md:text-4xl font-semibold text-timber-700 mb-2 flex-1 pr-4">
                    {product.name}
                  </h1>
                  
                  <div className="flex space-x-2 flex-shrink-0">
                    <button 
                      onClick={toggleFavorite}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite 
                          ? 'bg-red-50 text-red-500' 
                          : 'bg-timber-100 text-timber-600 hover:bg-timber-200'
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
                      className="p-2 bg-timber-100 rounded-full text-timber-600 hover:bg-timber-200 transition-colors"
                      aria-label="Share product"
                    >
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <PricingSection product={product} />

                
                <p className="text-timber-600 mb-8 leading-relaxed">
                  {product.longDescription || product.description}
                </p>

                {/* Materials & Features */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-primary/10">
                  <h3 className="font-semibold text-timber-700 mb-4 flex items-center">
                    <TreePine className="w-5 h-5 mr-2 text-primary" />
                    Materials & Craftsmanship
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Ruler className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-timber-600">Dimensions: {product.size}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-timber-600">Handcrafted - Allow 2-4 weeks for creation</span>
                    </div>
                  </div>
                </div>
                
                {/* Product Information Tabs */}
                {(product.features || product.details || product.uses || product.customization) && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl mb-6 border border-primary/10 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-primary/10">
                      {product.features && (
                        <button
                          onClick={() => setActiveTab('features')}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'features'
                              ? 'bg-primary/5 text-primary border-b-2 border-primary'
                              : 'text-timber-600 hover:text-primary hover:bg-primary/2'
                          }`}
                        >
                          <Award className="w-4 h-4 inline-block mr-2" />
                          Features
                        </button>
                      )}
                      {product.details && (
                        <button
                          onClick={() => setActiveTab('details')}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'details'
                              ? 'bg-primary/5 text-primary border-b-2 border-primary'
                              : 'text-timber-600 hover:text-primary hover:bg-primary/2'
                          }`}
                        >
                          <Hammer className="w-4 h-4 inline-block mr-2" />
                          Details
                        </button>
                      )}
                      {product.uses && (
                        <button
                          onClick={() => setActiveTab('uses')}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'uses'
                              ? 'bg-primary/5 text-primary border-b-2 border-primary'
                              : 'text-timber-600 hover:text-primary hover:bg-primary/2'
                          }`}
                        >
                          <Home className="w-4 h-4 inline-block mr-2" />
                          Uses
                        </button>
                      )}
                      {product.customization && (
                        <button
                          onClick={() => setActiveTab('customization')}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'customization'
                              ? 'bg-primary/5 text-primary border-b-2 border-primary'
                              : 'text-timber-600 hover:text-primary hover:bg-primary/2'
                          }`}
                        >
                          <Settings className="w-4 h-4 inline-block mr-2" />
                          Custom
                        </button>
                      )}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {activeTab === 'features' && product.features && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-timber-700 mb-4 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-primary" />
                            Key Features
                          </h4>
                          <ul className="space-y-3">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                <span className="text-timber-600 text-sm leading-relaxed">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeTab === 'details' && product.details && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-timber-700 mb-4 flex items-center">
                            <Hammer className="w-5 h-5 mr-2 text-primary" />
                            Craftsmanship Details
                          </h4>
                          <ul className="space-y-3">
                            {product.details.map((detail, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                <span className="text-timber-600 text-sm leading-relaxed">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeTab === 'uses' && product.uses && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-timber-700 mb-4 flex items-center">
                            <Home className="w-5 h-5 mr-2 text-primary" />
                            Perfect For
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {product.uses.map((use, index) => (
                              <div key={index} className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                                <span className="text-timber-700 text-sm font-medium">{use}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'customization' && product.customization && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-timber-700 mb-4 flex items-center">
                            <Settings className="w-5 h-5 mr-2 text-primary" />
                            Customization Options
                          </h4>
                          <div className="space-y-4">
                            {product.customization.map((option, index) => (
                              <div key={index} className="p-4 bg-gradient-to-r from-primary/5 to-timber-50/50 rounded-lg border border-primary/10">
                                <div className="flex items-start gap-3">
                                  <Palette className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                  <span className="text-timber-600 text-sm leading-relaxed">{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Quantity Selector and Add to Cart */}
                  <QuantityAndCartSection 
                    product={product}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    handleAddToCart={handleAddToCart}
                    isAddingToCart={isAddingToCart}
                    showNotification={showNotification}
                  />
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;