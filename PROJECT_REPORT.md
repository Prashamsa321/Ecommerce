# MeroGadget — E-Commerce Project Report

**Project Name:** MeroGadget  
**Type:** Full-Stack Electronics E-Commerce Web Application  
**Architecture:** MERN Stack (MongoDB, Express.js, React, Node.js)  
**Date:** June 2025  

---

## 1. Introduction

**MeroGadget** is a modern full-stack e-commerce platform focused on selling premium electronic products. The application provides a customer-facing storefront for browsing products, managing a shopping cart, and placing orders, along with a dedicated admin panel for managing products, users, orders, categories, and customer inquiries.

The project is built with a separated **Backend** (REST API) and **Frontend** (React SPA), each with its own environment configuration (`.env` files).

---

## 2. Project Objectives

- Build a responsive online electronics store with a premium dark-themed UI
- Provide secure user authentication with role-based access (User / Admin)
- Enable product catalog management with images, categories, and stock tracking
- Support shopping cart and order workflows
- Offer OTP-based email verification and password reset
- Provide an admin dashboard for full store management

---

## 3. Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite 4 | Build tool & dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Axios | HTTP API requests |
| React Hot Toast | Notifications |
| Lucide React / React Icons | Iconography |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js 5 | REST API framework |
| MongoDB | NoSQL database |
| Mongoose 9 | ODM for MongoDB |
| JWT | Authentication tokens |
| Bcrypt | Password hashing |
| Nodemailer | Email (OTP & password reset) |
| CORS | Cross-origin resource sharing |
| Dotenv | Environment variable management |

---

## 4. System Architecture

```
┌─────────────────┐         HTTP/REST          ┌─────────────────┐
│                 │  ◄──────────────────────►  │                 │
│  React Frontend │      localhost:3000        │  Express API    │
│  (Vite + React) │                            │  localhost:5000 │
│                 │                            │                 │
└─────────────────┘                            └────────┬────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │    MongoDB      │
                                               │  localhost:27017│
                                               └─────────────────┘
```

### Folder Structure

```
pp/
├── Backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── scripts/         # Seed & utility scripts
│   ├── services/        # Email service
│   ├── .env             # Backend environment variables
│   └── server.js        # Entry point
│
└── Frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # Auth, Cart, Toast state
    │   ├── hooks/       # Custom React hooks
    │   ├── pages/       # Route pages (user + admin)
    │   ├── services/    # API service layer
    │   └── utils/       # Helpers & constants
    ├── .env             # Frontend environment variables
    └── vite.config.js   # Dev server & API proxy
```

---

## 5. Features

### 5.1 Customer Features
- **Home Page** — Hero section, featured products, category highlights
- **Product Catalog** — Browse 100+ electronic products with images
- **Product Details** — Image gallery, price, stock, add to cart
- **Shopping Cart** — Add, increase, decrease, remove items
- **User Registration & Login** — JWT-based authentication
- **OTP Email Verification** — Secure account verification
- **Forgot Password** — Email-based password reset with OTP
- **User Profile** — View and edit profile information
- **Contact Page** — Submit inquiries to the store
- **About Page** — Company information and animated statistics

### 5.2 Admin Features
- **Admin Dashboard** — Overview of store activity
- **Product Management** — Create, edit, delete products with image URLs
- **Category Management** — Manage product categories with icons
- **Order Management** — View and manage customer orders
- **User Management** — Manage registered users
- **Contact Inquiries** — View customer messages
- **Admin Profile & Settings** — Admin account management

### 5.3 API Endpoints

| Module | Base Route | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Register, login, logout |
| Products | `/api/products` | CRUD operations |
| Cart | `/api/cart` | Cart management |
| Categories | `/api/categories` | Category CRUD |
| Orders | `/api/orders` | Order processing |
| Contact | `/api/contact` | Contact form submissions |
| OTP | `/api/otp` | OTP generation & verification |
| Password | `/api/password` | Password reset flow |

---

## 6. Database Models

| Model | Key Fields |
|-------|-----------|
| **User** | name, email, password (hashed), role (user/admin) |
| **Product** | name, description, price, category, images[], stock |
| **Category** | name, icon |
| **Cart** | user reference, product items with quantities |
| **Order** | user, products, total, status |
| **Contact** | name, email, message |
| **OTP** | email, code, expiry |

---

## 7. UI Theme & Color Palette

MeroGadget uses a **dark premium tech aesthetic** — deep navy backgrounds with vibrant orange call-to-action buttons and cyan accent highlights. The design conveys a modern, high-end electronics brand feel.

### 7.1 Primary Theme Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Dark Navy** | `#0A2540` | rgb(10, 37, 64) | Main page background, hero sections, input fields |
| **Deep Blue** | `#1E3A8A` | rgb(30, 58, 138) | Secondary background, borders, gradient backgrounds, blur orbs |
| **Slate Dark** | `#0F172A` | rgb(15, 23, 42) | Defined in theme config (dark surface variant) |
| **Card Dark** | `#111827` | rgb(17, 24, 39) | Product cards, form containers, modal backgrounds |

