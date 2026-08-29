# BookCycle Backend Documentation 📚

BookCycle is an online second-hand book buying and selling portal. This directory contains the complete Express API backend codebase, database schemas, security middleware, and seeding utilities.

---

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB (Atlas) using Mongoose ODM
- **Security**: Helmet, CORS, Express Rate Limit
- **Uploads**: Multer + Cloudinary
- **Testing**: Jest + Supertest
- **Hashing/Auth**: bcrypt, jsonwebtoken

---

## 🔑 Environment Variables Configuration
Create a `.env` file in the `backend/` directory using these variables:

```env
PORT=5000
NODE_ENV=development

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookcycle?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_jwt_access_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Cross-Origin Sharing
CLIENT_URL=http://localhost:3000

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP Email Configuration (Optional - Phase 12 skip)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_username
EMAIL_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@bookcycle.com
```

---

## ⚙️ Setup & Installation

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and add your IP address (or `0.0.0.0/0` for broad development testing).
3. Create a database user in **Database Access** with read-write roles.
4. Retrieve the connection string, replace `<password>` with your user's password, and save to your `.env` as `MONGODB_URI`.

### 2. Cloudinary Setup
1. Create a free account on [Cloudinary](https://cloudinary.com).
2. Open your Cloudinary console dashboard.
3. Copy the **Cloud Name**, **API Key**, and **API Secret** values, saving them to your `.env` file under the corresponding keys.

### 3. Startup & Commands
Navigate to the `backend/` folder:

```bash
# Install dependencies
npm install

# Run database seed script (populates mock records)
npm run db:seed

# Run tests
npm test

# Start development mode (Nodemon)
npm run dev

# Start production server
npm start
```

---

## 👥 Development Demo Credentials
Seeding the database creates the following credentials for development and testing:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@bookcycle.com` | `adminpassword123` |
| **Seller** | `seller1@test.com` | `sellerpassword123` |
| **Buyer** | `buyer1@test.com` | `buyerpassword123` |

---

## 🚀 Centralized API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /register`: Registers buyer or seller user body: `{ name, email, mobile, password, role, shopName }`
- `POST /login`: Receives `{ email, password }`. Sets HTTP-only cookies.
- `POST /admin/login`: Admin login.
- `POST /refresh-token`: Rotates access/refresh tokens.
- `POST /logout`: Revokes sessions and clears cookies.
- `POST /change-password`: (Auth) Update password.
- `GET /me`: (Auth) Returns current authenticated user metadata.
- `POST /forgot-password`: Generates reset token.
- `POST /reset-password`: Resets password using token.
- `GET /verify-email?token=<token>`: Activates verification hash.

### 📖 Seller Catalog Management (`/api/seller`)
- `GET /profile`: Get seller profile.
- `PUT /profile`: Update profile info (accepts file `profileImage`).
- `POST /verify`: Submits seller shop details for admin review.
- `GET /books`: Lists books owned by seller.
- `POST /books`: Creates book listing (accepts array of `images`, max 5 files).
- `PUT /books/:id`: Modifies listing, resets status to pending review (accepts new `images` and body `deleteImages`).
- `DELETE /books/:id`: Removes listing and deletes images from Cloudinary.
- `POST /books/:id/resubmit`: Resubmits rejected listing.
- `GET /orders`: View received orders.
- `POST /orders/:id/confirm`: Confirm placing order.
- `POST /orders/:id/pack`: Mark order packed.
- `POST /orders/:id/ship`: Mark order shipped (body: `{ courierName, trackingNumber }`).
- `GET /analytics`: Fetch seller sales aggregation reports.

### 🔍 Public & Buyer Catalog (`/api/books`)
- `GET /`: Search and browse listings with query filters (`search`, `category`, `genre`, `minPrice`, `maxPrice`, `sortBy`, `page`, `limit`).
- `GET /:id`: Details of approved listings (optionally pushes to buyer history stack).
- `GET /wishlist`: (Auth Buyer) Fetch wishlist.
- `POST /:id/wishlist`: (Auth Buyer) Toggle wishlist item status.
- `GET /recent`: (Auth Buyer) Fetch 10 most recently viewed books.

### 🛒 Shopping Cart (`/api/cart`)
- `GET /`: Fetch cart items and recalculated server totals.
- `POST /`: Add book (body: `{ bookId, quantity }`).
- `PUT /items/:bookId`: Update quantity (body: `{ quantity }`).
- `DELETE /items/:bookId`: Remove item.

### 📦 Orders & Transactions (`/api/orders`)
- `POST /checkout`: Create orders grouped by seller (body: `{ paymentMethod, paymentDetails, shippingAddress }`).
- `GET /`: List orders made by buyer.
- `GET /:id`: Order details.

### ⭐ Reviews (`/api/reviews`)
- `POST /`: Submit book review (body: `{ bookId, orderId, rating, comment }`). Restricts to delivered purchases.
- `GET /book/:bookId`: Public list of reviews.
- `POST /:id/moderate`: (Admin) Set status to `Approved` or `Flagged`.

### 🧠 Recommendations (`/api/recommendations`)
- `GET /`: Generate personalized listings using wishlist, browsing, and purchase history.

### 🛡️ Administrative Portal (`/api/admin`)
- `GET /stats`: Retrieve platform dashboard statistics.
- `POST /users/:id/status`: Modify status (body: `{ status: "blocked" | "active" }`).
- `POST /sellers/:id/verify`: Verify seller (body: `{ status: "approved" | "rejected" }`).
- `POST /books/:id/review`: Approve listing (body: `{ status: "approved" | "rejected", rejectionReason }`).
- `POST /categories`: Create category (body: `{ name, description, image }`).
- `PUT /categories/:id`: Modify category description/status.
- `DELETE /categories/:id`: Remove category.
- `GET /buyers`: Paginated list of buyers.
- `GET /sellers`: Paginated list of sellers.
- `GET /books`: Paginated list of listings.
- `GET /orders`: Paginated list of orders.
- `GET /transactions`: Paginated list of transactions.
- `GET /reviews`: Paginated list of reviews.
- `GET /reports`: Paginated list of reports.
- `GET /settings`: Read platform settings.
- `PUT /settings`: Modify platform fee/delivery configuration.

---

## 🔌 Frontend Integration Axios Example
Here is a recommended baseline Axios configuration to communicate with the backend:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Crucial to pass HTTP-only cookies
});

// Automatically append authorization bearer tokens if cookies are not used
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```
