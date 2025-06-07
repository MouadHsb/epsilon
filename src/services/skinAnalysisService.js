// src/services/skinAnalysisService.js
import products from '../../api/data/product.js';

// Add this import to the top of your SkinScan.jsx file:
// import { analyzeSkinPhoto } from '../services/skinAnalysisService.js';

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
 */
/**
 * Get recommended products based on analysis
 */
const getRecommendedProducts = (analysis) => {
  const { concerns, skinType } = analysis;
  
  // Enhanced scoring system for product recommendations
  const productScores = new Map();

  // Define concern-to-product mapping with specific product benefits
  const concernProductMap = {
    'acne breakouts': {
      keywords: ['tea tree', 'salicylic', 'charcoal', 'clay', 'purifying'],
      categories: ['Cleansers', 'Masks', 'Serums'],
      priority: 3
    },
    'dehydration': {
      keywords: ['hydrating', 'hyaluronic', 'moisture', 'water', 'hemp'],
      categories: ['Moisturizers', 'Serums', 'Face Oils'],
      priority: 3
    },
    'hyperpigmentation': {
      keywords: ['brightening', 'vitamin c', 'dark spots', 'even tone'],
      categories: ['Serums', 'Masks'],
      priority: 2
    },
    'fine lines and wrinkles': {
      keywords: ['anti-aging', 'peptide', 'retinol', 'repair', 'wrinkle'],
      categories: ['Serums', 'Moisturizers', 'Eye Care', 'Face Oils'],
      priority: 3
    },
    'excess oil production': {
      keywords: ['oil-control', 'mattifying', 'balancing', 'lotus'],
      categories: ['Cleansers', 'Toners', 'Serums'],
      priority: 2
    },
    'skin irritation': {
      keywords: ['soothing', 'calming', 'gentle', 'sensitive', 'chamomile'],
      categories: ['Moisturizers', 'Toners'],
      priority: 3
    },
    'visible pores': {
      keywords: ['pore', 'refining', 'minimizing', 'tightening'],
      categories: ['Toners', 'Serums', 'Masks'],
      priority: 2
    },
    'under-eye concerns': {
      keywords: ['eye', 'dark circles', 'puffiness', 'bags'],
      categories: ['Eye Care'],
      priority: 3
    },
    'clogged pores': {
      keywords: ['unclogging', 'exfoliating', 'clay', 'charcoal'],
      categories: ['Cleansers', 'Masks'],
      priority: 2
    },
    'general maintenance': {
      keywords: ['daily', 'essential', 'basic', 'routine'],
      categories: ['Cleansers', 'Moisturizers', 'Serums'],
      priority: 1
    }
  };

  // Skin type preferences
  const skinTypePreferences = {
    'oily': {
      preferred: ['gel', 'lightweight', 'oil-free', 'mattifying'],
      avoid: ['heavy', 'rich', 'cream'],
      categories: ['Cleansers', 'Toners', 'Serums']
    },
    'dry': {
      preferred: ['rich', 'nourishing', 'hydrating', 'cream', 'oil'],
      avoid: ['mattifying', 'oil-control'],
      categories: ['Moisturizers', 'Face Oils', 'Serums']
    },
    'combination': {
      preferred: ['balancing', 'lightweight', 'gel-cream'],
      avoid: ['heavy', 'extreme'],
      categories: ['Cleansers', 'Moisturizers', 'Serums']
    },
    'sensitive': {
      preferred: ['gentle', 'soothing', 'fragrance-free', 'calming'],
      avoid: ['acid', 'strong', 'potent'],
      categories: ['Moisturizers', 'Cleansers']
    },
    'normal': {
      preferred: ['maintaining', 'preventive', 'daily'],
      avoid: [],
      categories: ['Cleansers', 'Moisturizers', 'Serums']
    }
  };

  // Score each product based on how well it matches concerns and skin type
  products.forEach(product => {
    let score = 0;
    const productText = `${product.name} ${product.description} ${product.longDescription}`.toLowerCase();
    
    // Score based on concern matching
    concerns.forEach(concern => {
      const concernInfo = concernProductMap[concern];
      if (concernInfo) {
        // Category match
        if (concernInfo.categories.includes(product.category)) {
          score += concernInfo.priority * 2;
        }
        
        // Keyword match
        concernInfo.keywords.forEach(keyword => {
          if (productText.includes(keyword)) {
            score += concernInfo.priority;
          }
        });
      }
    });
    
    // Score based on skin type
    const skinPrefs = skinTypePreferences[skinType];
    if (skinPrefs) {
      // Category preference
      if (skinPrefs.categories.includes(product.category)) {
        score += 2;
      }
      
      // Keyword preferences
      skinPrefs.preferred.forEach(keyword => {
        if (productText.includes(keyword)) {
          score += 1;
        }
      });
      
      // Avoid certain keywords
      skinPrefs.avoid.forEach(keyword => {
        if (productText.includes(keyword)) {
          score -= 2;
        }
      });
    }
    
    // Bonus for featured products
    if (product.featured) {
      score += 1;
    }
    
    // Store score
    if (score > 0) {
      productScores.set(product.id, { product, score });
    }
  });

  // Sort products by score and get top recommendations
  const sortedProducts = Array.from(productScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // Get top 6 for better selection

  // Ensure variety in categories (max 2 per category for top 3)
  const categoryCount = new Map();
  const finalRecommendations = [];
  
  for (const { product } of sortedProducts) {
    const count = categoryCount.get(product.category) || 0;
    if (count < 2) {
      categoryCount.set(product.category, count + 1);
      finalRecommendations.push(product);
      if (finalRecommendations.length === 3) break; // Only need top 3
    }
  }
  
  // If we don't have 3 products yet, add more
  if (finalRecommendations.length < 3) {
    for (const { product } of sortedProducts) {
      if (!finalRecommendations.find(p => p.id === product.id)) {
        finalRecommendations.push(product);
        if (finalRecommendations.length === 3) break;
      }
    }
  }

  // If still not enough, add featured products
  if (finalRecommendations.length < 3) {
    const featured = products
      .filter(p => p.featured && !finalRecommendations.find(r => r.id === p.id))
      .slice(0, 3 - finalRecommendations.length);
    finalRecommendations.push(...featured);
  }

  // Format products for frontend
  return finalRecommendations.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.images[0],
    category: product.category
  }));
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