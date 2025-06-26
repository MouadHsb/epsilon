import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, CreditCard, Truck, ShoppingBag, TreePine, ShieldCheck, Award, Clock, Hammer } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Layout from '../components/Layout';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

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

  // Calculate shipping cost
  const getShippingCost = () => {
    const subtotal = getTotalPrice();
    const FREE_SHIPPING_THRESHOLD = 1500; // Higher threshold for furniture
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150; // Higher shipping cost for furniture
  };

  // Calculate final total (subtotal + shipping)
  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost();
  };

  // Calculate amount needed for free shipping
  const getAmountForFreeShipping = () => {
    const FREE_SHIPPING_THRESHOLD = 1500;
    const subtotal = getTotalPrice();
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
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
      to_name: 'WoodFlow Artisans',
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address,
      customer_city: formData.city,
      order_details: orderDetails,
      subtotal: getTotalPrice().toFixed(2),
      shipping_cost: getShippingCost().toFixed(2),
      total_price: getFinalTotal().toFixed(2),
      payment_method: formData.paymentMethod,
      note: formData.note || 'No special instructions provided',
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
          description: 'Our master craftsmen will contact you shortly to confirm your custom pieces.',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('There was an error placing your order', {
        description: 'Please try again or contact our workshop directly.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Toaster richColors position="bottom-right" />
      <div className="bg-gradient-to-br from-timber-50 to-white min-h-screen py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-light text-timber-700 mb-6 md:mb-12">
            Your <span className="text-primary font-semibold">Collection</span>
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto bg-timber-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-primary/70" />
              </div>
              <h2 className="text-2xl font-semibold text-timber-700 mb-4">Your cart is empty</h2>
              <p className="text-timber-600 mb-8 max-w-md mx-auto">
                You haven't added any handcrafted pieces to your collection yet. 
                Explore our artisan furniture and decor to find pieces that speak to you.
              </p>
              <Link 
                to="/products"
                className="bg-primary text-white px-8 py-4 rounded-full
                  hover:bg-primary-dark transition-all duration-300 shadow-md 
                  hover:shadow-lg font-medium inline-flex items-center gap-2"
              >
                <TreePine className="w-5 h-5" />
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              {/* Cart Items */}
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-timber-700 mb-4 flex items-center">
                    <Hammer className="w-5 h-5 mr-2 text-primary" />
                    Your Handcrafted Pieces
                  </h2>
                  
                  <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-4 border-b border-primary/10">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-timber-50 rounded-lg overflow-hidden">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Link to={`/product/${item.id}`} className="font-medium text-timber-700 hover:text-primary transition-colors">
                              {item.name}
                            </Link>
                            <p className="text-sm text-timber-600">${item.price.toFixed(2)} each</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 text-primary hover:bg-primary/5 rounded-full transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 text-primary hover:bg-primary/5 rounded-full transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-timber-700">
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
                  
                  <div className="pt-4 border-t border-primary/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-timber-600">Subtotal</span>
                      <span className="text-timber-700 font-medium">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-timber-600">White Glove Delivery</span>
                      <span className="text-timber-700 font-medium">
                        {getShippingCost() === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${getShippingCost().toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold text-timber-700 mt-4 pt-4 border-t border-primary/10">
                      <span>Total</span>
                      <span>${getFinalTotal().toFixed(2)}</span>
                    </div>
                    
                    {getAmountForFreeShipping() > 0 && (
                      <div className="mt-4 bg-primary/5 rounded-lg p-3 text-sm text-timber-700">
                        Add <span className="font-semibold">${getAmountForFreeShipping().toFixed(2)}</span> more to qualify for free white glove delivery!
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Shipping & Returns Info */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                  <h3 className="font-medium text-timber-700 mb-4">Delivery & Warranty</h3>
                  <div className="space-y-4 text-sm text-timber-600">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p>Free white glove delivery on orders over $1,500. Professional setup and placement included. Allow 2-4 weeks for custom pieces.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p>Lifetime craftsmanship warranty against defects in materials and workmanship. 30-day satisfaction guarantee.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p>Each piece is handcrafted by master artisans using sustainable FSC-certified hardwoods and eco-friendly resins.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information Form */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-timber-700 mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Delivery Information
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-timber-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-timber-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-timber-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-timber-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-timber-700 mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Street address, apartment, suite, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-timber-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-timber-700 mb-1">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Delivery preferences, access instructions, custom requests..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-timber-700 mb-1">
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
                          className="w-4 h-4 text-primary border-gray-300"
                        />
                        <span className="ml-3 flex items-center text-gray-400">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Online Payment
                        </span>
                        <span className="ml-2 text-xs text-red-400 font-medium">(Coming Soon)</span>
                      </label>

                      <label className="flex items-center p-3 rounded-lg border border-primary bg-white cursor-pointer hover:bg-timber-50 transition-colors">
                        <input
                          type="radio"
                          id="delivery"
                          name="paymentMethod"
                          value="delivery"
                          checked={formData.paymentMethod === 'delivery'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary border-primary"
                        />
                        <span className="ml-3 flex items-center text-timber-700">
                          <Truck className="w-4 h-4 mr-2" />
                          Payment on Delivery
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-timber-50/50 rounded-xl p-4 mt-6">
                    <h4 className="font-medium text-timber-700 mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-timber-600">{cartItems.length} handcrafted piece{cartItems.length > 1 ? 's' : ''}</span>
                        <span className="text-timber-700">${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-timber-600">White glove delivery</span>
                        <span className="text-timber-700">
                          {getShippingCost() === 0 ? 'Free' : `$${getShippingCost().toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-timber-700 pt-2 border-t border-timber-200">
                        <span>Total</span>
                        <span>${getFinalTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cartItems.length === 0 || isSubmitting}
                    className="w-full bg-primary text-white py-4 rounded-lg font-medium 
                      hover:bg-primary-dark transition-colors disabled:opacity-50 
                      disabled:cursor-not-allowed mt-6 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing Your Order...
                      </>
                    ) : (
                      <>
                        <Hammer className="w-5 h-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-timber-600 text-center mt-4">
                    By placing an order, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                    Our master craftsmen will contact you within 24 hours to confirm details and timeline.
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

export default CartPage;