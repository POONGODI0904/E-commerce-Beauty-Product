import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import connectDB from '../config/db.js';

dotenv.config();

export const categoriesData = [
  {
    name: 'Skincare',
    slug: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    description: 'Transformative botanicals, potent serums, and nourishing creams.'
  },
  {
    name: 'Makeup',
    slug: 'makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    description: 'Silky foundations, pigmented lipsticks, and radiant blushes.'
  },
  {
    name: 'Haircare',
    slug: 'haircare',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    description: 'Revitalizing shampoos, restorative masks, and shine-boosting serums.'
  },
  {
    name: 'Body Care',
    slug: 'body-care',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Sumptuous body washes, rich butter lotions, and polishing scrubs.'
  },
  {
    name: 'Fragrance',
    slug: 'fragrance',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    description: 'Haute perfumery featuring rare florals, amber, and Madagascar vanilla.'
  },
  {
    name: 'Beauty Kits',
    slug: 'beauty-kits',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Curated ritual gift sets and travel luxury essentials.'
  }
];

export const productsData = [
  // 1. Skincare - Cleanser
  {
    name: 'Velvet Cloud Gentle Gel Cleanser',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'A gentle pH-balanced foaming gel infused with chamomile and green tea that purifies pores without stripping moisture.',
    price: 38.00,
    discount: 10,
    stock: 45,
    sku: 'ELR-SK-01',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567928815104-b6d494c937ba?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 24,
    ingredients: 'Water, Cocamidopropyl Betaine, Chamomile Extract, Camellia Sinensis (Green Tea) Leaf Extract, Glycerin, Hyaluronic Acid.',
    benefits: ['Maintains natural skin barrier', 'Cleanses waterproof impurities', 'Soothes redness and irritation'],
    skinType: 'All Skin Types',
    usage: 'Massage 1-2 pumps onto damp face in circular motions. Rinse thoroughly with lukewarm water.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 2. Skincare - Face Wash
  {
    name: 'Radiance Enzyme Foaming Face Wash',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Papaya enzymes and willow bark melt away dull surface cells, unveiling an instant glass-skin radiance.',
    price: 42.00,
    discount: 15,
    stock: 32,
    sku: 'ELR-SK-02',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 18,
    ingredients: 'Papaya Fruit Extract, Salix Alba (Willow Bark) Extract, Aloe Barbadensis Leaf Juice, Lactic Acid, Vitamin C.',
    benefits: ['Gently dissolves dead skin', 'Minimizes enlarged pores', 'Brightens uneven tone'],
    skinType: 'Combination to Oily',
    usage: 'Dispense onto wet palms, work into a rich micro-foam, and cleanse face gently for 60 seconds.',
    featured: false,
    bestseller: true,
    newArrival: false
  },
  // 3. Skincare - Toner
  {
    name: 'Rose & Peptide Hydration Mist Toner',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Distilled from organic Bulgarian Damask roses and fortified with copper peptides to flood thirsty skin with deep hydration.',
    price: 36.00,
    discount: 0,
    stock: 50,
    sku: 'ELR-SK-03',
    images: [
      'https://images.unsplash.com/photo-1608248597359-00f8623b1854?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 31,
    ingredients: 'Rosa Damascena Floral Water, Tripeptide-1, Copper Tripeptide-1, Niacinamide, Sodium Hyaluronate.',
    benefits: ['Immediate dewy hydration surge', 'Firms and plumps cellular texture', 'Balances facial skin pH'],
    skinType: 'Dry & Dehydrated',
    usage: 'Mist generously over cleansed skin morning and evening before serums or throughout the day as a refresher.',
    featured: true,
    bestseller: false,
    newArrival: true
  },
  // 4. Skincare - Serum (Vitamin C)
  {
    name: 'Luminous 15% Vitamin C + Ferulic Serum',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'An ultra-potent antioxidant elixir combining ethylated L-ascorbic acid and pure ferulic acid to eradicate dark spots.',
    price: 68.00,
    discount: 20,
    stock: 28,
    sku: 'ELR-SK-04',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 5.0,
    numReviews: 54,
    ingredients: '3-O-Ethyl Ascorbic Acid 15%, Ferulic Acid 1%, Vitamin E, Hyaluronic Acid, Organic Bitter Orange Flower Water.',
    benefits: ['Dramatically brightens dark spots', 'Shields from environmental blue light', 'Boosts natural collagen synthesis'],
    skinType: 'All Skin Types',
    usage: 'Apply 3-4 drops directly onto cleansed skin in the morning. Follow with moisturizer and SPF.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 5. Skincare - Serum (Hyaluronic Acid)
  {
    name: 'Deep Sea Hyaluronic Plumping Serum',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Multi-molecular weight hyaluronic acid combined with marine red algae to replenish deep intercellular hydration reserves.',
    price: 54.00,
    discount: 0,
    stock: 40,
    sku: 'ELR-SK-05',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 29,
    ingredients: 'Sodium Hyaluronate (Multi-Weight 2%), Chondrus Crispus (Red Algae) Extract, Panthenol B5, Glycerin.',
    benefits: ['Instant 72-hour moisture lock', 'Fills fine lines caused by dryness', 'Non-sticky silky finish'],
    skinType: 'Dehydrated & Sensitive',
    usage: 'Press 2-3 drops into damp face and neck prior to heavier lotions.',
    featured: false,
    bestseller: true,
    newArrival: false
  },
  // 6. Skincare - Moisturizer / Face Cream
  {
    name: 'Ceramide Barrier Recovery Silk Cream',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Rich, cashmere-soft moisturizer fortified with 5 essential ceramides and shea butter to restore compromised barriers.',
    price: 62.00,
    discount: 10,
    stock: 35,
    sku: 'ELR-SK-06',
    images: [
      'https://images.unsplash.com/photo-1567928804445-3162b7be5e71?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 42,
    ingredients: 'Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Butyrospermum Parkii (Shea) Butter, Squalane.',
    benefits: ['Seals moisture for 48 hours', 'Calms irritation and flakiness', 'Silky, non-greasy cashmere feel'],
    skinType: 'Dry & Normal',
    usage: 'Warm a dime-sized amount between palms and press gently into skin until absorbed.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 7. Skincare - Sunscreen
  {
    name: 'Invisible Glow Mineral Sunscreen SPF 50+',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Broad-spectrum mineral UVA/UVB shield that leaves zero white cast while delivering a glass-skin pearlescent glow.',
    price: 44.00,
    discount: 0,
    stock: 60,
    sku: 'ELR-SK-07',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 38,
    ingredients: 'Zinc Oxide 18%, Titanium Dioxide 4%, Niacinamide, Squalane, Mica for luminescent sheen.',
    benefits: ['Zero white residue', 'Protects against UV and pollution', 'Functions as primer under makeup'],
    skinType: 'All Skin Types',
    usage: 'Apply liberally 15 minutes before sun exposure as the final step of your morning routine.',
    featured: true,
    bestseller: true,
    newArrival: true
  },
  // 8. Skincare - Lip Balm
  {
    name: 'Nectar Peptide Glaze Lip Therapy Balm',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'An intensely restorative lip treatment infused with peptides, cupuaçu butter, and sweet wild agave nectar.',
    price: 24.00,
    discount: 0,
    stock: 75,
    sku: 'ELR-SK-08',
    images: [
      'https://images.unsplash.com/photo-1599733589046-10c005739ef9?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 22,
    ingredients: 'Bis-Diglyceryl Polyacyladipate-2, Cupuacu Butter, Tripeptide-29, Agave Tequilana Leaf Extract.',
    benefits: ['Instantly plumps lip contours', 'Heals chapped lips overnight', 'Glossy mirror shine without stickiness'],
    skinType: 'All Skin Types',
    usage: 'Glide over lips whenever hydration is needed or apply thick layer before bedtime.',
    featured: false,
    bestseller: false,
    newArrival: true
  },

  // 9. Makeup - Foundation
  {
    name: 'Silk Veil Luminous Serum Foundation',
    brand: 'ÉLORA BEAUTY',
    category: 'Makeup',
    description: 'Weightless medium-to-full buildable coverage foundation with hyaluronic acid that delivers an undetectable second-skin veil.',
    price: 52.00,
    discount: 15,
    stock: 22,
    sku: 'ELR-MK-01',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 35,
    ingredients: 'Dimethicone, Water, Isohexadecane, Glycerin, Sodium Hyaluronate, Vitamin E, Iron Oxides.',
    benefits: ['16-hour sweat-resistant wear', 'Blurred satin luminous finish', 'Hydrating serum core'],
    skinType: 'All Skin Types',
    usage: 'Shake well. Dispense 1-2 pumps onto makeup brush or sponge and blend outward from center of face.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 10. Makeup - Concealer
  {
    name: 'Flawless Touch Radiant Eye Concealer',
    brand: 'ÉLORA BEAUTY',
    category: 'Makeup',
    description: 'Crease-proof liquid concealer enriched with caffeine and peptides to brighten dark undereye hollows.',
    price: 32.00,
    discount: 0,
    stock: 30,
    sku: 'ELR-MK-02',
    images: [
      'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    numReviews: 19,
    ingredients: 'Caffeine, Palmitoyl Tripeptide-38, Niacinamide, Caprylic/Capric Triglyceride.',
    benefits: ['Zero creasing for 12 hours', 'Neutralizes blue and violet shadows', 'Depuffs delicate eye skin'],
    skinType: 'All Skin Types',
    usage: 'Dot sparingly under eyes and over blemishes. Blend outward with clean finger or beauty sponge.',
    featured: false,
    bestseller: false,
    newArrival: true
  },
  // 11. Makeup - Lipstick
  {
    name: 'Rouge Supreme Matte Satin Lipstick',
    brand: 'ÉLORA BEAUTY',
    category: 'Makeup',
    description: 'Couture pigmented lipstick providing one-swipe intense color payoff with a velvety, hydrating satin matte finish.',
    price: 34.00,
    discount: 20,
    stock: 45,
    sku: 'ELR-MK-03',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 48,
    ingredients: 'Ricinus Communis (Castor) Seed Oil, Cera Alba, Camellia Japonica Seed Oil, Candelilla Wax, Red 7 Lake.',
    benefits: ['8-hour non-drying pigment', 'Soft blurred edge effect', 'Infused with camellia seed oil'],
    skinType: 'All Skin Types',
    usage: 'Apply directly from bullet starting at center of Cupid’s bow and gliding outward.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 12. Makeup - Blush
  {
    name: 'Petal Flush Melted Cream Blush',
    brand: 'ÉLORA BEAUTY',
    category: 'Makeup',
    description: 'A dewy watercolor cream blush that blends seamlessly into cheeks for a fresh, naturally pinched glow.',
    price: 30.00,
    discount: 0,
    stock: 35,
    sku: 'ELR-MK-04',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 27,
    ingredients: 'Octyldodecanol, Cera Microcristallina, Rosa Damascena Extract, Tocopheryl Acetate.',
    benefits: ['Dewy, skin-like radiance', 'Mistake-proof easy blending', 'Can also be used on lips'],
    skinType: 'All Skin Types',
    usage: 'Dab onto apples of cheeks with fingertips and blend upward along cheekbones.',
    featured: false,
    bestseller: true,
    newArrival: true
  },
  // 13. Makeup - Eyeliner
  {
    name: 'Calligraphy Precision Waterproof Liquid Eyeliner',
    brand: 'ÉLORA BEAUTY',
    category: 'Makeup',
    description: 'Ultra-fine 0.01mm Japanese brush tip eyeliner that creates sharp wings that do not smudge for 24 hours.',
    price: 26.00,
    discount: 0,
    stock: 50,
    sku: 'ELR-MK-05',
    images: [
      'https://images.unsplash.com/photo-1631730486784-5456119f69ae?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 16,
    ingredients: 'Acrylates Copolymer, Carbon Black, Butylene Glycol, Laureth-21, Phenoxyethanol.',
    benefits: ['24-hour waterproof & smudgeproof', 'Ultra-sharp micro tip', 'Rich carbon pitch black'],
    skinType: 'All Skin Types',
    usage: 'Trace lash line from inner corner outward, flicking diagonally for winged cat eye.',
    featured: false,
    bestseller: false,
    newArrival: false
  },
  // 14. Makeup - Mascara
  {
    name: 'Lash Sculpt 3D Volume & Curl Mascara',
    brand: 'ÉLORA BEAUTY',
    category: 'Makeup',
    description: 'Dual-curved wand separates, lengthens, and coats lashes with jet black fibers for an eye-opening faux lash effect.',
    price: 28.00,
    discount: 10,
    stock: 40,
    sku: 'ELR-MK-06',
    images: [
      'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 33,
    ingredients: 'Aqua, Beeswax, Carnauba Wax, Biotin, Panthenol, Keratin Peptides.',
    benefits: ['Zero clumps or flaking', 'Dramatic 3X volume lift', 'Fortified with conditioning biotin'],
    skinType: 'Sensitive Eyes & Contact Lenses',
    usage: 'Wiggle wand at root of lashes and sweep upward to tips in zigzag motion.',
    featured: true,
    bestseller: false,
    newArrival: true
  },

  // 15. Haircare - Shampoo
  {
    name: 'Silk Elixir Botanical Repair Shampoo',
    brand: 'ÉLORA BEAUTY',
    category: 'Haircare',
    description: 'Sulfate-free cleansing shampoo infused with argan oil and vegan keratin to repair split ends and color-treated hair.',
    price: 36.00,
    discount: 0,
    stock: 38,
    sku: 'ELR-HC-01',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 21,
    ingredients: 'Sodium Cocoyl Isethionate, Argania Spinosa Kernel Oil, Hydrolyzed Wheat Protein, Aloe Extract.',
    benefits: ['Repairs hair cuticles', 'Color safe & sulfate free', 'Silky bounce and shine'],
    skinType: 'All Hair Types',
    usage: 'Massage into scalp and damp roots, work into creamy lather, and rinse thoroughly.',
    featured: false,
    bestseller: true,
    newArrival: false
  },
  // 16. Haircare - Conditioner
  {
    name: 'Caviar & Keratin Gloss Conditioner',
    brand: 'ÉLORA BEAUTY',
    category: 'Haircare',
    description: 'Intense detangling and shine conditioner that seals damaged cuticles and prevents heat frizz.',
    price: 38.00,
    discount: 10,
    stock: 30,
    sku: 'ELR-HC-02',
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 17,
    ingredients: 'Cetearyl Alcohol, Hydrolyzed Keratin, Caviar Extract, Behentrimonium Chloride, Panthenol.',
    benefits: ['Detangles instantly', 'Heat defense up to 450°F', 'Deep gloss shine without heaviness'],
    skinType: 'Dry, Frizzy & Damaged',
    usage: 'Apply from mid-lengths to ends after shampooing. Leave for 3 minutes, then rinse cool.',
    featured: false,
    bestseller: false,
    newArrival: true
  },
  // 17. Haircare - Hair Serum
  {
    name: 'Golden Marula Hair Glaze Serum',
    brand: 'ÉLORA BEAUTY',
    category: 'Haircare',
    description: 'A featherlight blend of cold-pressed marula oil and camellia to instantly tame flyaways and impart salon glass shine.',
    price: 45.00,
    discount: 0,
    stock: 25,
    sku: 'ELR-HC-03',
    images: [
      'https://images.unsplash.com/photo-1608248597289-53e70d47eeae?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 5.0,
    numReviews: 28,
    ingredients: 'Sclerocarya Birrea (Marula) Seed Oil, Camellia Oleifera Seed Oil, Dimethiconol, Fragrance.',
    benefits: ['Tames frizz in humid weather', 'Non-greasy featherweight formula', 'Subtle amber & floral scent'],
    skinType: 'All Hair Types',
    usage: 'Warm 2 drops in palms and smooth through dry or damp hair focusing on ends.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 18. Haircare - Hair Mask
  {
    name: 'Intensive Restorative Butter Hair Mask',
    brand: 'ÉLORA BEAUTY',
    category: 'Haircare',
    description: 'Deep weekly conditioning treatment infused with cupuaçu butter and plant stem cells for brittle bleached hair.',
    price: 48.00,
    discount: 15,
    stock: 20,
    sku: 'ELR-HC-04',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 24,
    ingredients: 'Theobroma Grandiflorum (Cupuacu) Seed Butter, Murumuru Butter, Amino Acids, Hydrolyzed Collagen.',
    benefits: ['Restores elastic strength', 'Transforms coarse strands', 'Visible split end reduction'],
    skinType: 'Severely Damaged & Processed',
    usage: 'After shampooing, apply generously from roots to ends. Leave for 10-15 minutes, then rinse.',
    featured: false,
    bestseller: false,
    newArrival: false
  },

  // 19. Body Care - Body Wash
  {
    name: 'Rose & Santal Silkening Body Wash',
    brand: 'ÉLORA BEAUTY',
    category: 'Body Care',
    description: 'A sensuous aromatic shower gel featuring Damascus rose petals and rich Australian sandalwood essential oils.',
    price: 34.00,
    discount: 0,
    stock: 45,
    sku: 'ELR-BC-01',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 19,
    ingredients: 'Aqua, Cocamidopropyl Hydroxysultaine, Rosa Damascena Flower Water, Santalum Album Oil, Squalane.',
    benefits: ['Aromatherapeutic spa experience', 'Preserves skin lipid mantle', 'Leaves skin scented and supple'],
    skinType: 'All Body Skin Types',
    usage: 'Lather onto wet skin using washcloth or hands, breathe in the fragrance, and rinse.',
    featured: false,
    bestseller: true,
    newArrival: false
  },
  // 20. Body Care - Body Lotion
  {
    name: 'Whipped Shea & Vanilla Body Soufflé',
    brand: 'ÉLORA BEAUTY',
    category: 'Body Care',
    description: 'Air-whipped decadent body lotion that melts upon contact, quenching thirsty skin with Madagascar vanilla.',
    price: 40.00,
    discount: 10,
    stock: 35,
    sku: 'ELR-BC-02',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 32,
    ingredients: 'Butyrospermum Parkii, Cocoa Seed Butter, Vanilla Planifolia Extract, Jojoba Esters, Glycerin.',
    benefits: ['48-hour moisture nourishment', 'Decadent gourmand scent', 'Fast absorbing zero-grease texture'],
    skinType: 'Dry to Very Dry',
    usage: 'Smooth all over body after showering on towel-dried skin.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 21. Body Care - Body Scrub
  {
    name: 'Brown Sugar & Coconut Body Polish',
    brand: 'ÉLORA BEAUTY',
    category: 'Body Care',
    description: 'Natural brown sugar crystals suspended in cold-pressed coconut oil to gently buff away roughness and leave skin baby-soft.',
    price: 38.00,
    discount: 0,
    stock: 28,
    sku: 'ELR-BC-03',
    images: [
      'https://images.unsplash.com/photo-1567928804445-3162b7be5e71?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 21,
    ingredients: 'Sucrose (Brown Sugar), Cocos Nucifera (Coconut) Oil, Sweet Almond Oil, Citrus Aurantium Dulcis Peel Oil.',
    benefits: ['Removes keratosis bumps', 'Infuses deep botanical hydration', 'Reveals smooth glowing skin'],
    skinType: 'All Body Skin Types',
    usage: 'Massage in circular motions onto damp skin focusing on elbows and knees. Rinse with warm water.',
    featured: false,
    bestseller: false,
    newArrival: true
  },

  // 22. Fragrance - Perfume
  {
    name: 'Élixir Nocturne Eau de Parfum 50ml',
    brand: 'ÉLORA BEAUTY',
    category: 'Fragrance',
    description: 'A mesmerizing and sophisticated blend of midnight jasmine, warm amber resin, pink pepper, and creamy sandalwood.',
    price: 110.00,
    discount: 15,
    stock: 25,
    sku: 'ELR-FR-01',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 5.0,
    numReviews: 45,
    ingredients: 'Alcohol Denat., Parfum (Fragrance), Aqua, Benzyl Salicylate, Limonene, Linalool, Coumarin.',
    benefits: ['Long lasting 12+ hour sillage', 'Handcrafted French glass bottle', 'Unisex captivating scent'],
    skinType: 'All',
    usage: 'Spritz onto pulse points: wrists, behind ears, and collarbones.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 23. Fragrance - Body Mist
  {
    name: 'Jasmine Breeze Shimmer Body Mist',
    brand: 'ÉLORA BEAUTY',
    category: 'Fragrance',
    description: 'Light, refreshing fragrance veil infused with golden mica flecks for an ethereal glow and delicate solar scent.',
    price: 36.00,
    discount: 0,
    stock: 40,
    sku: 'ELR-FR-02',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 18,
    ingredients: 'Aqua, Alcohol, Parfum, Mica, Titanium Dioxide, Aloe Barbadensis Leaf Juice.',
    benefits: ['Subtle luminous skin sparkle', 'Crisp floral refreshing scent', 'Hydrating non-sticky base'],
    skinType: 'All',
    usage: 'Shake bottle to suspend shimmer and mist over hair and body from 6 inches away.',
    featured: false,
    bestseller: false,
    newArrival: true
  },

  // 24. Beauty Kits - Skincare Kit
  {
    name: 'The Royal Radiance 4-Piece Skincare Kit',
    brand: 'ÉLORA BEAUTY',
    category: 'Beauty Kits',
    description: 'The definitive daily regimen: Cleanser (50ml), Rose Mist (50ml), Vitamin C Serum (30ml), and Silk Cream (30ml) in a vanity case.',
    price: 135.00,
    discount: 25,
    stock: 18,
    sku: 'ELR-KIT-01',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 5.0,
    numReviews: 39,
    ingredients: 'Complete set featuring full and travel sizes of our best-selling antioxidant skincare.',
    benefits: ['Complete 4-step routine', 'Vanity leather bag included', 'Saves 35% compared to individual purchase'],
    skinType: 'All Skin Types',
    usage: 'Follow the 4-step routine morning and night: Cleanse, Tone, Treat with Serum, Moisturize.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 25. Beauty Kits - Makeup Kit
  {
    name: 'Couture Glamour Essentials Makeup Kit',
    brand: 'ÉLORA BEAUTY',
    category: 'Beauty Kits',
    description: 'Includes Serum Foundation, Radiant Concealer, Rouge Supreme Lipstick, and Lash Sculpt Mascara with a rose gold pouch.',
    price: 115.00,
    discount: 20,
    stock: 15,
    sku: 'ELR-KIT-02',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 26,
    ingredients: 'Premium clean cosmetic formulas dermatologically tested for high performance.',
    benefits: ['Curated red-carpet look in minutes', 'Luxurious gift-box packaging', 'High savings bundle'],
    skinType: 'All Skin Types',
    usage: 'Apply base, conceal imperfections, swipe on mascara, and finish with bold couture lipstick.',
    featured: true,
    bestseller: false,
    newArrival: true
  },
  // 26. Beauty Kits - Haircare Kit
  {
    name: 'Hair Spa Sanctuary Revival Ritual Kit',
    brand: 'ÉLORA BEAUTY',
    category: 'Beauty Kits',
    description: 'Transform dry locks with our Shampoo (250ml), Gloss Conditioner (250ml), Restorative Mask (150ml), and Marula Oil (30ml).',
    price: 125.00,
    discount: 15,
    stock: 14,
    sku: 'ELR-KIT-03',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 22,
    ingredients: 'Botanical proteins, keratin repair complexes, and cold-pressed botanical oils.',
    benefits: ['Transforms damaged dry hair', 'Intense salon-grade nourishment', 'Includes silk sleeping scrunchie'],
    skinType: 'Dry & Color Treated',
    usage: 'Use shampoo and conditioner weekly, treating strands with mask and finishing with marula glaze.',
    featured: false,
    bestseller: true,
    newArrival: false
  },

  // 27. Skincare - Retinol Serum
  {
    name: 'Midnight Renewal 0.5% Encapsulated Retinol',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Slow-release encapsulated retinol paired with soothing squalane and blue tansy for firming without redness.',
    price: 72.00,
    discount: 10,
    stock: 26,
    sku: 'ELR-SK-09',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 34,
    ingredients: 'Encapsulated Retinol 0.5%, Tanacetum Annuum (Blue Tansy) Oil, Squalane, Bisabolol.',
    benefits: ['Smooths fine lines and wrinkles', 'Accelerates cellular renewal', 'Cushioned by calming blue tansy'],
    skinType: 'Mature & Uneven Skin',
    usage: 'Apply 2-3 drops at night onto clean dry skin. Begin 2-3 nights per week and increase as tolerated.',
    featured: true,
    bestseller: true,
    newArrival: false
  },
  // 28. Skincare - Niacinamide Serum
  {
    name: 'Clarifying 10% Niacinamide + Zinc Serum',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Pore-refining balance serum that normalizes sebum, improves skin texture, and fades post-blemish marks.',
    price: 46.00,
    discount: 0,
    stock: 35,
    sku: 'ELR-SK-10',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 29,
    ingredients: 'Niacinamide 10%, Zinc PCA 1%, Allantoin, Centella Asiatica Extract.',
    benefits: ['Controls excess oil & shine', 'Refines texture and pore visibility', 'Strengthens moisture barrier'],
    skinType: 'Oily & Acne Prone',
    usage: 'Smooth a few drops across the face morning and night before moisturizers.',
    featured: false,
    bestseller: false,
    newArrival: true
  },
  // 29. Skincare - Eye Cream
  {
    name: 'Golden Truffle Firming Eye Cream',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Luxurious eye balm enriched with white truffle extract, gold peptides, and caffeine to sculpt and firm contours.',
    price: 64.00,
    discount: 10,
    stock: 22,
    sku: 'ELR-SK-11',
    images: [
      'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 19,
    ingredients: 'Tuber Magnatum (White Truffle) Extract, Acetyl Heptapeptide-9, Gold, Caffeine, Shea Butter.',
    benefits: ['Firms crow’s feet', 'Depuffs mornings', 'Cooling ceramic tip applicator feel'],
    skinType: 'All Skin Types',
    usage: 'Gently dab a pea-sized amount around orbital bone morning and night with ring finger.',
    featured: true,
    bestseller: false,
    newArrival: false
  },
  // 30. Skincare - Face Oil
  {
    name: 'Sultry Rosehip & Marula Botanical Elixir Oil',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: 'Cold-pressed virgin rosehip seed oil and antioxidant-dense marula oil that locks in supreme hydration and glow.',
    price: 58.00,
    discount: 0,
    stock: 30,
    sku: 'ELR-SK-12',
    images: [
      'https://images.unsplash.com/photo-1608248597289-53e70d47eeae?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 25,
    ingredients: 'Rosa Canina (Rosehip) Seed Oil, Sclerocarya Birrea Seed Oil, Meadowfoam Seed Oil, Rosemary Leaf Extract.',
    benefits: ['Intense lipid hydration', 'Restores elasticity', 'Natural non-comedogenic glow'],
    skinType: 'Dry & Sensitive',
    usage: 'Warm 2-3 drops in hands and press gently into face as the final step of nighttime routine.',
    featured: false,
    bestseller: true,
    newArrival: false
  },
  // 31. Makeup - Setting Powder
  {
    name: 'Invisible Silk Micro-Blur Setting Powder',
    brand: 'ÉLORA BEAUTY',
    category: 'Makeup',
    description: 'Triple-milled translucent blurring powder that locks makeup in place for 16 hours with zero flashback.',
    price: 38.00,
    discount: 0,
    stock: 34,
    sku: 'ELR-MK-07',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 21,
    ingredients: 'Silica, Mica, Lauroyl Lysine, Dimethicone, Tocopheryl Acetate.',
    benefits: ['No camera flashback', 'Ultra-velvet soft focus blur', 'Controls shine all day'],
    skinType: 'All Skin Types',
    usage: 'Dip powder puff or brush, tap excess, and press into T-zone and under eyes.',
    featured: false,
    bestseller: false,
    newArrival: true
  },
  // 32. Makeup - Highlighter
  {
    name: 'Champagne Starlight Liquid Highlighter',
    brand: 'ÉLORA BEAUTY',
    category: 'Makeup',
    description: 'Prismatic liquid drops infused with ultra-fine pearls that create a lit-from-within celestial champagne radiance.',
    price: 36.00,
    discount: 10,
    stock: 29,
    sku: 'ELR-MK-08',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 5.0,
    numReviews: 37,
    ingredients: 'Hydrogenated Didecene, Isododecane, Mica, Synthetic Fluorphlogopite, Squalane.',
    benefits: ['Glass-skin high impact sheen', 'Mixes into foundation or worn alone', 'Weightless dewy finish'],
    skinType: 'All Skin Types',
    usage: 'Dot on high points of cheekbones, bridge of nose, and collarbones and tap to blend.',
    featured: true,
    bestseller: true,
    newArrival: false
  }
];

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Clearing old collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    console.log('[Seeder] Seeding Users...');
    const adminUser = await User.create({
      name: 'Élora Admin',
      email: 'admin@elora.com',
      password: 'admin123',
      phone: '+1 (555) 019-2831',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      isActive: true,
      addresses: [
        {
          fullName: 'Élora Headquarters',
          phone: '+1 (555) 019-2831',
          houseFlat: 'Suite 900',
          street: '575 Fifth Avenue',
          city: 'New York',
          state: 'NY',
          pincode: '10017',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    const demoUser = await User.create({
      name: 'Sophia Laurent',
      email: 'user@elora.com',
      password: 'user123',
      phone: '+1 (555) 839-1102',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isActive: true,
      addresses: [
        {
          fullName: 'Sophia Laurent',
          phone: '+1 (555) 839-1102',
          houseFlat: 'Apt 4B',
          street: '142 Mercer Street, SoHo',
          city: 'New York',
          state: 'NY',
          pincode: '10012',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    console.log('[Seeder] Seeding Categories...');
    await Category.insertMany(categoriesData);

    console.log('[Seeder] Seeding Products...');
    const createdProducts = await Product.insertMany(productsData);

    console.log('[Seeder] Seeding Wishlist & Reviews for Demo User...');
    demoUser.wishlist = [createdProducts[0]._id, createdProducts[3]._id, createdProducts[10]._id];
    await demoUser.save();

    // Create realistic sample reviews
    await Review.create([
      {
        product: createdProducts[3]._id, // Vitamin C
        user: demoUser._id,
        userName: demoUser.name,
        userAvatar: demoUser.avatar,
        rating: 5,
        comment: 'This Vitamin C serum completely transformed my dull post-winter skin in just 2 weeks. The texture is silky, smells naturally like orange blossoms, and leaves zero sticky residue!'
      },
      {
        product: createdProducts[0]._id, // Cleanser
        user: demoUser._id,
        userName: demoUser.name,
        userAvatar: demoUser.avatar,
        rating: 5,
        comment: 'The gentlest cleanser I have ever tried! It removes my full makeup effortlessly while leaving my skin feeling soft like velvet petals.'
      }
    ]);

    console.log('[Seeder] Seeding Active Coupons...');
    await Coupon.create([
      {
        code: 'GLOW20',
        discountType: 'percentage',
        discountAmount: 20,
        minOrder: 50,
        maxDiscount: 100,
        expiryDate: new Date('2030-12-31'),
        usageLimit: 500,
        isActive: true
      },
      {
        code: 'BEAUTY10',
        discountType: 'fixed',
        discountAmount: 10,
        minOrder: 40,
        maxDiscount: 10,
        expiryDate: new Date('2030-12-31'),
        usageLimit: 500,
        isActive: true
      },
      {
        code: 'WELCOME15',
        discountType: 'percentage',
        discountAmount: 15,
        minOrder: 30,
        maxDiscount: 50,
        expiryDate: new Date('2030-12-31'),
        usageLimit: 1000,
        isActive: true
      }
    ]);

    console.log('[Seeder] Seeding Demo Orders for Admin Stats...');
    await Order.create({
      user: demoUser._id,
      orderItems: [
        {
          product: createdProducts[3]._id,
          name: createdProducts[3].name,
          image: createdProducts[3].images[0],
          price: createdProducts[3].price,
          discountPrice: createdProducts[3].price * 0.8,
          qty: 1
        },
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          discountPrice: createdProducts[0].price * 0.9,
          qty: 1
        }
      ],
      shippingAddress: demoUser.addresses[0],
      paymentMethod: 'Demo Card / Test Payment',
      paymentResult: { id: 'DEMO-TX-984124', status: 'COMPLETED' },
      itemsPrice: 88.60,
      discountAmount: 17.72,
      couponCode: 'GLOW20',
      shippingPrice: 0,
      taxPrice: 7.09,
      totalPrice: 77.97,
      orderStatus: 'Shipped',
      isPaid: true,
      paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      trackingTimeline: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), completed: true, description: 'Your order has been received and logged.' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), completed: true, description: 'Payment and order verified by our boutique.' },
        { status: 'Processing', timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000), completed: true, description: 'Items are being curated in the clean room.' },
        { status: 'Packed', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), completed: true, description: 'Securely packaged with luxury satin wrap.' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), completed: true, description: 'Handed over to priority courier. Tracking #ELR983419.' },
        { status: 'Out for Delivery', timestamp: null, completed: false, description: 'Courier is in transit to your address.' },
        { status: 'Delivered', timestamp: null, completed: false, description: 'Order delivered and verified.' }
      ]
    });

    console.log('----------------------------------------------------');
    console.log('  ÉLORA BEAUTY DATABASE SEEDED SUCCESSFULLY!       ');
    console.log('----------------------------------------------------');
    console.log(`  Products:    ${createdProducts.length} items`);
    console.log(`  Categories:  ${categoriesData.length} items`);
    console.log('  Admin User:  admin@elora.com / admin123');
    console.log('  Demo User:   user@elora.com  / user123');
    console.log('  Coupons:     GLOW20 (20% off), BEAUTY10 ($10 off)');
    console.log('----------------------------------------------------');

    return true;
  } catch (error) {
    console.error('[Seeder] Error seeding data:', error);
    throw error;
  }
};

// If run directly via `npm run seed`
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
