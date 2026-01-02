# 🥩 FreshMeat - Premium Meat Shop E-commerce

A fully functional, production-ready meat shop e-commerce web application built with the MERN stack.

![FreshMeat](https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800)

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse fresh meat by category (Chicken, Mutton, Seafood, Eggs)
- **Dynamic Weight Selection**: Select weight variants with live price updates
- **Shopping Cart**: Add products with selected weights, modify quantities
- **Checkout**: Simple checkout with name, phone, and delivery address
- **Order Tracking**: Track orders by phone number or order ID
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Admin Features
- **Dashboard**: View order statistics, total revenue, and today's orders
- **Order Management**: Update order status with one click (Pending → Cutting → Out for Delivery → Delivered)
- **Inventory View**: See all products with their variants and stock levels
- **Protected Routes**: JWT-based authentication for admin access

### UI/UX
- **Dark & Light Theme**: Toggle between themes with system preference detection
- **Premium Design**: Glassmorphism, gradients, smooth animations
- **Butcher Shop Aesthetic**: Warm color palette with professional look

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS 4** with custom theme
- **React Router DOM** for routing
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Express.js** with TypeScript
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
meat-shop/
├── frontend/
│   ├── src/
│   │   ├── api/           # API client and services
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   ├── App.tsx        # Main app with routing
│   │   └── index.css      # Global styles
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routes
│   │   ├── server.ts      # Entry point
│   │   └── seed.ts        # Database seeder
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd meat-shop
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Edit .env file with your MongoDB URI
   cp .env.example .env
   ```

4. **Seed the Database**
   ```bash
   npm run seed
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

6. **Install Frontend Dependencies** (new terminal)
   ```bash
   cd frontend
   npm install
   ```

7. **Start Frontend Server**
   ```bash
   npm run dev
   ```

8. **Open in Browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🔐 Admin Access

After seeding the database, use these credentials:

- **Email**: `admin@meatshop.com`
- **Password**: `admin123`

Access admin dashboard at: `/admin/login`

## 📡 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:id` | Get order by ID |
| GET | `/api/orders/track/:phone` | Get orders by phone |
| GET | `/api/orders/admin/all` | Get all orders (Admin) |
| PATCH | `/api/orders/:id/status` | Update order status (Admin) |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

## 💰 Payment

This application supports **Cash on Delivery (COD)** only. No payment gateway integration is required.

## 📱 Order Status Flow

1. **Pending** - Order received
2. **Cutting** - Meat is being prepared
3. **Out for Delivery** - On the way
4. **Delivered** - Successfully delivered

## 🌙 Theme Support

The app supports both light and dark themes:
- Toggle using the sun/moon icon in the header
- System preference is detected on first visit
- Theme preference is saved in localStorage

## 🏗️ Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder
```

## 📄 License

MIT License - feel free to use for your own projects!

---

Built with ❤️ for meat shops everywhere.
