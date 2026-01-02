import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import User from './models/User';

dotenv.config();

const products = [
    // Beef Products
    {
        name: 'Beef Curry Cut',
        description: 'Premium bone-in beef cut into curry-sized pieces. Perfect for traditional beef curries, biryanis, and slow-cooked dishes.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500',
        weightVariants: [
            { weight: '250g', price: 180, stock: 50 },
            { weight: '500g', price: 350, stock: 40 },
            { weight: '1kg', price: 680, stock: 30 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Beef Steak Cuts',
        description: 'Premium quality beef steak cuts, perfect for grilling, pan-searing, or BBQ. Tender and juicy with excellent marbling.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500',
        weightVariants: [
            { weight: '250g', price: 220, stock: 40 },
            { weight: '500g', price: 420, stock: 35 },
            { weight: '1kg', price: 800, stock: 25 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Boneless Beef',
        description: 'Prime boneless beef pieces, excellent for dry curries, stir-fries, and quick-cooking recipes. Lean and tender.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1602473812169-8ac76fdce848?w=500',
        weightVariants: [
            { weight: '250g', price: 200, stock: 45 },
            { weight: '500g', price: 380, stock: 35 },
            { weight: '1kg', price: 720, stock: 25 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Beef Keema (Mince)',
        description: 'Freshly ground beef mince, ideal for kebabs, koftas, burgers, samosas, and authentic beef dishes.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500',
        weightVariants: [
            { weight: '250g', price: 170, stock: 50 },
            { weight: '500g', price: 320, stock: 40 },
            { weight: '1kg', price: 600, stock: 30 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Beef Ribs',
        description: 'Meaty beef ribs perfect for slow cooking, BBQ, or braising. Rich flavor with tender meat that falls off the bone.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500',
        weightVariants: [
            { weight: '500g', price: 300, stock: 35 },
            { weight: '1kg', price: 580, stock: 25 },
            { weight: '1.5kg', price: 850, stock: 15 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Beef Liver',
        description: 'Fresh beef liver, rich in iron and nutrients. Perfect for traditional liver fry and curries.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500',
        weightVariants: [
            { weight: '250g', price: 80, stock: 40 },
            { weight: '500g', price: 150, stock: 30 },
            { weight: '1kg', price: 280, stock: 20 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Beef Shank',
        description: 'Cross-cut beef shank with bone and marrow. Ideal for making rich beef soups, stews, and nihari.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500',
        weightVariants: [
            { weight: '500g', price: 200, stock: 30 },
            { weight: '1kg', price: 380, stock: 25 },
            { weight: '2kg', price: 720, stock: 15 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Beef Brisket',
        description: 'Premium beef brisket, perfect for slow smoking, braising, or making traditional dishes. Tender and flavorful.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500',
        weightVariants: [
            { weight: '500g', price: 280, stock: 30 },
            { weight: '1kg', price: 540, stock: 20 },
            { weight: '2kg', price: 1000, stock: 10 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Beef Tenderloin',
        description: 'The most tender cut of beef, perfect for special occasions. Ideal for steaks, roasts, and fine dining recipes.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500',
        weightVariants: [
            { weight: '250g', price: 320, stock: 25 },
            { weight: '500g', price: 620, stock: 20 },
            { weight: '1kg', price: 1200, stock: 10 },
        ],
        isBestSeller: true,
    },
    {
        name: 'Beef Bone Marrow',
        description: 'Premium beef bone marrow, perfect for making rich bone broth, soups, or roasting. Highly nutritious.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500',
        weightVariants: [
            { weight: '500g', price: 120, stock: 40 },
            { weight: '1kg', price: 220, stock: 30 },
            { weight: '2kg', price: 400, stock: 20 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Beef Tongue',
        description: 'Fresh beef tongue, a delicacy when slow-cooked. Perfect for tacos, sandwiches, or traditional preparations.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1602473812169-8ac76fdce848?w=500',
        weightVariants: [
            { weight: '500g', price: 180, stock: 25 },
            { weight: '1kg', price: 340, stock: 20 },
        ],
        isBestSeller: false,
    },
    {
        name: 'Beef Nihari Cut',
        description: 'Special cut with bone and meat, perfect for making authentic nihari. Slow-cooked for hours to perfection.',
        category: 'beef',
        image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500',
        weightVariants: [
            { weight: '500g', price: 250, stock: 30 },
            { weight: '1kg', price: 480, stock: 25 },
            { weight: '2kg', price: 920, stock: 15 },
        ],
        isBestSeller: true,
    },
];

const adminUser = {
    name: 'Admin',
    email: 'admin@meatshop.com',
    password: 'admin123',
    phone: '6383938001',
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
