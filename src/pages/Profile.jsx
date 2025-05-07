import React from 'react';
import Header from '../components/Header';
import { Settings, ShoppingBag, Heart, Clock } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#F4F7F4] to-white">
      <Header />
      <div className="container mx-auto px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center mb-12">
            <div className="w-20 h-20 bg-[#3C6C3F]/10 rounded-full flex items-center 
              justify-center shadow-md">
              <span className="text-2xl font-semibold text-[#3C6C3F]">JD</span>
            </div>
            <div className="ml-6">
              <h2 className="text-4xl font-light text-[#2A462B] tracking-tight">
                John <span className="text-[#3C6C3F] font-semibold">Doe</span>
              </h2>
              <p className="text-[#2A462B]/70 text-lg">john.doe@example.com</p>
            </div>
          </div>

          {/* Profile Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <ProfileCard 
              icon={<ShoppingBag />} 
              title="Orders" 
              description="View your order history" 
            />
            <ProfileCard 
              icon={<Heart />} 
              title="Favorites" 
              description="Your saved products" 
            />
            <ProfileCard 
              icon={<Clock />} 
              title="SkinScan History" 
              description="View your skin analysis results" 
            />
            <ProfileCard 
              icon={<Settings />} 
              title="Settings" 
              description="Manage your account" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ icon, title, description }) => (
  <button className="flex items-start p-8 bg-white/90 backdrop-blur-sm rounded-2xl 
    shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3C6C3F]/10 
    hover:bg-white/95 group"
  >
    <div className="text-[#3C6C3F] transform group-hover:scale-110 transition-transform duration-300">
      {React.cloneElement(icon, { className: 'w-8 h-8', strokeWidth: 1.5 })}
    </div>
    <div className="ml-6 text-left">
      <h3 className="text-xl font-semibold text-[#2A462B] mb-2">{title}</h3>
      <p className="text-[#2A462B]/70 leading-relaxed">{description}</p>
    </div>
  </button>
);

export default Profile;