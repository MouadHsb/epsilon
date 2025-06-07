import React, { useRef, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Camera, Upload, X, ArrowRight, Loader2, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeSkinPhoto } from '../services/skinAnalysisService.js';


const CameraModal = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [cameraError, setCameraError] = useState(null);

  // Handle window resize
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
            ? { facingMode: "user" }
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
  }, [isMobile]);

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

  const handleCaptureClick = () => {
    if (!isVideoReady) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Set reasonable canvas dimensions (max 800px width to keep file size manageable)
    const maxWidth = 800;
    const aspectRatio = video.videoHeight / video.videoWidth;
    
    let canvasWidth = Math.min(video.videoWidth, maxWidth);
    let canvasHeight = canvasWidth * aspectRatio;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const context = canvas.getContext('2d');
    
    // If selfie camera, flip the image horizontally
    if (isMobile) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Use higher quality JPEG compression (0.85 quality)
    const photoData = canvas.toDataURL('image/jpeg', 0.85);
    
    console.log('Captured photo data length:', photoData.length);
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
    
    onCapture(photoData);
    stopCamera();
  };

  return (
    <div className="fixed inset-0 bg-[#2A462B]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#2A462B]">Take a Photo</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-[#F4F7F4] rounded-full transition-all duration-300"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-[#2A462B]" />
          </button>
        </div>
        
        <div className="relative bg-black aspect-[4/3] w-full">
          {cameraError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="mb-4 p-4 rounded-full bg-red-500/20">
                <Info className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Camera Access Error</h3>
              <p className="text-white/80 mb-4">{cameraError}</p>
              <p className="text-white/80 text-sm mb-4">Please ensure your browser has permission to access your camera and try again.</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-white text-[#2A462B] rounded-full font-medium"
              >
                Close
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: isMobile ? 'scaleX(-1)' : 'none' }}
              onLoadedData={() => setIsVideoReady(true)}
            />
          )}
          
          {!isVideoReady && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Initializing camera...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <button
            onClick={handleCaptureClick}
            disabled={!isVideoReady || cameraError}
            className={`w-full px-8 py-4 rounded-full transition-all duration-300 shadow-md font-medium flex items-center justify-center gap-2 ${
              isVideoReady && !cameraError
                ? 'bg-[#3C6C3F] text-white hover:bg-[#2A462B]' 
                : 'bg-[#F4F7F4] text-[#2A462B]/50 cursor-not-allowed'
            }`}
          >
            {isVideoReady && !cameraError ? (
              <>
                Capture Photo
                <Camera className="w-5 h-5" />
              </>
            ) : (
              !cameraError && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
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
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const fileInputRef = useRef(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  const handleAnalyzeSkinPhoto = async (photoData) => {
  setIsAnalyzing(true);
  setAnalysisError(null);
  
  try {
    const result = await analyzeSkinPhoto(photoData);
    
    if (result.success) {
      setAnalysis(result.analysis);
      setRecommendedProducts(result.recommendedProducts);
      
      // Show a warning if fallback was used
      if (result.fallback && !import.meta.env.DEV) {
        console.warn('Using fallback analysis due to API error:', result.error);
        // You could show a toast notification here about using fallback
      }
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
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      // Validate file size (max 10MB for processing)
      if (file.size > 10 * 1024 * 1024) {
        alert('Please select an image smaller than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        let photoData = e.target.result;
        
        // If the image is very large, resize it
        if (file.size > 2 * 1024 * 1024) { // If larger than 2MB
          photoData = await resizeImage(photoData, 800); // Resize to max 800px width
        }
        
        console.log('Uploaded photo data length:', photoData.length);
        setPhoto(photoData);
        await handleAnalyzeSkinPhoto(photoData);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  // Helper function to resize images
  const resizeImage = (dataUrl, maxWidth) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        const aspectRatio = img.height / img.width;
        const newWidth = Math.min(img.width, maxWidth);
        const newHeight = newWidth * aspectRatio;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        console.log('Resized image from', dataUrl.length, 'to', resizedDataUrl.length, 'characters');
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
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    alert(`${product.name} added to cart`);
  };

  const getImageUrl = (path) => {
    if (path?.startsWith('http')) {
      return path;
    }
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:5000';
    return `${baseUrl}${path}`;
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
      
      <div className="bg-gradient-to-br from-[#F4F7F4] to-white min-h-screen">
        <div className="container mx-auto px-4 md:px-8 py-10 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#2A462B] mb-4 md:mb-6 tracking-tight">
              Skin<span className="text-[#3C6C3F] font-semibold">Scan™</span>
            </h1>
            
            <div className="flex items-center justify-center mb-6 relative">
              <p className="text-lg text-[#2A462B]/80 leading-relaxed inline-flex items-center">
                AI-powered skin analysis for personalized recommendations
                <button 
                  className="ml-2 text-[#3C6C3F] p-1 rounded-full hover:bg-[#3C6C3F]/10 transition-colors"
                  onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                  aria-label="More information about SkinScan"
                >
                  <Info className="w-5 h-5" />
                </button>
              </p>
              
              {showInfoTooltip && (
                <div className="absolute top-full mt-2 bg-white p-4 rounded-xl shadow-lg text-left z-10 max-w-md">
                  <h3 className="font-medium text-[#2A462B] mb-2">How SkinScan Works</h3>
                  <p className="text-sm text-[#2A462B]/80 mb-3">
                    SkinScan uses advanced AI computer vision to analyze your skin's condition and identify 
                    various concerns like acne, dryness, pigmentation, and more. Based on the analysis, 
                    we provide personalized Tadefi product recommendations.
                  </p>
                  <p className="text-xs text-[#2A462B]/60 mb-3">
                    For best results, take a clear, well-lit photo of your face without makeup.
                  </p>
                  <button 
                    className="text-xs text-[#3C6C3F] font-medium hover:underline"
                    onClick={() => setShowInfoTooltip(false)}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#3C6C3F]/10 mb-10">
              <div className="max-w-md mx-auto">
                <p className="text-[#2A462B]/80 mb-8">
                  Take or upload a clear photo of your face and our AI will analyze your skin condition 
                  to recommend the best Tadefi products for your unique needs.
                </p>

                {!photo && !isAnalyzing && (
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <button
                      onClick={() => setShowCamera(true)}
                      className="flex flex-col items-center justify-center p-6 bg-[#F4F7F4] rounded-xl
                        border border-[#3C6C3F]/10 hover:shadow-md transition-all duration-300 h-40
                        hover:bg-white hover:border-[#3C6C3F]/20 group"
                    >
                      <Camera className="w-10 h-10 text-[#3C6C3F] mb-3 transform group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-lg font-medium text-[#2A462B] mb-1">Take Photo</h3>
                      <p className="text-sm text-[#2A462B]/60">Use your camera</p>
                    </button>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-6 bg-[#F4F7F4] rounded-xl
                        border border-[#3C6C3F]/10 hover:shadow-md transition-all duration-300 h-40
                        hover:bg-white hover:border-[#3C6C3F]/20 group"
                    >
                      <Upload className="w-10 h-10 text-[#3C6C3F] mb-3 transform group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-lg font-medium text-[#2A462B] mb-1">Upload Photo</h3>
                      <p className="text-sm text-[#2A462B]/60">From your device</p>
                    </button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="bg-[#F4F7F4]/50 rounded-xl p-8 text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-[#3C6C3F]/10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#3C6C3F] animate-spin" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-[#2A462B] mb-2">Analyzing Your Skin</h3>
                    <p className="text-sm text-[#2A462B]/70">
                      Our AI is examining your skin characteristics to provide personalized recommendations...
                    </p>
                  </div>
                )}

                {analysisError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Analysis Failed</h3>
                    <p className="text-sm text-red-600 mb-4">{analysisError}</p>
                    <button 
                      onClick={handleNewPhoto}
                      className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {photo && analysis && !isAnalyzing && (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#F4F7F4] p-2 rounded-xl border border-[#3C6C3F]/10 mb-6 max-w-xs mx-auto">
                      <img 
                        src={photo} 
                        alt="Your skin analysis" 
                        className="w-full rounded-lg"
                      />
                    </div>
                    {analysis.confidence && (
                      <div className="text-sm text-[#2A462B]/70 mb-4">
                        Analysis Confidence: {Math.round(analysis.confidence * 100)}%
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {photo && analysis && !isAnalyzing && (
              <div className="space-y-10">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#3C6C3F]/10">
                  <h2 className="text-2xl font-semibold text-[#3C6C3F] mb-6">Your Skin Analysis</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-[#2A462B] mb-3">Skin Type</h3>
                      <div className="bg-[#F4F7F4] rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#3C6C3F]/10 rounded-full flex items-center justify-center">
                            <span className="text-[#3C6C3F] font-semibold">
                              {analysis.skinType.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[#2A462B] capitalize">{analysis.skinType}</p>
                            <p className="text-sm text-[#2A462B]/70">
                              {analysis.skinType === 'combination' ? 
                                'Oily in T-zone, normal to dry elsewhere' : 
                                analysis.skinType === 'oily' ?
                                'Produces excess sebum, prone to shine' :
                                analysis.skinType === 'dry' ?
                                'Lacks natural oils, may feel tight' :
                                'Easily irritated, requires gentle care'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-[#2A462B] mb-3">Detected Concerns</h3>
                      <div className="bg-[#F4F7F4] rounded-xl p-4">
                        <ul className="space-y-2">
                          {analysis.concerns.map((concern, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-[#3C6C3F]"></div>
                                <span className="text-[#2A462B] capitalize">{concern}</span>
                              </div>
                              {analysis.concernDetails && analysis.concernDetails[concern] && (
                                <span className="text-xs text-[#2A462B]/60">
                                  {Math.round(analysis.concernDetails[concern] * 100)}%
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-left">
                    <h3 className="text-lg font-medium text-[#2A462B] mb-3">Recommended Routine</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-[#F4F7F4] rounded-xl p-4">
                        <h4 className="font-medium text-[#3C6C3F] mb-2">Morning</h4>
                        <ul className="space-y-2 text-sm text-[#2A462B]/80">
                          {analysis.recommendations.morning.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-[#3C6C3F] font-medium flex-shrink-0 mt-0.5">
                                {index + 1}.
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-[#F4F7F4] rounded-xl p-4">
                        <h4 className="font-medium text-[#3C6C3F] mb-2">Evening</h4>
                        <ul className="space-y-2 text-sm text-[#2A462B]/80">
                          {analysis.recommendations.evening.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-[#3C6C3F] font-medium flex-shrink-0 mt-0.5">
                                {index + 1}.
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-[#F4F7F4] rounded-xl p-4">
                        <h4 className="font-medium text-[#3C6C3F] mb-2">Weekly</h4>
                        <ul className="space-y-2 text-sm text-[#2A462B]/80">
                          {analysis.recommendations.weekly.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-[#3C6C3F] font-medium flex-shrink-0 mt-0.5">
                                {index + 1}.
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {recommendedProducts.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#3C6C3F]/10">
                    <h2 className="text-2xl font-semibold text-[#3C6C3F] mb-6">Recommended Products</h2>
                    
                    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                      {recommendedProducts.map((product) => (
                        <div 
                          key={product.id}
                          className="bg-[#F4F7F4]/50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 border border-[#3C6C3F]/10"
                        >
                          <div className="bg-[#F4F7F4] aspect-square relative overflow-hidden">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="p-4">
                            <div className="mb-2">
                              <span className="text-xs text-[#3C6C3F] font-medium bg-[#3C6C3F]/10 px-2 py-1 rounded-full">
                                {product.category}
                              </span>
                            </div>
                            <h3 className="font-medium text-[#2A462B] mb-1">{product.name}</h3>
                            <p className="text-sm text-[#2A462B]/70 line-clamp-2 mb-3 h-10">
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-[#2A462B]">${product.price.toFixed(2)}</span>
                              <button
                                onClick={() => addToCart(product)}
                                className="bg-[#3C6C3F] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#2A462B] transition-colors"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Link 
                        to="/products"
                        className="inline-flex items-center text-[#3C6C3F] font-medium hover:text-[#2A462B] transition-colors"
                      >
                        View all products
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleNewPhoto}
                    className="bg-[#3C6C3F] text-white px-6 py-3 rounded-full
                      hover:bg-[#2A462B] transition-all duration-300 shadow-md 
                      hover:shadow-lg font-medium"
                  >
                    Take New Photo
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#F4F7F4] text-[#2A462B] px-6 py-3 rounded-full hover:bg-[#E8EEE8] 
                      transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                  >
                    Upload Different Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCamera && (
        <CameraModal 
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </Layout>
  );
};

export default SkinScan;