### 7.2 Accent & Action Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Vibrant Orange** | `#FF6200` | rgb(255, 98, 0) | Primary buttons, hover states, focus rings, brand accent |
| **Vibrant Orange Dark** | `#FF3D00` | rgb(255, 61, 0) | Button gradients (end color), text gradients |
| **Orange Hover** | `#E05500` | rgb(224, 85, 0) | Button hover state on primary CTAs |
| **Cyan Accent** | `#22D3EE` | rgb(34, 211, 238) | Links, badges, borders, admin panel accents, pulse indicators |

### 7.3 Text Colors

| Color | Usage |
|-------|-------|
| **White** (`#FFFFFF`) | Headings, primary text on dark backgrounds |
| **Gray 300** (`#D1D5DB`) | Body text, descriptions, secondary labels |
| **Gray 400** (`#9CA3AF`) | Placeholder text in form inputs |

### 7.4 Gradients Used

| Gradient | CSS Value | Usage |
|----------|-----------|-------|
| **Hero Title** | `from-[#FF6200] to-[#FF3D00]` | "Electronics" headline text |
| **Primary Button** | `from-[#FF6200] to-[#FF3D00]` | Sign up, login, submit buttons |
| **Page Background** | `from-[#0A2540] to-[#1E3A8A]` | Auth pages (login, register) |
| **Profile Header** | `from-[#0A2540] to-[#1E3A8A]` | Profile section headers |
| **Admin Button** | `linear-gradient(135deg, #1E3A8A, #22D3EE)` | Admin panel navigation button |

### 7.5 Visual Effects

- **Glass morphism** — `backdrop-blur-sm` with semi-transparent backgrounds (`bg-[#111827]/80`)
- **Glow orbs** — Blurred circular backgrounds in hero (`blur-[128px]`) using Deep Blue, Orange, and Cyan
- **Orange shadow** — `shadow-orange-500/30` on primary buttons for depth
- **Border hover** — Product cards transition from `#1E3A8A` to `#FF6200` on hover
- **Cyan pulse** — Animated ping indicator on "New Collection" badges

### 7.6 Color Palette Visual Reference

```
┌──────────────────────────────────────────────────────────────┐
│  BACKGROUNDS                                                 │
│  ████████  #0A2540  Dark Navy     (Primary Background)       │
│  ████████  #1E3A8A  Deep Blue     (Secondary / Borders)      │
│  ████████  #111827  Card Dark     (Cards / Forms)            │
│  ████████  #0F172A  Slate Dark    (Theme Variant)            │
├──────────────────────────────────────────────────────────────┤
│  ACCENTS                                                     │
│  ████████  #FF6200  Vibrant Orange  (Primary CTA)            │
│  ████████  #FF3D00  Orange Dark     (Gradient End)           │
│  ████████  #22D3EE  Cyan Accent     (Links / Badges)         │
├──────────────────────────────────────────────────────────────┤
│  TEXT                                                        │
│  ████████  #FFFFFF  White           (Headings)               │
│  ████████  #D1D5DB  Gray 300         (Body Text)             │
└──────────────────────────────────────────────────────────────┘
```

### 7.7 Tailwind Config (Theme Definition)

Defined in `Frontend/tailwind.config.js`:

```javascript
colors: {
  'dark-navy': '#0A2540',
  'deep-blue': '#1E3A8A',
  'slate-dark': '#0F172A',
  'vibrant-orange': '#FF6200',
  'vibrant-orange-dark': '#FF3D00',
  'cyan-accent': '#22D3EE',
}
```

---

## 8. Environment Configuration

### Backend (`.env`)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/test
JWT_SECRET=<secret>
FRONTEND_URL=http://localhost:3000
EMAIL_USER=<gmail>
EMAIL_PASS=<app_password>
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 9. How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### Start Backend
```bash
cd Backend
npm install
npm run dev
```
Server runs at: **http://localhost:5000**

### Start Frontend
```bash
cd Frontend
npm install
npm run dev
```
App runs at: **http://localhost:3000**

### Seed Sample Products
```bash
cd Backend
npm run seed:products
```
Seeds 100 electronic products with working product images.

---

## 10. Security Features

- Password hashing with Bcrypt
- JWT token-based authentication
- Role-based route protection (Admin vs User)
- CORS restricted to frontend origin
- OTP verification for registration and password reset
- Environment variables for sensitive credentials (not committed to Git)

---

## 11. Product Catalog

The store includes **100 electronic products** across categories:

| Category | Examples |
|----------|---------|
| Smartphones | iPhone, Samsung Galaxy, Google Pixel |
| Laptops | MacBook Pro, Dell XPS, HP Pavilion |
| Tablets | iPad Pro, Samsung Galaxy Tab |
| Headphones | Sony WH-1000XM5, AirPods Pro |
| Smart Watches | Apple Watch, Galaxy Watch |
| Cameras | Canon EOS, Sony Alpha |
| Gaming | PlayStation 5, Xbox Series X |
| Monitors | LG UltraWide, Samsung Odyssey |
| Audio | JBL, Bose speakers |
| Accessories | Chargers, cables, cases |

Product images are served from the DummyJSON CDN with real product-related photos.

---

## 12. Conclusion

MeroGadget is a complete full-stack e-commerce solution for electronics retail. It combines a visually striking dark-themed UI with a robust REST API backend, secure authentication, and comprehensive admin tools. The consistent color palette — navy blues, vibrant orange, and cyan accents — creates a cohesive premium brand identity suitable for a modern gadget store.

---

**Report Generated:** June 2025  
**Project Repository:** `pp/` (Backend + Frontend)
