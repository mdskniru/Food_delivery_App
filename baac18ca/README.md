# Tripti — Food Delivery (React + Vite)

A frontend-only food delivery demo built for a college project. Uses **React (Vite)**, **Tailwind CSS**, **React Router**, **Context API** and **localStorage** as the mock database. No backend required.

## Setup

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

Build for production:

```bash
npm run build
npm run preview
```

## Demo accounts

| Role | Email | Password | Notes |
|---|---|---|---|
| Customer | demo@tripti.com | 123456 | Has one seeded "Placed" order |
| Restaurant (Spice Garden) | owner@tripti.com | 123456 | Has a seeded incoming order |
| Restaurant (Burger Hub) | owner2@tripti.com | 123456 | |
| Restaurant (Pizza Roma) | owner3@tripti.com | 123456 | |
| Restaurant (Sweet Tooth Cafe) | owner4@tripti.com | 123456 | Seeded as **Closed** |
| Rider | rider@tripti.com | 123456 | Bike |

You can also create fresh accounts from the sign up pages.

## Features

### Customer
- Browse all food without logging in, with search + category filter
- Food cards show image, name, price, restaurant name and Open/Closed badge
- "Add to Cart" is disabled for closed restaurants / unavailable dishes
- Cart persists in localStorage, supports quantity change and removal
- Checkout requires login (redirects back to checkout after login)
- Checkout collects name, phone, address and optional note — **Cash on Delivery only**
- Order confirmation page shows order ID and status
- "My Orders" (navbar dropdown) tracks Placed → Accepted → Ready for Pickup → Picked Up → On the Way → Delivered, or Rejected

### Restaurant owner
- Separate signup (owner name, restaurant name, phone, email, password, address, logo upload) and login
- Open/Closed toggle that updates the food list instantly
- Add/Edit food with name, description, price, category and a **device-uploaded image**
  - JPG/PNG/WEBP only, max 2MB, converted to a base64 data URL and stored in localStorage
- Menu list with availability toggle, edit and delete
- Incoming orders with customer details/items; Accept, Reject, and Mark Ready for Pickup

### Rider
- Separate signup (name, phone, email, password, vehicle type) and login
- Available orders (Ready for Pickup) with restaurant info, customer address, items and COD amount
- "Pick Up Order" assigns the order to that rider only
- Active delivery with status updates: Picked Up → On the Way → Delivered
- Delivery history after completion

## Order status flow

```
Placed → Accepted → Ready for Pickup → Picked Up → On the Way → Delivered
                 ↘ Rejected
```

Status changes are shared through the Orders context, so customer, restaurant and rider views stay in sync.

## Roles & protected routes

| Route | Access |
|---|---|
| `/` | Public |
| `/login`, `/signup` | Public (customer auth) |
| `/cart` | Public |
| `/checkout`, `/my-orders`, `/order-success/:id` | Customer only |
| `/restaurant/login`, `/restaurant/signup` | Public |
| `/restaurant/dashboard` | Restaurant owner only |
| `/rider/login`, `/rider/signup` | Public |
| `/rider/dashboard` | Rider only |

## Folder structure

```
src/
├── components/       Navbar, Footer, FoodCard, ProtectedRoute, StatusBadge, EmptyState, AuthLayout
├── context/          AuthContext, FoodsContext, CartContext, OrdersContext, ToastContext
├── pages/            Home, Login, Signup, Cart, Checkout, OrderSuccess, MyOrders,
│                     RestaurantLogin/Signup/Dashboard, RiderLogin/Signup/Dashboard
├── utils/            db.js (seed + storage helpers), constants.js, format.js, image.js, validate.js
├── App.jsx
├── main.jsx
└── index.css
```

## Notes

- This is a demo, so passwords are stored in plain text in localStorage. Do not use this auth approach in production.
- To reset all demo data, clear the `tripti_*` keys in your browser's localStorage and reload the page.
- Cart items must come from a single restaurant per order (the app prevents mixing restaurants).
