import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import User from './models/User';

dotenv.config();

const products = [
    // Chicken Products
    {
        name: 'Boneless Chicken Breast',
        description: 'Premium quality boneless chicken breast, perfect for grilling, baking, or stir-frying. Lean and tender meat cut from fresh farm chickens.',
        category: 'chicken',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500',
        weightVariants: [
            { weight: '250g', price: 120, stock: 50 },
            { weight: '500g', price: 230, stock: 40 },
            { weight: '1kg', price: 450, stock: 30 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Chicken Drumsticks',
        description: 'Juicy chicken drumsticks with bone, ideal for roasting, frying, or making delicious curries. Sourced from premium quality farm chickens.',
        category: 'chicken',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500',
        weightVariants: [
            { weight: '250g', price: 80, stock: 60 },
            { weight: '500g', price: 150, stock: 50 },
            { weight: '1kg', price: 280, stock: 40 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Chicken Wings',
        description: 'Crispy-perfect chicken wings, great for buffalo wings, grilling, or baking. Fresh and never frozen.',
        category: 'chicken',
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500',
        weightVariants: [
            { weight: '250g', price: 90, stock: 45 },
            { weight: '500g', price: 170, stock: 35 },
            { weight: '1kg', price: 320, stock: 25 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Whole Chicken',
        description: 'Whole farm-fresh chicken, perfect for roasting or making traditional recipes. Cleaned and ready to cook.',
        category: 'chicken',
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500',
        weightVariants: [
            { weight: '1kg', price: 260, stock: 30 },
            { weight: '1.5kg', price: 380, stock: 25 },
            { weight: '2kg', price: 500, stock: 20 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Chicken Keema',
        description: 'Freshly minced chicken, perfect for kebabs, koftas, burgers, and various Indian dishes.',
        category: 'chicken',
        image: 'https://images.unsplash.com/photo-1602473812169-8ac76fdce848?w=500',
        weightVariants: [
            { weight: '250g', price: 100, stock: 40 },
            { weight: '500g', price: 190, stock: 35 },
            { weight: '1kg', price: 370, stock: 25 },
        ],
        isBestSeller: false,
    },

    // Mutton Products
    {
        name: 'Goat Curry Cut',
        description: 'Premium bone-in goat meat cut into curry-sized pieces. Perfect for traditional mutton curries and biryanis.',
        category: 'mutton',
        image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500',
        weightVariants: [
            { weight: '250g', price: 200, stock: 30 },
            { weight: '500g', price: 390, stock: 25 },
            { weight: '1kg', price: 750, stock: 20 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Mutton Keema',
        description: 'Freshly ground mutton mince, ideal for seekh kebabs, samosas, parathas, and authentic mutton dishes.',
        category: 'mutton',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500',
        weightVariants: [
            { weight: '250g', price: 220, stock: 25 },
            { weight: '500g', price: 420, stock: 20 },
            { weight: '1kg', price: 800, stock: 15 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Lamb Chops',
        description: 'Tender lamb chops, perfect for grilling, pan-frying, or baking. Premium quality meat with excellent marbling.',
        category: 'mutton',
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500',
        weightVariants: [
            { weight: '250g', price: 280, stock: 20 },
            { weight: '500g', price: 540, stock: 15 },
            { weight: '1kg', price: 1050, stock: 10 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Boneless Mutton',
        description: 'Prime boneless mutton pieces, excellent for dry curries, stir-fries, and quick-cooking recipes.',
        category: 'mutton',
        image: 'https://images.unsplash.com/photo-1602473812169-8ac76fdce848?w=500',
        weightVariants: [
            { weight: '250g', price: 250, stock: 25 },
            { weight: '500g', price: 480, stock: 20 },
            { weight: '1kg', price: 920, stock: 15 },
        ],
        isBestSeller: false,
    },

    // Seafood Products
    {
        name: 'Fresh Prawns',
        description: 'Large, fresh prawns perfect for curries, grilling, or stir-frying. Cleaned and deveined for convenience.',
        category: 'seafood',
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500',
        weightVariants: [
            { weight: '250g', price: 200, stock: 35 },
            { weight: '500g', price: 380, stock: 30 },
            { weight: '1kg', price: 720, stock: 20 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Rohu Fish',
        description: 'Fresh Rohu fish steaks, a popular freshwater fish perfect for traditional fish curries and frying.',
        category: 'seafood',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
        weightVariants: [
            { weight: '500g', price: 180, stock: 30 },
            { weight: '1kg', price: 340, stock: 25 },
            { weight: '2kg', price: 650, stock: 15 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Pomfret',
        description: 'Premium silver pomfret, ideal for frying or grilling. A delicacy with tender white flesh.',
        category: 'seafood',
        image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=500',
        weightVariants: [
            { weight: '250g', price: 220, stock: 25 },
            { weight: '500g', price: 420, stock: 20 },
            { weight: '1kg', price: 800, stock: 15 },
        ],
        isBestSeller: true,
    },
    {
        name: 'King Fish Steaks',
        description: 'Thick-cut king fish steaks, perfect for pan-searing or making fish fry. Rich in Omega-3.',
        category: 'seafood',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500',
        weightVariants: [
            { weight: '250g', price: 180, stock: 30 },
            { weight: '500g', price: 340, stock: 25 },
            { weight: '1kg', price: 650, stock: 20 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Squid Rings',
        description: 'Fresh squid cleaned and cut into rings, ready for frying or adding to seafood curries.',
        category: 'seafood',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500',
        weightVariants: [
            { weight: '250g', price: 160, stock: 25 },
            { weight: '500g', price: 300, stock: 20 },
            { weight: '1kg', price: 580, stock: 15 },
        ],
        isBestSeller: false,
    },

    // Eggs
    {
        name: 'Farm Fresh Eggs',
        description: 'Free-range farm fresh eggs with rich golden yolks. Perfect for breakfast or baking.',
        category: 'eggs',
        image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=500',
        weightVariants: [
            { weight: '6 pcs', price: 60, stock: 100 },
            { weight: '12 pcs', price: 110, stock: 80 },
            { weight: '30 pcs', price: 250, stock: 50 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Organic Brown Eggs',
        description: 'Premium organic brown eggs from cage-free hens. Richer in nutrients and flavor.',
        category: 'eggs',
        image: 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?w=500',
        weightVariants: [
            { weight: '6 pcs', price: 90, stock: 60 },
            { weight: '12 pcs', price: 170, stock: 50 },
            { weight: '30 pcs', price: 400, stock: 30 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Duck Eggs',
        description: 'Fresh duck eggs, larger than chicken eggs with richer taste. Great for baking and Asian cuisines.',
        category: 'eggs',
        image: 'https://images.unsplash.com/photo-1569127959161-2b1297b2d9a6?w=500',
        weightVariants: [
            { weight: '6 pcs', price: 120, stock: 40 },
            { weight: '12 pcs', price: 220, stock: 30 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Quail Eggs',
        description: 'Delicate quail eggs, perfect for appetizers, salads, and gourmet dishes. Pack of premium quality eggs.',
        category: 'eggs',
        image: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=500',
        weightVariants: [
            { weight: '12 pcs', price: 80, stock: 50 },
            { weight: '24 pcs', price: 150, stock: 40 },
            { weight: '50 pcs', price: 280, stock: 25 },
        ],
        isBestSeller: false,
    },
];

const adminUser = {
    name: 'Admin',
    email: 'admin@meatshop.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
};

const seedDatabase = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meat-shop';
        await mongoose.connect(mongoURI);
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Seed products
        await Product.insertMany(products);
        console.log(`✅ Seeded ${products.length} products`);

        // Create admin user
        await User.create(adminUser);
        console.log('✅ Created admin user');
        console.log('   Email: admin@meatshop.com');
        console.log('   Password: admin123');

        console.log('\n🎉 Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
