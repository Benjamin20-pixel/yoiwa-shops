# Yoiwa Shops 🇬🇭

Asankrangwa's very own online marketplace — shop local, shop smart!

## About
Yoiwa Shops is a full-stack e-commerce platform built for the Asankrangwa community in Ghana. It allows local sellers to list products and customers to shop online with Mobile Money payment and real-time location-based delivery.

## Tech Stack
- **Frontend:** React + Vite, inline styles
- **Backend:** Node.js + Express
- **Database:** MongoDB (mongodb-memory-server for development)
- **Maps:** Leaflet + OpenStreetMap
- **Auth:** JWT + bcryptjs

## Features Built
- Customer portal (browse, cart, checkout)
- Seller dashboard
- Rider dashboard with Google Maps/Waze directions
- Admin dashboard
- User registration and login
- Product listing from database
- Real-time location detection on checkout
- Mobile Money payment (MTN, Vodafone, AirtelTigo)
- Order placement and tracking
- Pin drop delivery location
- House description for delivery

## Pages
- Home — product listing
- Sign In / Register
- Cart
- Checkout — with map pin drop and real-time location
- Order Confirmation
- Seller Dashboard
- Rider Dashboard — enter Order ID to get delivery details and directions
- Admin Dashboard

## User Roles
- **Customer** — browse and buy products
- **Seller** — manage products and orders
- **Rider** — enter Order ID to see delivery details and get directions
- **Admin** — full platform control

## Getting Started

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## What's Still Needed
- Real cart functionality (add/remove items dynamically)
- Product detail page
- Seller registration flow
- Real Mobile Money payment integration (Paystack or Hubtel)
- Product image upload
- Search functionality
- SMS/email notifications
- Deploy frontend (Vercel) and backend (Render)
- Switch from mongodb-memory-server to MongoDB Atlas

## Color Scheme
- Dark header: #131921
- Green (Ghana): #006B3F
- Gold (Ghana): #FCD116
- Background: #EAEDED