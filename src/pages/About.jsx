import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ChevronRight, Award, Leaf, Globe2, Users, Heart, Shield, Star } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  const handleProductsClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate('/products');
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-[#F4F7F4] to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-light text-[#2A462B] mb-6 opacity-0 animate-fade-in">
                Our <span className="text-[#3C6C3F] font-semibold">Story</span>
              </h1>
              <p className="text-xl text-[#2A462B]/80 leading-relaxed mb-8 opacity-0 animate-fade-in-delay-1">
                At Sirdy, we're reimagining skincare through the fusion of Morocco's natural treasures 
                and sustainable innovation. Born from a deep commitment to both skin health and environmental responsibility,
                our journey celebrates the harmony between tradition and modern science.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg opacity-0 animate-slide-in-left">
                <h2 className="text-3xl font-light text-[#2A462B] mb-4">
                  Our <span className="text-[#3C6C3F] font-semibold">Vision</span>
                </h2>
                <p className="text-lg text-[#2A462B]/80 leading-relaxed">
                  We envision a world where skincare rituals honor both personal wellbeing and planetary health. 
                  Where ancient wisdom meets modern science, and where Moroccan beauty traditions create 
                  transformative experiences for people worldwide while empowering local communities.
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg opacity-0 animate-slide-in-right">
                <h2 className="text-3xl font-light text-[#2A462B] mb-4">
                  Our <span className="text-[#3C6C3F] font-semibold">Mission</span>
                </h2>
                <p className="text-lg text-[#2A462B]/80 leading-relaxed">
                  To create exceptional skincare formulations that harness the power of Morocco's natural ingredients, 
                  particularly Argan oil, through sustainable practices that preserve traditions, empower communities, 
                  and deliver pure, effective products that celebrate the connection between personal and planetary wellbeing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enactus & EMI Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-light text-[#2A462B] mb-6">
                Created by <span className="text-[#3C6C3F] font-semibold">Enactus EMI</span>
              </h2>
              <p className="text-lg text-[#2A462B]/80 leading-relaxed">
                Sirdy was born from the innovative minds of students at École Mohammadia d'Ingénieurs (EMI), 
                Morocco's premier engineering institution, through their award-winning Enactus chapter. 
                This initiative bridges academic excellence with social entrepreneurship, creating a brand that's 
                as much about positive impact as it is about exceptional skincare.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up">
              <h3 className="text-2xl font-semibold text-[#3C6C3F] mb-6 text-center">
                Global Recognition & Impact
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <Award 
                          className={`transform group-hover:scale-110 transition-transform ${
                            index === 0 ? 'w-12 h-12 text-[#3C6C3F]' :
                            index === 1 ? 'w-10 h-10 text-[#3C6C3F]/90' :
                            index === 2 ? 'w-9 h-9 text-[#3C6C3F]/80' :
                            'w-8 h-8 text-[#3C6C3F]/70'
                          }`}
                        />
                      </div>
                      <p className={`text-[#2A462B]/80 ${
                        index === 0 ? 'font-semibold' :
                        index === 1 ? 'font-medium' : ''
                      }`}>{achievement}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-[#F4F7F4]/70 rounded-xl">
                    <h4 className="text-xl font-medium text-[#3C6C3F] mb-3">Our Impact in Numbers</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#2A462B]">250+</p>
                        <p className="text-sm text-[#2A462B]/70">Women Employed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#2A462B]">12</p>
                        <p className="text-sm text-[#2A462B]/70">Cooperatives</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#2A462B]">5,000+</p>
                        <p className="text-sm text-[#2A462B]/70">Trees Preserved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#2A462B]">35%</p>
                        <p className="text-sm text-[#2A462B]/70">Income Increase</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-[#F4F7F4]/70">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-light text-[#2A462B] mb-12 text-center">
              Our <span className="text-[#3C6C3F] font-semibold">Values</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center
                    shadow-lg hover:shadow-xl transition-all duration-300 
                    border border-[#3C6C3F]/10 hover:bg-white/95 group
                    opacity-0 animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-16 h-16 bg-[#F4F7F4] rounded-full flex items-center 
                    justify-center mx-auto mb-6 group-hover:bg-[#3C6C3F]/10 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#3C6C3F] mb-4">{value.title}</h3>
                  <p className="text-[#2A462B]/80 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Sirdy Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-light text-[#2A462B] mb-8 text-center">
                The <span className="text-[#3C6C3F] font-semibold">Sirdy</span> Philosophy
              </h2>
              
              <div className="space-y-10">
                {storyPoints.map((point, index) => (
                  <div key={index} className="flex gap-6 items-start opacity-0 animate-fade-in-up">
                    <div className="flex-shrink-0">
                      {point.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#3C6C3F] mb-2">
                        {point.title}
                      </h3>
                      <p className="text-[#2A462B]/80 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-[#3C6C3F]/10 to-white">
          <div className="container mx-auto px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-light text-[#2A462B] mb-6">
                Join Our <span className="text-[#3C6C3F] font-semibold">Journey</span>
              </h2>
              <p className="text-lg text-[#2A462B]/80 leading-relaxed mb-8">
                Experience the fusion of traditional Moroccan beauty secrets with modern 
                skincare innovation. Every Sirdy product tells a story of sustainability, 
                empowerment, and natural beauty. Discover our collection and become part of 
                a movement that nourishes your skin while nurturing the planet.
              </p>
              <Link 
                to="/products"
                onClick={handleProductsClick}
                className="inline-block bg-[#3C6C3F] text-white px-8 py-4 rounded-full
                hover:bg-[#2A462B] transition-all duration-300 shadow-md 
                hover:shadow-lg font-medium group">
                <span className="flex items-center gap-2">
                  Explore Our Products
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
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
  "Vice-world champion 2014 (China) & 2024 (Kazakhstan)",
  "Third place worldwide 2015 (South Africa)",
  "Fourth place worldwide 2018 (United States)",
  "Semi-finalist 2013 (Mexico), 2019 (USA), 2020 (Netherlands), 2022 (Puerto Rico)"
];

const values = [
  {
    icon: <Leaf className="w-8 h-8 text-[#3C6C3F] group-hover:scale-110 transition-transform" />,
    title: "Sustainability",
    description: "We prioritize earth-friendly practices throughout our supply chain, from sourcing to packaging, ensuring our environmental footprint remains as light as possible."
  },
  {
    icon: <Heart className="w-8 h-8 text-[#3C6C3F] group-hover:scale-110 transition-transform" />,
    title: "Community Empowerment",
    description: "Our partnerships with women's cooperatives create sustainable livelihoods, preserve traditional knowledge, and strengthen local communities."
  },
  {
    icon: <Shield className="w-8 h-8 text-[#3C6C3F] group-hover:scale-110 transition-transform" />,
    title: "Authentic Purity",
    description: "We're committed to formulations that are genuinely natural, transparent in their composition, and free from harmful chemicals and unnecessary additives."
  }
];

const storyPoints = [
  {
    icon: <Leaf className="w-8 h-8 text-[#3C6C3F]" />,
    title: "Natural Heritage",
    description: "Sirdy harnesses the power of Moroccan Argan oil, often called 'liquid gold,' renowned worldwide for its exceptional skincare properties. This precious ingredient, native to Morocco's Souss Valley, has been used for centuries by Berber women to protect their skin from the harsh desert climate. Our formulations honor this rich tradition while embracing modern scientific advancements to create products that deliver profound results."
  },
  {
    icon: <Globe2 className="w-8 h-8 text-[#3C6C3F]" />,
    title: "Sustainable Impact",
    description: "Our relationship with the environment goes beyond simply using natural ingredients. We work directly with local communities to ensure sustainable harvesting practices that preserve the delicate ecosystem of the Argan forests. The Argan trees, recognized by UNESCO as an Intangible Cultural Heritage, are central to combating desertification in Morocco. Through our practices, we're helping to maintain this vital environmental balance while creating economic opportunities."
  },
  {
    icon: <Users className="w-8 h-8 text-[#3C6C3F]" />,
    title: "Community Empowerment",
    description: "At the heart of Sirdy is our commitment to the women of rural Morocco. Through our partnership with local women's cooperatives, we create sustainable employment opportunities that provide financial independence, education, and social empowerment. These cooperatives are custodians of traditional Argan extraction methods passed down through generations. By honoring their expertise and ensuring fair compensation, we help preserve cultural heritage while advancing gender equality."
  },
  {
    icon: <Star className="w-8 h-8 text-[#3C6C3F]" />,
    title: "Innovation with Integrity",
    description: "While we deeply respect tradition, we also embrace innovation. Our team works with cosmetic scientists to enhance the efficacy of our natural ingredients through cutting-edge techniques that preserve their integrity. This balanced approach allows us to create formulations that deliver exceptional results while staying true to our commitment to purity and sustainability – proving that modern skincare doesn't have to compromise on ethics to achieve excellence."
  }
];



export default AboutUs;