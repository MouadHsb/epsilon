import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  QrCode, 
  Type, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Calendar,
  Award,
  Leaf,
  Camera,
  X,
  ArrowRight,
  Sparkles,
  Globe,
  Users,
  Heart
} from 'lucide-react';

// Serial code logic constants
const PRODUCT_CATEGORIES = {
  'SKC': { name: 'Skincare', products: ['Cleansers', 'Moisturizers', 'Serums', 'Masks', 'Toners', 'Eye Care'] },
  'DTR': { name: 'Daily Treatment & Recovery', products: ['Face Oils', 'Lip Care'] }
};

const ARGAN_REGIONS = {
  '1247': { name: 'Essaouira', description: 'Coastal region with premium argan groves' },
  '2891': { name: 'Agadir', description: 'Traditional argan oil production center' },
  '3762': { name: 'Taroudant', description: 'Ancient argan cultivation heritage' },
  '4536': { name: 'Tiznit', description: 'High-altitude argan forests' },
  '5194': { name: 'Chtouka-Ait Baha', description: 'UNESCO Biosphere Reserve region' },
  '6823': { name: 'Inezgane-Ait Melloul', description: 'Sustainable argan cooperative hub' },
  '7459': { name: 'Souss Valley', description: 'Heart of argan oil production' },
  '8601': { name: 'Anti-Atlas Mountains', description: 'Wild argan tree preservation area' }
};

// Generate a valid serial code for demo purposes
const generateValidCode = () => {
  const categories = Object.keys(PRODUCT_CATEGORIES);
  const regions = Object.keys(ARGAN_REGIONS);
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const categoryNum = Math.floor(Math.random() * 20) + 1;
  const region = regions[Math.floor(Math.random() * regions.length)];
  
  // Generate date-based code (YYMMDD format)
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const dateCode = year + month + day;
  
  return `${category}${categoryNum}-${region}-${dateCode}`;
};

// Parse date from serial code format YYMMDD
const parseDateFromCode = (dateCode) => {
  if (dateCode.length !== 6) return null;
  
  const year = parseInt('20' + dateCode.slice(0, 2));
  const month = parseInt(dateCode.slice(2, 4)) - 1; // Month is 0-indexed
  const day = parseInt(dateCode.slice(4, 6));
  
  // Validate date components
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  
  return new Date(year, month, day);
};

// Verify serial code format and extract information
const verifySerialCode = (code) => {
  if (!code || typeof code !== 'string') {
    return { isValid: false, error: 'Invalid code format' };
  }

  const cleanCode = code.trim().toUpperCase();
  const parts = cleanCode.split('-');
  
  if (parts.length !== 3) {
    return { isValid: false, error: 'Code must have 3 sections separated by dashes' };
  }

  const [categorySection, regionCode, dateSection] = parts;
  
  // Validate category section (SKC1, DTR8, etc.)
  const categoryMatch = categorySection.match(/^(SKC|DTR)(\d+)$/);
  if (!categoryMatch) {
    return { isValid: false, error: 'Invalid product category section' };
  }
  
  const [, categoryCode, productNumber] = categoryMatch;
  
  // Validate region code
  if (!ARGAN_REGIONS[regionCode]) {
    return { isValid: false, error: 'Invalid region code' };
  }
  
  // Validate date section (6 digits YYMMDD)
  if (!/^\d{6}$/.test(dateSection)) {
    return { isValid: false, error: 'Invalid production date format' };
  }
  
  // Parse production date
  const productionDate = parseDateFromCode(dateSection);
  if (!productionDate) {
    return { isValid: false, error: 'Invalid production date' };
  }
  
  return {
    isValid: true,
    data: {
      serialCode: cleanCode,
      category: PRODUCT_CATEGORIES[categoryCode],
      productName: "Rosehip Face Oil", // Always show the same product name as requested
      productNumber,
      region: ARGAN_REGIONS[regionCode],
      productionDate,
      batchNumber: `B${regionCode}${dateSection.slice(0, 3)}`,
      verificationId: `TDF-${dateSection}`
    }
  };
};

