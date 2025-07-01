import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, Hammer, ShieldCheck, ArrowRight, Star, ShoppingCart, Palette } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchProducts } from '../services/productService';
import { getImageUrl } from '../utils/imageUtils';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        const featured = products.filter(product => product.featured).slice(0, 4);
        setFeaturedProducts(featured);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setLoading(false);
      }
    };

    getFeaturedProducts();
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find(item => item.id === product.id);
    
    let newCart;
    if (existingItem) {
      newCart = existingCart.map(item => 
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      };
      newCart = [...existingCart, cartItem];
    }
    
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Show success feedback
    const button = e.currentTarget;
    const originalText = button.innerText;
    button.innerText = "Added!";
    button.classList.add("bg-green-600");
    
    setTimeout(() => {
      button.innerText = originalText;
      button.classList.remove("bg-green-600");
    }, 1000);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-timber-50 to-timber-100" />
        
        <div className="container mx-auto px-4 sm:px-8 py-12 sm:py-20">
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-row items-center gap-16">
            <div className="md:w-1/2 z-10">
              <h1 className="text-5xl lg:text-6xl font-light text-timber-700 mb-6 tracking-tight leading-tight">
                Handcrafted wood,<br />
                <span className="text-primary font-semibold">enhanced by resin</span>
              </h1>
              <p className="text-lg text-timber-600 mb-8 leading-relaxed max-w-xl">
                Discover artisan furniture and decor that combines the natural beauty of sustainable wood 
                with the modern appeal of colorful epoxy resin. Each piece tells a unique story through grain and flow.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/products')}
                  className="bg-primary text-white px-8 py-4 rounded-full
                    hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg
                    font-medium flex items-center gap-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="bg-white text-primary px-8 py-4 rounded-full border border-primary
                    hover:bg-timber-50 transition-all duration-300 shadow-md hover:shadow-lg
                    font-medium"
                >
                  Our Craftsmanship
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-gradient-to-br from-timber-100 to-timber-200 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/hero.png" 
                  alt="Handcrafted wood and resin furniture"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full
                  text-primary font-semibold text-sm shadow-md">
                  Handcrafted
                </div>
              </div>

            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col relative z-10">
            <div className="text-center mb-8 relative z-20">
              <h1 className="text-5xl font-light text-timber-700 mb-4 tracking-tight leading-tight">
                Handcrafted wood,<br />
                <span className="text-primary font-semibold">enhanced by resin</span>
              </h1>
              <p className="text-base text-timber-600 leading-relaxed px-4 opacity-90">
                Artisan furniture that combines natural wood beauty with modern resin artistry.
              </p>
            </div>
            
            <div className="relative mb-8">
              <div className="bg-gradient-to-br from-timber-100 to-timber-200 rounded-2xl overflow-hidden shadow-xl mx-4">
                <img
                  src="/hero.png" 
                  alt="Handcrafted wood and resin furniture"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full
                  text-primary font-semibold text-xs shadow-md">
                  Handcrafted
                </div>
                <div className="absolute top-3 right-3 bg-primary text-white p-2 rounded-full shadow-lg
                  text-center leading-tight text-xs min-w-[2.5rem]">
                  <div className="font-bold">Custom</div>
                  <div className="text-xs">Made</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 px-4 relative z-20">
              <button 
                onClick={() => navigate('/products')}
                className="w-full bg-primary text-white px-6 py-4 rounded-full
                  hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg
                  font-medium flex items-center justify-center gap-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="w-full bg-white text-primary px-6 py-4 rounded-full border border-primary
                  hover:bg-timber-50 transition-all duration-300 shadow-md hover:shadow-lg
                  font-medium"
              >
                Our Craftsmanship
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-light text-timber-700">
              Featured <span className="text-primary font-semibold">Creations</span>
            </h2>
            <Link
              to="/products"
              className="text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="rounded-2xl bg-gray-200 h-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden
                    shadow-lg hover:shadow-xl transition-all duration-300
                    border border-primary/10 hover:bg-white/95 group cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="bg-gradient-to-br from-timber-50 to-timber-100
                    aspect-square relative overflow-hidden"
                  >
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover
                        transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm
                      px-3 py-1 rounded-full text-timber-700 font-semibold text-sm">
                      {product.price.toFixed(0)} DH
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-primary font-medium">
                          {product.category}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star}
                              className="w-3 h-3 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-timber-700 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-timber-600 line-clamp-2 h-10">
                        {product.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-primary text-white px-4 py-2 rounded-full
                          hover:bg-primary-dark transition-all duration-300 shadow-md
                          hover:shadow-lg font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <span>Add to Cart</span>
                      </button>
                      <button 
                        className="bg-white text-primary px-4 py-2 rounded-full border border-primary
                        hover:bg-primary/5 transition-all duration-300 font-medium text-sm"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Craftsmanship Story */}
{/* Combined Why Choose & Craftsmanship Story */}
<section className="py-16 bg-timber-50">
  <div className="container mx-auto px-4 sm:px-8">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-light text-timber-700">
          Where tradition meets <span className="text-primary font-semibold">Innovation</span>
        </h2>
        <p className="text-lg text-timber-600 leading-relaxed">
          At WoodFlow, we honor the ancient art of woodworking while embracing modern resin techniques. 
          Each piece begins with carefully selected sustainable hardwoods, chosen for their unique grain patterns and natural beauty.
        </p>

        {/* Why Choose WoodFlow Features */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          
          <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-primary/10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-timber-700">Resin Artistry</h3>
              <p className="text-sm text-timber-600">Premium epoxy resins in vibrant colors create stunning rivers, oceans, and artistic patterns that flow with the wood</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-primary/10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Hammer className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-timber-700">Master Craftsmanship</h3>
              <p className="text-sm text-timber-600">Hand-finished by skilled artisans with decades of experience in traditional and modern woodworking techniques</p>
            </div>
          </div>
        </div>
        
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl overflow-hidden h-48 transform translate-y-8">
          <img 
            src="/ft1.png" 
            alt="Craftsman working with wood"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden h-64">
          <img 
            src="/ft2.png" 
            alt="Epoxy resin being poured"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden h-64">
          <img 
            src="/ft3.png" 
            alt="Selecting premium wood"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden h-64 transform translate-y-8">
          <img 
            src="/ft4.png" 
            alt="Final finishing process"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>

    </Layout>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center
    shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10
    hover:bg-white/95 group">
    <div className="mb-6 flex justify-center">
      <div className="transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold text-timber-700 mb-4">
      {title}
    </h3>
    <p className="text-timber-600 leading-relaxed">
      {description}
    </p>
  </div>
);

export default HomePage;