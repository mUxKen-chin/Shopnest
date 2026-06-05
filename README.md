# ShopNest - Fashion E-Commerce Platform
### Built with MERN Stack (MongoDB, Express, React, Node.js)

---

## 🚀 How to Run (Step by Step)

### Prerequisites
Make sure you have installed:
- **Node.js** (https://nodejs.org) — download LTS version
- **MongoDB Community** (https://www.mongodb.com/try/download/community)
- **VS Code** (https://code.visualstudio.com)

---

### Step 1: Start MongoDB
- Open MongoDB Compass (installed with MongoDB) OR
- Open a terminal and run: `mongod`

---

### Step 2: Setup Backend

Open a terminal in the `shopnest/backend` folder:

```bash
npm install
npm run seed
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

The `npm run seed` command creates:
- 20 fashion products in the database
- Admin account: admin@shopnest.com / admin123
- Customer account: user@shopnest.com / user1234

---

### Step 3: Setup Frontend

Open a **new** terminal in the `shopnest/frontend` folder:

```bash
npm install
npm start
```

Browser will open automatically at **http://localhost:3000** 🎉

---

## 🔑 Login Credentials

| Role     | Email                 | Password  |
|----------|-----------------------|-----------|
| Admin    | admin@shopnest.com    | admin123  |
| Customer | user@shopnest.com     | user1234  |

---

## ✨ Features

### Customer Side
- 🏠 Beautiful homepage with hero, categories, featured & new arrivals
- 🛍️ Shop page with filters (category, gender, size, price range, search)
- 📦 Product detail page with size/color selection, reviews
- 🛒 Shopping cart (add, update quantity, remove)
- 💳 Checkout with shipping form (Cash on Delivery)
- 📋 Order history and order detail view
- 🔐 Register & Login with JWT authentication

### Admin Side
- 📊 Dashboard with revenue, orders, products, customers stats
- ➕ Add / Edit / Delete products
- 📦 Manage orders & update order status
- 👥 View & delete users

---

## 📁 Project Structure

```
shopnest/
├── backend/
│   ├── config/
│   │   └── seed.js          ← Seeds DB with products & users
│   ├── middleware/
│   │   └── auth.js          ← JWT auth middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── pages/
        │   ├── HomePage.js
        │   ├── ShopPage.js
        │   ├── ProductPage.js
        │   ├── CartPage.js
        │   ├── CheckoutPage.js
        │   ├── LoginPage.js
        │   ├── OrdersPage.js
        │   └── admin/
        │       ├── AdminDashboard.js
        │       ├── AdminProducts.js
        │       ├── AdminOrders.js
        │       └── AdminUsers.js
        └── components/
            ├── layout/ (Navbar, Footer)
            └── product/ (ProductCard)
```

---

## 🛠️ Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React (Create React App)      |
| Backend  | Node.js + Express             |
| Database | MongoDB + Mongoose            |
| Auth     | JWT (JSON Web Tokens)         |
| Styling  | Custom CSS (no UI library)    |

---

## API Endpoints

| Method | Endpoint                        | Description          |
|--------|---------------------------------|----------------------|
| POST   | /api/auth/register              | Register user        |
| POST   | /api/auth/login                 | Login                |
| GET    | /api/products                   | Get all products     |
| GET    | /api/products/:id               | Get single product   |
| POST   | /api/cart/add                   | Add to cart          |
| GET    | /api/cart                       | Get user cart        |
| POST   | /api/orders                     | Place order          |
| GET    | /api/orders/my                  | Get my orders        |
| GET    | /api/admin/stats                | Admin dashboard data |
| POST   | /api/admin/products             | Add product          |
| PUT    | /api/admin/products/:id         | Update product       |
| DELETE | /api/admin/products/:id         | Delete product       |

---

*ShopNest — Web Programming Semester Project*
