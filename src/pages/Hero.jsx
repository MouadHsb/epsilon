import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Droplet, ShieldCheck, ArrowRight, Star, ShoppingCart } from 'lucide-react';
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#F4F7F4] to-white" />
        
        <div className="container mx-auto px-4 sm:px-8 py-12 sm:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 z-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2A462B] mb-6 tracking-tight leading-tight">
                Nature's wisdom,<br />
                <span className="text-[#3C6C3F] font-semibold">bottled with care</span>
              </h1>
              <p className="text-lg text-[#2A462B]/80 mb-8 leading-relaxed max-w-xl">
                Discover skincare that honors both your skin and the Earth.
                Tadefi brings you carefully crafted formulations using sustainable,
                natural ingredients from Morocco that nurture your skin's natural balance.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => navigate('/products')}
                  className="bg-[#3C6C3F] text-white px-8 py-4 rounded-full
                    hover:bg-[#2A462B] transition-all duration-300 shadow-md hover:shadow-lg
                    font-medium flex items-center gap-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/skin-scan')}
                  className="bg-white text-[#3C6C3F] px-8 py-4 rounded-full border border-[#3C6C3F]
                    hover:bg-[#F4F7F4] transition-all duration-300 shadow-md hover:shadow-lg
                    font-medium"
                >
                  Try SkinScan™
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative mt-8 md:mt-0">
              <div className="bg-gradient-to-br from-[#F4F7F4] to-[#E8EEE8] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/hp2.webp" 
                  alt="Natural skincare products"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full
                  text-[#3C6C3F] font-semibold text-sm shadow-md">
                  100% Natural
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#3C6C3F] text-white p-4 rounded-full shadow-lg
                hidden md:flex items-center justify-center w-24 h-24 text-center leading-tight">
                <div>
                  <div className="font-bold text-lg">20%</div>
                  <div className="text-xs">First Order</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#F4F7F4]/60 py-16">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-lg mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-[#2A462B] mb-4">
              Why Choose <span className="text-[#3C6C3F] font-semibold">Tadefi</span>
            </h2>
            <p className="text-[#2A462B]/70 leading-relaxed">
              Our products combine traditional Moroccan beauty wisdom with modern formulation 
              techniques for exceptional results you can feel and see.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Leaf className="w-12 h-12 text-[#3C6C3F]" strokeWidth={1.5} />}
              title="100% Natural"
              description="Ethically sourced ingredients from nature's finest offerings, harvested sustainably in Morocco"
            />
            <FeatureCard
              icon={<Droplet className="w-12 h-12 text-[#3C6C3F]" strokeWidth={1.5} />}
              title="Pure Formulation"
              description="No harsh chemicals, only gentle, effective natural compounds for healthy skin"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-12 h-12 text-[#3C6C3F]" strokeWidth={1.5} />}
              title="Sustainable"
              description="Eco-friendly packaging and responsible production practices that respect our planet"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-light text-[#2A462B]">
              Featured <span className="text-[#3C6C3F] font-semibold">Products</span>
            </h2>
            <Link
              to="/products"
              className="text-[#3C6C3F] font-medium hover:text-[#2A462B] transition-colors flex items-center gap-1"
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
                    border border-[#3C6C3F]/10 hover:bg-white/95 group cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="bg-gradient-to-br from-[#F4F7F4] to-[#E8EEE8]
                    aspect-square relative overflow-hidden"
                  >
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover
                        transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm
                      px-3 py-1 rounded-full text-[#2A462B] font-semibold text-sm">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-[#3C6C3F] font-medium">
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
                      <h3 className="text-lg font-semibold text-[#2A462B] group-hover:text-[#3C6C3F] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#2A462B]/70 line-clamp-2 h-10">
                        {product.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-[#3C6C3F] text-white px-4 py-2 rounded-full
                          hover:bg-[#2A462B] transition-all duration-300 shadow-md
                          hover:shadow-lg font-medium text-sm flex items-center justify-center gap-1"
                      >
                      
                        <span>Add to Cart</span>
                      </button>
                      <button 
                        className="bg-white text-[#3C6C3F] px-4 py-2 rounded-full border border-[#3C6C3F]
                        hover:bg-[#3C6C3F]/5 transition-all duration-300 font-medium text-sm"
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

      {/* Testimonials Section */}
      <section className="bg-[#F4F7F4] py-16">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-lg mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-[#2A462B] mb-4">
              Customer <span className="text-[#3C6C3F] font-semibold">Stories</span>
            </h2>
            <p className="text-[#2A462B]/70 leading-relaxed">
              See what our customers have to say about their Tadefi experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I've tried countless natural skincare brands, but Tadefi's products are truly exceptional. My skin has never looked better!"
              name="Amina K."
              location="Casablanca"
              rating={5}
            />
            <TestimonialCard
              quote="The Rosehip Face Oil completely transformed my skin. After just two weeks, my fine lines were visibly reduced. I'm amazed!"
              name="Sarah M."
              location="Marrakech"
              rating={5}
            />
            <TestimonialCard
              quote="SkinScan recommended the perfect products for my combination skin. The personalized approach makes all the difference."
              name="Thomas L."
              location="Rabat"
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* About & Social Impact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-light text-[#2A462B]">
                Beauty with <span className="text-[#3C6C3F] font-semibold">Purpose</span>
              </h2>
              <p className="text-lg text-[#2A462B]/80 leading-relaxed">
                Tadefi is more than skincare — it's a movement to preserve traditional Moroccan beauty 
                practices while creating sustainable livelihoods for local communities.
              </p>
              <p className="text-lg text-[#2A462B]/80 leading-relaxed">
                Every purchase directly supports women's cooperatives in rural Morocco, 
                providing fair wages and preserving ancestral knowledge.
              </p>
              <button 
                onClick={() => navigate('/about')}
                className="bg-[#3C6C3F] text-white px-8 py-4 rounded-full
                  hover:bg-[#2A462B] transition-all duration-300 shadow-md hover:shadow-lg
                  font-medium"
              >
                Discover Our Story
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden h-48 transform translate-y-8">
                <img 
                  src="/coop.jpeg" 
                  alt="Women's cooperative in Morocco"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-64">
                <img 
                  src="/argan.jpg" 
                  alt="Traditional ingredients"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-64">
                <img 
                  src="/argan2.jpg" 
                  alt="Sustainable harvesting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-64 transform translate-y-8">
                <img 
                  src="/making.webp" 
                  alt="Product creation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter & CTA */}
      <section className="bg-gradient-to-br from-[#3C6C3F] to-[#2A462B] py-16 text-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Join the Tadefi <span className="font-semibold">Community</span>
            </h2>
            <p className="text-white/90 mb-8 leading-relaxed">
              Subscribe to receive natural skincare tips, exclusive offers, and early access to new products
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border border-white/30
                  focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner
                  bg-white/10 backdrop-blur-sm text-white placeholder-white/60
                  transition-all duration-300"
              />
              
              <button className="bg-white text-[#3C6C3F] px-8 py-4 rounded-full
                hover:bg-[#F4F7F4] transition-all duration-300 shadow-md 
                hover:shadow-lg font-medium"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center
    shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3C6C3F]/10
    hover:bg-white/95 group">
    <div className="mb-6 flex justify-center">
      <div className="transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold text-[#2A462B] mb-4">
      {title}
    </h3>
    <p className="text-[#2A462B]/70 leading-relaxed">
      {description}
    </p>
  </div>
);

const TestimonialCard = ({ quote, name, location, rating }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      ))}
      {[...Array(5-rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-gray-200" />
      ))}
    </div>
    <p className="text-[#2A462B]/80 italic mb-6">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-[#3C6C3F]/10 flex items-center justify-center 
        text-[#3C6C3F] font-semibold">
        {name.charAt(0)}
      </div>
      <div className="ml-3">
        <p className="font-medium text-[#2A462B]">{name}</p>
        <p className="text-sm text-[#2A462B]/60">{location}</p>
      </div>
    </div>
  </div>
);

export default HomePage;