import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { notFound, errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Meat Shop API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
🥩 ================================== 🥩
   MEAT SHOP API SERVER
   Running on port ${PORT}
   Environment: ${process.env.NODE_ENV || 'development'}
🥩 ================================== 🥩
  `);
});

export default app;
