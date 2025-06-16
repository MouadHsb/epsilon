// api/data/product.js
const products = [
  {
    id: 1,
    name: "Liquid Hand Soap with Argan Cake",
    description: "Nourishing liquid hand soap enriched with argan cake, specially formulated to gently cleanse while preserving the skin's natural hydration.",
    price: 35.00,
    category: "Cleansers",
    size: "150 ML",
    featured: true,
    images: [
      "/Tadefi.png",
      "/Tadefi.png"
    ],
    ingredients: "All natural ingredients",
    usage: "Apply a small amount to wet hands. Lather gently then rinse thoroughly with clean water. Use as often as needed.",
    benefits: [
      "Gentle cleansing",
      "Nourishes and hydrates",
      "Rich in argan cake",
      "Pleasant texture"
    ],
    skinType: ["normal", "dry", "sensitive"],
    concerns: ["dryness", "daily cleansing"],
    keyIngredients: ["Argan cake", "Natural moisturizers"]
  },
  {
    id: 2,
    name: "Hydrating Shower Gel with Sweet Almond Oil or Beeswax",
    description: "Gentle and hydrating shower gel enriched with sweet almond oil or beeswax for soft and nourished skin after every shower.",
    price: 37.00,
    category: "Cleansers",
    size: "150 ML",
    featured: false,
    images: [
      "/Tadefi.png",
      "/Tadefi.png"
    ],
    ingredients: "All natural ingredients",
    usage: "Apply to wet skin, lather gently all over the body, then rinse thoroughly. Avoid the eye area.",
    benefits: [
      "Intense hydration",
      "Softens skin",
      "Delicate fragrance",
      "Natural formula"
    ],
    skinType: ["dry", "sensitive", "normal"],
    concerns: ["dryness", "daily cleansing", "sensitivity"],
    keyIngredients: ["Sweet almond oil", "Beeswax"]
  },
  {
    id: 3,
    name: "Face and Body Moisturizing Cream with Argan Cake",
    description: "Multi-purpose cream enriched with argan cake to intensely hydrate and nourish face and body skin. Rich and creamy texture.",
    price: 45.00,
    category: "Moisturizers",
    size: "150 ML",
    featured: true,
    images: [
      "/Tadefi.png",
      "/Tadefi.png"
    ],
    ingredients: "All natural ingredients",
    usage: "Apply morning and/or evening to clean, dry skin. Massage gently until completely absorbed. Suitable for face and body.",
    benefits: [
      "Long-lasting hydration",
      "Deep nourishment",
      "Natural anti-aging",
      "Multi-use face and body"
    ],
    skinType: ["dry", "mature", "normal"],
    concerns: ["dryness", "aging", "daily moisturizing"],
    keyIngredients: ["Argan cake", "Natural moisturizers"]
  },
  {
    id: 4,
    name: "Olive Pomace Shampoo",
    description: "Natural shampoo with olive pomace to gently cleanse hair while providing shine and vitality. Scalp-friendly formula.",
    price: 49.00,
    category: "Hair Care",
    size: "150 ML",
    featured: false,
    images: [
      "/Tadefi.png",
      "/Tadefi.png"
    ],
    ingredients: "All natural ingredients",
    usage: "Apply to wet hair, gently massage the scalp to lather, then rinse thoroughly. Repeat if necessary.",
    benefits: [
      "Gentle cleansing",
      "Adds shine",
      "Strengthens hair",
      "Respects the scalp"
    ],
    skinType: ["all"],
    concerns: ["hair care", "daily cleansing"],
    keyIngredients: ["Olive pomace", "Natural extracts"]
  },
  {
    id: 5,
    name: "Face Cleansing Gel with Rose Water and Argan Cake",
    description: "Delicate facial cleansing gel combining the soothing properties of rose water and the nourishing benefits of argan cake.",
    price: 40.00,
    category: "Cleansers",
    size: "150 ML",
    featured: true,
    images: [
      "/Tadefi.png",
      "/Tadefi.png"
    ],
    ingredients: "All natural ingredients",
    usage: "Apply morning and evening to damp face, massage gently avoiding the eye area, then rinse thoroughly with lukewarm water.",
    benefits: [
      "Cleanses without drying",
      "Soothes and refreshes",
      "Suitable for sensitive skin",
      "Delicate rose fragrance"
    ],
    skinType: ["sensitive", "normal", "combination"],
    concerns: ["daily cleansing", "sensitivity", "hydration"],
    keyIngredients: ["Rose water", "Argan cake"]
  }
];

export default products;