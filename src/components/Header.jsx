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
            ? 'text-[#3C6C3F] hover:bg-[#F4F7F4] rounded-lg'  // Match mobile menu button style
            : 'rounded-full bg-[#F4F7F4] hover:bg-[#E8EEE8]'
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
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#3C6C3F]/10">
      <div className="mx-auto max-w-7xl px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-semibold tracking-tight text-[#2A462B]">
            <span className="text-[#3C6C3F]">Tad</span>efi
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex space-x-16 pl-6">
              <NavLink to="/" isActive={location.pathname === '/'}>Home</NavLink>
              <NavLink to="/products" isActive={location.pathname === '/products'}>Products</NavLink>
              <NavLink to="/skin-scan" isActive={location.pathname === '/skin-scan'}>SkinScan</NavLink>
              <NavLink to="/about" isActive={location.pathname === '/about'}>About Us</NavLink>
              {/* <NavLink to="/blogs" isActive={location.pathname === '/blogs'}>Blogs</NavLink> */}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-5">
            {/* Search Bar */}
            <div className="relative" ref={searchInputRef}>
              <div
                className={`flex items-center transition-all duration-300 ease-in-out
                  ${isSearchOpen ? 'w-64' : 'w-10'}
                  ${isSearchOpen ? 'bg-[#F4F7F4]' : 'hover:bg-[#F4F7F4]'}
                  rounded-full`}
              >
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[#3C6C3F] bg-[#F4F7F4] flex items-center justify-center"
                >
                  <Search className="w-5 h-5" strokeWidth={2} />
                </button>
                <form onSubmit={handleSearch} className={`flex-1 ${isSearchOpen ? 'block' : 'hidden'}`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-[#2A462B] placeholder-[#3C6C3F]/60"
                  />
                </form>
                {isSearchOpen && (
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 bg-[#F4F7F4] text-[#3C6C3F]"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>

            {/* Shopping Cart - Desktop */}
            <div className="relative" ref={cartRef}>
              <CartButton />
              {isCartMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#3C6C3F]/10 bg-white shadow-lg">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#3C6C3F] mb-3">Shopping Cart</h3>
                    
                    {cartItems.length === 0 ? (
                      <p className="text-gray-500 text-sm">Your cart is empty</p>
                    ) : (
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <button 
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="bg-[#3C6C3F]/5 p-1 text-[#3C6C3F] hover:bg-white rounded-full"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium text-gray-800">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="bg-[#3C6C3F]/5 p-1 text-[#3C6C3F] hover:bg-white rounded-full"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="bg-[#3C6C3F]/5 border border-[#3C6C3F] text-xs text-red-600 hover:bg-white text-red-500 mt-1"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-medium text-gray-800">Total</p>
                            <p className="text-sm font-bold text-gray-800">
                              ${totalPrice.toFixed(2)}
                            </p>
                          </div>
                          
                          <Link 
                            to="/cart"
                            className="block w-full text-center bg-[#3C6C3F] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#2A4B2C] transition-colors"
                          >
                            Checkout
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-1">
            {/* Mobile Cart Button - Only show if items exist */}
            {cartItems.length > 0 && (
              <CartButton isMobile={true} />
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="p-2 text-[#3C6C3F] hover:bg-[#F4F7F4] rounded-lg transition-colors 
                active:scale-95 transform select-none"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={2} />
              ) : (
                <div className="space-y-1.5">
                  <div className="w-6 h-0.5 bg-current"></div>
                  <div className="w-6 h-0.5 bg-current"></div>
                  <div className="w-6 h-0.5 bg-current"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
          <div className="py-4 space-y-3">
            <MobileNavLink to="/">Home</MobileNavLink>
            <MobileNavLink to="/products">Products</MobileNavLink>
            <MobileNavLink to="/skin-scan">SkinScan</MobileNavLink>
            <NavLink to="/about" isActive={location.pathname === '/about'}>About Us</NavLink>
            {/* <MobileNavLink to="/blogs">Blogs</MobileNavLink> */}
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
        transition-colors duration-200 font-medium tracking-wide text-sm
        ${isActive ? 'text-[#3C6C3F]' : 'text-[#2A462B] hover:text-[#3C6C3F]'}
      `}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`
        block py-2 text-sm transition-colors duration-200 font-medium 
        ${isActive ? 'text-[#3C6C3F]' : 'text-[#2A462B] hover:text-[#3C6C3F]'}
      `}
    >
      {children}
    </Link>
  );
};

export default Header;