# ShopSphere 🛒
*(CodeAlpha Full Stack Development – Task 1: E-commerce Store)*

A full-stack e-commerce platform built with real-world engineering practices — not just a CRUD clone. Includes verified-purchase reviews with authenticity detection, explainable AI-driven recommendations, an admin management panel, and a complete order fulfillment workflow.

## 🚀 Features

### Core
- User registration & login with JWT authentication
- Browse, search, filter, and sort products
- Shopping cart with quantity management
- Checkout flow that creates real orders

### Advanced
- **Admin Dashboard** — add/edit/delete products (with real image uploads), manage all orders, update order status
- **Verified-Purchase Reviews** — only users who actually bought a product can review it; reviews are checked for authenticity by comparing sentiment against star rating (flags mismatches like a 5★ review with negative text)
- **Explainable Recommendations** — "Recommended for You" section shows real reasons (e.g., "Because you bought X"), based on actual purchase history rather than a black-box AI suggestion
- **Order Status Workflow** — orders move through Pending → Shipped → Delivered
- **Search, Filter & Sort** — search by name, filter by category, sort by price

## 🛠 Tech Stack
**Frontend:** React (Vite), React Router, Axios, Context API, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Authentication:** JWT, bcrypt
**Image Storage:** Cloudinary
**Other:** Sentiment analysis (review authenticity checks)

## 📂 Project Structure

CodeAlpha_Ecommerce/
├── client/ # React frontend
│ └── src/
│ ├── components/
│ ├── context/
│ └── pages/
└── server/ # Express backend
├── config/
├── middleware/
├── models/
└── routes/

## ⚙️ Setup Instructions

### Backend
```bash
cd server
npm install
```
Create a `.env` file in `server/` with:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Run the server:
```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 📌 Key API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get products (supports `?search=&category=&sort=`) |
| POST | /api/products | Create product (admin only) |
| PUT | /api/products/:id | Update product (admin only) |
| DELETE | /api/products/:id | Delete product (admin only) |
| POST | /api/users/register | Register a new user |
| POST | /api/users/login | Login user |
| POST | /api/orders | Place an order (protected) |
| GET | /api/orders/my-orders | Get logged-in user's orders |
| GET | /api/orders | Get all orders (admin only) |
| PUT | /api/orders/:id/status | Update order status (admin only) |
| GET | /api/reviews/:productId | Get reviews for a product |
| POST | /api/reviews | Post a review (verified-purchase only) |
| GET | /api/recommendations | Get personalized recommendations (protected) |
| POST | /api/upload | Upload product image to Cloudinary (admin only) |

## 🎓 Design Notes

This project goes beyond the basic task requirements by addressing real, research-backed problems in e-commerce:
- **Trust & fake reviews** — reviews are gated behind verified purchases and checked for sentiment/rating mismatches, addressing a well-documented issue in modern e-commerce platforms
- **Recommendation transparency** — recommendations always show *why* a product is suggested, rather than an opaque "AI recommends" black box

## 👤 Author
Kalpana — built as part of the CodeAlpha Full Stack Development Internship
