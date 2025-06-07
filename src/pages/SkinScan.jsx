import React, { useRef, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Camera, Upload, X, ArrowRight, Loader2, Info, AlertCircle, Check, Sparkles, Shield, Sun, Droplets, Eye, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeSkinPhoto } from '../services/skinAnalysisService.js';

// Instructions data
const photoInstructions = [
  { icon: <Droplets className="w-5 h-5" />, text: "Wash your face and let it air dry for 5-10 minutes" },
  { icon: <Sun className="w-5 h-5" />, text: "Face a natural light source or bright indoor lighting" },
  { icon: <Camera className="w-5 h-5" />, text: "Use the back camera for better quality if possible" },
  { icon: <Eye className="w-5 h-5" />, text: "Keep a neutral expression and look directly at camera" }
];

// Confidence level mapping
const getConfidenceLevel = (confidence) => {
  if (confidence >= 0.85) return { level: "Very High", color: "text-green-600", bgColor: "bg-green-50", description: "Excellent image quality" };
  if (confidence >= 0.7) return { level: "High", color: "text-blue-600", bgColor: "bg-blue-50", description: "Good analysis results" };
  return { level: "Moderate", color: "text-amber-600", bgColor: "bg-amber-50", description: "Follow photo guidelines for better results" };
};

const CameraModal = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('user');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const startCamera = async () => {
      try {
        const constraints = {
          video: isMobile 
            ? { facingMode: facingMode }
            : true
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!isMounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setCameraError(null);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setCameraError(err.message || 'Could not access your camera');
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isMobile, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleCaptureClick = () => {
    if (!isVideoReady) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    const maxWidth = 800;
    const aspectRatio = video.videoHeight / video.videoWidth;
    
    let canvasWidth = Math.min(video.videoWidth, maxWidth);
    let canvasHeight = canvasWidth * aspectRatio;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const context = canvas.getContext('2d');
    
    if (facingMode === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    
    onCapture(photoData);
    stopCamera();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#F4F7F4] to-white">
          <div>
            <h2 className="text-2xl font-semibold text-[#2A462B]">Capture Your Photo</h2>
            <p className="text-sm text-[#2A462B]/70 mt-1">Position your face in the center</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-full transition-all duration-300"
          >
            <X className="w-6 h-6 text-[#2A462B]" />
          </button>
        </div>
        
        <div className="relative bg-black aspect-[4/3] w-full">
          {cameraError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="mb-4 p-4 rounded-full bg-red-500/20">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Camera Access Required</h3>
              <p className="text-white/80 mb-4">{cameraError}</p>
              <p className="text-white/60 text-sm mb-6">Please enable camera permissions in your browser settings.</p>
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
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                onLoadedData={() => setIsVideoReady(true)}
              />
              
              {/* Camera overlay guide */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  w-64 h-80 border-2 border-white/50 rounded-3xl"></div>
              </div>
              
              {isMobile && (
                <button
                  onClick={switchCamera}
                  className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full
                    text-white hover:bg-white/30 transition-all duration-300"
                  aria-label="Switch camera"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </>
          )}
          
          {!isVideoReady && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black/50">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                <span className="text-lg">Initializing camera...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-gradient-to-r from-[#F4F7F4] to-white">
          <button
            onClick={handleCaptureClick}
            disabled={!isVideoReady || cameraError}
            className={`w-full px-8 py-4 rounded-full transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-3 ${
              isVideoReady && !cameraError
                ? 'bg-[#3C6C3F] text-white hover:bg-[#2A462B] hover:shadow-xl transform hover:scale-[1.02]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isVideoReady && !cameraError ? (
              <>
                <Camera className="w-5 h-5" />
                Capture Photo
              </>
            ) : (
              !cameraError && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Camera Loading...
                </>
              )
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const SkinScan = () => {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('instructions');

  const handleAnalyzeSkinPhoto = async (photoData) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const result = await analyzeSkinPhoto(photoData);
      
      if (result.success) {
        setAnalysis(result.analysis);
        // Only take top 3 products
        setRecommendedProducts(result.recommendedProducts.slice(0, 3));
        setActiveTab('results');
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCapture = async (photoData) => {
    setPhoto(photoData);
    setShowCamera(false);
    await handleAnalyzeSkinPhoto(photoData);
  };

  const handleNewPhoto = () => {
    setPhoto(null);
    setAnalysis(null);
    setRecommendedProducts([]);
    setAnalysisError(null);
    setActiveTab('instructions');
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('Please select an image smaller than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        let photoData = e.target.result;
        
        if (file.size > 2 * 1024 * 1024) {
          photoData = await resizeImage(photoData, 800);
        }
        
        setPhoto(photoData);
        await handleAnalyzeSkinPhoto(photoData);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const resizeImage = (dataUrl, maxWidth) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const aspectRatio = img.height / img.width;
        const newWidth = Math.min(img.width, maxWidth);
        const newHeight = newWidth * aspectRatio;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        resolve(resizedDataUrl);
      };
      img.src = dataUrl;
    });
  };

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find(item => item.id === product.id);
    
    let newCart;
    if (existingItem) {
      newCart = existingCart.map(item => 
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };
      newCart = [...existingCart, cartItem];
    }
    
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
    
    // Visual feedback
    const button = event.target;
    const originalContent = button.innerHTML;
    button.innerHTML = '<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Added';
    button.classList.add('bg-green-600');
    
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.classList.remove('bg-green-600');
    }, 2000);
  };

  const getImageUrl = (path) => {
    if (path?.startsWith('http')) {
      return path;
    }
    return path?.startsWith('/') ? path : `/${path}`;
  };

  return (
    <Layout>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleUpload}
        className="hidden"
      />
      
      <div className="bg-gradient-to-br from-[#F4F7F4] via-white to-[#F4F7F4] min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-white to-[#F4F7F4]/50 pb-8">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 md:px-8 pt-10 md:pt-16 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#3C6C3F]/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-[#3C6C3F]" />
                <span className="text-sm font-medium text-[#3C6C3F]">AI-Powered Skin Analysis</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-light text-[#2A462B] mb-4 tracking-tight">
                Discover Your Skin's
                <span className="block text-[#3C6C3F] font-semibold mt-2">Perfect Match</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#2A462B]/80 mb-8 leading-relaxed">
                Advanced AI technology analyzes your unique skin characteristics to recommend 
                the ideal Tadefi products for your skincare journey.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 pb-20">
          {!photo && !isAnalyzing && (
            <div className="max-w-5xl mx-auto">
              {/* Tabs */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-white rounded-full p-1 shadow-md">
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTab === 'instructions' 
                        ? 'bg-[#3C6C3F] text-white shadow-lg' 
                        : 'text-[#2A462B]/70 hover:text-[#2A462B]'
                    }`}
                  >
                    Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTab === 'upload' 
                        ? 'bg-[#3C6C3F] text-white shadow-lg' 
                        : 'text-[#2A462B]/70 hover:text-[#2A462B]'
                    }`}
                  >
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Instructions Tab */}
              {activeTab === 'instructions' && (
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-[#3C6C3F]/10">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#2A462B] mb-8 text-center">
                      How to Take the Perfect Photo
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      {photoInstructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-[#F4F7F4]/50 rounded-xl hover:bg-[#F4F7F4] transition-colors">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center text-[#3C6C3F]">
                            {instruction.icon}
                          </div>
                          <p className="text-[#2A462B]/80 leading-relaxed">{instruction.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                      <div className="flex items-start gap-3">
                        <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-amber-900 mb-2">Important Note</h3>
                          <p className="text-amber-800 text-sm leading-relaxed">
                            The accuracy of your skin analysis is directly linked to photo quality. 
                            Following these guidelines ensures the most precise recommendations for your skincare needs.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="inline-flex items-center gap-2 bg-[#3C6C3F] text-white px-8 py-4 rounded-full
                          hover:bg-[#2A462B] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        Continue to Upload
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-[#3C6C3F]/10">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#2A462B] mb-8 text-center">
                      Choose Your Method
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <button
                        onClick={() => setShowCamera(true)}
                        className="group relative overflow-hidden bg-gradient-to-br from-[#F4F7F4] to-white p-8 rounded-2xl
                          border-2 border-[#3C6C3F]/20 hover:border-[#3C6C3F] transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4
                            group-hover:bg-[#3C6C3F]/20 transition-colors">
                            <Camera className="w-8 h-8 text-[#3C6C3F]" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#2A462B] mb-2">Take Photo</h3>
                          <p className="text-[#2A462B]/70">Use your device camera</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3C6C3F]/5 to-transparent opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative overflow-hidden bg-gradient-to-br from-[#F4F7F4] to-white p-8 rounded-2xl
                          border-2 border-[#3C6C3F]/20 hover:border-[#3C6C3F] transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center mx-auto mb-4
                            group-hover:bg-[#3C6C3F]/20 transition-colors">
                            <Upload className="w-8 h-8 text-[#3C6C3F]" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#2A462B] mb-2">Upload Photo</h3>
                          <p className="text-[#2A462B]/70">From your gallery</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3C6C3F]/5 to-transparent opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">Privacy First</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Your photos are processed securely and never stored. We respect your privacy and delete all images immediately after analysis.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analyzing State */}
          {isAnalyzing && (
            <div className="max-w-xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#3C6C3F]/20 to-[#3C6C3F]/5 
                    flex items-center justify-center mb-6 animate-pulse">
                    <Sparkles className="w-12 h-12 text-[#3C6C3F] animate-spin-slow" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-[#3C6C3F]/20 border-t-[#3C6C3F] animate-spin"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-[#2A462B] mb-3">Analyzing Your Skin</h3>
                <p className="text-[#2A462B]/70 leading-relaxed">
                  Our AI is examining your unique skin characteristics to provide personalized recommendations...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {analysisError && (
            <div className="max-w-xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-2 border-red-100">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Analysis Error</h3>
                <p className="text-gray-600 mb-6">{analysisError}</p>
                <button 
                  onClick={handleNewPhoto}
                  className="bg-[#3C6C3F] text-white px-8 py-3 rounded-full hover:bg-[#2A462B] 
                    transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {photo && analysis && !isAnalyzing && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Analysis Summary Card */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#3C6C3F] to-[#2A462B] p-8 text-white">
                  <h2 className="text-3xl font-semibold mb-2">Your Skin Analysis Results</h2>
                  <p className="text-white/80">Personalized insights based on your unique skin profile</p>
                </div>
                
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Photo Preview */}
                    <div className="md:col-span-1">
                      <div className="bg-gradient-to-br from-[#F4F7F4] to-white p-3 rounded-2xl shadow-md">
                        <img 
                          src={photo} 
                          alt="Your skin analysis" 
                          className="w-full rounded-xl"
                        />
                      </div>
                      {analysis.confidence && (
                        <div className={`mt-4 text-center p-3 rounded-xl ${getConfidenceLevel(analysis.confidence).bgColor}`}>
                          <p className={`font-medium ${getConfidenceLevel(analysis.confidence).color}`}>
                            Analysis Quality: {getConfidenceLevel(analysis.confidence).level}
                          </p>
                          <p className={`text-xs mt-1 ${getConfidenceLevel(analysis.confidence).color} opacity-80`}>
                            {getConfidenceLevel(analysis.confidence).description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Analysis Details */}
                    <div className="md:col-span-2 space-y-6">
                      {/* Skin Type */}
                      <div>
                        <h3 className="text-lg font-semibold text-[#2A462B] mb-3">Your Skin Type</h3>
                        <div className="bg-gradient-to-br from-[#F4F7F4] to-white rounded-2xl p-6 border border-[#3C6C3F]/10">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-[#3C6C3F]">
                                {analysis.skinType.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-xl font-semibold text-[#2A462B] capitalize">{analysis.skinType} Skin</p>
                              <p className="text-[#2A462B]/70 mt-1">
                                {analysis.skinType === 'combination' ? 
                                  'Mixed oily and dry areas requiring balanced care' : 
                                  analysis.skinType === 'oily' ?
                                  'Excess sebum production needing oil control' :
                                  analysis.skinType === 'dry' ?
                                  'Low moisture levels requiring deep hydration' :
                                  analysis.skinType === 'sensitive' ?
                                  'Reactive skin needing gentle, soothing care' :
                                  'Well-balanced skin with minimal concerns'
                              }</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detected Concerns */}
                      <div>
                        <h3 className="text-lg font-semibold text-[#2A462B] mb-3">Detected Concerns</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {analysis.concerns.map((concern, index) => (
                            <div key={index} className="bg-gradient-to-r from-[#F4F7F4] to-white rounded-xl p-4 
                              border border-[#3C6C3F]/10 hover:shadow-md transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-[#3C6C3F] animate-pulse"></div>
                                  <span className="text-[#2A462B] font-medium capitalize">{concern}</span>
                                </div>
                                {analysis.concernDetails && analysis.concernDetails[concern] && (
                                  <span className="text-xs text-[#2A462B]/60 bg-[#3C6C3F]/5 px-2 py-1 rounded-full">
                                    {Math.round(analysis.concernDetails[concern] * 100)}% match
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-[#2A462B] mb-3">
                      Your Personalized Product Matches
                    </h2>
                    <p className="text-[#2A462B]/70 max-w-2xl mx-auto">
                      Based on your skin analysis, these are the top 3 Tadefi products specifically chosen to address your unique skin needs
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {recommendedProducts.map((product, index) => (
                      <div 
                        key={product.id}
                        className="group bg-gradient-to-br from-[#F4F7F4]/50 to-white rounded-2xl overflow-hidden 
                          border border-[#3C6C3F]/10 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        {/* Match Badge */}
                        <div className="relative">
                          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 
                            rounded-full text-xs font-semibold text-[#3C6C3F] shadow-md">
                            #{index + 1} Best Match
                          </div>
                          <div className="aspect-square bg-gradient-to-br from-[#F4F7F4] to-white relative overflow-hidden">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="mb-3">
                            <span className="text-xs text-[#3C6C3F] font-medium bg-[#3C6C3F]/10 px-3 py-1 rounded-full">
                              {product.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg text-[#2A462B] mb-2 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-[#2A462B]/70 line-clamp-2 mb-4 h-10">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-[#2A462B]">${product.price.toFixed(2)}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                              ))}
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                            className="w-full bg-[#3C6C3F] text-white px-4 py-3 rounded-xl font-medium
                              hover:bg-[#2A462B] transition-all duration-300 shadow-md hover:shadow-lg
                              flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link 
                      to="/products"
                      className="inline-flex items-center gap-2 text-[#3C6C3F] font-medium 
                        hover:text-[#2A462B] transition-colors group"
                    >
                      Explore all products
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-900 mb-1">Disclaimer</h4>
                    <p className="text-blue-800 leading-relaxed">
                      This AI-powered analysis provides general skincare recommendations based on visual assessment. 
                      For specific skin conditions or concerns, please consult with a dermatologist or skincare professional. 
                      Results accuracy depends on photo quality and lighting conditions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleNewPhoto}
                  className="bg-[#3C6C3F] text-white px-8 py-4 rounded-full
                    hover:bg-[#2A462B] transition-all duration-300 shadow-lg 
                    hover:shadow-xl font-medium flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Take New Photo
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-white text-[#3C6C3F] px-8 py-4 rounded-full 
                    border-2 border-[#3C6C3F] hover:bg-[#F4F7F4] 
                    transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  Browse All Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCamera && (
        <CameraModal 
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
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

export default SkinScan;