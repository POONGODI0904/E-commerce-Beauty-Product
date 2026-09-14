# ✨ ÉLORA BEAUTY — Luxury E-Commerce Platform

A complete, production-grade, full-stack luxury beauty and cosmetics e-commerce platform crafted with **React.js**, **Node.js / Express**, **MongoDB**, **JWT Authentication**, and modern responsive design aesthetics.

---

## 🌟 1. Project Overview & Features

**ÉLORA BEAUTY** is designed to deliver a high-fashion, sensory shopping experience with a soft rose gold & silk alabaster palette, Playfair/Outfit typography, micro-interactions, and real-time state synchronization.

### Key Highlights
- **Product Catalog**: 32+ rich, realistic beauty formulations across 6 categories (Skincare, Makeup, Haircare, Body Care, Fragrance, and Beauty Kits).
- **Search & Filter Engine**: Live debounced search suggestions, category filters, brand selectors, dynamic price range sliders, star rating filters, stock toggles, and sorting (Popularity, Price Low-High, Price High-Low, Newest, Rating).
- **Product Detail Experience**: Multi-image thumbnail gallery, dynamic stock status, quantity stepper, instant "Add to Bag" and "Buy Now", tabbed specifications (Description, Clean Ingredients, How to Use, Customer Reviews), and interactive 5-star review submissions.
- **Shopping Bag**: Quantity controls, free shipping threshold progress bar ($50 minimum), promotional coupon validation (`GLOW20` for 20% off, `BEAUTY10` for $10 off), tax calculations (8%), and localStorage persistence.
- **Multi-Step Checkout**:
  - Step 1: Delivery Address (Select saved address or add new)
  - Step 2: Order Summary & Coupon verification
  - Step 3: Payment Method (Cash on Delivery or Demo Card sandbox)
  - Step 4: Order Confirmation with celebratory confetti and tracking link
- **Live Order Tracking**: Interactive step-by-step progress timeline:
  `Order Placed` ➔ `Confirmed` ➔ `Processing` ➔ `Packed` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`
- **Customer Dashboard**: Overview KPI cards, profile editing, order history with live tracking links, and address book manager (Add, Delete, Set Default).
- **Dedicated Admin Portal**:
  - KPI Overview: Total Sales revenue, Total Orders, Total Products, Total Registered Users, and Low-Stock warnings (≤ 5 units).
  - Product Manager: Add, Edit, Delete formulations with instant MongoDB persistence that dynamically displays on the customer shop page.
  - Category Manager: Add/delete product categories.
  - Order Fulfillment Manager: Inspect orders and update status in real-time.
  - User Directory: Inspect accounts, order counts, and activate/deactivate status.
  - Coupon Manager: Create new discount codes with expiration and minimum order rules.
- **Demo Mode**: 1-click quick login buttons for both Demo Admin and Demo Customer on the authentication screen.

---

## 🛠️ 2. Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with Bearer token interceptor)
- **Icons**: Lucide React
- **Animations**: CSS3 Keyframes & Canvas Confetti
- **Styling**: Vanilla CSS with comprehensive design token variables and glassmorphic panels

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (REST API architecture, ES Modules)
- **Database**: MongoDB (Mongoose ODM) with resilient local/Atlas support and embedded fallback
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing (salt rounds: 10)
- **File Uploads**: Multer with disk storage into `backend/uploads/`
- **CORS & Logging**: `cors`, `morgan`

---

## 📁 3. Project Structure

```
d:\E-commerce\
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── QuickViewModal.jsx
│   │   │   ├── CountdownTimer.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── WishlistContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── UserDashboardPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── ContactPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── couponController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Coupon.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── adminRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seeder.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

---

## 🔑 4. Demo Accounts & Credentials

