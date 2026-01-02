export interface WeightVariant {
    weight: string;
    price: number;
    stock: number;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: 'beef';
    image: string;
    weightVariants: WeightVariant[];
    isBestSeller: boolean;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    product: Product;
    selectedWeight: string;
    price: number;
    quantity: number;
}

export interface OrderItem {
    product: string;
    productName: string;
    weight: string;
    price: number;
    quantity: number;
}

export interface Order {
    _id: string;
    orderId: string;
    customerName: string;
    phone: string;
    address: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'cutting' | 'out-for-delivery' | 'delivered' | 'cancelled';
    paymentMethod: 'cod';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    role: 'user' | 'admin';
    token: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    count?: number;
    total?: number;
    page?: number;
    pages?: number;
}

export interface OrderStats {
    byStatus: Array<{
        _id: string;
        count: number;
        totalAmount: number;
    }>;
    totalOrders: number;
    totalRevenue: number;
    todayOrders: number;
}

export type Category = 'all' | 'beef';

export type OrderStatus = 'pending' | 'cutting' | 'out-for-delivery' | 'delivered' | 'cancelled';
