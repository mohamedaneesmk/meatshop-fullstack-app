import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { customerName, phone, address, items, notes } = req.body;

        if (!items || items.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No order items provided',
            });
            return;
        }

        // Validate products and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
                return;
            }

            // Find the weight variant
            const variant = product.weightVariants.find(v => v.weight === item.weight);

            if (!variant) {
                res.status(400).json({
                    success: false,
                    message: `Weight variant ${item.weight} not found for ${product.name}`,
                });
                return;
            }

            if (variant.stock < item.quantity) {
                res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name} (${item.weight})`,
                });
                return;
            }

            orderItems.push({
                product: product._id,
                productName: product.name,
                weight: item.weight,
                price: variant.price,
                quantity: item.quantity,
            });

            totalAmount += variant.price * item.quantity;

            // Update stock
            variant.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            customerName,
            phone,
            address,
            items: orderItems,
            totalAmount,
            notes,
            paymentMethod: 'cod',
        });

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });

        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get order by phone number
// @route   GET /api/orders/track/:phone
// @access  Public
export const getOrdersByPhone = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ phone: req.params.phone })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const filter: any = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            count: orders.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: orders,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Update order status (admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'cutting', 'out-for-delivery', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status',
            });
            return;
        }

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { status },
            { new: true }
        );

        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get order statistics (admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
export const getOrderStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                },
            },
        ]);

        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: todayStart },
        });

        res.json({
            success: true,
            data: {
                byStatus: stats,
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                todayOrders,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
