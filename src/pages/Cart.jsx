import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Layout from '../components/Layout';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';

// Initialize EmailJS with your public key
emailjs.init("cMenK54GAq1TC2xL0");

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'delivery' // Default to delivery payment
  });

  // Load cart data from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    loadCart();

    // Set up event listener for cart updates from other components
    window.addEventListener('storage', loadCart);
    
    return () => {
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  // Update quantity of an item in the cart
  const updateQuantity = (productId, delta) => {
    const newItems = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);
    
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    // Show feedback to user
    if (delta > 0) {
      toast.success("Quantity increased");
    } else {
      toast.success("Quantity decreased");
    }
  };

  // Remove an item from the cart
  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find(item => item.id === productId);
    if (!itemToRemove) return;
    
    const newItems = cartItems.filter(item => item.id !== productId);
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    // Show feedback to user
    toast.success(`${itemToRemove.name} removed from cart`);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Handle input changes in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission (checkout)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // Form validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);

    const orderDetails = cartItems.map(item => 
      `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      to_name: 'Store Owner',
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address,
      customer_city: formData.city,
      order_details: orderDetails,
      total_price: getTotalPrice().toFixed(2),
      payment_method: formData.paymentMethod,
      note: formData.note || 'No note provided',
      reply_to: formData.email
    };

    try {
      const response = await emailjs.send(
        'service_yb807ht',
        'template_3sy4w0r',
        templateParams
      );

      if (response.status === 200) {
        // Clear cart and form
        localStorage.setItem('cart', '[]');
        setCartItems([]);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          note: '',
          paymentMethod: 'delivery'
        });
        
        toast.success('Order placed successfully!', {
          description: 'We will contact you shortly to confirm your order.',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('There was an error placing your order', {
        description: 'Please try again or contact customer support.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get image URL, handling both relative and absolute paths
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
          <h1 className="text-4xl font-light text-[#2A462B] mb-6 md:mb-12">
            Shopping <span className="text-[#3C6C3F] font-semibold">Cart</span>
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto bg-[#F4F7F4] rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-[#3C6C3F]/70" />
              </div>
              <h2 className="text-2xl font-semibold text-[#2A462B] mb-4">Your cart is empty</h2>
              <p className="text-[#2A462B]/70 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Explore our collection to find products that are perfect for your skin.
              </p>
              <Link 
                to="/products"
                className="bg-[#3C6C3F] text-white px-8 py-4 rounded-full
                  hover:bg-[#2A462B] transition-all duration-300 shadow-md 
                  hover:shadow-lg font-medium inline-flex items-center"
              >
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              {/* Cart Items */}
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-[#2A462B] mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-4 border-b border-[#3C6C3F]/10">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-[#F4F7F4] rounded-lg overflow-hidden">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Link to={`/product/${item.id}`} className="font-medium text-[#2A462B] hover:text-[#3C6C3F] transition-colors">
                              {item.name}
                            </Link>
                            <p className="text-sm text-[#2A462B]/70">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 text-[#3C6C3F] hover:bg-[#3C6C3F]/5 rounded-full transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 text-[#3C6C3F] hover:bg-[#3C6C3F]/5 rounded-full transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#2A462B]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 mt-2 ml-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-[#3C6C3F]/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#2A462B]/70">Subtotal</span>
                      <span className="text-[#2A462B] font-medium">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#2A462B]/70">Shipping</span>
                      <span className="text-[#2A462B] font-medium">
                        {getTotalPrice() >= 50 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          '$5.00'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold text-[#2A462B] mt-4 pt-4 border-t border-[#3C6C3F]/10">
                      <span>Total</span>
                      <span>${(getTotalPrice() >= 50 ? getTotalPrice() : getTotalPrice() + 5).toFixed(2)}</span>
                    </div>
                    
                    {getTotalPrice() < 50 && (
                      <div className="mt-4 bg-[#3C6C3F]/5 rounded-lg p-3 text-sm text-[#2A462B]">
                        Add <span className="font-semibold">${(50 - getTotalPrice()).toFixed(2)}</span> more to qualify for free shipping!
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Shipping & Returns Info */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                  <h3 className="font-medium text-[#2A462B] mb-4">Shipping & Returns</h3>
                  <div className="space-y-4 text-sm text-[#2A462B]/70">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-[#3C6C3F] flex-shrink-0 mt-0.5" />
                      <p>Free shipping on all orders over $50. Standard delivery takes 3-5 business days.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-[#3C6C3F] flex-shrink-0 mt-0.5" />
                      <p>Easy returns within 30 days of delivery. See our <Link to="/returns" className="text-[#3C6C3F] hover:underline">return policy</Link> for more details.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#3C6C3F] flex-shrink-0 mt-0.5" />
                      <p>All transactions are secure and encrypted for your protection.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information Form */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-[#2A462B] mb-6">Delivery Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2A462B] mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-[#3C6C3F]/10 focus:ring-2 focus:ring-[#3C6C3F]/20 focus:border-[#3C6C3F] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A462B] mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-[#3C6C3F]/10 focus:ring-2 focus:ring-[#3C6C3F]/20 focus:border-[#3C6C3F] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A462B] mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#3C6C3F]/10 focus:ring-2 focus:ring-[#3C6C3F]/20 focus:border-[#3C6C3F] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A462B] mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#3C6C3F]/10 focus:ring-2 focus:ring-[#3C6C3F]/20 focus:border-[#3C6C3F] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A462B] mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#3C6C3F]/10 focus:ring-2 focus:ring-[#3C6C3F]/20 focus:border-[#3C6C3F] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A462B] mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#3C6C3F]/10 focus:ring-2 focus:ring-[#3C6C3F]/20 focus:border-[#3C6C3F] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A462B] mb-1">
                      Note (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-[#3C6C3F]/10 focus:ring-2 focus:ring-[#3C6C3F]/20 focus:border-[#3C6C3F] transition-colors"
                      placeholder="Special instructions for delivery or any other comments..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#2A462B] mb-1">
                      Payment Method
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed">
                        <input
                          type="radio"
                          id="online"
                          name="paymentMethod"
                          value="online"
                          disabled
                          className="w-4 h-4 text-[#3C6C3F] border-gray-300"
                        />
                        <span className="ml-3 flex items-center text-gray-400">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Online Payment
                        </span>
                        <span className="ml-2 text-xs text-red-400 font-medium">(Coming Soon)</span>
                      </label>

                      <label className="flex items-center p-3 rounded-lg border border-[#3C6C3F] bg-white cursor-pointer hover:bg-[#F4F7F4] transition-colors">
                        <input
                          type="radio"
                          id="delivery"
                          name="paymentMethod"
                          value="delivery"
                          checked={formData.paymentMethod === 'delivery'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#3C6C3F] border-[#3C6C3F]"
                        />
                        <span className="ml-3 flex items-center text-[#2A462B]">
                          <Truck className="w-4 h-4 mr-2" />
                          Payment on Delivery
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cartItems.length === 0 || isSubmitting}
                    className="w-full bg-[#3C6C3F] text-white py-4 rounded-lg font-medium 
                      hover:bg-[#2A462B] transition-colors disabled:opacity-50 
                      disabled:cursor-not-allowed mt-6 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Processing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                  
                  <p className="text-xs text-[#2A462B]/60 text-center mt-4">
                    By placing an order, you agree to our <Link to="/terms" className="text-[#3C6C3F] hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-[#3C6C3F] hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Missing icons
const ArrowRight = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const RefreshCw = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const ShieldCheck = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 13c0 5-3.5 7.5-8 9.5-4.5-2-8-4.5-8-9.5V6c4.5-1 7-2.5 8-5 1 2.5 3.5 4 8 5z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const Loader2 = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default CartPage;