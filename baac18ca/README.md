# Tripti — Food Delivery Website

A frontend-only food delivery demo built for a college project. It uses plain **HTML, CSS and JavaScript** with **localStorage** as a mock database, so there is no backend and no build step.

## Run the project

Option 1 — simply open `index.html` in your browser.

Option 2 — serve it locally (recommended):

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

> The app uses hash URLs such as `index.html#/cart`, so it also works on GitHub Pages without any server configuration.

## Demo accounts

| Role | Email | Password | Notes |
|---|---|---|---|
| Customer | demo@tripti.com | 123456 | Has one seeded "Placed" order |
| Restaurant (Spice Garden) | owner@tripti.com | 123456 | Has a seeded incoming order |
| Restaurant (Burger Hub) | owner2@tripti.com | 123456 | |
| Restaurant (Pizza Roma) | owner3@tripti.com | 123456 | |
| Restaurant (Sweet Tooth Cafe) | owner4@tripti.com | 123456 | Seeded as **Closed** |
| Rider | rider@tripti.com | 123456 | Bike |

You can also create fresh accounts from the sign-up pages.

## Features

### Customer
- Browse all food without logging in, with search and category filter
- Food cards show image, name, price, restaurant name and Open/Closed badge
- "Add to Cart" is disabled for closed restaurants / unavailable dishes
- Cart persists in localStorage, supports quantity change and removal
- Checkout requires login (redirects back to checkout after login)
- Checkout collects name, phone, address and optional note — **Cash on Delivery only**
- Order confirmation page shows order ID and status
- "My Orders" tracks Placed → Accepted → Ready for Pickup → Picked Up → On the Way → Delivered, or Rejected

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

Status changes are shared through localStorage, so customer, restaurant and rider views stay in sync.

## Pages and access

| Page | Hash route | Access |
|---|---|---|
| Home / menu | `#/` | Public |
| Customer login / signup | `#/login`, `#/signup` | Public |
| Cart | `#/cart` | Public |
| Checkout, My Orders, Order success | `#/checkout`, `#/my-orders`, `#/order-success/:id` | Customer only |
| Restaurant login / signup | `#/restaurant/login`, `#/restaurant/signup` | Public |
| Restaurant dashboard | `#/restaurant/dashboard` | Restaurant owner only |
| Rider login / signup | `#/rider/login`, `#/rider/signup` | Public |
| Rider dashboard | `#/rider/dashboard` | Rider only |

## Project structure

```
index.html     Page shell, header/footer mount points
style.css      All styling (mobile-first, responsive)
app.js         Data, localStorage, hash router, pages and events
README.md      Setup and feature notes
```

Everything the site needs is in these files at the repository root.

## Upload to GitHub / GitHub Pages

1. Push this repository to GitHub (only the files above plus `.gitignore` and `README.md` are needed).
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder.
4. Save. GitHub will publish the site at `https://<username>.github.io/<repository>/`.

Because routing uses the URL hash, links work on GitHub Pages even when the repository is served from a subfolder.

## Notes

- This is a demo, so passwords are stored in plain text in localStorage. Do not use this auth approach in production.
- To reset all demo data, clear the `tripti_*` keys in your browser's localStorage and reload the page.
- Cart items must come from a single restaurant per order (the app prevents mixing restaurants).
- Food photos are loaded from Unsplash, so an internet connection is needed for the images.
