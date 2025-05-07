import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, ChevronRight, ArrowRight } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (email && email.includes('@')) {
      // In a production app, you would call an API to handle subscription
      // For demo purposes, we'll just show a success message
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus(null), 3000);
    } else {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus(null), 3000);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#F4F7F4]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F4F7F4] to-white opacity-70" />
      
      {/* Awards & Recognition Banner */}
      <div className="relative bg-[#3C6C3F]/5 py-4 border-b border-[#3C6C3F]/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            <h4 className="text-[#2A462B] font-semibold text-center sm:text-left">
              <span className="text-[#3C6C3F]">Awards</span> & Recognition:
            </h4>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              <AwardBadge name="Enactus World Cup 2024" place="Vice Champion" />
              <AwardBadge name="Sustainable Beauty Awards" place="Finalist 2023" />
              <AwardBadge name="Social Impact Awards" place="Winner 2022" />
              <AwardBadge name="Morocco Green Initiative" place="Excellence Award" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 pt-16 pb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-semibold text-[#2A462B] mb-6">
              About <span className="text-[#3C6C3F]">Tadefi</span>
            </h3>
            <p className="text-[#2A462B]/80 mb-6 leading-relaxed">
              Tadefi brings Morocco's natural treasures to modern skincare through sustainable practices and social impact. We create products that honor both your skin and the Earth.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} />
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} />
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-[#2A462B] mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/products">Shop All</FooterLink>
              <FooterLink to="/skin-scan">SkinScan™</FooterLink>
              <FooterLink to="/about">Our Story</FooterLink>
              <FooterLink to="/blogs">Blog</FooterLink>
            </ul>
          </div>
          
          {/* Column 3: Categories */}
          <div>
            <h3 className="text-xl font-semibold text-[#2A462B] mb-6">Categories</h3>
            <ul className="space-y-3">
              <FooterLink to="/products?category=cleansers">Cleansers</FooterLink>
              <FooterLink to="/products?category=moisturizers">Moisturizers</FooterLink>
              <FooterLink to="/products?category=serums">Serums</FooterLink>
              <FooterLink to="/products?category=masks">Face Masks</FooterLink>
              <FooterLink to="/products?category=lip-care">Lip Care</FooterLink>
            </ul>
          </div>
          
          {/* Column 4: Contact & Subscribe */}
          <div>
            <h3 className="text-xl font-semibold text-[#2A462B] mb-6">Stay Connected</h3>
            
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-[#3C6C3F]/20
                    focus:outline-none focus:ring-2 focus:ring-[#3C6C3F]/40 shadow-sm
                    bg-white/70 backdrop-blur-sm text-[#2A462B] placeholder-[#2A462B]/50
                    transition-all duration-300"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2
                    bg-[#3C6C3F] text-white p-2 rounded-full
                    hover:bg-[#2A462B] transition-all duration-300"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
              
              {subscribeStatus === 'success' && (
                <p className="text-green-600 text-sm mt-2">Thank you for subscribing!</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-red-500 text-sm mt-2">Please enter a valid email address.</p>
              )}
            </form>
            
            <div className="space-y-3">
              <ContactItem 
                icon={<MapPin size={16} />} 
                text="Rabat, Morocco" 
              />
              <ContactItem 
                icon={<Phone size={16} />} 
                text="+212 5XX-XXXXXX" 
                href="tel:+2125XXXXXXX"
              />
              <ContactItem 
                icon={<Mail size={16} />} 
                text="contact@tadefi.com" 
                href="mailto:contact@tadefi.com"
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-[#3C6C3F]/10 pt-6 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[#2A462B]/70 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Tadefi. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-[#2A462B]/70 hover:text-[#3C6C3F] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-[#2A462B]/70 hover:text-[#3C6C3F] transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-[#2A462B]/70 hover:text-[#3C6C3F] transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
        
        {/* Made By */}
        <div className="text-center text-xs text-[#2A462B]/60 mt-6">
          Made with 💚 by Enactus EMI
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-[#2A462B]/80 hover:text-[#3C6C3F] transition-colors flex items-center group"
    >
      <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
      {children}
    </Link>
  </li>
);

const SocialLink = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full bg-white flex items-center justify-center
      text-[#3C6C3F] border border-[#3C6C3F]/20 hover:bg-[#3C6C3F] hover:text-white
      transition-all duration-300 shadow-sm"
  >
    {icon}
  </a>
);

const ContactItem = ({ icon, text, href }) => {
  const content = (
    <div className="flex items-center text-[#2A462B]/80 hover:text-[#3C6C3F] transition-colors">
      <span className="mr-3 text-[#3C6C3F]">{icon}</span>
      <span>{text}</span>
    </div>
  );
  
  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
};

const AwardBadge = ({ name, place }) => (
  <div className="flex items-center">
    <div className="w-8 h-8 rounded-full bg-white border border-[#3C6C3F]/20 
      flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="#3C6C3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="#3C6C3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <div>
      <p className="text-xs font-medium text-[#2A462B]">{name}</p>
      <p className="text-xs text-[#2A462B]/60">{place}</p>
    </div>
  </div>
);

export default Footer;