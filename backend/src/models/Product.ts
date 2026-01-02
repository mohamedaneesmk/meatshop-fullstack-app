import mongoose, { Document, Schema } from 'mongoose';

export interface IWeightVariant {
    weight: string;
    price: number;
    stock: number;
}

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    category: 'chicken' | 'mutton' | 'seafood' | 'eggs';
    image: string;
    weightVariants: IWeightVariant[];
    isBestSeller: boolean;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const weightVariantSchema = new Schema<IWeightVariant>(
    {
        weight: {
            type: String,
            required: [true, 'Weight is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
    },
    { _id: false }
);

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['chicken', 'mutton', 'seafood', 'eggs'],
                message: 'Category must be chicken, mutton, seafood, or eggs',
            },
        },
        image: {
            type: String,
            required: [true, 'Product image is required'],
        },
        weightVariants: {
            type: [weightVariantSchema],
            required: [true, 'At least one weight variant is required'],
            validate: {
                validator: function (variants: IWeightVariant[]) {
                    return variants.length > 0;
                },
                message: 'Product must have at least one weight variant',
            },
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ isBestSeller: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
