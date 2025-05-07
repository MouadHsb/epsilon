// src/models/product.js
const products = [
    // CLEANSERS
    {
      id: 1,
      name: "Charcoal Face Cleanser",
      description: "Zero-waste facial cleanser with activated charcoal and tea tree oil. Deeply cleanses while maintaining skin's natural balance.",
      longDescription: "Our Charcoal Face Cleanser combines the powerful detoxifying properties of activated charcoal with the clarifying benefits of tea tree oil. This zero-waste formula effectively draws out impurities, excess oil, and environmental pollutants while respecting your skin's natural moisture barrier. Perfect for those seeking a deep cleanse without the dryness typically associated with charcoal products.",
      price: 14.99,
      category: "Cleansers",
      ingredients: "Organic Coconut Oil, Activated Bamboo Charcoal, Tea Tree Essential Oil, Shea Butter",
      size: "100g",
      usage: "Apply a small amount to damp skin and massage in circular motions. Rinse thoroughly with warm water. Use morning and evening for best results.",
      benefits: [
        "Draws out impurities and toxins",
        "Balances oily skin without over-drying",
        "Reduces appearance of pores",
        "Promotes clearer complexion"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: true
    },
    {
      id: 2,
      name: "Alpine Milk Cleanser",
      description: "Gentle cleansing milk with organic alpine herbs. Removes makeup while nourishing skin.",
      longDescription: "Our Alpine Milk Cleanser is a gentle yet effective formula that melts away makeup and impurities while infusing skin with nourishment. Enriched with a proprietary blend of organic alpine herbs harvested from pristine mountain regions, this cleanser maintains your skin's natural pH while providing essential vitamins and minerals. The creamy milk texture transforms your daily cleansing routine into a luxurious ritual.",
      price: 32.99,
      category: "Cleansers",
      ingredients: "Organic Milk Proteins, Alpine Herb Complex, Almond Oil, Chamomile Extract",
      size: "200ml",
      usage: "Apply to dry skin with fingertips, massaging gently to dissolve makeup and impurities. Remove with a warm, damp cloth or rinse thoroughly with water.",
      benefits: [
        "Dissolves makeup and impurities without stripping skin",
        "Maintains skin's natural moisture barrier",
        "Soothes and calms sensitive skin",
        "Prepares skin for better absorption of subsequent products"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
    {
      id: 3,
      name: "Rose Gel Cleanser",
      description: "Gentle gel cleanser with pink clay and rose water. Perfect for sensitive skin.",
      longDescription: "Our Rose Gel Cleanser combines the gentle purifying properties of pink clay with the soothing benefits of rose water. This lightweight gel formula transforms into a silky lather that cleanses without disrupting your skin's natural balance. Formulated specifically for sensitive and reactive skin types, it removes daily impurities while calming redness and irritation. The subtle rose fragrance provides an aromatherapeutic experience that transforms your cleansing routine into a moment of self-care.",
      price: 28.99,
      category: "Cleansers",
      ingredients: "Rose Water, Pink Clay, Glycerin, Aloe Vera",
      size: "150ml",
      usage: "Apply a small amount to damp skin and massage in gentle circular motions. Rinse thoroughly with lukewarm water. Use morning and evening.",
      benefits: [
        "Calms and soothes sensitive skin",
        "Reduces redness and irritation",
        "Cleanses without disrupting skin barrier",
        "Provides aromatherapeutic benefits"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: true
    },
  
    // MOISTURIZERS
    {
      id: 4,
      name: "Hemp Face Cream",
      description: "Rich yet lightweight moisturizer packed with omega fatty acids from organic hemp seed oil. Ideal for sensitive skin.",
      longDescription: "Our Hemp Face Cream harnesses the power of organic hemp seed oil, renowned for its perfect balance of omega-3 and omega-6 fatty acids that mirror your skin's natural lipid structure. This rich yet surprisingly lightweight formula absorbs quickly to provide deep hydration without heaviness or greasiness. The unique composition helps strengthen your skin's moisture barrier while calming inflammation and balancing oil production, making it perfect for sensitive and reactive skin types.",
      price: 45.99,
      category: "Moisturizers",
      ingredients: "Hemp Seed Oil, Aloe Vera Juice, Jojoba Oil, Vegetable Glycerin",
      size: "50ml",
      usage: "After cleansing, apply a small amount to face and neck using upward motions. May be used morning and night.",
      benefits: [
        "Deeply hydrates without heaviness",
        "Strengthens skin barrier function",
        "Balances oil production",
        "Calms inflammation and irritation"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: true
    },
    {
      id: 5,
      name: "Night Repair Cream",
      description: "Rich night moisturizer with moringa oil and blue tansy. Repairs and regenerates while you sleep.",
      longDescription: "Our Night Repair Cream works in harmony with your skin's natural nighttime regeneration process to deliver transformative results by morning. The luxurious formula features moringa oil, rich in cytokinins that promote cell renewal, and blue tansy oil, renowned for its powerful anti-inflammatory properties. This intensive treatment addresses multiple signs of aging and environmental damage while you sleep, allowing you to wake up to visibly rejuvenated, more resilient skin.",
      price: 49.99,
      category: "Moisturizers",
      ingredients: "Moringa Oil, Blue Tansy Oil, Shea Butter, Vitamin E",
      size: "50ml",
      usage: "Apply to clean face and neck in the evening. Allow to absorb before resting on your pillow. For enhanced results, perform a gentle facial massage during application.",
      benefits: [
        "Accelerates overnight cell renewal",
        "Reduces fine lines and signs of aging",
        "Deeply nourishes and repairs damaged skin",
        "Enhances overall skin resilience"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: true
    },
  
    // SERUMS
    {
      id: 6,
      name: "Marine Peptide Serum",
      description: "Marine-based serum with peptides and organic seaweed extract for enhanced collagen production and skin firmness.",
      longDescription: "Our Marine Peptide Serum combines the regenerative power of ocean-derived ingredients with advanced peptide technology to visibly improve skin firmness and elasticity. The unique formula features a proprietary complex of marine peptides that stimulate collagen synthesis at the cellular level, while organic seaweed extract provides a wealth of minerals and amino acids essential for skin repair. This concentrated treatment addresses multiple signs of aging while supporting your skin's natural renewal processes.",
      price: 55.99,
      category: "Serums",
      ingredients: "Marine Peptides, Organic Seaweed Extract, Hyaluronic Acid, Green Tea Extract",
      size: "30ml",
      usage: "Apply 2-3 drops to cleansed skin morning and evening before moisturizer. Gently press into skin rather than rubbing for optimal absorption.",
      benefits: [
        "Stimulates collagen production",
        "Improves skin firmness and elasticity",
        "Reduces appearance of fine lines",
        "Enhances skin's natural repair processes"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
    {
      id: 7,
      name: "Lotus Balance Serum",
      description: "Balancing serum with blue lotus extract and niacinamide. Regulates oil production and minimizes pores.",
      longDescription: "Our Lotus Balance Serum is specifically formulated to restore harmony to combination and oily skin types. The star ingredient, blue lotus extract, has been revered in traditional medicine for centuries for its balancing and purifying properties. Combined with niacinamide (Vitamin B3), this lightweight serum effectively regulates sebum production, minimizes the appearance of pores, and evens skin tone without causing dryness or irritation. The water-light texture absorbs instantly, leaving skin with a natural matte finish.",
      price: 52.99,
      category: "Serums",
      ingredients: "Blue Lotus Extract, Niacinamide, Zinc PCA, Hyaluronic Acid",
      size: "30ml",
      usage: "Apply 3-4 drops to cleansed skin morning and evening before moisturizer. Can be used alone in hot, humid conditions for very oily skin types.",
      benefits: [
        "Regulates excess oil production",
        "Minimizes appearance of enlarged pores",
        "Balances and clarifies complexion",
        "Provides lightweight hydration"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
  
    // LIP CARE
    {
      id: 8,
      name: "Nordic Lip Mask",
      description: "Overnight lip treatment with Nordic berries and shea butter. Deeply nourishes and repairs dry lips.",
      longDescription: "Our Nordic Lip Mask is an intensive overnight treatment that transforms chronically dry, chapped lips while you sleep. The formula harnesses the power of Nordic berries—lingonberry, cloudberry, and sea buckthorn—renowned for their exceptional content of antioxidants, vitamins, and omega fatty acids. Combined with ultra-nourishing shea butter, this treatment creates an occlusive barrier that locks in moisture and active ingredients, allowing you to wake up to remarkably softer, smoother, and healthier lips.",
      price: 19.99,
      category: "Lip Care",
      ingredients: "Nordic Berry Complex, Shea Butter, Vitamin E, Beeswax",
      size: "15ml",
      usage: "Apply a generous layer to clean lips before bedtime. May also be used as an intensive treatment during the day when lips need extra care.",
      benefits: [
        "Intensely repairs and rejuvenates dry, damaged lips",
        "Creates protective barrier against environmental stressors",
        "Restores natural softness and smoothness",
        "Helps prevent future chapping and cracking"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
    {
      id: 9,
      name: "Rose Lip Balm",
      description: "Nourishing lip balm with organic honey and rose oil. Keeps lips soft and protected.",
      longDescription: "Our Rose Lip Balm combines the natural humectant properties of organic honey with the nourishing and protective benefits of rose essential oil. This daily care essential provides immediate comfort to dry lips while establishing a protective barrier against environmental aggressors. The subtle rose fragrance provides a sensory pleasure with each application, transforming lip care into a moment of small luxury. The convenient size makes it perfect for on-the-go hydration and protection.",
      price: 12.99,
      category: "Lip Care",
      ingredients: "Organic Honey, Rose Essential Oil, Coconut Oil, Beeswax",
      size: "10ml",
      usage: "Apply as needed throughout the day. For best results, apply to slightly damp lips after drinking water to lock in moisture.",
      benefits: [
        "Provides immediate comfort to dry, chapped lips",
        "Creates lasting hydration and protection",
        "Offers subtle aromatic pleasure with each application",
        "Prevents moisture loss in challenging environments"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: true
    },
  
    // MASKS
    {
      id: 10,
      name: "Berry Enzyme Mask",
      description: "Exfoliating mask with organic honey and berry enzymes. Reveals brighter, smoother skin naturally.",
      longDescription: "Our Berry Enzyme Mask offers gentle yet effective exfoliation through the power of fruit enzymes derived from strawberries, blueberries, and raspberries. These natural AHAs dissolve dead skin cells without abrasion, while organic raw honey provides antibacterial and humectant properties to purify and hydrate simultaneously. The result is instantly brighter, smoother skin with minimized pores and enhanced radiance. Unlike harsh physical or chemical exfoliants, this mask revitalizes your complexion without irritation or sensitivity.",
      price: 34.99,
      category: "Masks",
      ingredients: "Raw Honey, Mixed Berry Enzymes, Kaolin Clay, Vitamin C",
      size: "50ml",
      usage: "Apply a thin layer to clean skin, avoiding eye area. Leave on for 10-15 minutes until slightly tacky but not completely dry. Rinse thoroughly with warm water. Use 1-2 times weekly.",
      benefits: [
        "Gently dissolves dead skin cells without irritation",
        "Reveals brighter, more radiant complexion",
        "Minimizes appearance of pores",
        "Provides hydration while purifying"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
    {
      id: 11,
      name: "Green Tea Clay Mask",
      description: "Antioxidant-rich mask with organic matcha and white clay. Detoxifies and brightens skin.",
      longDescription: "Our Green Tea Clay Mask combines the powerful antioxidant benefits of organic matcha green tea with the gentle drawing properties of white kaolin clay. This purifying treatment removes impurities while delivering catechins and polyphenols that neutralize free radicals and calm inflammation. The addition of spirulina provides additional vitamins, minerals, and chlorophyll for enhanced detoxification and brightening effects. This mask is ideal for environmentally stressed skin or those exposed to high levels of pollution.",
      price: 36.99,
      category: "Masks",
      ingredients: "Organic Matcha Green Tea, White Clay, Spirulina, Vitamin E",
      size: "50ml",
      usage: "Apply an even layer to clean, slightly damp skin. Leave on for 10-15 minutes before it fully dries. Rinse with warm water. Use weekly for maintenance or twice weekly for more intensive care.",
      benefits: [
        "Draws out impurities and environmental toxins",
        "Protects against oxidative damage",
        "Reduces inflammation and redness",
        "Brightens dull, tired complexion"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
  
    // TONERS
    {
      id: 12,
      name: "Chamomile Toner",
      description: "Alcohol-free toner with organic chamomile and calendula. Soothes and balances sensitive skin.",
      longDescription: "Our Chamomile Toner is specially formulated for sensitive and reactive skin types. This alcohol-free formulation combines the powerful soothing properties of organic chamomile and calendula extracts to calm irritation and reduce redness. Unlike conventional toners that strip the skin, our formula gently rebalances the skin's pH after cleansing while providing a first layer of hydration. The soothing botanical blend helps strengthen the skin barrier and prepare your complexion for optimal absorption of subsequent treatments.",
      price: 28.99,
      category: "Toners",
      ingredients: "Organic Chamomile Water, Calendula Extract, Rose Water, Witch Hazel",
      size: "120ml",
      usage: "After cleansing, apply to a cotton pad and gently sweep across face and neck, or pour a small amount into palms and press directly into skin. Follow with serum and moisturizer.",
      benefits: [
        "Calms irritation and reduces redness",
        "Rebalances skin's pH after cleansing",
        "Provides first layer of hydration",
        "Prepares skin for better product absorption"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
    {
      id: 13,
      name: "Marine Mist Toner",
      description: "Refreshing facial mist with marine minerals and organic algae. Perfect for midday hydration boost.",
      longDescription: "Our Marine Mist Toner harnesses the revitalizing power of the ocean in a refreshing facial spray. Formulated with a proprietary blend of marine minerals and organic algae extract, this multifunctional mist delivers essential trace elements that energize skin cells and enhance hydration levels. The ultra-fine spray provides an immediate sense of freshness and comfort, making it perfect for midday revitalization or as a hydrating boost before applying serums and moisturizers. The convenient format makes it ideal for on-the-go skincare.",
      price: 27.99,
      category: "Toners",
      ingredients: "Marine Minerals, Organic Algae Extract, Rose Water, Glycerin",
      size: "100ml",
      usage: "Hold bottle 8-10 inches from face and spray evenly, avoiding the eye area. Can be used after cleansing, before applying serums, or throughout the day as needed for hydration and refreshment.",
      benefits: [
        "Provides instant hydration and refreshment",
        "Delivers essential minerals and trace elements",
        "Sets makeup and prevents dryness",
        "Enhances effectiveness of subsequent skincare products"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: true
    },
  
    // EYE CARE
    {
      id: 14,
      name: "Mushroom Eye Cream",
      description: "Brightening eye cream with reishi mushroom extract and caffeine. Reduces dark circles and puffiness.",
      longDescription: "Our Mushroom Eye Cream targets multiple eye area concerns with a powerful blend of adaptogenic reishi mushroom extract and energizing caffeine. This lightweight yet potent formula works to brighten dark circles, reduce puffiness, and smooth fine lines around the delicate eye area. The reishi mushroom, known as the 'mushroom of immortality' in traditional medicine, is rich in triterpenes and beta-glucans that strengthen skin and improve circulation, while caffeine provides immediate tightening and de-puffing effects.",
      price: 42.99,
      category: "Eye Care",
      ingredients: "Reishi Mushroom Extract, Caffeine, Vitamin K, Organic Argan Oil",
      size: "15ml",
      usage: "Using your ring finger, gently pat a small amount around the orbital bone morning and evening. For enhanced de-puffing benefits, store in the refrigerator.",
      benefits: [
        "Reduces appearance of dark circles and discoloration",
        "Minimizes puffiness and fluid retention",
        "Smooths fine lines and crow's feet",
        "Strengthens delicate skin around the eyes"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
    {
      id: 15,
      name: "Green Tea Eye Gel",
      description: "Lightweight gel with green tea and cucumber. Refreshes and depuffs tired eyes.",
      longDescription: "Our Green Tea Eye Gel provides instant relief for tired, puffy eyes with its cooling, lightweight formula. The powerful combination of green tea extract and cucumber delivers potent antioxidants while calming inflammation and reducing water retention around the delicate eye area. The innovative gel texture absorbs quickly without heaviness or migration, making it perfect for use in the morning, under makeup, or as a refreshing afternoon pick-me-up. The metal applicator tip provides additional cooling benefits to instantly depuff and revitalize.",
      price: 38.99,
      category: "Eye Care",
      ingredients: "Green Tea Extract, Cucumber Extract, Aloe Vera, Peptides",
      size: "15ml",
      usage: "Apply a small amount using the cooling metal applicator around the eye area, focusing on areas of puffiness. Gently tap excess product with ring finger until absorbed. Can be used morning, evening, or throughout the day as needed.",
      benefits: [
        "Instantly cools and depuffs tired eyes",
        "Provides antioxidant protection against environmental damage",
        "Hydrates without heaviness or greasy residue",
        "Works beautifully under makeup without pilling"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    },
  
    // FACE OILS
    {
      id: 16,
      name: "Rosehip Face Oil",
      description: "Organic cold-pressed rosehip oil enriched with vitamin C and essential fatty acids. Perfect for reducing fine lines.",
      longDescription: "Our Rosehip Face Oil is a regenerative elixir crafted from organic, cold-pressed rosa canina seeds harvested at peak ripeness. This ruby-colored oil is naturally rich in trans-retinoic acid (a natural form of vitamin A), vitamins C and E, and essential fatty acids that work synergistically to promote cell turnover, boost collagen production, and improve skin elasticity. Unlike synthetic retinols, rosehip oil provides similar benefits without irritation, making it suitable for even sensitive skin types. The lightweight, dry-touch formula absorbs quickly without leaving an oily residue.",
      price: 39.99,
      category: "Face Oils",
      ingredients: "Organic Rosa Canina (Rosehip) Seed Oil, Vitamin E, Essential Oils of Lavender and Geranium",
      size: "30ml",
      usage: "Apply 3-5 drops to clean skin after water-based treatments and before heavier creams. Can be used morning and night, or mixed with moisturizer for easier application.",
      benefits: [
        "Reduces appearance of fine lines and hyperpigmentation",
        "Improves skin elasticity and firmness",
        "Provides intense hydration without heaviness",
        "Calms inflammation and balances oil production"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: true
    },
    {
      id: 17,
      name: "Marula Face Oil",
      description: "Luxurious face oil with marula and evening primrose. Rich in antioxidants and omega fatty acids.",
      longDescription: "Our Marula Face Oil harnesses the 'miracle oil' that has been used by African women for centuries to protect their skin from the harsh elements. Cold-pressed from the kernels of the marula fruit, this luxurious oil contains high levels of antioxidants and oleic acid that penetrate deeply to nourish and protect. The addition of evening primrose oil, rich in gamma-linolenic acid (GLA), helps address hormonal skin concerns and maintain skin elasticity. This multitasking oil provides both immediate and long-term benefits for all skin types, particularly mature or environmentally damaged skin.",
      price: 45.99,
      category: "Face Oils",
      ingredients: "Marula Oil, Evening Primrose Oil, Vitamin E, Rose Essential Oil",
      size: "30ml",
      usage: "Warm 4-6 drops between palms and press gently into clean skin. Allow to absorb for 1-2 minutes before applying other products. Can be used day or night, or added to foundation for a luminous finish.",
      benefits: [
        "Provides deep nourishment and hydration for dry or mature skin",
        "Protects against environmental damage and premature aging",
        "Improves skin's resilience and barrier function",
        "Creates healthy, radiant glow without greasiness"
      ],
      images: [
        "/Tadefi.png",
        "/Tadefi.png",
        "/Tadefi.png"
      ],
      featured: false
    }
  ];
  
  module.exports = products;