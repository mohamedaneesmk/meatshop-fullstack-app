import React from 'react';
import type { OrderStatus } from '../../types';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<
    OrderStatus,
    { label: string; class: string; icon: string }
> = {
    pending: {
        label: 'Order Received',
        class: 'status-pending',
        icon: '📋',
    },
    cutting: {
        label: 'Preparing',
        class: 'status-cutting',
        icon: '🔪',
    },
    'out-for-delivery': {
        label: 'Out for Delivery',
        class: 'status-out-for-delivery',
        icon: '🚚',
    },
    delivered: {
        label: 'Delivered',
        class: 'status-delivered',
        icon: '✅',
    },
    cancelled: {
        label: 'Cancelled',
        class: 'status-cancelled',
        icon: '❌',
    },
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
    status,
    size = 'md',
}) => {
    const config = statusConfig[status];

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.class} ${sizeClasses[size]}`}
        >
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;
