import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, ChevronRight, ArrowRight, TreePine, Hammer, Award } from 'lucide-react';

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
    <footer className="relative overflow-hidden bg-timber-50">
      <div className="absolute inset-0 bg-gradient-to-br from-timber-50 to-white opacity-70" />
      
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 pt-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Column 1: About */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-timber-700 mb-6">
              About <span className="text-primary">Epsilon Woods</span>
            </h3>
            <p className="text-timber-600 mb-6 leading-relaxed">
              Epsilon Woods creates exceptional furniture and decor through the fusion of sustainable hardwoods 
              and artistic resin flows. Each handcrafted piece celebrates the harmony between nature's gifts 
              and human creativity, bringing functional art to your home.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://www.instagram.com/epsilon.woods.resine/?hl=en" icon={<Instagram size={18} />} />
              <SocialLink href="https://www.facebook.com/epsilonwoods/" icon={<Facebook size={18} />} />
            </div>
            <p className="text-sm text-timber-600/70 pt-8 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Epsilon Woods. All rights reserved.
            </p>
          </div>
          
          
          {/* Column 3: Contact & Subscribe */}
          <div>
            <h3 className="text-xl font-semibold text-timber-700 mb-6">Stay Connected</h3>
            
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-primary/20
                    focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm
                    bg-white/70 backdrop-blur-sm text-timber-700 placeholder-timber-600/50
                    transition-all duration-300"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2
                    bg-primary text-white p-2 rounded-full
                    hover:bg-primary-dark transition-all duration-300"
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
                text="Casablanca, Morocco" 
              />
              <ContactItem 
                icon={<Phone size={16} />} 
                text="+212 617497105"
                href="tel:+212617497105"
              />
              <ContactItem 
                icon={<Phone size={16} />} 
                text="+212 766552652"
                href="tel:+212766552652"
              />
              <ContactItem 
                icon={<Mail size={16} />} 
                text="contact@epsilonwoods.com" 
                href="mailto:contact@epsilonwoods.com"
              />
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-timber-600/80 hover:text-primary transition-colors flex items-center group"
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
      text-primary border border-primary/20 hover:bg-primary hover:text-white
      transition-all duration-300 shadow-sm"
  >
    {icon}
  </a>
);

const ContactItem = ({ icon, text, href }) => {
  const content = (
    <div className="flex items-center text-timber-600/80 hover:text-primary transition-colors">
      <span className="mr-3 text-primary">{icon}</span>
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
    <div className="w-8 h-8 rounded-full bg-white border border-primary/20 
      flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
      <Award className="w-4 h-4 text-primary" />
    </div>
    <div>
      <p className="text-xs font-medium text-timber-700">{name}</p>
      <p className="text-xs text-timber-600/60">{place}</p>
    </div>
  </div>
);

export default Footer;