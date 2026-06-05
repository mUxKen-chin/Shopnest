const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const products = [
  // Men's Tops
  {
    name: 'Classic White Oxford Shirt',
    description: 'A timeless white Oxford shirt crafted from premium 100% cotton. Features a button-down collar, chest pocket, and a tailored fit that works perfectly for both formal and casual occasions.',
    price: 3200,
    originalPrice: 4500,
    category: "Men's Tops",
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Grey'],
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500'],
    stock: 50,
    rating: 4.5,
    numReviews: 12,
    featured: true,
    tags: ['shirt', 'formal', 'classic'],
  },
  {
    name: 'Oversized Graphic Hoodie',
    description: 'Ultra-soft fleece hoodie with a relaxed oversized fit. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Perfect for streetwear and casual outings.',
    price: 4500,
    originalPrice: 5500,
    category: "Men's Tops",
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Charcoal', 'Olive'],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500'],
    stock: 35,
    rating: 4.7,
    numReviews: 18,
    isNew: true,
    featured: true,
    tags: ['hoodie', 'streetwear', 'casual'],
  },
  {
    name: 'Linen Summer Shirt',
    description: 'Lightweight linen shirt perfect for summer. Breathable fabric keeps you cool in the heat. Features a relaxed fit with a classic collar and mother-of-pearl buttons.',
    price: 2800,
    category: "Men's Tops",
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Beige', 'White', 'Sky Blue'],
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b5696?w=500'],
    stock: 40,
    rating: 4.3,
    numReviews: 8,
    isNew: true,
    tags: ['linen', 'summer', 'casual'],
  },

  // Men's Bottoms
  {
    name: 'Slim Fit Chino Pants',
    description: 'Modern slim-fit chinos made from stretch cotton blend. Comfortable for all-day wear with a smart casual look. Features two front pockets and two back pockets.',
    price: 3800,
    originalPrice: 4800,
    category: "Men's Bottoms",
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Khaki', 'Navy', 'Olive', 'Black'],
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'],
    stock: 45,
    rating: 4.4,
    numReviews: 15,
    featured: true,
    tags: ['chinos', 'pants', 'smart casual'],
  },
  {
    name: 'Premium Denim Jeans',
    description: 'Classic straight-cut denim jeans with a modern wash. Made from high-quality denim with just the right amount of stretch for comfort. A wardrobe essential.',
    price: 4200,
    category: "Men's Bottoms",
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Indigo Blue', 'Dark Blue', 'Black'],
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    stock: 60,
    rating: 4.6,
    numReviews: 22,
    tags: ['jeans', 'denim', 'classic'],
  },
  {
    name: 'Cargo Utility Pants',
    description: 'Functional cargo pants with multiple pockets for a utility look. Made from durable ripstop fabric. Features an adjustable waistband and tapered leg fit.',
    price: 3500,
    category: "Men's Bottoms",
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Olive', 'Black', 'Tan'],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'],
    stock: 30,
    rating: 4.2,
    numReviews: 10,
    isNew: true,
    tags: ['cargo', 'utility', 'streetwear'],
  },

  // Women's Tops
  {
    name: 'Floral Print Blouse',
    description: 'Elegant floral blouse made from lightweight chiffon. Features a v-neckline, short flutter sleeves, and a relaxed drape. Perfect for brunches and casual outings.',
    price: 2500,
    originalPrice: 3200,
    category: "Women's Tops",
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink Floral', 'Blue Floral', 'White Floral'],
    images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500'],
    stock: 55,
    rating: 4.8,
    numReviews: 25,
    featured: true,
    tags: ['blouse', 'floral', 'feminine'],
  },
  {
    name: 'Ribbed Knit Crop Top',
    description: 'Trendy ribbed knit crop top with a snug, flattering fit. Made from soft stretchy fabric. Pairs perfectly with high-waist jeans or skirts.',
    price: 1800,
    category: "Women's Tops",
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Cream', 'Black', 'Dusty Rose', 'Sage Green'],
    images: ['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500'],
    stock: 70,
    rating: 4.5,
    numReviews: 30,
    isNew: true,
    featured: true,
    tags: ['crop top', 'knit', 'trendy'],
  },
  {
    name: 'Oversized Knit Sweater',
    description: 'Cozy oversized knit sweater perfect for cooler days. Made from soft wool blend with a chunky ribbed texture. Features dropped shoulders and a relaxed silhouette.',
    price: 3800,
    originalPrice: 4800,
    category: "Women's Tops",
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Cream', 'Burgundy', 'Grey'],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500'],
    stock: 40,
    rating: 4.7,
    numReviews: 19,
    tags: ['sweater', 'knit', 'cozy'],
  },

  // Women's Bottoms
  {
    name: 'Pleated Midi Skirt',
    description: 'Elegant pleated midi skirt with a flowy silhouette. Made from satin-like fabric that drapes beautifully. Features an elastic waistband for comfortable wear.',
    price: 2800,
    category: "Women's Bottoms",
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blush Pink', 'Black', 'Ivory', 'Sage Green'],
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500'],
    stock: 45,
    rating: 4.6,
    numReviews: 14,
    featured: true,
    tags: ['skirt', 'midi', 'elegant'],
  },
  {
    name: 'High-Waist Skinny Jeans',
    description: 'Classic high-waist skinny jeans that sculpt and flatter. Made from premium stretch denim for all-day comfort. A versatile staple for every wardrobe.',
    price: 3500,
    originalPrice: 4200,
    category: "Women's Bottoms",
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Dark Blue', 'Black', 'Light Blue'],
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'],
    stock: 65,
    rating: 4.5,
    numReviews: 28,
    isNew: true,
    tags: ['jeans', 'high-waist', 'skinny'],
  },
  {
    name: 'Wide Leg Trousers',
    description: 'Fashion-forward wide leg trousers with a flattering high-rise cut. Made from flowy fabric that moves beautifully. Perfect for office-to-evening transition.',
    price: 3200,
    category: "Women's Bottoms",
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Camel', 'White', 'Navy'],
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b5696?w=500'],
    stock: 35,
    rating: 4.4,
    numReviews: 11,
    tags: ['trousers', 'wide-leg', 'office'],
  },

  // Outerwear
  {
    name: 'Classic Trench Coat',
    description: 'Timeless double-breasted trench coat made from water-resistant cotton gabardine. Features a belted waist, storm flaps, and epaulettes. A true wardrobe investment.',
    price: 12500,
    originalPrice: 16000,
    category: 'Outerwear',
    gender: 'Unisex',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Black', 'Khaki'],
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'],
    stock: 20,
    rating: 4.9,
    numReviews: 16,
    featured: true,
    tags: ['trench coat', 'classic', 'outerwear'],
  },
  {
    name: 'Puffer Winter Jacket',
    description: 'Warm quilted puffer jacket filled with premium insulation. Features a high collar, zip pockets, and a water-resistant outer shell. Essential for cold winters.',
    price: 8500,
    originalPrice: 11000,
    category: 'Outerwear',
    gender: 'Unisex',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Olive', 'Burgundy'],
    images: ['https://images.unsplash.com/photo-1544923246-77307dd654cb?w=500'],
    stock: 25,
    rating: 4.7,
    numReviews: 20,
    isNew: true,
    tags: ['puffer', 'winter', 'jacket'],
  },

  // Footwear
  {
    name: 'Classic White Sneakers',
    description: 'Clean, minimalist white leather sneakers with a cushioned sole. Versatile enough to pair with any outfit. Features a rubber sole for durability and comfort.',
    price: 6500,
    originalPrice: 8000,
    category: 'Footwear',
    gender: 'Unisex',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['White', 'White/Grey'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    stock: 40,
    rating: 4.8,
    numReviews: 35,
    featured: true,
    tags: ['sneakers', 'white', 'casual'],
  },
  {
    name: 'Chelsea Leather Boots',
    description: 'Sleek Chelsea boots crafted from genuine leather. Features elastic side panels for easy slip-on, a pointed toe, and a block heel. Perfect for smart-casual and formal looks.',
    price: 9500,
    category: 'Footwear',
    gender: 'Unisex',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Black', 'Tan', 'Dark Brown'],
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500'],
    stock: 30,
    rating: 4.6,
    numReviews: 14,
    isNew: true,
    tags: ['boots', 'chelsea', 'leather'],
  },
  {
    name: 'Strappy Block Heel Sandals',
    description: 'Elegant strappy sandals with a comfortable block heel. Features adjustable ankle straps and a cushioned footbed. Perfect for summer events and evening outings.',
    price: 5500,
    originalPrice: 7000,
    category: 'Footwear',
    gender: 'Women',
    sizes: ['38', '39', '40', '41'],
    colors: ['Nude', 'Black', 'White'],
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500'],
    stock: 35,
    rating: 4.4,
    numReviews: 12,
    tags: ['sandals', 'heels', 'summer'],
  },

  // Accessories
  {
    name: 'Canvas Tote Bag',
    description: 'Spacious and sturdy canvas tote bag with reinforced handles. Features an interior zip pocket and a snap button closure. Perfect for shopping, beach, and everyday carry.',
    price: 1500,
    category: 'Accessories',
    gender: 'Unisex',
    sizes: ['One Size'],
    colors: ['Natural', 'Black', 'Navy', 'Olive'],
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=500'],
    stock: 80,
    rating: 4.3,
    numReviews: 21,
    isNew: true,
    tags: ['tote', 'bag', 'canvas'],
  },
  {
    name: 'Genuine Leather Belt',
    description: 'Classic genuine leather belt with a polished silver buckle. Smooth finish with precise stitching. Available in multiple lengths. A must-have wardrobe accessory.',
    price: 2200,
    originalPrice: 2800,
    category: 'Accessories',
    gender: 'Unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Tan'],
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500'],
    stock: 60,
    rating: 4.5,
    numReviews: 17,
    tags: ['belt', 'leather', 'accessory'],
  },
  {
    name: 'Merino Wool Scarf',
    description: 'Luxuriously soft merino wool scarf in a classic plaid pattern. Lightweight yet warm, perfect for autumn and winter layering. Generously sized for multiple styling options.',
    price: 2800,
    category: 'Accessories',
    gender: 'Unisex',
    sizes: ['One Size'],
    colors: ['Camel/Black', 'Grey/Navy', 'Red/Black'],
    images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500'],
    stock: 45,
    rating: 4.7,
    numReviews: 9,
    tags: ['scarf', 'wool', 'winter'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@shopnest.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👑 Admin created: admin@shopnest.com / admin123');

    // Create test customer
    await User.create({
      name: 'Test User',
      email: 'user@shopnest.com',
      password: 'user1234',
      role: 'customer',
    });
    console.log('👤 Customer created: user@shopnest.com / user1234');

    // Create products
    await Product.insertMany(products);
    console.log(`📦 ${products.length} products seeded`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('=====================================');
    console.log('Admin Login:    admin@shopnest.com / admin123');
    console.log('Customer Login: user@shopnest.com  / user1234');
    console.log('=====================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
