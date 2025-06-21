// api/skin-analysis.js
import products from './data/product.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Debug GET endpoint
  if (req.method === 'GET') {
    const apiKey = process.env.ROBOFLOW_API_KEY;
    
    return res.status(200).json({
      debug: true,
      apiKeyConfigured: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'Not configured',
      endpoint: 'https://serverless.roboflow.com/skin-problem-multilabel/1',
      timestamp: new Date().toISOString(),
      message: 'Debug info for skin analysis API'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Get API key from environment
    const apiKey = process.env.ROBOFLOW_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Roboflow API key not configured' });
    }

    // Convert data URL to base64
    let base64Image;
    if (imageData.startsWith('data:')) {
      base64Image = imageData.split(',')[1];
    } else {
      base64Image = imageData;
    }

    // Validate base64 format
    if (!base64Image || base64Image.length < 100) {
      throw new Error('Invalid image data - image too small or malformed');
    }

    console.log('Image data length:', base64Image.length);
    console.log('Image data prefix:', base64Image.substring(0, 50) + '...');

    // Call Roboflow API
    console.log('Calling Roboflow API...');
    
    const roboflowResponse = await fetch(
      `https://serverless.roboflow.com/skin-problem-multilabel/1?api_key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: base64Image
      }
    );

    console.log('Roboflow response status:', roboflowResponse.status);

    if (!roboflowResponse.ok) {
      const errorText = await roboflowResponse.text();
      console.error('Roboflow API error response:', errorText);
      throw new Error(`Roboflow API error: ${roboflowResponse.status} ${roboflowResponse.statusText} - ${errorText}`);
    }

    // Get response as text first to debug
    const responseText = await roboflowResponse.text();
    console.log('Roboflow raw response:', responseText);

    // Try to parse JSON
    let roboflowResult;
    try {
      roboflowResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Roboflow response as JSON:', parseError);
      console.error('Response text was:', responseText);
      throw new Error(`Invalid JSON response from Roboflow API: ${parseError.message}`);
    }
    
    // Process the analysis results
    console.log('Processing Roboflow result:', roboflowResult);
    const analysis = interpretResults(roboflowResult);
    
    // Get recommended products based on analysis (with fixed products)
    const recommendedProducts = getRecommendedProducts(analysis);

    console.log('Analysis complete:', analysis);
    console.log('Recommended products count:', recommendedProducts.length);

    return res.status(200).json({
      success: true,
      analysis,
      recommendedProducts
    });

  } catch (error) {
    console.error('Skin analysis error:', error);
    
    // Provide fallback analysis
    const fallbackAnalysis = {
      skinType: "combination",
      concerns: ["general maintenance"],
      concernDetails: {},
      recommendations: {
        morning: [
          "Gentle cleanser suitable for your skin type",
          "Hydrating toner or essence", 
          "Lightweight moisturizer with SPF protection"
        ],
        evening: [
          "Double cleansing routine",
          "Nourishing treatment serum",
          "Night moisturizer for repair"
        ],
        weekly: [
          "Gentle exfoliation 1-2 times per week",
          "Weekly hydrating or purifying mask"
        ]
      },
      confidence: 0.5,
      fallback: true
    };
    
    const fallbackProducts = getRecommendedProducts(fallbackAnalysis);

    return res.status(200).json({
      success: true,
      analysis: fallbackAnalysis,
      recommendedProducts: fallbackProducts,
      error: error.message,
      fallback: true
    });
  }
}

function interpretResults(roboflowResult) {
  const predictions = roboflowResult.predictions || {};
  
  // Extract concerns from predictions
  const detectedConcerns = [];
  const concernDetails = {};
  
  // Process each prediction
  Object.entries(predictions).forEach(([concern, data]) => {
    const confidence = data.confidence || 0;
    
    if (confidence > 0.3) { // Confidence threshold
      const mappedConcern = mapRoboflowToConcern(concern);
      if (mappedConcern) {
        detectedConcerns.push(mappedConcern);
        concernDetails[mappedConcern] = confidence;
      }
    }
  });

  // Determine skin type based on detected concerns
  const skinType = determineSkinType(detectedConcerns);
  
  // Generate recommendations
  const recommendations = generateRecommendations(detectedConcerns, skinType);

  return {
    skinType,
    concerns: detectedConcerns.length > 0 ? detectedConcerns : ['general maintenance'],
    concernDetails,
    recommendations,
    confidence: calculateOverallConfidence(predictions)
  };
}

function mapRoboflowToConcern(roboflowLabel) {
  const mapping = {
    'acne': 'acne breakouts',
    'blackheads': 'clogged pores',
    'whiteheads': 'clogged pores',
    'dark_spots': 'hyperpigmentation',
    'wrinkles': 'fine lines and wrinkles',
    'dryness': 'dehydration',
    'oiliness': 'excess oil production',
    'redness': 'skin irritation',
    'pores': 'visible pores',
    'dark_circles': 'under-eye concerns'
  };
  
  return mapping[roboflowLabel] || null;
}

function determineSkinType(concerns) {
  if (concerns.includes('excess oil production') && concerns.includes('acne breakouts')) {
    return 'oily';
  } else if (concerns.includes('dehydration') && concerns.includes('skin irritation')) {
    return 'dry';
  } else if (concerns.includes('skin irritation')) {
    return 'sensitive';
  } else if (concerns.includes('excess oil production') || concerns.includes('dehydration')) {
    return 'combination';
  } else {
    return 'normal';
  }
}

function generateRecommendations(concerns, skinType) {
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
}

function calculateOverallConfidence(predictions) {
  const confidences = Object.values(predictions).map(p => p.confidence || 0);
  if (confidences.length === 0) return 0;
  
  return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
}

// MODIFIED: Product recommendation function with FIXED products
function getRecommendedProducts(analysis) {
  // FIXED: Always recommend these two specific products by ID
  const FIXED_PRODUCT_IDS = [3, 5]; // IDs for "Face and Body Moisturizing Cream" and "Face Cleansing Gel with Rose Water and Argan Cake"
  
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
}