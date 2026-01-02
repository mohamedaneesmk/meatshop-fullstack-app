import express from 'express';
import {
    createOrder,
    getOrder,
    getOrdersByPhone,
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
} from '../controllers/orderController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/', createOrder);
router.get('/track/:phone', getOrdersByPhone);
router.get('/:id', getOrder);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/admin/stats', protect, adminOnly, getOrderStats);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
