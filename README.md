# Yoiwa Shops 🇬🇭

**Asankrangwa's very own online marketplace — shop local, shop smart!**

Yoiwa Shops is a full-stack e-commerce platform built specifically for the Asankrangwa community in the Ahafo region of Ghana. It allows local sellers to list products, customers to shop online, riders to deliver orders, and admins to manage the entire platform.

---

## 🌍 About

Yoiwa Shops was built to bring e-commerce to Asankrangwa — a community in Ghana where online shopping wasn't previously accessible. The platform is designed around local needs:
- **Mobile Money payments** (MTN, Vodafone, AirtelTigo)
- **Pin drop delivery** with real-time location detection
- **Rider delivery system** with Google Maps/Waze navigation
- **Google Sign In** for easy authentication
- **Product image upload** via Cloudinary
- **Ghanaian branding** (green and gold — Ghana flag colors)

---

## 🛠 Tech Stack

### Frontend
- **React** + **Vite** — UI framework
- **Leaflet / React-Leaflet** — Interactive maps for delivery location
- **Axios** — API communication
- **@react-oauth/google** — Google Sign In
- **Inline styles** — Custom Ghanaian-themed styling

### Backend
- **Node.js** + **Express** — Server framework
- **MongoDB** (local) + **Mongoose** — Database
- **JWT** — Authentication tokens
- **bcryptjs** — Password encryption
- **Cloudinary** + **Multer** — Image upload and storage
- **google-auth-library** — Google OAuth verification

---

## 👥 User Roles

| Role | Description | Access |
|------|-------------|--------|
| **Customer** | Browse and buy products | Homepage, Cart, Checkout, Orders |
| **Seller** | List and sell products | Seller Dashboard, Add Product |
| **Rider** | Deliver orders | Rider Dashboard with Maps |
| **Admin** | Manage entire platform | Admin Dashboard |

---

## 📱 Pages Built

### Customer Side
- **Homepage** — Product listing with search and category filter
- **Product Detail** — Full product info with quantity selector
- **Cart** — Real cart with add/remove/update quantity
- **Checkout** — Real-time location detection, pin drop map, Mobile Money payment
- **Order Confirmation** — Order summary after placement
- **Sign In** — Email/password + Google Sign In
- **Register** — Customer registration

### Seller Side
- **Seller Register** — Store name, description, category
- **Seller Sign In** — Dedicated seller login
- **Seller Dashboard** — Sales stats, recent orders, product management
- **Add Product** — Upload images, set price, stock, category

### Rider Side
- **Rider Register** — Vehicle type, license number
- **Rider Sign In** — Dedicated rider login
- **Rider Dashboard** — Enter Order ID to see delivery details, customer phone, Get Directions on Google Maps/Waze, Mark as Delivered

### Admin Side
- **Admin Dashboard** — Platform revenue, orders, sellers, customers overview

---

## ✅ Features Built

- ✅ User registration and login (email/password)
- ✅ Google Sign In
- ✅ Role-based navigation (customer, seller, rider, admin)
- ✅ Product listing from database
- ✅ Search functionality
- ✅ Category filter (Electronics, Fashion, Home, Beauty, Food, Agriculture, Services)
- ✅ Product detail page with quantity selector
- ✅ Real cart functionality with localStorage
- ✅ Cart count in navbar
- ✅ Checkout with real-time GPS location detection
- ✅ Pin drop map (OpenStreetMap/Leaflet) centered on Asankrangwa
- ✅ Mobile Money payment selection (MTN, Vodafone, AirtelTigo)
- ✅ Free delivery for orders over GH₵ 100
- ✅ Order placement and confirmation
- ✅ Rider dashboard with Google Maps/Waze directions
- ✅ Seller registration and dashboard
- ✅ Add product with image upload (Cloudinary)
- ✅ Rider registration flow
- ✅ Admin dashboard
- ✅ Logout with role-based redirect
- ✅ Persistent MongoDB database (local)
- ✅ Seeded default products on server start
- ✅ "Become a Rider" link in footer
- ✅ "Sell on Yoiwa" link in navbar

---

## 🚧 What's Still Needed

- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Render)
- [ ] Switch from local MongoDB to MongoDB Atlas (DNS issue in Ghana)
- [ ] Real Mobile Money payment integration (Paystack or Hubtel)
- [ ] SMS/email notifications for orders
- [ ] Seller order management (view and update order status)
- [ ] Product editing for sellers
- [ ] Customer order history page
- [ ] Reviews and ratings system
- [ ] Mobile app (React Native)

---

## 🎨 Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Header/Navbar | Dark | `#131921` |
| Primary Green | Ghana Green | `#006B3F` |
| Accent Gold | Ghana Gold | `#FCD116` |
| Background | Light Grey | `#EAEDED` |
| Search Bar | Dark Grey | `#232F3E` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local installation)
- Git

### Frontend Setup
```bash
# In root yoiwa_shops folder
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Environment Variables

**Backend `.env`:**