For instant evaluation without creating new accounts, use these pre-seeded accounts:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@elora.com` | `admin123` | Full Admin Dashboard, Inventory, Orders, Users, Products |
| **Customer** | `user@elora.com` | `user123` | Bag, Wishlist, Checkout, Orders, Profile, Addresses |

### Active Promotional Codes
- **`GLOW20`**: 20% discount on orders over $50 (max discount: $100)
- **`BEAUTY10`**: $10 flat discount on orders over $40
- **`WELCOME15`**: 15% discount on orders over $30

---

## 🚀 5. How to Run Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI in `backend/.env`)

### Step 1: Install Dependencies
Open terminal in the root directory `d:\E-commerce`:
```bash
# Install backend dependencies
cd d:\E-commerce\backend
npm install

# Install frontend dependencies
cd d:\E-commerce\frontend
npm install
```

### Step 2: Seed Database (32+ Luxury Formulations & Accounts)
From `backend/`:
```bash
cd d:\E-commerce\backend
npm run seed
```

### Step 3: Run Backend & Frontend Servers
In **Terminal 1** (Backend API server):
```bash
cd d:\E-commerce\backend
npm start
# API runs at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

In **Terminal 2** (Frontend Vite dev server):
```bash
cd d:\E-commerce\frontend
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 📡 6. REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user account.
- `POST /api/auth/login` — Sign in and retrieve JWT token.
- `GET /api/auth/profile` — Retrieve current user profile (Private).
- `PUT /api/auth/profile` — Update user profile details / password (Private).
- `POST /api/auth/addresses` — Add delivery address (Private).
- `PUT /api/auth/addresses/:id` — Update delivery address (Private).
- `DELETE /api/auth/addresses/:id` — Delete delivery address (Private).
- `POST /api/auth/wishlist/toggle` — Add / remove product from wishlist (Private).

### Products (`/api/products`)
- `GET /api/products` — Search, filter by category/brand/price/rating, sort, and paginate products.
- `GET /api/products/suggestions?q=keyword` — Fast live search suggestions.
- `GET /api/products/:id` — Single product details with related recommendations.
- `POST /api/products` — Create new formulation (Admin).
- `PUT /api/products/:id` — Update formulation specifications, price, stock (Admin).
- `DELETE /api/products/:id` — Remove formulation from catalog (Admin).

### Orders (`/api/orders`)
- `POST /api/orders` — Create new order and deduct stock (Private).
- `GET /api/orders/myorders` — Retrieve current client's order history (Private).
- `GET /api/orders/:id` — Order invoice and live tracking timeline (Private).
- `GET /api/orders` — Retrieve all orders with status filter (Admin).
- `PUT /api/orders/:id/status` — Update order fulfillment status (Admin).
- `PUT /api/orders/:id/cancel` — Cancel order prior to dispatch (Private).

### Categories (`/api/categories`)
- `GET /api/categories` — List all categories with live item counts.
- `POST /api/categories` — Add new category (Admin).
- `PUT /api/categories/:id` — Edit category (Admin).
- `DELETE /api/categories/:id` — Delete category (Admin).

### Coupons (`/api/coupons`)
- `POST /api/coupons/validate` — Validate promotional code against cart subtotal.
- `GET /api/coupons` — List all active coupons (Admin).
- `POST /api/coupons` — Create promotional coupon (Admin).
- `DELETE /api/coupons/:id` — Delete promotional coupon (Admin).

### Administration (`/api/admin`)
- `GET /api/admin/stats` — Revenue KPI totals, low-stock warnings, category share.
- `GET /api/admin/users` — Customer directory with order counts.
- `PUT /api/admin/users/:id/toggle-status` — Toggle customer active / suspended status.

---

## 🔒 7. Security Best Practices
- Passwords hashed with salt via `bcryptjs`
- Protected API endpoints using JWT Bearer authentication
- Role-based authorization guarding `/api/admin` and product mutations
- Environment secrets isolated in `.env`
- CORS configuration ensuring protected access
- Input sanitization and parameterized Mongoose queries
