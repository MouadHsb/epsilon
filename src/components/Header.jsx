import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const cartRef = useRef(null);

  // Function to load cart data
  const loadCartData = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  // Load cart data initially
  useEffect(() => {
    loadCartData();
  }, []);

  // Listen for storage events (when other components update localStorage)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also set up an interval to check localStorage periodically
    const interval = setInterval(loadCartData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleClickOutside = (e) => {
    if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
      setIsSearchOpen(false);
    }
    if (cartRef.current && !cartRef.current.contains(e.target)) {
      setIsCartMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Memoized cart button to prevent unnecessary re-renders
  const CartButton = React.memo(({ className = '', isMobile = false }) => {
    const handleClick = () => {
      if (isMobile) {
        navigate('/cart');
      } else {
        setIsCartMenuOpen(prev => !prev);
      }
    };

    return (
      <button
        onClick={handleClick}
        className={`p-2 relative select-none ${
          isMobile 
            ? 'text-primary hover:bg-timber-50 rounded-lg'
            : 'rounded-full bg-timber-50 hover:bg-timber-100'
        } transition-colors duration-200 active:scale-95 transform`}
        aria-label="Shopping Cart"
      >
        <ShoppingCart 
          className={`w-${isMobile ? '6' : '5'} h-${isMobile ? '6' : '5'}`} 
          strokeWidth={2} 
        />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
            rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
            {cartCount}
          </span>
        )}
      </button>
    );
  });

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-primary/10 shadow-sm">
      <div className="mx-auto max-w-7xl px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold tracking-tight text-timber-700 hover:text-primary transition-colors">
            <span className="text-primary">Epsilon </span>Woods
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex space-x-16 pr-16">
              <NavLink to="/" isActive={location.pathname === '/'}>Home</NavLink>
              <NavLink to="/products" isActive={location.pathname === '/products'}>Products</NavLink>
              <NavLink to="/about" isActive={location.pathname === '/about'}>About Us</NavLink>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative" ref={searchInputRef}>
              <div
                className={`flex items-center transition-all duration-300 ease-in-out
                  ${isSearchOpen ? 'w-64' : 'w-10'}
                  ${isSearchOpen ? 'bg-timber-50' : 'hover:bg-timber-50'}
                  rounded-full border border-primary/10`}
              >
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-primary bg-timber-50 rounded-full flex items-center justify-center hover:bg-timber-100 transition-colors"
                >
                  <Search className="w-5 h-5" strokeWidth={2} />
                </button>
                <form onSubmit={handleSearch} className={`flex-1 ${isSearchOpen ? 'block' : 'hidden'}`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search furniture & decor..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-timber-700 placeholder-timber-500 px-3"
                  />
                </form>
                {isSearchOpen && (
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 bg-timber-50 text-primary rounded-full mr-1 hover:bg-timber-100 transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>

            {/* Shopping Cart - Desktop */}
            <div className="relative" ref={cartRef}>
              <CartButton />
              {isCartMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-primary/10 bg-white shadow-xl">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary mb-3">Shopping Cart</h3>
                    
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-timber-300 mx-auto mb-3" />
                        <p className="text-timber-500 text-sm">Your cart is empty</p>
                        <p className="text-timber-400 text-xs mt-1">Add some beautiful pieces to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="max-h-60 overflow-y-auto space-y-3">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-start bg-timber-50/50 rounded-lg p-3">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-timber-700 line-clamp-1">{item.name}</p>
                                <p className="text-xs text-timber-500 mt-1">{item.price.toFixed(2)} DH each</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button 
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="bg-white border border-timber-200 p-1 text-primary hover:bg-timber-50 rounded transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-sm font-medium text-timber-700 min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="bg-white border border-timber-200 p-1 text-primary hover:bg-timber-50 rounded transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="ml-3 text-right">
                                <p className="text-sm font-semibold text-timber-700">
                                  {(item.price * item.quantity).toFixed(2)} DH
                                </p>
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-4 border-t border-timber-200">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-base font-semibold text-timber-700">Total</p>
                            <p className="text-lg font-bold text-primary">
                              {totalPrice.toFixed(2)} DH
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Link 
                              to="/cart"
                              onClick={() => setIsCartMenuOpen(false)}
                              className="block w-full text-center bg-primary text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-primary-dark transition-colors"
                            >
                              View Cart & Checkout
                            </Link>
                            <button
                              onClick={() => setIsCartMenuOpen(false)}
                              className="block w-full text-center text-timber-600 text-sm hover:text-timber-700 transition-colors"
                            >
                              Continue Shopping
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Cart Button - Only show if items exist */}
            {cartItems.length > 0 && (
              <CartButton isMobile={true} />
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="p-2 text-primary hover:bg-timber-50 rounded-lg transition-colors 
                active:scale-95 transform select-none"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={2} />
              ) : (
                <div className="space-y-1.5">
                  <div className="w-6 h-0.5 bg-current rounded-full"></div>
                  <div className="w-6 h-0.5 bg-current rounded-full"></div>
                  <div className="w-6 h-0.5 bg-current rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden mt-4`}>
          <div className="py-4 space-y-3 border-t border-primary/10">
            <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</MobileNavLink>
            
            {/* Mobile Search */}
            <div className="pt-3 border-t border-primary/10">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-3 rounded-lg border border-primary/20 text-sm text-timber-700 placeholder-timber-500 bg-timber-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button 
                  type="submit"
                  className="bg-primary text-white px-4 py-3 rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children, isActive }) => {
  return (
    <Link
      to={to}
      className={`
        transition-colors duration-200 font-medium tracking-wide text-sm hover:text-primary
        ${isActive ? 'text-primary font-semibold' : 'text-timber-600'}
      `}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        block py-3 px-4 text-sm transition-colors duration-200 font-medium rounded-lg
        ${isActive ? 'text-primary bg-primary/10 font-semibold' : 'text-timber-600 hover:text-primary hover:bg-timber-50'}
      `}
    >
      {children}
    </Link>
  );
};

export default Header;