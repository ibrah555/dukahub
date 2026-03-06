# DukaHub — Kenyan E-Commerce Platform 🛒🇰🇪

A full-stack e-commerce web application for the Kenyan market, built with **Next.js**, **Express**, **MongoDB**, and **TailwindCSS**.

## Features

### Customer
- 🏠 Homepage with featured products, deals, categories
- 🔍 Product search, filtering, and sorting
- 🛒 Shopping cart with localStorage persistence
- 💳 Multi-step checkout (M-Pesa, Card, Cash on Delivery)
- 👤 User registration, login, and account management
- 📦 Order tracking with status timeline
- ⭐ Product reviews and ratings
- ❤️ Wishlist
- 🎟️ Discount codes
- 📍 All 47 Kenyan counties for delivery

### Admin Dashboard
- 📊 Analytics: revenue charts, top products, order status breakdown
- 📦 Product CRUD with image upload
- 🏷️ Category management
- 📋 Order management with status updates
- 👥 Customer management with purchase history
- 🎟️ Discount code management

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TailwindCSS 3, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Uploads | Multer (local storage) |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
node seed.js    # Populate database with sample data
node server.js  # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:3000
```

### 3. Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dukahub.co.ke | admin123 |
| Customer | jane@example.com | password123 |

## Project Structure
```
dukahub/
├── backend/
│   ├── config/db.js
│   ├── middleware/   (auth, upload, errorHandler)
│   ├── models/       (User, Product, Category, Order, Review, DiscountCode)
│   ├── routes/       (auth, products, categories, orders, users, reviews, payments, discounts, analytics)
│   ├── seed.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── app/      (pages: home, products, cart, checkout, login, register, account, admin/*)
│       ├── components/ (Navbar, Footer, ProductCard, DashboardCharts)
│       ├── context/  (AuthContext, CartContext)
│       └── lib/      (api helpers, constants)
└── README.md
```

## M-Pesa Integration
The M-Pesa endpoints are **stubs** ready for Safaricom Daraja API integration. Replace the stub in `backend/routes/payments.js` with real API calls.

## License
MIT
