// src/services/skinAnalysisService.js
import products from '../../api/data/product.js';

// Simple environment detection - only check if we're in development mode
const isDev = import.meta.env.DEV;

/**
 * Generate fallback skin analysis for development/testing
 */
const generateFallbackAnalysis = () => {
  // Simulate different skin types and concerns for testing
  const skinTypes = ['oily', 'dry', 'combination', 'sensitive', 'normal'];
  const possibleConcerns = [
    'acne breakouts',
    'dehydration', 
    'hyperpigmentation',
    'fine lines and wrinkles',
    'excess oil production',
    'skin irritation',
    'visible pores',
    'under-eye concerns',
    'general maintenance'
  ];

  // Randomly select skin type and concerns for variety in testing
  const skinType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
  const numConcerns = Math.floor(Math.random() * 3) + 1; // 1-3 concerns
  const concerns = [];
  
  for (let i = 0; i < numConcerns; i++) {
    const concern = possibleConcerns[Math.floor(Math.random() * possibleConcerns.length)];
    if (!concerns.includes(concern)) {
      concerns.push(concern);
    }
  }

  // Generate recommendations based on skin type and concerns
  const recommendations = generateRecommendations(concerns, skinType);

  return {
    skinType,
    concerns: concerns.length > 0 ? concerns : ['general maintenance'],
    concernDetails: concerns.reduce((acc, concern) => {
      acc[concern] = Math.random() * 0.5 + 0.5; // Random confidence 0.5-1.0
      return acc;
    }, {}),
    recommendations,
    confidence: Math.random() * 0.3 + 0.7, // Random confidence 0.7-1.0
    fallback: true
  };
};

/**
 * Generate recommendations based on concerns and skin type
 */
const generateRecommendations = (concerns, skinType) => {
  const baseRecommendations = {
    morning: [
      "Gentle cleanser suitable for your skin type",
      "Hydrating toner or essence",
      "Lightweight moisturizer with SPF protection"
    ],
    evening: [
      "Double cleansing routine",
      "Treatment serum based on your concerns",
      "Nourishing night moisturizer"
    ],
    weekly: [
      "Gentle exfoliation 1-2 times per week",
      "Weekly treatment mask"
    ]
  };

  // Customize based on detected concerns
  if (concerns.includes('acne breakouts')) {
    baseRecommendations.morning[1] = "Salicylic acid toner";
    baseRecommendations.evening[1] = "Tea tree or salicylic acid treatment serum";
    baseRecommendations.weekly.push("Clay mask for deep pore cleansing");
  }

  if (concerns.includes('dehydration')) {
    baseRecommendations.morning[1] = "Hydrating essence or toner";
    baseRecommendations.evening[1] = "Hyaluronic acid hydrating serum";
    baseRecommendations.weekly[1] = "Intensive hydrating mask";
  }

  if (concerns.includes('hyperpigmentation')) {
    baseRecommendations.morning[1] = "Vitamin C brightening serum";
    baseRecommendations.evening[1] = "Niacinamide or gentle retinol treatment";
  }

  if (concerns.includes('fine lines and wrinkles')) {
    baseRecommendations.evening[1] = "Anti-aging serum with peptides or retinol";
    baseRecommendations.evening[2] = "Rich anti-aging night cream";
  }

  if (concerns.includes('excess oil production')) {
    baseRecommendations.morning[1] = "Oil-balancing toner with niacinamide";
    baseRecommendations.evening[1] = "Pore-refining serum";
  }

  return baseRecommendations;
};

/**
 * Get recommended products based on analysis
 * MODIFIED: Always return the two specific products requested
 */
const getRecommendedProducts = (analysis) => {
  // FIXED: Always recommend these two specific products by ID
  const FIXED_PRODUCT_IDS = [3, 5]; // Product IDs for the two products requested
  
  // Get the fixed products from your products array
  const fixedRecommendations = FIXED_PRODUCT_IDS.map(productId => {
    const product = products.find(p => p.id === productId);
    if (product) {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.images[0],
        category: product.category
      };
    }
    return null;
  }).filter(Boolean); // Remove any null entries if product not found

  console.log(`✅ Returning ${fixedRecommendations.length} fixed product recommendations`);
  
  return fixedRecommendations;
};

/**
 * Analyze skin photo - works in both development and production
 */
export const analyzeSkinPhoto = async (photoData) => {
  try {
    if (isDev) {
      // Local development - use fallback analysis
      console.log('🔧 SkinScan: Using fallback analysis for development');
      
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = generateFallbackAnalysis();
      const recommendedProducts = getRecommendedProducts(analysis);
      
      console.log('✅ Generated fallback analysis:', analysis);
      console.log(`✅ Recommended ${recommendedProducts.length} products`);
      
      return {
        success: true,
        analysis,
        recommendedProducts,
        fallback: true
      };
    } else {
      // Production - use real API
      console.log('🌐 SkinScan: Using production API');
      
      const response = await fetch('/api/skin-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: photoData })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Production analysis completed');
        return data;
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    }
  } catch (error) {
    console.error('SkinScan analysis error:', error);
    
    // Always provide fallback analysis if production API fails
    console.log('🔄 Falling back to local analysis due to error');
    
    const fallbackAnalysis = generateFallbackAnalysis();
    const fallbackProducts = getRecommendedProducts(fallbackAnalysis);
    
    return {
      success: true,
      analysis: fallbackAnalysis,
      recommendedProducts: fallbackProducts,
      error: error.message,
      fallback: true
    };
  }
};

// Development info
if (isDev) {
  console.log('🔧 SkinScan Service: Using local fallback analysis for development');
}