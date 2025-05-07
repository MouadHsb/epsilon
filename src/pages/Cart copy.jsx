import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, CreditCard, Truck } from 'lucide-react';
import Layout from '../components/Layout';
import emailjs from '@emailjs/browser';
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

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

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
  };

  const removeFromCart = (productId) => {
    const newItems = cartItems.filter(item => item.id !== productId);
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
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
        alert('Order placed successfully! We will contact you shortly.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-[#F4F7F4] to-white min-h-screen py-20">
        <div className="container mx-auto px-8">
          <h1 className="text-4xl font-light text-[#2A462B] mb-12">
            Shopping <span className="text-[#3C6C3F] font-semibold">Cart</span>
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Cart Items */}
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#2A462B] mb-4">Order Summary</h2>
                
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty</p>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-4 border-b border-[#3C6C3F]/10">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-[#F4F7F4] rounded-lg overflow-hidden">
                            <img
                              src={getImageUrl(product.images[activeImage])}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#2A462B]">{item.name}</h3>
                            <p className="text-sm text-[#2A462B]/70">${item.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 text-[#3C6C3F] hover:bg-[#3C6C3F]/5 rounded-full transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 text-[#3C6C3F] hover:bg-[#3C6C3F]/5 rounded-full transition-colors"
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
                            className="text-sm text-red-500 hover:text-red-600 mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold text-[#2A462B]">
                        <span>Total</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Delivery Information Form */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#2A462B] mb-6">Delivery Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2A462B] mb-1">
                      First Name
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
                      Last Name
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
                    Email
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
                    Phone Number
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
                    Address
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
                    City
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
                      <span className="ml-2 text-xs text-red-400 font-medium">(Under Maintenance)</span>
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
                  className="w-full bg-[#3C6C3F] text-white py-3 rounded-lg font-medium 
                    hover:bg-[#2A462B] transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;