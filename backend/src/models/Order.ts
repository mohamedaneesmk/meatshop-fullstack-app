import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    productName: string;
    weight: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    orderId: string;
    user?: mongoose.Types.ObjectId;
    customerName: string;
    phone: string;
    address: string;
    items: IOrderItem[];
    totalAmount: number;
    status: 'pending' | 'cutting' | 'out-for-delivery' | 'delivered' | 'cancelled';
    paymentMethod: 'cod';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        weight: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        address: {
            type: String,
            required: [true, 'Delivery address is required'],
            trim: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (items: IOrderItem[]) {
                    return items.length > 0;
                },
                message: 'Order must have at least one item',
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'cutting', 'out-for-delivery', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['cod'],
            default: 'cod',
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

// Generate order ID before saving
orderSchema.pre('save', async function () {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderId = `MS${year}${month}${day}${random}`;
    }
});

// Index for faster queries
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1 });

export default mongoose.model<IOrder>('Order', orderSchema);
