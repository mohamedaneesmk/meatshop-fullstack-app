import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin,
    toggleAvailability,
} from '../controllers/productController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllProductsAdmin);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/toggle-availability', protect, adminOnly, toggleAvailability);

export default router;
