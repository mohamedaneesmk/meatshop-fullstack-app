import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, bestSeller } = req.query;

        const filter: any = { isAvailable: true };

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (bestSeller === 'true') {
            filter.isBestSeller = true;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }

        res.json({
            success: true,
            data: product,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, category, image, weightVariants, isBestSeller } = req.body;

        const product = await Product.create({
            name,
            description,
            category,
            image,
            weightVariants,
            isBestSeller: isBestSeller || false,
        });

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }

        res.json({
            success: true,
            data: product,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }

        res.json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get all products (admin view - includes unavailable)
// @route   GET /api/products/admin/all
// @access  Private/Admin
export const getAllProductsAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Toggle product availability
// @route   PATCH /api/products/:id/toggle-availability
// @access  Private/Admin
export const toggleAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }

        product.isAvailable = !product.isAvailable;
        await product.save();

        res.json({
            success: true,
            data: product,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
