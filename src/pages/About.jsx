import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Award, TreePine, Globe2, Users, Hammer, Shield, Star, Palette, Recycle } from 'lucide-react';
import Layout from '../components/Layout';

const AboutUs = () => {
  const navigate = useNavigate();

  const handleProductsClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate('/products');
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-timber-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-light text-timber-700 mb-6 opacity-0 animate-fade-in">
                Our <span className="text-primary font-semibold">Craft Story</span>
              </h1>
              <p className="text-xl text-timber-600 leading-relaxed mb-8 opacity-0 animate-fade-in-delay-1">
                At Epsilon Woods, we're reimagining furniture design through the fusion of sustainable hardwoods 
                and artistic resin flows. Born from a deep passion for both traditional craftsmanship and modern innovation,
                our journey celebrates the harmony between nature's gifts and human creativity.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg opacity-0 animate-slide-in-left">
                <h2 className="text-3xl font-light text-timber-700 mb-4">
                  Our <span className="text-primary font-semibold">Vision</span>
                </h2>
                <p className="text-lg text-timber-600 leading-relaxed">
                  We envision a world where furniture tells stories through the marriage of natural wood grain 
                  and flowing resin rivers. Where every home becomes a gallery of functional art, and where 
                  sustainable craftsmanship creates heirloom pieces that span generations while honoring our planet.
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg opacity-0 animate-slide-in-right">
                <h2 className="text-3xl font-light text-timber-700 mb-4">
                  Our <span className="text-primary font-semibold">Mission</span>
                </h2>
                <p className="text-lg text-timber-600 leading-relaxed">
                  To create exceptional furniture and decor that showcases the natural beauty of sustainably sourced hardwoods, 
                  enhanced with artistically poured epoxy resin. Through master craftsmanship and innovative design, 
                  we deliver functional art pieces that celebrate the perfect union of nature and human creativity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Master Artisans Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-light text-timber-700 mb-6">
                Master <span className="text-primary font-semibold">Artisans</span>
              </h2>
              <p className="text-lg text-timber-600 leading-relaxed">
                Epsilon Woods was founded by a collective of master woodworkers and resin artists, each bringing decades 
                of experience in their craft. Our workshop combines traditional joinery techniques with cutting-edge 
                resin artistry to create pieces that are both timeless and contemporary.
              </p>
            </div>


          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-timber-50/70">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-light text-timber-700 mb-12 text-center">
              Our <span className="text-primary font-semibold">Values</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center
                    shadow-lg hover:shadow-xl transition-all duration-300 
                    border border-primary/10 hover:bg-white/95 group
                    opacity-0 animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-16 h-16 bg-timber-50 rounded-full flex items-center 
                    justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-4">{value.title}</h3>
                  <p className="text-timber-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Epsilon Woods Philosophy Section */}
        <section className="py-16">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-light text-timber-700 mb-8 text-center">
                The <span className="text-primary font-semibold">Epsilon Woods</span> Philosophy
              </h2>
              
              <div className="space-y-10">
                {storyPoints.map((point, index) => (
                  <div key={index} className="flex gap-6 items-start opacity-0 animate-fade-in-up">
                    <div className="flex-shrink-0">
                      {point.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">
                        {point.title}
                      </h3>
                      <p className="text-timber-600 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Commitment */}
        <section className="py-16 bg-gradient-to-br from-timber-50 to-white">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-timber-700 mb-4">
                  Our <span className="text-primary font-semibold">Sustainability</span> Commitment
                </h2>
                <p className="text-lg text-timber-600 leading-relaxed max-w-3xl mx-auto">
                  We believe beautiful furniture shouldn't come at the cost of our planet. 
                  Every piece we create follows strict sustainability principles.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-primary/10 text-center shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TreePine className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-timber-700 mb-2">FSC Certified Wood</h3>
                  <p className="text-sm text-timber-600">All hardwoods sourced from responsibly managed forests</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-primary/10 text-center shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Recycle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-timber-700 mb-2">Zero Waste Workshop</h3>
                  <p className="text-sm text-timber-600">Wood scraps become smaller pieces, sawdust becomes compost</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-primary/10 text-center shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-timber-700 mb-2">Eco-Friendly Resins</h3>
                  <p className="text-sm text-timber-600">Low-VOC epoxy resins that are safe for homes and environment</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-primary/10 text-center shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe2 className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-timber-700 mb-2">Carbon Neutral Shipping</h3>
                  <p className="text-sm text-timber-600">All deliveries offset through tree planting partnerships</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-white">
          <div className="container mx-auto px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-light text-timber-700 mb-6">
                Experience the <span className="text-primary font-semibold">Artistry</span>
              </h2>
              <p className="text-lg text-timber-600 leading-relaxed mb-8">
                From stunning river tables to elegant wall art, each Epsilon Woods piece tells a unique story 
                of natural beauty enhanced by human creativity. Discover furniture that transforms 
                your space into a gallery of functional art.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/products"
                  onClick={handleProductsClick}
                  className="inline-block bg-primary text-white px-8 py-4 rounded-full
                  hover:bg-primary-dark transition-all duration-300 shadow-md 
                  hover:shadow-lg font-medium group"
                >
                  <span className="flex items-center gap-2">
                    Explore Our Collection
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link 
                  to="/custom"
                  className="inline-block bg-white text-primary px-8 py-4 rounded-full border border-primary
                  hover:bg-timber-50 transition-all duration-300 shadow-md 
                  hover:shadow-lg font-medium"
                >
                  Commission Custom Piece
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 1s forwards;
        }

        .animate-fade-in-delay-1 {
          animation: fadeIn 1s 0.3s forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 1s 0.5s forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 1s 0.5s forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s forwards;
        }
      `}</style>
    </Layout>
  );
};

const achievements = [
  "Fine Woodworking Magazine 'Artisan of the Year' 2023",
  "International Furniture Fair 'Best Innovation' Award 2022",
  "Sustainable Design Excellence Award 2021",
  "Featured in Architectural Digest, Better Homes & Gardens"
];

const values = [
  {
    icon: <TreePine className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />,
    title: "Sustainability",
    description: "We source only high quality hardwoods and use eco-friendly finishes, ensuring our beautiful furniture doesn't come at the planet's expense."
  },
  {
    icon: <Hammer className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />,
    title: "Master Craftsmanship",
    description: "Every piece is handcrafted by artisans with decades of experience, combining traditional joinery with innovative resin techniques."
  },
  {
    icon: <Palette className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />,
    title: "Artistic Innovation",
    description: "We push the boundaries of furniture design, creating pieces that serve as functional art through the marriage of wood and resin."
  }
];

const storyPoints = [
  {
    icon: <TreePine className="w-8 h-8 text-primary" />,
    title: "Natural Heritage",
    description: "Epsilon Woods celebrates the inherent beauty of hardwoods - from the rich chocolate tones of walnut to the golden warmth of oak. Each piece of wood is carefully selected for its unique grain pattern, character marks, and natural beauty. We believe that the best furniture starts with respecting and showcasing the tree's natural story, preserved through centuries of growth."
  },
  {
    icon: <Palette className="w-8 h-8 text-primary" />,
    title: "Resin Artistry",
    description: "Our signature epoxy resin work transforms furniture into flowing art. Like rivers cutting through landscapes, our resin flows follow the natural contours of wood, creating stunning visual narratives. Whether it's a deep blue ocean table or a golden amber accent, each resin pour is carefully planned and executed to complement the wood's natural character while adding contemporary flair."
  },
  {
    icon: <Hammer className="w-8 h-8 text-primary" />,
    title: "Master Craftsmanship",
    description: "Traditional joinery meets modern innovation in our workshop. Our master craftsmen use time-tested techniques like mortise and tenon joints, dovetails, and hand-planing, combined with precision CNC work and advanced resin techniques. This fusion ensures that every piece is not only beautiful but built to last for generations."
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Custom Collaboration",
    description: "We believe the best furniture tells your story. Our design process is deeply collaborative - working closely with clients to understand their vision, space, and lifestyle. From initial sketch to final delivery, we ensure every custom piece perfectly reflects the client's personality while maintaining our signature aesthetic of natural beauty enhanced by artistic innovation."
  }
];

export default AboutUs;