const QRScannerModal = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Camera access denied. Please enable camera permissions.');
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-[#F4F7F4] to-white">
          <div>
            <h2 className="text-2xl font-semibold text-[#2A462B]">Scan QR Code</h2>
            <p className="text-sm text-[#2A462B]/70 mt-1">Position the QR code within the frame</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-full transition-all duration-300"
          >
            <X className="w-6 h-6 text-[#2A462B]" />
          </button>
        </div>
        
        <div className="relative bg-black aspect-square w-full">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="mb-4">{error}</p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-white text-[#2A462B] rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* QR Code overlay frame */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  w-64 h-64 border-4 border-white/80 rounded-2xl">
                  {/* Corner indicators */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-[#3C6C3F] rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-[#3C6C3F] rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-[#3C6C3F] rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-[#3C6C3F] rounded-br-lg"></div>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center">
                <p className="text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  Align QR code within the frame to scan
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="p-6 bg-gradient-to-r from-[#F4F7F4] to-white">
          <button
            onClick={() => {
              // Simulate QR scan with a valid code for demo
              const demoCode = generateValidCode();
              onScan(demoCode);
              handleClose();
            }}
            className="w-full bg-[#3C6C3F] text-white px-8 py-4 rounded-full
              hover:bg-[#2A462B] transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Simulate QR Scan (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductVerification = () => {
  const [verificationMethod, setVerificationMethod] = useState('select'); // 'select', 'qr', 'manual'
  const [serialCode, setSerialCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Refs for scroll targeting
  const methodSelectionRef = useRef(null);
  const manualEntryRef = useRef(null);
  const verifyingRef = useRef(null);
  const resultsRef = useRef(null);

  // Smooth scroll function with offset for header
  const scrollToElement = (elementRef, offset = -100) => {
    if (elementRef.current) {
      const elementPosition = elementRef.current.offsetTop + offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Enhanced method selection with scroll
  const handleMethodSelection = (method) => {
    setVerificationMethod(method);
    // Small delay to ensure the DOM is updated before scrolling
    setTimeout(() => {
      if (method === 'manual') {
        scrollToElement(manualEntryRef);
      }
    }, 100);
  };

  const handleVerification = async (code) => {
    setIsVerifying(true);
    
    // Scroll to verification loading area
    setTimeout(() => {
      scrollToElement(verifyingRef, -150);
    }, 100);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = verifySerialCode(code);
    setVerificationResult(result);
    setIsVerifying(false);
    
    if (result.isValid) {
      setSerialCode(code);
    }

    // Scroll to results after verification completes
    setTimeout(() => {
      scrollToElement(resultsRef, -150);
    }, 200);
  };

  const handleQRScan = (scannedCode) => {
    setSerialCode(scannedCode);
    setVerificationMethod('qr');
    handleVerification(scannedCode);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (serialCode.trim()) {
      handleVerification(serialCode.trim());
    }
  };

  const resetVerification = () => {
    setVerificationMethod('select');
    setSerialCode('');
    setVerificationResult(null);
    
    // Scroll back to method selection
    setTimeout(() => {
      scrollToElement(methodSelectionRef, -100);
    }, 100);
  };

  const handleBackToSelection = () => {
    setVerificationMethod('select');
    // Scroll back to method selection
    setTimeout(() => {
      scrollToElement(methodSelectionRef, -100);
    }, 100);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-[#F4F7F4] via-white to-[#F4F7F4] min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-white to-[#F4F7F4]/50 pb-8">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 md:px-8 pt-10 md:pt-16 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#3C6C3F]/10 px-4 py-2 rounded-full mb-6">
                <Shield className="w-4 h-4 text-[#3C6C3F]" />
                <span className="text-sm font-medium text-[#3C6C3F]">Authenticity Verification</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-light text-[#2A462B] mb-4 tracking-tight">
                Verify Your
                <span className="block text-[#3C6C3F] font-semibold mt-2">Authentic Tadefi</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#2A462B]/80 mb-8 leading-relaxed">
                Ensure the authenticity of your Tadefi products and trace their journey from 
                Morocco's argan forests to your skincare routine.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 pb-20">
          {/* Method Selection */}
          {verificationMethod === 'select' && !verificationResult && (
            <div ref={methodSelectionRef} className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-[#3C6C3F]/10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-[#2A462B] mb-4">
                    Choose Verification Method
                  </h2>
                  <p className="text-[#2A462B]/70 max-w-2xl mx-auto">
                    Select how you'd like to verify your product. Each Tadefi product comes with a unique serial code for authenticity verification.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <button
                    onClick={() => setShowQRScanner(true)}
                    className="group relative overflow-hidden bg-gradient-to-br from-[#F4F7F4] to-white p-8 rounded-2xl
                      border-2 border-[#3C6C3F]/20 hover:border-[#3C6C3F] transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4
                        group-hover:bg-[#3C6C3F]/20 transition-colors">
                        <QrCode className="w-8 h-8 text-[#3C6C3F]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#2A462B] mb-2">Scan QR Code</h3>
                      <p className="text-[#2A462B]/70">Quick verification using your camera</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3C6C3F]/5 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button 
                    onClick={() => handleMethodSelection('manual')}
                    className="group relative overflow-hidden bg-gradient-to-br from-[#F4F7F4] to-white p-8 rounded-2xl
                      border-2 border-[#3C6C3F]/20 hover:border-[#3C6C3F] transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4
                        group-hover:bg-[#3C6C3F]/20 transition-colors">
                        <Type className="w-8 h-8 text-[#3C6C3F]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#2A462B] mb-2">Enter Serial Code</h3>
                      <p className="text-[#2A462B]/70">Type the code manually</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3C6C3F]/5 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* The Tadefi Authenticity Promise */}
                <div className="bg-gradient-to-br from-[#F4F7F4]/50 to-white rounded-3xl p-8 md:p-12 border border-[#3C6C3F]/5">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold text-[#2A462B] mb-4">
                      The Tadefi Authenticity Promise
                    </h2>
                    <p className="text-[#2A462B]/70 max-w-3xl mx-auto leading-relaxed">
                      Every genuine Tadefi product carries a unique serial code that connects you to its authentic origins 
                      in Morocco's sustainable argan cooperatives. Here's what makes our verification system special.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-[#3C6C3F]/10 text-center shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-7 h-7 text-[#3C6C3F]" />
                      </div>
                      <h3 className="font-semibold text-[#2A462B] mb-2">Traceable Origins</h3>
                      <p className="text-sm text-[#2A462B]/70">Track your product back to specific argan regions in Morocco</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#3C6C3F]/10 text-center shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-7 h-7 text-[#3C6C3F]" />
                      </div>
                      <h3 className="font-semibold text-[#2A462B] mb-2">Community Impact</h3>
                      <p className="text-sm text-[#2A462B]/70">Know exactly which cooperative produced your item</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#3C6C3F]/10 text-center shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-7 h-7 text-[#3C6C3F]" />
                      </div>
                      <h3 className="font-semibold text-[#2A462B] mb-2">Sustainability</h3>
                      <p className="text-sm text-[#2A462B]/70">Verify ethical sourcing and environmental practices</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#3C6C3F]/10 text-center shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-7 h-7 text-[#3C6C3F]" />
                      </div>
                      <h3 className="font-semibold text-[#2A462B] mb-2">Quality Assurance</h3>
                      <p className="text-sm text-[#2A462B]/70">Guarantee of authentic formulation and freshness</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Entry Form */}
          {verificationMethod === 'manual' && !verificationResult && (
            <div ref={manualEntryRef} className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-[#3C6C3F]/10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-[#2A462B] mb-4">
                    Enter Serial Code
                  </h2>
                  <p className="text-[#2A462B]/70">
                    Find the serial code on your product packaging or included authenticity card
                  </p>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2A462B] mb-2">
                      Serial Code
                    </label>
                    <input
                      type="text"
                      value={serialCode}
                      onChange={(e) => setSerialCode(e.target.value.toUpperCase())}
                      placeholder="SKC1-3762-240828"
                      className="w-full px-6 py-4 rounded-xl border border-[#3C6C3F]/20 text-center
                        focus:outline-none focus:ring-2 focus:ring-[#3C6C3F]/40 focus:border-[#3C6C3F]
                        text-lg font-mono tracking-wider shadow-sm bg-[#F4F7F4]/30"
                      autoFocus
                    />
                    <p className="text-xs text-[#2A462B]/60 mt-2 text-center">
                      Format: XXX#-####-YYMMDD (Example: SKC1-3762-240828)
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBackToSelection}
                      className="flex-1 bg-white text-[#3C6C3F] px-6 py-4 rounded-xl border-2 border-[#3C6C3F]
                        hover:bg-[#F4F7F4] transition-all duration-300 font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!serialCode.trim()}
                      className="flex-1 bg-[#3C6C3F] text-white px-6 py-4 rounded-xl
                        hover:bg-[#2A462B] transition-all duration-300 shadow-lg hover:shadow-xl 
                        font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify Product
                    </button>
                  </div>
                </form>

                {/* Sample Code Helper */}
                {/* <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="text-center">
                    <p className="text-sm text-blue-900 mb-2 font-medium">
                      Need a sample code to test?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const sampleCode = generateValidCode();
                        setSerialCode(sampleCode);
                      }}
                      className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors"
                    >
                      Generate sample code for testing
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          )}

          {/* Verification Loading */}
          {isVerifying && (
            <div ref={verifyingRef} className="max-w-xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#3C6C3F]/20 to-[#3C6C3F]/5 
                    flex items-center justify-center mb-6 animate-pulse">
                    <Shield className="w-12 h-12 text-[#3C6C3F] animate-spin-slow" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-[#3C6C3F]/20 border-t-[#3C6C3F] animate-spin"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-[#2A462B] mb-3">Verifying Authenticity</h3>
                <p className="text-[#2A462B]/70 leading-relaxed">
                  Checking your product's authenticity and tracing its origin...
                </p>
              </div>
            </div>
          )}

          {/* Verification Results */}
          {verificationResult && !isVerifying && (
            <div ref={resultsRef} className="max-w-5xl mx-auto">
              {verificationResult.isValid ? (
                <div className="space-y-8">
                  {/* Success Header */}
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-10 h-10" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-semibold">Authentic Tadefi Product</h2>
                          <p className="text-green-100">Verification completed successfully</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-mono bg-white/20 rounded-lg px-6 py-3 inline-block">
                          {verificationResult.data.serialCode}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Product Details */}
                        <div className="bg-gradient-to-br from-[#F4F7F4] to-white p-6 rounded-2xl border border-[#3C6C3F]/10">
                          <div className="w-12 h-12 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mb-4">
                            <Award className="w-6 h-6 text-[#3C6C3F]" />
                          </div>
                          <h3 className="font-semibold text-[#2A462B] mb-2">Product Details</h3>
                          <p className="text-[#3C6C3F] font-medium">{verificationResult.data.productName}</p>
                          <p className="text-sm text-[#2A462B]/70 mt-1">{verificationResult.data.category.name} Category</p>
                        </div>

                        {/* Origin Region */}
                        <div className="bg-gradient-to-br from-[#F4F7F4] to-white p-6 rounded-2xl border border-[#3C6C3F]/10">
                          <div className="w-12 h-12 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-[#3C6C3F]" />
                          </div>
                          <h3 className="font-semibold text-[#2A462B] mb-2">Origin Region</h3>
                          <p className="text-[#3C6C3F] font-medium">{verificationResult.data.region.name}</p>
                          <p className="text-sm text-[#2A462B]/70 mt-1">{verificationResult.data.region.description}</p>
                        </div>

                        {/* Production Info */}
                        <div className="bg-gradient-to-br from-[#F4F7F4] to-white p-6 rounded-2xl border border-[#3C6C3F]/10">
                          <div className="w-12 h-12 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-[#3C6C3F]" />
                          </div>
                          <h3 className="font-semibold text-[#2A462B] mb-2">Production Date</h3>
                          <p className="text-[#3C6C3F] font-medium">
                            {verificationResult.data.productionDate.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-[#2A462B]/70 mt-1">Batch: {verificationResult.data.batchNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Authenticity Features */}
                  <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h3 className="text-2xl font-semibold text-[#2A462B] mb-8 text-center">
                      Why This Matters
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Shield className="w-8 h-8 text-[#3C6C3F]" />
                        </div>
                        <h4 className="font-semibold text-[#2A462B] mb-2">Authentic Quality</h4>
                        <p className="text-[#2A462B]/70 text-sm leading-relaxed">
                          Guaranteed genuine Tadefi formulation with premium Moroccan argan oil and natural ingredients
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-[#3C6C3F]" />
                        </div>
                        <h4 className="font-semibold text-[#2A462B] mb-2">Supporting Communities</h4>
                        <p className="text-[#2A462B]/70 text-sm leading-relaxed">
                          Your purchase directly supports women's cooperatives and sustainable practices in Morocco
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Leaf className="w-8 h-8 text-[#3C6C3F]" />
                        </div>
                        <h4 className="font-semibold text-[#2A462B] mb-2">Sustainable Sourcing</h4>
                        <p className="text-[#2A462B]/70 text-sm leading-relaxed">
                          Traced from {verificationResult.data.region.name} to ensure ethical and environmental standards
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Invalid Product
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-red-100">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-semibold mb-2">Verification Failed</h2>
                    <p className="text-red-100">{verificationResult.error}</p>
                  </div>
                  
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      This serial code doesn't match our authentic Tadefi products. This could indicate a counterfeit product 
                      or an incorrectly entered code. For your safety and the best skincare results, we recommend purchasing 
                      only from authorized Tadefi retailers.
                    </p>
                    
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">If you believe this is an error:</h4>
                      <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
                        <li>• Double-check the serial code for any typos</li>
                        <li>• Ensure you're entering the complete code including dashes</li>
                        <li>• Contact our customer service team for assistance</li>
                        <li>• Keep your product and packaging for verification</li>
                      </ul>
                    </div>
                    
                    {/* Try again with sample code */}
                    <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                      <p className="text-sm text-blue-900 mb-2">
                        Want to try with a valid sample code?
                      </p>
                      <button
                        onClick={() => {
                          const sampleCode = generateValidCode();
                          setSerialCode(sampleCode);
                          handleVerification(sampleCode);
                        }}
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors"
                      >
                        Test with sample code
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button
                  onClick={resetVerification}
                  className="bg-[#3C6C3F] text-white px-8 py-4 rounded-full
                    hover:bg-[#2A462B] transition-all duration-300 shadow-lg 
                    hover:shadow-xl font-medium flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Verify Another Product
                </button>
                {verificationResult.isValid && (
                  <button
                    onClick={() => {
                      // Navigate to products page (in real app, use navigate('/products'))
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white text-[#3C6C3F] px-8 py-4 rounded-full 
                      border-2 border-[#3C6C3F] hover:bg-[#F4F7F4] 
                      transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Explore More Products
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showQRScanner && (
        <QRScannerModal 
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #3C6C3F10 1px, transparent 1px),
            linear-gradient(to bottom, #3C6C3F10 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </Layout>
  );
};

export default ProductVerification;