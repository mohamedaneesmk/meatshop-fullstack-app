import api from './client';
import type { Product, Order, User, ApiResponse, OrderStats } from '../types';

// Products API
export const getProducts = async (category?: string): Promise<ApiResponse<Product[]>> => {
    const params = category && category !== 'all' ? { category } : {};
    const response = await api.get('/products', { params });
    return response.data;
};

export const getProduct = async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const getAllProductsAdmin = async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/products/admin/all');
    return response.data;
};

export const createProduct = async (productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await api.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const toggleProductAvailability = async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.patch(`/products/${id}/toggle-availability`);
    return response.data;
};

// Orders API
export interface CreateOrderPayload {
    customerName: string;
    phone: string;
    address: string;
    items: Array<{
        productId: string;
        weight: string;
        quantity: number;
    }>;
    notes?: string;
}

export const createOrder = async (orderData: CreateOrderPayload): Promise<ApiResponse<Order>> => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const getOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

export const getOrdersByPhone = async (phone: string): Promise<ApiResponse<Order[]>> => {
    const response = await api.get(`/orders/track/${phone}`);
    return response.data;
};

export const getAllOrders = async (status?: string): Promise<ApiResponse<Order[]>> => {
    const params = status && status !== 'all' ? { status } : {};
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
};

export const getOrderStats = async (): Promise<ApiResponse<OrderStats>> => {
    const response = await api.get('/orders/admin/stats');
    return response.data;
};

// Auth API
export const login = async (email: string, password: string): Promise<ApiResponse<User>> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
}): Promise<ApiResponse<User>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const getMe = async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const updateProfile = async (profileData: {
    name: string;
    phone: string;
    address?: string;
}): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
};

