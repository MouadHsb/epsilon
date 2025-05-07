import React from 'react';
import Layout from '../components/Layout';

const Blogs = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-[#F4F7F4] to-white w-screen display-flex flex flex-col">
        <div className="container mx-auto px-8 py-20">
          <h1 className="text-5xl font-light text-[#2A462B] mb-12">
            Skincare <span className="text-[#3C6C3F] font-semibold">Blog</span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Example blog posts */}
            {Array(4).fill(null).map((_, index) => (
              <div 
                key={index} 
                className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden 
                  shadow-lg hover:shadow-xl transition-all duration-300 
                  border border-[#3C6C3F]/10 hover:bg-white/95 group"
              >
                <div className="bg-gradient-to-br from-[#F4F7F4] to-[#E8EEE8] h-48">
                  <img
                    src="/api/placeholder/500/300"
                    alt="Blog post thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-[#2A462B] mb-4">
                    Blog Post Title
                  </h3>
                  <p className="text-[#2A462B]/70 leading-relaxed mb-6">
                    Preview of the blog post content goes here...
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[#3C6C3F] font-medium group-hover:text-[#2A462B] 
                      transition-colors duration-300">
                      Read More →
                    </span>
                    <span className="text-[#2A462B]/50">
                      5 mins read
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;