/* Tripti — food delivery demo (vanilla HTML/CSS/JS, localStorage only) */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Keys, constants & seed data
   * ------------------------------------------------------------------ */

  var KEYS = {
    users: 'tripti_users',
    foods: 'tripti_foods',
    orders: 'tripti_orders',
    cart: 'tripti_cart',
    session: 'tripti_session'
  };

  var CATEGORIES = ['Pizza', 'Burger', 'Indian', 'Chinese', 'Sides', 'Dessert', 'Drinks'];

  var ORDER_STATUS = {
    PLACED: 'Placed',
    ACCEPTED: 'Accepted',
    READY: 'Ready for Pickup',
    PICKED_UP: 'Picked Up',
    ON_THE_WAY: 'On the Way',
    DELIVERED: 'Delivered',
    REJECTED: 'Rejected'
  };

  var TRACK_STEPS = [
    ORDER_STATUS.PLACED,
    ORDER_STATUS.ACCEPTED,
    ORDER_STATUS.READY,
    ORDER_STATUS.PICKED_UP,
    ORDER_STATUS.ON_THE_WAY,
    ORDER_STATUS.DELIVERED
  ];

  var DELIVERY_FEE = 50;
  var VEHICLES = ['Bike', 'Scooter', 'Bicycle', 'Car'];
  var ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  var MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  var FALLBACK_IMAGE =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#fff7ed"/><stop offset="1" stop-color="#fed7aa"/>' +
        '</linearGradient></defs>' +
        '<rect width="800" height="500" fill="url(#g)"/>' +
        '<text x="50%" y="50%" font-family="Arial, sans-serif" font-size="72" font-weight="bold" ' +
        'fill="#ea580c" text-anchor="middle" dominant-baseline="middle">Tripti</text></svg>'
    );

  var now = Date.now();

  var SEED_USERS = [
    {
      id: 'user_demo',
      role: 'customer',
      name: 'Aarav Shrestha',
      email: 'demo@tripti.com',
      password: '123456',
      phone: '9800000001',
      address: 'Baneshwor, Kathmandu'
    },
    {
      id: 'rest_spice',
      role: 'restaurant',
      name: 'Rahul Sharma',
      restaurantName: 'Spice Garden',
      email: 'owner@tripti.com',
      password: '123456',
      phone: '9800000011',
      address: '12 MG Road, Lazimpat, Kathmandu',
      logo: '',
      isOpen: true
    },
    {
      id: 'rest_burger',
      role: 'restaurant',
      name: 'Maya Gurung',
      restaurantName: 'Burger Hub',
      email: 'owner2@tripti.com',
      password: '123456',
      phone: '9800000012',
      address: '45 Jhamsikhel Road, Lalitpur',
      logo: '',
      isOpen: true
    },
    {
      id: 'rest_pizza',
      role: 'restaurant',
      name: 'Luca Romano',
      restaurantName: 'Pizza Roma',
      email: 'owner3@tripti.com',
      password: '123456',
      phone: '9800000013',
      address: '8 Durbar Marg, Kathmandu',
      logo: '',
      isOpen: true
    },
    {
      id: 'rest_sweet',
      role: 'restaurant',
      name: 'Nisha Thapa',
      restaurantName: 'Sweet Tooth Cafe',
      email: 'owner4@tripti.com',
      password: '123456',
      phone: '9800000014',
      address: '3 Pulchowk, Lalitpur',
      logo: '',
      isOpen: false
    },
    {
      id: 'rider_demo',
      role: 'rider',
      name: 'Suman Rai',
      email: 'rider@tripti.com',
      password: '123456',
      phone: '9800000002',
      vehicleType: 'Bike'
    }
  ];

  var SEED_FOODS = [
    {
      id: 'food_biryani',
      restaurantId: 'rest_spice',
      name: 'Chicken Biryani',
      category: 'Indian',
      price: 320,
      description: 'Fragrant basmati rice cooked with tender chicken and traditional spices.',
      image:
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_paneer',
      restaurantId: 'rest_spice',
      name: 'Paneer Butter Masala',
      category: 'Indian',
      price: 280,
      description: 'Creamy tomato gravy with soft paneer cubes. Served best with naan.',
      image:
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_momo',
      restaurantId: 'rest_spice',
      name: 'Steamed Veg Momo',
      category: 'Chinese',
      price: 180,
      description: 'Ten juicy vegetable dumplings steamed fresh, with spicy tomato chutney.',
      image:
        'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_cheeseburger',
      restaurantId: 'rest_burger',
      name: 'Classic Cheeseburger',
      category: 'Burger',
      price: 350,
      description: 'Beef patty, cheddar, lettuce, tomato and house sauce in a toasted bun.',
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_chickenburger',
      restaurantId: 'rest_burger',
      name: 'Crispy Chicken Burger',
      category: 'Burger',
      price: 380,
      description: 'Crunchy fried chicken with slaw and chipotle mayo.',
      image:
        'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_fries',
      restaurantId: 'rest_burger',
      name: 'Peri Peri Fries',
      category: 'Sides',
      price: 180,
      description: 'Crispy fries tossed in smoky peri peri seasoning.',
      image:
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_margherita',
      restaurantId: 'rest_pizza',
      name: 'Margherita Pizza',
      category: 'Pizza',
      price: 450,
      description: 'Wood-fired crust with tomato sauce, mozzarella and fresh basil.',
      image:
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_pepperoni',
      restaurantId: 'rest_pizza',
      name: 'Pepperoni Pizza',
      category: 'Pizza',
      price: 550,
      description: 'Loaded with spicy pepperoni and extra cheese. A crowd favourite.',
      image:
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_garlicbread',
      restaurantId: 'rest_pizza',
      name: 'Cheesy Garlic Bread',
      category: 'Sides',
      price: 200,
      description: 'Toasted baguette with garlic butter and melted mozzarella.',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_lavacake',
      restaurantId: 'rest_sweet',
      name: 'Chocolate Lava Cake',
      category: 'Dessert',
      price: 220,
      description: 'Warm chocolate cake with a gooey molten centre.',
      image:
        'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_cheesecake',
      restaurantId: 'rest_sweet',
      name: 'New York Cheesecake',
      category: 'Dessert',
      price: 250,
      description: 'Creamy baked cheesecake on a buttery biscuit base.',
      image:
        'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
      available: true
    },
    {
      id: 'food_latte',
      restaurantId: 'rest_sweet',
      name: 'Iced Latte',
      category: 'Drinks',
      price: 160,
      description: 'Chilled milk coffee brewed with locally roasted beans.',
      image:
        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
      available: true
    }
  ];

  var SEED_ORDERS = [
    {
      id: 'TRP-100001',
      customerId: 'user_demo',
      customerName: 'Aarav Shrestha',
      phone: '9800000001',
      address: 'Baneshwor, Kathmandu',
      note: 'Extra napkins please',
      restaurantId: 'rest_spice',
      restaurantName: 'Spice Garden',
      restaurantAddress: '12 MG Road, Lazimpat, Kathmandu',
      items: [
        { foodId: 'food_biryani', name: 'Chicken Biryani', price: 320, qty: 1 },
        { foodId: 'food_paneer', name: 'Paneer Butter Masala', price: 280, qty: 1 }
      ],
      subtotal: 600,
      deliveryFee: 50,
      total: 650,
      payment: 'COD',
      status: 'Placed',
      riderId: null,
      riderName: '',
      createdAt: new Date(now - 15 * 60 * 1000).toISOString()
    }
  ];

  var STATUS_CLASS = {
    Placed: 'status-placed',
    Accepted: 'status-accepted',
    'Ready for Pickup': 'status-ready',
    'Picked Up': 'status-picked',
    'On the Way': 'status-way',
    Delivered: 'status-delivered',
    Rejected: 'status-rejected'
  };

  /* ------------------------------------------------------------------ *
   * Storage helpers (with in-memory fallback)
   * ------------------------------------------------------------------ */

  var memory = Object.create(null);
  var memorySession = null;

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : fallback;
    }
  }

  function write(key, value) {
    memory[key] = value;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* storage may be unavailable — memory fallback keeps the demo working */
    }
  }

  function getSessionId() {
    try {
      return localStorage.getItem(KEYS.session);
    } catch (error) {
      return memorySession;
    }
  }

  function setSessionId(id) {
    memorySession = id;
    try {
      localStorage.setItem(KEYS.session, id);
    } catch (error) {
      /* ignore */
    }
  }

  function clearSessionId() {
    memorySession = null;
    try {
      localStorage.removeItem(KEYS.session);
    } catch (error) {
      /* ignore */
    }
  }

  function uid(prefix) {
    return (
      String(prefix || 'id') +
      '_' +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 7)
    );
  }

  function seedDatabase() {
    if (!localStorage.getItem(KEYS.users)) {
      try {
        localStorage.setItem(KEYS.users, JSON.stringify(SEED_USERS));
      } catch (error) {
        memory[KEYS.users] = SEED_USERS;
      }
    }
    if (!localStorage.getItem(KEYS.foods)) {
      try {
        localStorage.setItem(KEYS.foods, JSON.stringify(SEED_FOODS));
      } catch (error) {
        memory[KEYS.foods] = SEED_FOODS;
      }
    }
    if (!localStorage.getItem(KEYS.orders)) {
      try {
        localStorage.setItem(KEYS.orders, JSON.stringify(SEED_ORDERS));
      } catch (error) {
        memory[KEYS.orders] = SEED_ORDERS;
      }
    }
  }

  seedDatabase();

  /* ------------------------------------------------------------------ *
   * Small utilities
   * ------------------------------------------------------------------ */

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return escapeMap[ch];
    });
  }

  function money(amount) {
    return 'Rs ' + Number(amount || 0).toLocaleString('en-IN');
  }

  function formatDate(iso) {
    var date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isPhone(value) {
    return /^\d{7,15}$/.test(value.replace(/[\s-]/g, ''));
  }

  function validateAccount(form) {
    var errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!isEmail(form.email)) errors.email = 'Enter a valid email address';
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    else if (!isPhone(form.phone)) errors.phone = 'Enter a valid phone number';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  }

  function hasErrors(errors) {
    return Object.keys(errors).some(function (key) {
      return Boolean(errors[key]);
    });
  }

  function readImageFile(file) {
    return new Promise(function (resolve, reject) {
      if (!file) {
        reject(new Error('Please choose an image file'));
        return;
      }
      if (ALLOWED_IMAGE_TYPES.indexOf(file.type) === -1) {
        reject(new Error('Only JPG, PNG or WEBP images are allowed'));
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error('Image must be 2MB or smaller'));
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(new Error('Could not read that image'));
      };
      reader.readAsDataURL(file);
    });
  }

  function firstName(name) {
    return String(name || '').trim().split(/\s+/)[0] || 'there';
  }

  function initial(name) {
    return String(name || '?').trim().charAt(0).toUpperCase() || '?';
  }

  function statusBadge(status) {
    var cls = STATUS_CLASS[status] || 'status-default';
    return '<span class="status ' + cls + '">' + esc(status) + '</span>';
  }

  function imageTag(src, alt, className) {
    return (
      '<img src="' +
      esc(src || FALLBACK_IMAGE) +
      '" alt="' +
      esc(alt) +
      '" class="' +
      esc(className || '') +
      '" loading="lazy">'
    );
  }

  function emptyState(emoji, title, description, action) {
    return (
      '<div class="empty-state">' +
      '<span class="empty-emoji">' +
      emoji +
      '</span>' +
      '<h3 class="empty-title">' +
      esc(title) +
      '</h3>' +
      (description ? '<p class="empty-text">' + esc(description) + '</p>' : '') +
      (action ? '<div class="empty-action">' + action + '</div>' : '') +
      '</div>'
    );
  }

  function cartIcon() {
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h7.8a2 2 0 0 0 2-1.6L21 7H6"/>' +
      '<circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>'
    );
  }

  function searchIcon() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/>' +
      '<path d="m20 20-3.5-3.5"/></svg>'
    );
  }

  function menuIcon() {
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M4 7h16M4 12h16M4 17h16"/></svg>'
    );
  }

  function countBadge(count) {
    return count > 0 ? '<span class="count-badge">' + count + '</span>' : '';
  }

  /* ------------------------------------------------------------------ *
   * Data state & mutations
   * ------------------------------------------------------------------ */

  function loadState() {
    var users = read(KEYS.users, []);
    var foods = read(KEYS.foods, []);
    var orders = read(KEYS.orders, []);
    var rawCart = read(KEYS.cart, []);
    var sessionId = getSessionId();
    var currentUser = users.filter(function (user) {
      return user.id === sessionId;
    })[0] || null;

    if (sessionId && !currentUser) clearSessionId();

    var restaurants = users.filter(function (user) {
      return user.role === 'restaurant';
    });

    var restaurantMap = {};
    restaurants.forEach(function (restaurant) {
      restaurantMap[restaurant.id] = restaurant;
    });

    var cart = rawCart
      .map(function (item) {
        var food = foods.filter(function (entry) {
          return entry.id === item.foodId;
        })[0];
        return food ? { foodId: item.foodId, qty: item.qty, food: food } : null;
      })
      .filter(Boolean);

    var subtotal = cart.reduce(function (sum, item) {
      return sum + item.food.price * item.qty;
    }, 0);
    var count = cart.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
    var deliveryFee = cart.length ? DELIVERY_FEE : 0;

    return {
      users: users,
      foods: foods,
      orders: orders,
      restaurants: restaurants,
      restaurantMap: restaurantMap,
      currentUser: currentUser,
      cart: cart,
      count: count,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: subtotal + deliveryFee
    };
  }

  function signupUser(data) {
    var users = read(KEYS.users, []);
    var email = String(data.email || '').trim().toLowerCase();

    var exists = users.some(function (user) {
      return String(user.email).toLowerCase() === email;
    });
    if (exists) {
      return { ok: false, error: 'An account with this email already exists' };
    }

    var user = Object.assign(
      {
        id: uid(data.role),
        createdAt: new Date().toISOString()
      },
      data,
      { email: email }
    );
    if (data.role === 'restaurant') user.isOpen = true;

    write(KEYS.users, users.concat(user));
    setSessionId(user.id);
    return { ok: true, user: user };
  }

  function loginUser(email, password, role) {
    var users = read(KEYS.users, []);
    var normalized = String(email || '').trim().toLowerCase();
    var user = users.filter(function (entry) {
      return String(entry.email).toLowerCase() === normalized && entry.password === password;
    })[0];

    if (!user) return { ok: false, error: 'Incorrect email or password' };
    if (role && user.role !== role) {
      var label =
        user.role === 'restaurant' ? 'restaurant owner' : user.role === 'rider' ? 'rider' : 'customer';
      return { ok: false, error: 'This email belongs to a ' + label + ' account.' };
    }

    setSessionId(user.id);
    return { ok: true, user: user };
  }

  function logoutUser() {
    clearSessionId();
  }

  function updateCurrentUser(patch) {
    var users = read(KEYS.users, []);
    var id = getSessionId();
    var found = false;
    var next = users.map(function (user) {
      if (user.id === id) {
        found = true;
        return Object.assign({}, user, patch);
      }
      return user;
    });
    if (found) write(KEYS.users, next);
  }

  function addFoodItem(data) {
    var foods = read(KEYS.foods, []);
    var food = Object.assign({ id: uid('food'), available: true }, data);
    write(KEYS.foods, foods.concat(food));
    return food;
  }

  function updateFoodItem(id, patch) {
    var foods = read(KEYS.foods, []);
    write(
      KEYS.foods,
      foods.map(function (food) {
        return food.id === id ? Object.assign({}, food, patch) : food;
      })
    );
  }

  function deleteFoodItem(id) {
    var foods = read(KEYS.foods, []);
    write(
      KEYS.foods,
      foods.filter(function (food) {
        return food.id !== id;
      })
    );
  }

  function addToCart(foodId) {
    var state = loadState();
    var food = state.foods.filter(function (entry) {
      return entry.id === foodId;
    })[0];

    if (!food || !food.available) {
      return { ok: false, error: 'This item is currently unavailable' };
    }

    var restaurant = state.restaurantMap[food.restaurantId];
    if (!restaurant || !restaurant.isOpen) {
      return { ok: false, error: 'This restaurant is currently closed' };
    }

    var cartFood = state.cart[0] ? state.cart[0].food : null;
    if (cartFood && cartFood.restaurantId !== food.restaurantId) {
      return { ok: false, error: 'Your cart has items from another restaurant. Clear it first.' };
    }

    var raw = read(KEYS.cart, []);
    var exists = raw.some(function (item) {
      return item.foodId === foodId;
    });
    var next = exists
      ? raw.map(function (item) {
          return item.foodId === foodId ? { foodId: foodId, qty: item.qty + 1 } : item;
        })
      : raw.concat({ foodId: foodId, qty: 1 });

    write(KEYS.cart, next);
    return { ok: true };
  }

  function updateCartQty(foodId, delta) {
    var raw = read(KEYS.cart, []);
    var next = raw
      .map(function (item) {
        return item.foodId === foodId ? { foodId: foodId, qty: item.qty + delta } : item;
      })
      .filter(function (item) {
        return item.qty > 0;
      });
    write(KEYS.cart, next);
  }

  function removeCartItem(foodId) {
    var raw = read(KEYS.cart, []);
    write(
      KEYS.cart,
      raw.filter(function (item) {
        return item.foodId !== foodId;
      })
    );
  }

  function clearCart() {
    write(KEYS.cart, []);
  }

  function placeOrder(data) {
    var orders = read(KEYS.orders, []);
    var id;
    do {
      id = 'TRP-' + Math.floor(100000 + Math.random() * 900000);
    } while (
      orders.some(function (order) {
        return order.id === id;
      })
    );

    var order = Object.assign(
      {
        id: id,
        status: ORDER_STATUS.PLACED,
        payment: 'COD',
        riderId: null,
        riderName: '',
        createdAt: new Date().toISOString()
      },
      data
    );

    write(KEYS.orders, [order].concat(orders));
    return order;
  }

  function updateOrderStatus(orderId, status, extra) {
    var orders = read(KEYS.orders, []);
    var updated = null;
    var next = orders.map(function (order) {
      if (order.id !== orderId) return order;
      updated = Object.assign({}, order, extra || {}, {
        status: status,
        updatedAt: new Date().toISOString()
      });
      return updated;
    });
    write(KEYS.orders, next);
    return updated;
  }

  function roleHome(user) {
    if (!user) return '/';
    if (user.role === 'restaurant') return '/restaurant/dashboard';
    if (user.role === 'rider') return '/rider/dashboard';
    return '/';
  }

  function roleLabel(user) {
    if (!user) return '';
    if (user.role === 'restaurant') return 'Restaurant owner';
    if (user.role === 'rider') return 'Rider';
    return 'Customer';
  }

  /* ------------------------------------------------------------------ *
   * UI state
   * ------------------------------------------------------------------ */

  var searchTerm = '';
  var category = 'All';
  var homeLoading = true;
  var homeLoadTimer = null;
  var mobileMenuOpen = false;
  var restaurantTab = 'orders';
  var foodDraft = { name: '', description: '', price: '', category: CATEGORIES[0] };
  var foodPreview = '';
  var editingFoodId = null;
  var logoPreview = '';
  var lastRoute = null;
  var returnTo = null;

  function emptyFoodDraft() {
    foodDraft = { name: '', description: '', price: '', category: CATEGORIES[0] };
    foodPreview = '';
    editingFoodId = null;
    var input = document.querySelector('input[data-file="food-image"]');
    if (input) input.value = '';
  }

  /* ------------------------------------------------------------------ *
   * Toast
   * ------------------------------------------------------------------ */

  function toast(message, type) {
    var host = document.getElementById('toasts');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'success');
    el.textContent = message;
    host.appendChild(el);
    window.setTimeout(function () {
      el.classList.add('toast-out');
      window.setTimeout(function () {
        el.remove();
      }, 260);
    }, 2800);
  }

  /* ------------------------------------------------------------------ *
   * Routing
   * ------------------------------------------------------------------ */

  function currentPath() {
    var hash = String(location.hash || '').replace(/^#/, '');
    if (!hash) return '/';
    return hash.charAt(0) === '/' ? hash : '/' + hash;
  }

  function navigate(path, replace) {
    var target = '#' + (String(path).charAt(0) === '/' ? path : '/' + path);
    if (location.hash === target) {
      render();
      return;
    }
    if (replace) location.replace(target);
    else location.hash = target;
  }

  function guardRoute(route, state) {
    var user = state.currentUser;
    var isCustomerOnly =
      route === '/checkout' || route === '/my-orders' || route.indexOf('/order-success/') === 0;

    if (isCustomerOnly) {
      if (!user) {
        returnTo = route;
        return { redirect: '/login', message: 'Please log in to continue.' };
      }
      if (user.role !== 'customer') {
        return {
          redirect: roleHome(user),
          message: 'Please log in with a customer account to continue.'
        };
      }
    }

    if (route === '/restaurant/dashboard' && (!user || user.role !== 'restaurant')) {
      if (!user) returnTo = route;
      return {
        redirect: '/restaurant/login',
        message: user ? 'That page is for restaurant owners.' : 'Please log in as a restaurant owner.'
      };
    }

    if (route === '/rider/dashboard' && (!user || user.role !== 'rider')) {
      if (!user) returnTo = route;
      return {
        redirect: '/rider/login',
        message: user ? 'That page is for riders.' : 'Please log in as a rider.'
      };
    }

    return {};
  }

  function takeReturnTo(prefix) {
    var wanted = prefix || '/';
    var value = returnTo && returnTo.indexOf(wanted) === 0 ? returnTo : null;
    returnTo = null;
    return value;
  }

  function pageTitle(route) {
    if (route === '/') return 'Tripti — Food Delivery';
    if (route === '/cart') return 'Your cart — Tripti';
    if (route === '/checkout') return 'Checkout — Tripti';
    if (route === '/my-orders') return 'My Orders — Tripti';
    if (route.indexOf('/order-success/') === 0) return 'Order placed — Tripti';
    if (route === '/login') return 'Customer login — Tripti';
    if (route === '/signup') return 'Create account — Tripti';
    if (route === '/restaurant/login') return 'Restaurant login — Tripti';
    if (route === '/restaurant/signup') return 'Register restaurant — Tripti';
    if (route === '/restaurant/dashboard') return 'Restaurant dashboard — Tripti';
    if (route === '/rider/login') return 'Rider login — Tripti';
    if (route === '/rider/signup') return 'Become a rider — Tripti';
    if (route === '/rider/dashboard') return 'Rider dashboard — Tripti';
    return 'Page not found — Tripti';
  }

  function render() {
    var route = currentPath();
    var state = loadState();
    var guard = guardRoute(route, state);

    if (guard.redirect) {
      if (guard.message) toast(guard.message, 'error');
      navigate(guard.redirect, true);
      return;
    }

    if (route !== lastRoute) {
      if (homeLoadTimer) {
        window.clearTimeout(homeLoadTimer);
        homeLoadTimer = null;
      }
      if (route === '/') {
        searchTerm = '';
        category = 'All';
        homeLoading = true;
      }
      if (route === '/restaurant/signup') logoPreview = '';
      if (route === '/restaurant/dashboard') {
        restaurantTab = 'orders';
        emptyFoodDraft();
      }
      lastRoute = route;
    }

    mobileMenuOpen = false;
    renderHeader(state, route);
    renderPage(state, route);
    document.title = pageTitle(route);
  }

  function renderHeader(state, route) {
    var host = document.getElementById('site-header');
    if (!host) return;

    var user = state.currentUser;
    var count = state.count;
    var brand =
      '<a class="brand" href="#/" aria-label="Tripti home">' +
      '<span class="brand-mark">T</span><span class="brand-name">Tripti</span></a>';

    var cartLink =
      '<a class="nav-link' +
      (route === '/cart' ? ' active' : '') +
      '" href="#/cart">Cart ' +
      countBadge(count) +
      '</a>';

    var desktop;
    if (!user) {
      desktop =
        '<nav class="nav-desktop" aria-label="Main navigation">' +
        '<a class="nav-link' +
        (route === '/' ? ' active' : '') +
        '" href="#/">Menu</a>' +
        cartLink +
        '<details class="dropdown-wrap">' +
        '<summary class="nav-link">For Partners <span class="chevron">▼</span></summary>' +
        '<div class="dropdown"><p class="dropdown-label">Partner portals</p>' +
        '<a href="#/restaurant/login">Restaurant Owner</a><a href="#/rider/login">Rider</a></div>' +
        '</details>' +
        '<a class="btn btn-outline btn-sm" href="#/login">Login</a>' +
        '<a class="btn btn-primary btn-sm" href="#/signup">Sign Up</a>' +
        '</nav>';
    } else {
      var dash = user.role === 'restaurant' ? '/restaurant/dashboard' : '/rider/dashboard';
      var primary =
        user.role === 'customer'
          ? '<a class="nav-link' +
            (route === '/my-orders' ? ' active' : '') +
            '" href="#/my-orders">My Orders</a>'
          : '<a class="btn btn-soft btn-sm" href="#' + dash + '">Dashboard</a>';

      desktop =
        '<nav class="nav-desktop" aria-label="Main navigation">' +
        '<a class="nav-link' +
        (route === '/' ? ' active' : '') +
        '" href="#/">Menu</a>' +
        cartLink +
        primary +
        '<details class="dropdown-wrap user-menu">' +
        '<summary class="user-chip"><span class="avatar">' +
        esc(initial(user.name)) +
        '</span><span class="name">' +
        esc(user.name) +
        '</span><span class="chevron">▼</span></summary>' +
        '<div class="dropdown"><div class="dropdown-user"><strong>' +
        esc(user.name) +
        '</strong><span>' +
        esc(roleLabel(user)) +
        '</span></div><div class="divider"></div>' +
        (user.role === 'customer'
          ? '<a href="#/my-orders">My Orders</a>'
          : '<a href="#' + dash + '">Dashboard</a>') +
        '<div class="divider"></div>' +
        '<button type="button" class="danger" data-action="logout">Logout</button></div>' +
        '</details>' +
        '</nav>';
    }

    var mobileActions =
      '<div class="nav-mobile-actions">' +
      '<a class="icon-btn" href="#/cart" aria-label="Cart' +
      (count > 0 ? ', ' + count + ' items' : '') +
      '">' +
      cartIcon() +
      countBadge(count) +
      '</a>';

    if (user) {
      var profileHref = user.role === 'customer' ? '/my-orders' : dashFor(user);
      mobileActions +=
        '<a class="avatar-btn" href="#' +
        profileHref +
        '" aria-label="' +
        esc(user.name) +
        ' — open ' +
        (user.role === 'customer' ? 'My Orders' : 'dashboard') +
        '">' +
        esc(initial(user.name)) +
        '</a>';
    } else {
      mobileActions +=
        '<a class="btn btn-outline btn-xs" href="#/login">Login</a>' +
        '<a class="btn btn-primary btn-xs" href="#/signup">Sign Up</a>';
    }

    mobileActions +=
      '<button type="button" class="icon-btn menu-toggle" data-action="toggle-mobile-menu" ' +
      'aria-label="Toggle menu" aria-expanded="' +
      String(mobileMenuOpen) +
      '">' +
      menuIcon() +
      '</button></div>';

    var mobileMenu = '';
    if (mobileMenuOpen) {
      mobileMenu = '<div class="mobile-menu"><div class="container mobile-menu-inner">';
      if (user) {
        mobileMenu += '<p class="menu-label">Signed in as ' + esc(user.name) + '</p>';
      }
      mobileMenu +=
        '<a class="mobile-link" href="#/">Menu</a>' +
        '<a class="mobile-link" href="#/cart"><span>Cart</span>' +
        countBadge(count) +
        '</a>';
      if (user && user.role === 'customer') {
        mobileMenu += '<a class="mobile-link" href="#/my-orders">My Orders</a>';
      }
      if (user && user.role !== 'customer') {
        mobileMenu +=
          '<a class="mobile-link" href="#' + dashFor(user) + '">Dashboard</a>';
      }
      if (!user) {
        mobileMenu +=
          '<div class="divider"></div>' +
          '<p class="menu-label">Partner portals</p>' +
          '<a class="mobile-link" href="#/restaurant/login">Restaurant Owner Login</a>' +
          '<a class="mobile-link" href="#/rider/login">Rider Login</a>';
      } else {
        mobileMenu +=
          '<div class="divider"></div>' +
          '<button type="button" class="mobile-link" data-action="logout">Logout</button>';
      }
      mobileMenu += '</div></div>';
    }

    host.innerHTML =
      '<div class="container header-inner">' +
      brand +
      desktop +
      mobileActions +
      '</div>' +
      mobileMenu;
  }

  function dashFor(user) {
    return user.role === 'restaurant' ? '/restaurant/dashboard' : '/rider/dashboard';
  }

  function renderPage(state, route) {
    var app = document.getElementById('app');
    if (!app) return;
    var html = '';
    var id;

    if (route === '/') html = homePage(state);
    else if (route === '/cart') html = cartPage(state);
    else if (route === '/checkout') html = checkoutPage(state);
    else if (route === '/my-orders') html = myOrdersPage(state);
    else if (route.indexOf('/order-success/') === 0) {
      id = decodeURIComponent(route.slice('/order-success/'.length));
      html = orderSuccessPage(state, id);
    } else if (route === '/login') html = loginPage();
    else if (route === '/signup') html = signupPage();
    else if (route === '/restaurant/login') html = restaurantLoginPage();
    else if (route === '/restaurant/signup') html = restaurantSignupPage();
    else if (route === '/restaurant/dashboard') html = restaurantDashboardPage(state);
    else if (route === '/rider/login') html = riderLoginPage();
    else if (route === '/rider/signup') html = riderSignupPage();
    else if (route === '/rider/dashboard') html = riderDashboardPage(state);
    else {
      html =
        '<div class="container page">' +
        emptyState(
          '🧭',
          'Page not found',
          'The page you are looking for does not exist.',
          '<a class="btn btn-primary" href="#/">Back to menu</a>'
        ) +
        '</div>';
    }

    app.innerHTML = html;

    if (route === '/') {
      homeLoading = true;
      var loadingHost = document.getElementById('home-results');
      if (loadingHost) loadingHost.innerHTML = skeletonGrid();

      if (homeLoadTimer) window.clearTimeout(homeLoadTimer);
      homeLoadTimer = window.setTimeout(function () {
        if (currentPath() !== '/') return;
        homeLoading = false;
        refreshHomeResults();
      }, 450);
    }
  }

  /* ------------------------------------------------------------------ *
   * Page templates
   * ------------------------------------------------------------------ */

  function homePage(state) {
    var chips = ['All'].concat(CATEGORIES)
      .map(function (item) {
        var active = category === item;
        return (
          '<button type="button" class="chip' +
          (active ? ' active' : '') +
          '" data-action="filter-category" data-category="' +
          esc(item) +
          '" aria-pressed="' +
          String(active) +
          '">' +
          esc(item) +
          '</button>'
        );
      })
      .join('');

    return (
      '<section class="hero"><div class="container hero-inner">' +
      '<span class="hero-pill">🛵 Fast delivery · Cash on Delivery</span>' +
      '<h1>Hungry? <span class="brand-word">Tripti</span> it.</h1>' +
      '<p class="hero-lead">Order from your favourite local restaurants and pay cash when it arrives at your door.</p>' +
      '<div class="search-wrap">' +
      searchIcon() +
      '<input id="food-search" class="input search-input" type="search" ' +
      'placeholder="Search food or restaurant..." aria-label="Search food or restaurant" ' +
      'value="' +
      esc(searchTerm) +
      '">' +
      '</div></div></section>' +
      '<div class="container home-body">' +
      '<div class="category-row" id="category-row" role="group" aria-label="Food categories">' +
      chips +
      '</div>' +
      '<div id="home-results">' +
      (homeLoading ? skeletonGrid() : homeResults(state)) +
      '</div></div>'
    );
  }

  function skeletonGrid() {
    var cards = '';
    for (var i = 0; i < 8; i += 1) {
      cards +=
        '<div class="skeleton-card"><div class="skeleton thumb"></div><div class="lines">' +
        '<div class="skeleton line w-75"></div><div class="skeleton line w-50"></div>' +
        '<div class="skeleton line btn"></div></div></div>';
    }
    return '<div class="food-grid" aria-hidden="true">' + cards + '</div>';
  }

  function homeResults(state) {
    var term = searchTerm.trim().toLowerCase();
    var filtered = state.foods.filter(function (food) {
      var restaurant = state.restaurantMap[food.restaurantId];
      var matchesSearch =
        !term ||
        food.name.toLowerCase().indexOf(term) !== -1 ||
        String((restaurant && restaurant.restaurantName) || '')
          .toLowerCase()
          .indexOf(term) !== -1;
      var matchesCategory = category === 'All' || food.category === category;
      return matchesSearch && matchesCategory;
    });

    var openCount = state.restaurants.filter(function (restaurant) {
      return restaurant.isOpen;
    }).length;

    var head =
      '<div class="results-head"><h2 class="results-title">' +
      esc(category === 'All' ? 'All food' : category) +
      '</h2><p class="results-meta">' +
      filtered.length +
      ' items · ' +
      openCount +
      ' restaurants open</p></div>';

    if (!filtered.length) {
      return (
        head +
        '<div class="mt-16">' +
        emptyState(
          '🔍',
          'No food found',
          'Try a different search term or category.',
          '<button type="button" class="btn btn-primary" data-action="clear-filters">Clear filters</button>'
        ) +
        '</div>'
      );
    }

    return (
      head +
      '<div class="food-grid">' +
      filtered
        .map(function (food) {
          return foodCard(food, state.restaurantMap[food.restaurantId]);
        })
        .join('') +
      '</div>'
    );
  }

  function foodCard(food, restaurant) {
    var isOpen = Boolean(restaurant && restaurant.isOpen);
    var canOrder = isOpen && food.available;
    var label = !isOpen ? 'Closed' : !food.available ? 'Unavailable' : 'Add to Cart';

    return (
      '<article class="food-card">' +
      '<div class="food-media">' +
      imageTag(food.image, food.name, '') +
      '<span class="media-badge left ' +
      (isOpen ? 'open-badge' : 'closed-badge') +
      '">' +
      (isOpen ? 'Open' : 'Closed') +
      '</span>' +
      '<span class="media-badge right">' +
      esc(food.category) +
      '</span></div>' +
      '<div class="food-body"><div><h3 class="food-title">' +
      esc(food.name) +
      '</h3><p class="food-restaurant">' +
      esc((restaurant && restaurant.restaurantName) || 'Restaurant') +
      '</p></div>' +
      '<div class="food-bottom"><span class="price">' +
      money(food.price) +
      '</span><button type="button" class="btn btn-primary btn-sm" data-action="add-to-cart" ' +
      'data-id="' +
      esc(food.id) +
      '"' +
      (canOrder ? '' : ' disabled') +
      ' aria-label="' +
      esc(label + ': ' + food.name) +
      '">' +
      esc(label) +
      '</button></div></div></article>'
    );
  }

  function refreshHomeResults() {
    var state = loadState();
    var host = document.getElementById('home-results');
    if (!host) return;
    host.innerHTML = homeResults(state);

    var row = document.getElementById('category-row');
    if (row) {
      Array.prototype.forEach.call(row.querySelectorAll('.chip'), function (chip) {
        var active = chip.getAttribute('data-category') === category;
        chip.classList.toggle('active', active);
        chip.setAttribute('aria-pressed', String(active));
      });
    }
  }

  function cartPage(state) {
    if (!state.cart.length) {
      return (
        '<div class="container page"><h1 class="page-title">Your cart</h1>' +
        '<div class="mt-24">' +
        emptyState(
          '🛒',
          'Your cart is empty',
          'Add something delicious from the menu to get started.',
          '<a class="btn btn-primary" href="#/">Browse food</a>'
        ) +
        '</div></div>'
      );
    }

    var items = state.cart
      .map(function (item) {
        var food = item.food;
        return (
          '<div class="card cart-item">' +
          imageTag(food.image, food.name, 'cart-thumb') +
          '<div class="cart-info"><p class="cart-name">' +
          esc(food.name) +
          '</p><p class="cart-each">' +
          money(food.price) +
          ' each</p><button type="button" class="remove-btn" data-action="cart-remove" data-id="' +
          esc(food.id) +
          '">Remove</button></div>' +
          '<div class="cart-right"><div class="qty-box">' +
          '<button type="button" data-action="cart-decrease" data-id="' +
          esc(food.id) +
          '" aria-label="Decrease ' +
          esc(food.name) +
          ' quantity">−</button>' +
          '<span>' +
          item.qty +
          '</span>' +
          '<button type="button" data-action="cart-increase" data-id="' +
          esc(food.id) +
          '" aria-label="Increase ' +
          esc(food.name) +
          ' quantity">+</button></div>' +
          '<span class="line-total">' +
          money(food.price * item.qty) +
          '</span></div></div>'
        );
      })
      .join('');

    return (
      '<div class="container page"><h1 class="page-title">Your cart</h1>' +
      '<p class="page-subtitle">' +
      state.cart.length +
      ' item' +
      (state.cart.length > 1 ? 's' : '') +
      ' from one restaurant</p>' +
      '<div class="split-layout"><div class="stack">' +
      items +
      '</div><aside class="card card-pad"><h2 class="summary-title">Order summary</h2>' +
      '<div class="summary-rows">' +
      '<div class="summary-row"><span>Subtotal</span><span>' +
      money(state.subtotal) +
      '</span></div>' +
      '<div class="summary-row"><span>Delivery fee</span><span>' +
      money(state.deliveryFee) +
      '</span></div><div class="divider"></div>' +
      '<div class="summary-row total"><span>Total</span><span>' +
      money(state.total) +
      '</span></div></div>' +
      '<a class="btn btn-primary btn-block mt-16" href="#/checkout">Proceed to Checkout</a>' +
      (!state.currentUser
        ? '<p class="hint text-center mt-8">You will be asked to log in first.</p>'
        : '') +
      '<p class="cod-note">Cash on Delivery only</p>' +
      '<a class="continue-link" href="#/">Continue shopping</a></aside></div></div>'
    );
  }

  function checkoutPage(state) {
    if (!state.cart.length) {
      return (
        '<div class="container page"><h1 class="page-title">Checkout</h1>' +
        '<div class="mt-24">' +
        emptyState(
          '🛒',
          'Nothing to check out',
          'Your cart is empty. Add some food first.',
          '<a class="btn btn-primary" href="#/">Browse food</a>'
        ) +
        '</div></div>'
      );
    }

    var user = state.currentUser;
    var restaurant = state.restaurantMap[state.cart[0].food.restaurantId];
    var items = state.cart
      .map(function (item) {
        return (
          '<li><span>' +
          item.qty +
          ' × ' +
          esc(item.food.name) +
          '</span><span>' +
          money(item.food.price * item.qty) +
          '</span></li>'
        );
      })
      .join('');

    return (
      '<div class="container page"><div class="page-header"><div>' +
      '<h1 class="page-title">Checkout</h1><p class="page-subtitle">Ordering from ' +
      esc((restaurant && restaurant.restaurantName) || 'this restaurant') +
      '</p></div><a class="link small" href="#/cart">Edit cart</a></div>' +
      '<form class="split-layout" data-form="checkout" novalidate>' +
      '<div class="card card-pad"><h2 class="summary-title">Delivery details</h2>' +
      '<p class="form-error" data-error="form" hidden></p>' +
      '<div class="form-stack">' +
      '<div class="grid-2">' +
      checkoutField('name', 'Full name', 'text', user.name, 'Your name', 'name') +
      checkoutField('phone', 'Phone', 'tel', user.phone, '98XXXXXXXX', 'tel') +
      '</div>' +
      '<div class="field"><label class="label" for="checkout-address">Delivery address</label>' +
      '<textarea class="input" id="checkout-address" name="address" rows="3" ' +
      'placeholder="House, street, area, city">' +
      esc(user.address) +
      '</textarea><p class="field-error" data-error="address"></p></div>' +
      '<div class="field"><label class="label" for="checkout-note">Delivery note ' +
      '<span class="optional">(optional)</span></label>' +
      '<textarea class="input" id="checkout-note" name="note" rows="2" ' +
      'placeholder="Landmark, gate colour, extra napkins..."></textarea></div>' +
      '<div><p class="label">Payment method</p>' +
      '<div class="payment-box"><input type="radio" checked aria-label="Cash on Delivery">' +
      '<div><strong>Cash on Delivery (COD)</strong>' +
      '<span>Pay ' +
      money(state.total) +
      ' in cash when your order arrives.</span></div></div></div></div></div>' +
      '<aside class="card card-pad"><h2 class="summary-title">Your order</h2>' +
      '<ul class="order-items">' +
      items +
      '</ul><div class="divider"></div><div class="summary-rows">' +
      '<div class="summary-row"><span>Subtotal</span><span>' +
      money(state.subtotal) +
      '</span></div><div class="summary-row"><span>Delivery fee</span><span>' +
      money(state.deliveryFee) +
      '</span></div><div class="summary-row total"><span>Total</span><span>' +
      money(state.total) +
      '</span></div></div>' +
      '<button type="submit" class="btn btn-primary btn-block mt-16">Place Order · ' +
      money(state.total) +
      '</button><p class="hint text-center mt-8">No online payment required.</p>' +
      '</aside></form></div>'
    );
  }

  function checkoutField(name, label, type, value, placeholder, autocomplete) {
    return (
      '<div class="field"><label class="label" for="checkout-' +
      name +
      '">' +
      label +
      '</label><input class="input" id="checkout-' +
      name +
      '" name="' +
      name +
      '" type="' +
      type +
      '" autocomplete="' +
      autocomplete +
      '" placeholder="' +
      placeholder +
      '" value="' +
      esc(value || '') +
      '"><p class="field-error" data-error="' +
      name +
      '"></p></div>'
    );
  }

  function myOrdersPage(state) {
    var orders = state.orders
      .filter(function (order) {
        return order.customerId === state.currentUser.id;
      })
      .sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    var header =
      '<div class="page-header"><div><h1 class="page-title">My Orders</h1>' +
      '<p class="page-subtitle">Track your order from kitchen to doorstep.</p></div>' +
      '<a class="btn btn-primary btn-sm" href="#/">Order food</a></div>';

    if (!orders.length) {
      return (
        '<div class="container page">' +
        header +
        '<div class="mt-24">' +
        emptyState(
          '🍔',
          'No orders yet',
          'When you place an order it will appear here with live status updates.',
          '<a class="btn btn-primary" href="#/">Browse the menu</a>'
        ) +
        '</div></div>'
      );
    }

    var cards = orders
      .map(function (order) {
        var items = order.items
          .map(function (item) {
            return (
              '<li><span>' +
              item.qty +
              ' × ' +
              esc(item.name) +
              '</span><span>' +
              money(item.price * item.qty) +
              '</span></li>'
            );
          })
          .join('');

        return (
          '<article class="card order-card"><div class="order-top"><div>' +
          '<p class="order-name">' +
          esc(order.restaurantName) +
          '</p><p class="order-meta"><span class="mono">' +
          esc(order.id) +
          '</span> · ' +
          formatDate(order.createdAt) +
          '</p></div>' +
          statusBadge(order.status) +
          '</div><ul class="order-items">' +
          items +
          '</ul>' +
          '<div class="order-footer"><p class="order-address">Deliver to: ' +
          esc(order.address) +
          '</p><p class="order-total">' +
          money(order.total) +
          ' · COD</p></div>' +
          (order.riderName
            ? '<p class="order-rider">Rider: ' + esc(order.riderName) + '</p>'
            : '') +
          orderTracker(order.status) +
          '</article>'
        );
      })
      .join('');

    return (
      '<div class="container page">' +
      header +
      '<div class="stack mt-24">' +
      cards +
      '</div></div>'
    );
  }

  function orderTracker(status) {
    if (status === ORDER_STATUS.REJECTED) {
      return (
        '<p class="tracker-rejected">This order was rejected by the restaurant.</p>'
      );
    }

    var currentIndex = TRACK_STEPS.indexOf(status);
    var steps = TRACK_STEPS.map(function (step, index) {
      var done = index <= currentIndex;
      return (
        '<div class="tracker-step' +
        (done ? ' done' : '') +
        '"><span class="tracker-dot">' +
        (index + 1) +
        '</span><span class="tracker-label">' +
        esc(step) +
        '</span></div>'
      );
    }).join('');

    return '<div class="tracker"><div class="tracker-grid">' + steps + '</div></div>';
  }

  function orderSuccessPage(state, id) {
    var order = state.orders.filter(function (entry) {
      return entry.id === id && entry.customerId === state.currentUser.id;
    })[0];

    if (!order) {
      return (
        '<div class="container page">' +
        emptyState(
          '🧾',
          'Order not found',
          'We could not find that order in this browser.',
          '<a class="btn btn-primary" href="#/my-orders">Go to My Orders</a>'
        ) +
        '</div>'
      );
    }

    var items = order.items
      .map(function (item) {
        return (
          '<li><span>' +
          item.qty +
          ' × ' +
          esc(item.name) +
          '</span><span>' +
          money(item.price * item.qty) +
          '</span></li>'
        );
      })
      .join('');

    return (
      '<div class="container page"><div class="success-card">' +
      '<span class="success-icon">✓</span>' +
      '<h1 class="success-title">Order placed!</h1>' +
      '<p class="page-subtitle">' +
      esc(order.restaurantName) +
      ' will review your order shortly.</p>' +
      '<div class="mt-12"><span class="order-id-pill">' +
      esc(order.id) +
      '</span></div>' +
      '<div class="mt-8">' +
      statusBadge(order.status) +
      '</div>' +
      '<div class="success-details">' +
      '<div class="detail-row"><span>Placed on</span><span>' +
      formatDate(order.createdAt) +
      '</span></div>' +
      '<div class="detail-row"><span>Deliver to</span><span>' +
      esc(order.address) +
      '</span></div>' +
      '<div class="detail-row"><span>Phone</span><span>' +
      esc(order.phone) +
      '</span></div>' +
      (order.note
        ? '<div class="detail-row"><span>Note</span><span>' + esc(order.note) + '</span></div>'
        : '') +
      '</div>' +
      '<div class="success-summary"><h2 class="summary-title">Order summary</h2>' +
      '<ul class="order-items">' +
      items +
      '</ul><div class="divider"></div>' +
      '<div class="summary-row total"><span>Total (Cash on Delivery)</span><span>' +
      money(order.total) +
      '</span></div></div>' +
      '<div class="success-actions"><a class="btn btn-primary" href="#/my-orders">Track My Orders</a>' +
      '<a class="btn btn-outline" href="#/">Order more food</a></div>' +
      '</div></div>'
    );
  }

  function authLayout(options) {
    return (
      '<div class="container auth-wrap"><div class="auth-column"><div class="auth-card">' +
      (options.badge ? '<span class="auth-badge">' + esc(options.badge) + '</span>' : '') +
      '<h1>' +
      esc(options.title) +
      '</h1>' +
      (options.subtitle ? '<p class="auth-sub">' + esc(options.subtitle) + '</p>' : '') +
      '<div class="auth-form">' +
      options.body +
      '</div></div>' +
      (options.footer ? '<div class="auth-footer">' + options.footer + '</div>' : '') +
      '</div></div>'
    );
  }

  function loginPage() {
    return authLayout({
      badge: 'Customer',
      title: 'Welcome back',
      subtitle: 'Log in to order food and track your deliveries.',
      body:
        '<form data-form="customer-login" novalidate>' +
        '<p class="form-error" data-error="form" hidden></p>' +
        '<div class="field"><label class="label" for="login-email">Email</label>' +
        '<input class="input" id="login-email" name="email" type="email" autocomplete="email" ' +
        'placeholder="you@example.com"></div>' +
        '<div class="field"><label class="label" for="login-password">Password</label>' +
        '<input class="input" id="login-password" name="password" type="password" ' +
        'autocomplete="current-password" placeholder="••••••"></div>' +
        '<button class="btn btn-primary btn-block" type="submit">Login</button></form>' +
        '<div class="demo-box"><strong>Demo customer</strong><p>demo@tripti.com · 123456</p></div>' +
        '<div class="auth-alt"><a href="#/restaurant/login">Restaurant owner login</a>' +
        '<a href="#/rider/login">Rider login</a></div>',
      footer: 'New to Tripti? <a class="link" href="#/signup">Create an account</a>'
    });
  }

  function signupPage() {
    return authLayout({
      badge: 'Customer',
      title: 'Create your account',
      subtitle: 'Sign up to start ordering food in minutes.',
      body:
        '<form data-form="customer-signup" novalidate>' +
        '<div class="grid-2">' +
        '<div class="field"><label class="label" for="signup-name">Full name</label>' +
        '<input class="input" id="signup-name" name="name" autocomplete="name" ' +
        'placeholder="Aarav Shrestha"><p class="field-error" data-error="name"></p></div>' +
        '<div class="field"><label class="label" for="signup-phone">Phone</label>' +
        '<input class="input" id="signup-phone" name="phone" type="tel" autocomplete="tel" ' +
        'placeholder="98XXXXXXXX"><p class="field-error" data-error="phone"></p></div>' +
        '</div>' +
        '<div class="field"><label class="label" for="signup-email">Email</label>' +
        '<input class="input" id="signup-email" name="email" type="email" autocomplete="email" ' +
        'placeholder="you@example.com"><p class="field-error" data-error="email"></p></div>' +
        '<div class="field"><label class="label" for="signup-password">Password</label>' +
        '<input class="input" id="signup-password" name="password" type="password" ' +
        'autocomplete="new-password" placeholder="At least 6 characters">' +
        '<p class="field-error" data-error="password"></p></div>' +
        '<div class="field"><label class="label" for="signup-address">Delivery address</label>' +
        '<textarea class="input" id="signup-address" name="address" rows="2" ' +
        'placeholder="Street, area, city"></textarea><p class="field-error" data-error="address"></p></div>' +
        '<button class="btn btn-primary btn-block" type="submit">Create account</button></form>',
      footer: 'Already have an account? <a class="link" href="#/login">Login</a>'
    });
  }

  function restaurantLoginPage() {
    return authLayout({
      badge: 'Restaurant owner',
      title: 'Restaurant login',
      subtitle: 'Manage your menu and incoming orders.',
      body:
        '<form data-form="restaurant-login" novalidate>' +
        '<p class="form-error" data-error="form" hidden></p>' +
        '<div class="field"><label class="label" for="rest-email">Email</label>' +
        '<input class="input" id="rest-email" name="email" type="email" autocomplete="email" ' +
        'placeholder="owner@restaurant.com"></div>' +
        '<div class="field"><label class="label" for="rest-password">Password</label>' +
        '<input class="input" id="rest-password" name="password" type="password" ' +
        'autocomplete="current-password" placeholder="••••••"></div>' +
        '<button class="btn btn-primary btn-block" type="submit">Login to dashboard</button></form>' +
        '<div class="demo-box"><strong>Demo restaurant</strong>' +
        '<p>owner@tripti.com · 123456 (Spice Garden)</p>' +
        '<p>owner2@tripti.com · 123456 (Burger Hub)</p>' +
        '<p>owner4@tripti.com · 123456 (Sweet Tooth Cafe — closed)</p></div>' +
        '<div class="auth-alt"><a href="#/login">Customer login</a><a href="#/rider/login">Rider login</a></div>',
      footer:
        'New restaurant? <a class="link" href="#/restaurant/signup">Register here</a>'
    });
  }

  function restaurantSignupPage() {
    return authLayout({
      badge: 'Restaurant owner',
      title: 'Register your restaurant',
      subtitle: 'Join Tripti and start receiving orders from hungry customers.',
      body:
        '<form data-form="restaurant-signup" novalidate>' +
        '<div class="logo-row"><div class="logo-preview" id="logo-preview">' +
        (logoPreview ? imageTag(logoPreview, 'Restaurant logo preview', '') : 'Logo') +
        '</div><div><label class="btn btn-outline btn-sm" for="logo-input">Upload logo</label>' +
        '<input class="sr-only" id="logo-input" type="file" accept="image/jpeg,image/png,image/webp" ' +
        'data-file="logo"><p class="hint">JPG, PNG or WEBP · max 2MB</p>' +
        '<p class="field-error" data-error="logo"></p></div></div>' +
        '<div class="grid-2">' +
        '<div class="field"><label class="label" for="owner-name">Owner name</label>' +
        '<input class="input" id="owner-name" name="name"><p class="field-error" data-error="name"></p></div>' +
        '<div class="field"><label class="label" for="restaurant-name">Restaurant name</label>' +
        '<input class="input" id="restaurant-name" name="restaurantName">' +
        '<p class="field-error" data-error="restaurantName"></p></div></div>' +
        '<div class="grid-2">' +
        '<div class="field"><label class="label" for="owner-phone">Phone</label>' +
        '<input class="input" id="owner-phone" name="phone" type="tel">' +
        '<p class="field-error" data-error="phone"></p></div>' +
        '<div class="field"><label class="label" for="owner-email">Email</label>' +
        '<input class="input" id="owner-email" name="email" type="email">' +
        '<p class="field-error" data-error="email"></p></div></div>' +
        '<div class="field"><label class="label" for="owner-password">Password</label>' +
        '<input class="input" id="owner-password" name="password" type="password" ' +
        'placeholder="At least 6 characters"><p class="field-error" data-error="password"></p></div>' +
        '<div class="field"><label class="label" for="restaurant-address">Restaurant address</label>' +
        '<textarea class="input" id="restaurant-address" name="address" rows="2" ' +
        'placeholder="Street, area, city"></textarea><p class="field-error" data-error="address"></p></div>' +
        '<button class="btn btn-primary btn-block" type="submit">Create restaurant account</button></form>',
      footer:
        'Already registered? <a class="link" href="#/restaurant/login">Login</a>'
    });
  }

  function riderLoginPage() {
    return authLayout({
      badge: 'Rider',
      title: 'Rider login',
      subtitle: 'Pick up ready orders and manage your deliveries.',
      body:
        '<form data-form="rider-login" novalidate>' +
        '<p class="form-error" data-error="form" hidden></p>' +
        '<div class="field"><label class="label" for="rider-email">Email</label>' +
        '<input class="input" id="rider-email" name="email" type="email" autocomplete="email" ' +
        'placeholder="rider@example.com"></div>' +
        '<div class="field"><label class="label" for="rider-password">Password</label>' +
        '<input class="input" id="rider-password" name="password" type="password" ' +
        'autocomplete="current-password" placeholder="••••••"></div>' +
        '<button class="btn btn-primary btn-block" type="submit">Login to dashboard</button></form>' +
        '<div class="demo-box"><strong>Demo rider</strong><p>rider@tripti.com · 123456</p></div>' +
        '<div class="auth-alt"><a href="#/login">Customer login</a>' +
        '<a href="#/restaurant/login">Restaurant login</a></div>',
      footer:
        'Want to ride with us? <a class="link" href="#/rider/signup">Sign up as a rider</a>'
    });
  }

  function riderSignupPage() {
    var options = VEHICLES.map(function (vehicle) {
      return '<option value="' + esc(vehicle) + '">' + esc(vehicle) + '</option>';
    }).join('');

    return authLayout({
      badge: 'Rider',
      title: 'Become a Tripti rider',
      subtitle: 'Deliver food around the city and earn on every order.',
      body:
        '<form data-form="rider-signup" novalidate>' +
        '<div class="field"><label class="label" for="rider-name">Full name</label>' +
        '<input class="input" id="rider-name" name="name" autocomplete="name" ' +
        'placeholder="Your name"><p class="field-error" data-error="name"></p></div>' +
        '<div class="grid-2">' +
        '<div class="field"><label class="label" for="rider-phone">Phone</label>' +
        '<input class="input" id="rider-phone" name="phone" type="tel" autocomplete="tel" ' +
        'placeholder="98XXXXXXXX"><p class="field-error" data-error="phone"></p></div>' +
        '<div class="field"><label class="label" for="vehicle-type">Vehicle type</label>' +
        '<select class="input" id="vehicle-type" name="vehicleType">' +
        options +
        '</select><p class="field-error" data-error="vehicleType"></p></div></div>' +
        '<div class="field"><label class="label" for="rider-signup-email">Email</label>' +
        '<input class="input" id="rider-signup-email" name="email" type="email" ' +
        'autocomplete="email" placeholder="you@example.com">' +
        '<p class="field-error" data-error="email"></p></div>' +
        '<div class="field"><label class="label" for="rider-signup-password">Password</label>' +
        '<input class="input" id="rider-signup-password" name="password" type="password" ' +
        'autocomplete="new-password" placeholder="At least 6 characters">' +
        '<p class="field-error" data-error="password"></p></div>' +
        '<button class="btn btn-primary btn-block" type="submit">Create rider account</button></form>',
      footer:
        'Already a rider? <a class="link" href="#/rider/login">Login</a>'
    });
  }

  function restaurantDashboardPage(state) {
    var user = state.currentUser;
    var myFoods = state.foods.filter(function (food) {
      return food.restaurantId === user.id;
    });
    var myOrders = state.orders
      .filter(function (order) {
        return order.restaurantId === user.id;
      })
      .sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    var newOrders = myOrders.filter(function (order) {
      return order.status === ORDER_STATUS.PLACED;
    }).length;
    var delivered = myOrders.filter(function (order) {
      return order.status === ORDER_STATUS.DELIVERED;
    }).length;

    var tabs =
      '<div class="tabs" role="tablist" aria-label="Dashboard sections">' +
      '<button type="button" class="tab' +
      (restaurantTab === 'orders' ? ' active' : '') +
      '" data-action="restaurant-tab" data-tab="orders" role="tab" aria-selected="' +
      String(restaurantTab === 'orders') +
      '">Orders' +
      (newOrders > 0 ? '<span class="count-badge">' + newOrders + '</span>' : '') +
      '</button>' +
      '<button type="button" class="tab' +
      (restaurantTab === 'menu' ? ' active' : '') +
      '" data-action="restaurant-tab" data-tab="menu" role="tab" aria-selected="' +
      String(restaurantTab === 'menu') +
      '">Menu</button></div>';

    var body = restaurantTab === 'orders' ? restaurantOrders(myOrders) : restaurantMenu(myFoods);

    return (
      '<div class="container page"><div class="dash-head"><div class="dash-id">' +
      (user.logo
        ? '<div class="dash-logo">' + imageTag(user.logo, user.restaurantName, '') + '</div>'
        : '<div class="dash-logo">' + esc(initial(user.restaurantName)) + '</div>') +
      '<div><p class="eyebrow">Restaurant dashboard</p>' +
      '<h1 class="dash-title">' +
      esc(user.restaurantName) +
      '</h1><p class="dash-address">' +
      esc(user.address) +
      '</p></div></div>' +
      '<div class="status-switch"><span class="status-dot' +
      (user.isOpen ? ' on' : '') +
      '"></span><div><small>Store status</small><strong>' +
      (user.isOpen ? 'Open' : 'Closed') +
      '</strong></div>' +
      '<button type="button" class="switch' +
      (user.isOpen ? ' on' : '') +
      '" data-action="toggle-restaurant" aria-label="Toggle restaurant open or closed" ' +
      'aria-pressed="' +
      String(user.isOpen) +
      '"></button></div></div>' +
      '<div class="stats">' +
      statCard('New orders', newOrders) +
      statCard('Menu items', myFoods.length) +
      statCard('Delivered orders', delivered) +
      '</div>' +
      tabs +
      body +
      '</div>'
    );
  }

  function statCard(label, value) {
    return (
      '<div class="stat-card"><p class="stat-label">' +
      esc(label) +
      '</p><p class="stat-value">' +
      value +
      '</p></div>'
    );
  }

  function restaurantOrders(orders) {
    if (!orders.length) {
      return (
        '<div class="dash-section">' +
        emptyState(
          '🧾',
          'No orders yet',
          'New customer orders will show up here as soon as they are placed.'
        ) +
        '</div>'
      );
    }

    var cards = orders
      .map(function (order) {
        var items = order.items
          .map(function (item) {
            return (
              '<li><span>' +
              item.qty +
              ' × ' +
              esc(item.name) +
              '</span><span>' +
              money(item.price * item.qty) +
              '</span></li>'
            );
          })
          .join('');

        var actions = '';
        if (order.status === ORDER_STATUS.PLACED) {
          actions =
            '<div class="action-row">' +
            '<button type="button" class="btn btn-primary btn-sm" data-action="accept-order" ' +
            'data-id="' +
            esc(order.id) +
            '">Accept order</button>' +
            '<button type="button" class="btn btn-danger btn-sm" data-action="reject-order" ' +
            'data-id="' +
            esc(order.id) +
            '">Reject</button></div>';
        } else if (order.status === ORDER_STATUS.ACCEPTED) {
          actions =
            '<button type="button" class="btn btn-primary btn-sm btn-block mt-12" ' +
            'data-action="ready-order" data-id="' +
            esc(order.id) +
            '">Mark Ready for Pickup</button>';
        }

        return (
          '<article class="card order-card"><div class="order-top"><div>' +
          '<div class="order-meta"><span class="mono">' +
          esc(order.id) +
          '</span> ' +
          statusBadge(order.status) +
          '</div><p class="order-name mt-8">' +
          esc(order.customerName) +
          '</p><p class="order-meta">' +
          formatDate(order.createdAt) +
          '</p></div><div class="text-right"><p class="price-lg">' +
          money(order.total) +
          '</p><p class="order-meta" style="color:var(--brand-600);font-weight:700">COD</p></div></div>' +
          '<div class="info-grid"><p><b>Phone:</b> ' +
          esc(order.phone) +
          '</p><p><b>Address:</b> ' +
          esc(order.address) +
          '</p>' +
          (order.note ? '<p><b>Note:</b> ' + esc(order.note) + '</p>' : '') +
          '</div><ul class="order-items">' +
          items +
          '</ul>' +
          (order.riderName
            ? '<p class="order-rider">Rider: ' + esc(order.riderName) + '</p>'
            : '') +
          actions +
          '</article>'
        );
      })
      .join('');

    return '<div class="dash-section stack">' + cards + '</div>';
  }

  function restaurantMenu(foods) {
    var editing = Boolean(editingFoodId);
    var categoryOptions = CATEGORIES.map(function (item) {
      return (
        '<option value="' +
        esc(item) +
        '"' +
        (foodDraft.category === item ? ' selected' : '') +
        '>' +
        esc(item) +
        '</option>'
      );
    }).join('');

    var form =
      '<form class="card card-pad" data-form="food" id="food-form" novalidate>' +
      '<div class="page-header"><h2 class="summary-title">' +
      (editing ? 'Edit food item' : 'Add a food item') +
      '</h2>' +
      (editing
        ? '<button type="button" class="link-muted small" data-action="reset-food">Cancel</button>'
        : '') +
      '</div><div class="form-stack">' +
      '<div class="field"><label class="label" for="food-name">Food name</label>' +
      '<input class="input" id="food-name" name="name" value="' +
      esc(foodDraft.name) +
      '" placeholder="Chicken Biryani"><p class="field-error" data-error="name"></p></div>' +
      '<div class="field"><label class="label" for="food-description">Description</label>' +
      '<textarea class="input" id="food-description" name="description" rows="2" ' +
      'placeholder="Short description of the dish">' +
      esc(foodDraft.description) +
      '</textarea><p class="field-error" data-error="description"></p></div>' +
      '<div class="grid-2">' +
      '<div class="field"><label class="label" for="food-price">Price (Rs)</label>' +
      '<input class="input" id="food-price" name="price" type="number" min="1" value="' +
      esc(foodDraft.price) +
      '" placeholder="320"><p class="field-error" data-error="price"></p></div>' +
      '<div class="field"><label class="label" for="food-category">Category</label>' +
      '<select class="input" id="food-category" name="category">' +
      categoryOptions +
      '</select><p class="field-error" data-error="category"></p></div></div>' +
      '<div class="field"><span class="label">Food image</span>' +
      '<label class="upload-box"><span id="food-preview-slot" class="upload-slot">' +
      (foodPreview
        ? imageTag(foodPreview, 'Food preview', 'upload-preview')
        : '<span class="upload-placeholder"><span class="big">📷</span>' +
          'Upload an image from your device<span class="hint">JPG, PNG or WEBP · max 2MB</span></span>') +
      '</span><input class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" ' +
      'data-file="food-image"></label>' +
      '<p class="field-error" data-error="image"></p>' +
      '<div class="page-header mt-8"><p class="hint">Tap the image to change it.</p>' +
      (foodPreview
        ? '<button type="button" class="link-muted small" data-action="reset-food">Clear form</button>'
        : '') +
      '</div></div></div>' +
      '<button type="submit" class="btn btn-primary btn-block mt-16">' +
      (editing ? 'Save changes' : 'Add food item') +
      '</button></form>';

    var list;
    if (!foods.length) {
      list = emptyState(
        '🍳',
        'Your menu is empty',
        'Add your first dish using the form to start selling.'
      );
    } else {
      list = foods
        .map(function (food) {
          return (
            '<article class="menu-food">' +
            imageTag(food.image, food.name, '') +
            '<div class="menu-food-body"><div class="menu-food-top"><div style="min-width:0">' +
            '<h3 class="menu-food-name">' +
            esc(food.name) +
            '</h3><p class="menu-food-meta">' +
            esc(food.category) +
            ' · ' +
            money(food.price) +
            '</p></div><span class="availability ' +
            (food.available ? 'on' : 'off') +
            '">' +
            (food.available ? 'Available' : 'Unavailable') +
            '</span></div>' +
            '<p class="menu-food-desc">' +
            esc(food.description) +
            '</p>' +
            '<div class="menu-food-actions"><button type="button" class="mini-switch' +
            (food.available ? ' on' : '') +
            '" data-action="toggle-food" data-id="' +
            esc(food.id) +
            '" aria-label="Toggle availability for ' +
            esc(food.name) +
            '" aria-pressed="' +
            String(food.available) +
            '"></button>' +
            '<div class="action-row" style="margin-top:0"><button type="button" ' +
            'class="btn btn-outline btn-xs" data-action="edit-food" data-id="' +
            esc(food.id) +
            '">Edit</button><button type="button" class="btn btn-danger btn-xs" ' +
            'data-action="delete-food" data-id="' +
            esc(food.id) +
            '">Delete</button></div></div></div></article>'
          );
        })
        .join('');
    }

    return (
      '<div class="menu-layout">' +
      form +
      '<div><h2 class="summary-title">Your menu (' +
      foods.length +
      ')</h2><div class="menu-list">' +
      list +
      '</div></div></div>'
    );
  }

  function riderDashboardPage(state) {
    var user = state.currentUser;
    var available = state.orders
      .filter(function (order) {
        return order.status === ORDER_STATUS.READY && !order.riderId;
      })
      .sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

    var active = state.orders.filter(function (order) {
      return (
        order.riderId === user.id &&
        (order.status === ORDER_STATUS.PICKED_UP || order.status === ORDER_STATUS.ON_THE_WAY)
      );
    });

    var history = state.orders
      .filter(function (order) {
        return order.riderId === user.id && order.status === ORDER_STATUS.DELIVERED;
      })
      .sort(function (a, b) {
        return new Date(b.deliveredAt || b.updatedAt) - new Date(a.deliveredAt || a.updatedAt);
      });

    return (
      '<div class="container page"><div class="dash-head"><div>' +
      '<p class="eyebrow">Rider dashboard</p><h1 class="dash-title">Hey, ' +
      esc(firstName(user.name)) +
      '</h1><p class="dash-address">Vehicle: <b>' +
      esc(user.vehicleType) +
      '</b></p></div>' +
      '<span class="pill-open">Available for delivery</span></div>' +
      '<div class="stats">' +
      statCard('Ready for pickup', available.length) +
      statCard('Active deliveries', active.length) +
      statCard('Delivered by you', history.length) +
      '</div>' +
      '<section class="section-head"><h2 class="section-title">Available orders</h2>' +
      '<p class="section-sub">Orders marked ready by the restaurant.</p>' +
      (available.length
        ? '<div class="stack mt-12">' + available.map(riderAvailableCard).join('') + '</div>'
        : '<div class="mt-12">' +
          emptyState(
            '📦',
            'No orders ready right now',
            'Check back in a moment — new pickups appear here as restaurants mark orders ready.'
          ) +
          '</div>') +
      '</section>' +
      '<section class="section-head"><h2 class="section-title">My active delivery</h2>' +
      '<p class="section-sub">Update the status as you progress.</p>' +
      (active.length
        ? '<div class="stack mt-12">' + active.map(riderActiveCard).join('') + '</div>'
        : '<div class="mt-12">' +
          emptyState(
            '🛵',
            'No active delivery',
            'Pick up an available order to start delivering.'
          ) +
          '</div>') +
      '</section>' +
      '<section class="section-head"><h2 class="section-title">Delivery history</h2>' +
      (history.length
        ? '<div class="stack mt-12">' + history.map(riderHistoryRow).join('') + '</div>'
        : '<div class="mt-12">' +
          emptyState(
            '🕘',
            'No completed deliveries yet',
            'Delivered orders will appear here.'
          ) +
          '</div>') +
      '</section></div>'
    );
  }

  function riderAvailableCard(order) {
    var items = order.items
      .map(function (item) {
        return '<li>' + item.qty + ' × ' + esc(item.name) + '</li>';
      })
      .join('');

    return (
      '<article class="card order-card"><div class="order-top"><div>' +
      '<p class="pickup-label">Pickup</p><p class="order-name">' +
      esc(order.restaurantName) +
      '</p><p class="order-meta">' +
      esc(order.restaurantAddress) +
      '</p></div>' +
      statusBadge(order.status) +
      '</div><div class="rider-grid">' +
      '<div class="delivery-box"><strong>Deliver to · ' +
      esc(order.customerName) +
      '</strong><p>' +
      esc(order.address) +
      '</p><p>' +
      esc(order.phone) +
      '</p></div>' +
      '<div class="delivery-box"><strong>Items</strong><ul>' +
      items +
      '</ul></div></div>' +
      (order.note ? '<p class="order-rider">Note: ' + esc(order.note) + '</p>' : '') +
      '<div class="collect-row"><p>Collect COD <strong>' +
      money(order.total) +
      '</strong></p><button type="button" class="btn btn-primary btn-sm" ' +
      'data-action="pickup-order" data-id="' +
      esc(order.id) +
      '">Pick Up Order</button></div></article>'
    );
  }

  function riderActiveCard(order) {
    var items = order.items
      .map(function (item) {
        return (
          '<li><span>' +
          item.qty +
          ' × ' +
          esc(item.name) +
          '</span><span>' +
          money(item.price * item.qty) +
          '</span></li>'
        );
      })
      .join('');

    var nextLabel =
      order.status === ORDER_STATUS.PICKED_UP ? 'Mark On the Way' : 'Mark Delivered';

    return (
      '<article class="card order-card"><div class="order-top"><div>' +
      '<p class="order-meta mono">' +
      esc(order.id) +
      '</p><p class="order-name">' +
      esc(order.restaurantName) +
      ' → ' +
      esc(order.customerName) +
      '</p><p class="order-meta">' +
      esc(order.address) +
      '</p><p class="order-meta">' +
      esc(order.phone) +
      '</p></div>' +
      statusBadge(order.status) +
      '</div><ul class="order-items" style="padding:12px;background:var(--slate-50);border-radius:11px">' +
      items +
      '</ul><div class="collect-row"><p>Collect COD <strong>' +
      money(order.total) +
      '</strong></p><button type="button" class="btn btn-primary btn-sm" ' +
      'data-action="advance-order" data-id="' +
      esc(order.id) +
      '">' +
      nextLabel +
      '</button></div></article>'
    );
  }

  function riderHistoryRow(order) {
    return (
      '<div class="card history-row"><div><p class="order-meta mono">' +
      esc(order.id) +
      '</p><p class="history-title">' +
      esc(order.restaurantName) +
      ' → ' +
      esc(order.customerName) +
      '</p><p class="history-meta">Delivered ' +
      formatDate(order.deliveredAt || order.updatedAt) +
      '</p></div><div class="history-right"><span class="history-total">' +
      money(order.total) +
      '</span>' +
      statusBadge(order.status) +
      '</div></div>'
    );
  }

  /* ------------------------------------------------------------------ *
   * Form helpers
   * ------------------------------------------------------------------ */

  function fieldValue(form, name) {
    var field = form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  }

  function fieldRaw(form, name) {
    var field = form.elements.namedItem(name);
    return field ? String(field.value || '') : '';
  }

  function clearFormErrors(form) {
    Array.prototype.forEach.call(form.querySelectorAll('.field-error'), function (el) {
      el.textContent = '';
    });
    var banner = form.querySelector('[data-error="form"]');
    if (banner) {
      banner.textContent = '';
      banner.hidden = true;
    }
  }

  function setFieldError(form, field, message) {
    var el = form.querySelector('[data-error="' + field + '"]');
    if (el) el.textContent = message;
  }

  function showFormErrors(form, errors) {
    Object.keys(errors).forEach(function (field) {
      setFieldError(form, field, errors[field]);
    });
  }

  function showFormError(form, message) {
    var banner = form.querySelector('[data-error="form"]');
    if (banner) {
      banner.textContent = message;
      banner.hidden = false;
    } else {
      toast(message, 'error');
    }
  }

  /* ------------------------------------------------------------------ *
   * Event handlers
   * ------------------------------------------------------------------ */

  document.addEventListener('click', function (event) {
    var openMenus = document.querySelectorAll('details.dropdown-wrap[open]');
    Array.prototype.forEach.call(openMenus, function (menu) {
      if (!menu.contains(event.target)) menu.removeAttribute('open');
    });

    var el = event.target.closest('[data-action]');
    if (!el) return;

    var action = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');
    var state = loadState();

    if (action === 'toggle-mobile-menu') {
      mobileMenuOpen = !mobileMenuOpen;
      renderHeader(state, currentPath());
      return;
    }

    if (action === 'logout') {
      logoutUser();
      mobileMenuOpen = false;
      toast('You have been logged out', 'info');
      navigate('/');
      return;
    }

    if (action === 'add-to-cart') {
      var result = addToCart(id);
      if (!result.ok) {
        toast(result.error, 'error');
        return;
      }
      var food = state.foods.filter(function (entry) {
        return entry.id === id;
      })[0];
      toast((food ? food.name : 'Item') + ' added to cart');
      renderHeader(loadState(), currentPath());
      return;
    }

    if (action === 'cart-increase') {
      updateCartQty(id, 1);
      render();
      return;
    }

    if (action === 'cart-decrease') {
      updateCartQty(id, -1);
      render();
      return;
    }

    if (action === 'cart-remove') {
      removeCartItem(id);
      toast('Item removed from cart', 'info');
      render();
      return;
    }

    if (action === 'filter-category') {
      category = el.getAttribute('data-category') || 'All';
      refreshHomeResults();
      return;
    }

    if (action === 'clear-filters') {
      searchTerm = '';
      category = 'All';
      var search = document.getElementById('food-search');
      if (search) search.value = '';
      refreshHomeResults();
      return;
    }

    if (action === 'restaurant-tab') {
      restaurantTab = el.getAttribute('data-tab') === 'menu' ? 'menu' : 'orders';
      render();
      return;
    }

    if (action === 'toggle-restaurant') {
      if (!state.currentUser || state.currentUser.role !== 'restaurant') return;
      updateCurrentUser({ isOpen: !state.currentUser.isOpen });
      toast(
        state.currentUser.isOpen ? 'Restaurant is now closed' : 'Restaurant is now open',
        'info'
      );
      render();
      return;
    }

    if (action === 'accept-order' || action === 'reject-order' || action === 'ready-order') {
      if (!state.currentUser || state.currentUser.role !== 'restaurant') return;
      var order = state.orders.filter(function (entry) {
        return entry.id === id;
      })[0];
      if (!order || order.restaurantId !== state.currentUser.id) {
        toast('Order not found', 'error');
        return;
      }
      if (action === 'accept-order' && order.status === ORDER_STATUS.PLACED) {
        updateOrderStatus(id, ORDER_STATUS.ACCEPTED);
        toast('Order accepted');
      } else if (action === 'reject-order' && order.status === ORDER_STATUS.PLACED) {
        updateOrderStatus(id, ORDER_STATUS.REJECTED);
        toast('Order rejected', 'info');
      } else if (action === 'ready-order' && order.status === ORDER_STATUS.ACCEPTED) {
        updateOrderStatus(id, ORDER_STATUS.READY);
        toast('Order ready for pickup');
      }
      render();
      return;
    }

    if (action === 'pickup-order') {
      if (!state.currentUser || state.currentUser.role !== 'rider') return;
      var pickup = state.orders.filter(function (entry) {
        return entry.id === id;
      })[0];
      if (!pickup || pickup.status !== ORDER_STATUS.READY || pickup.riderId) {
        toast('This order is no longer available', 'error');
        render();
        return;
      }
      updateOrderStatus(id, ORDER_STATUS.PICKED_UP, {
        riderId: state.currentUser.id,
        riderName: state.currentUser.name,
        pickedUpAt: new Date().toISOString()
      });
      toast('Order picked up — head to the customer');
      render();
      return;
    }

    if (action === 'advance-order') {
      if (!state.currentUser || state.currentUser.role !== 'rider') return;
      var delivery = state.orders.filter(function (entry) {
        return entry.id === id;
      })[0];
      if (!delivery || delivery.riderId !== state.currentUser.id) {
        toast('Order not found', 'error');
        return;
      }
      if (delivery.status === ORDER_STATUS.PICKED_UP) {
        updateOrderStatus(id, ORDER_STATUS.ON_THE_WAY);
        toast('Marked as On the Way');
      } else if (delivery.status === ORDER_STATUS.ON_THE_WAY) {
        updateOrderStatus(id, ORDER_STATUS.DELIVERED, {
          deliveredAt: new Date().toISOString()
        });
        toast('Delivered! Collect ' + money(delivery.total) + ' cash');
      }
      render();
      return;
    }

    if (action === 'edit-food') {
      if (!state.currentUser || state.currentUser.role !== 'restaurant') return;
      var editFood = state.foods.filter(function (entry) {
        return entry.id === id && entry.restaurantId === state.currentUser.id;
      })[0];
      if (!editFood) {
        toast('Food item not found', 'error');
        return;
      }
      editingFoodId = editFood.id;
      foodDraft = {
        name: editFood.name,
        description: editFood.description,
        price: String(editFood.price),
        category: editFood.category
      };
      foodPreview = editFood.image;
      restaurantTab = 'menu';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (action === 'delete-food') {
      if (!state.currentUser || state.currentUser.role !== 'restaurant') return;
      var deleteFood = state.foods.filter(function (entry) {
        return entry.id === id && entry.restaurantId === state.currentUser.id;
      })[0];
      if (!deleteFood) return;
      if (!window.confirm('Delete "' + deleteFood.name + '" from your menu?')) return;
      deleteFoodItem(id);
      if (editingFoodId === id) emptyFoodDraft();
      toast('Food item deleted', 'info');
      render();
      return;
    }

    if (action === 'toggle-food') {
      if (!state.currentUser || state.currentUser.role !== 'restaurant') return;
      var toggleFood = state.foods.filter(function (entry) {
        return entry.id === id && entry.restaurantId === state.currentUser.id;
      })[0];
      if (!toggleFood) return;
      updateFoodItem(id, { available: !toggleFood.available });
      toast(
        toggleFood.available
          ? toggleFood.name + ' is now unavailable'
          : toggleFood.name + ' is available again',
        'info'
      );
      render();
      return;
    }

    if (action === 'reset-food') {
      emptyFoodDraft();
      render();
      return;
    }
  });

  document.addEventListener('submit', function (event) {
    var form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();

    var kind = form.getAttribute('data-form');
    clearFormErrors(form);

    if (kind === 'customer-login' || kind === 'restaurant-login' || kind === 'rider-login') {
      var email = fieldValue(form, 'email');
      var password = fieldRaw(form, 'password');
      if (!email || !password) {
        showFormError(form, 'Please enter your email and password');
        return;
      }
      var role =
        kind === 'restaurant-login' ? 'restaurant' : kind === 'rider-login' ? 'rider' : 'customer';
      var login = loginUser(email, password, role);
      if (!login.ok) {
        showFormError(form, login.error);
        return;
      }

      if (kind === 'customer-login') {
        toast('Welcome back, ' + firstName(login.user.name) + '!');
        navigate(takeReturnTo('/') || '/', true);
      } else if (kind === 'restaurant-login') {
        toast('Welcome back to your kitchen!');
        navigate(takeReturnTo('/restaurant/') || '/restaurant/dashboard', true);
      } else {
        toast('Welcome back, rider!');
        navigate(takeReturnTo('/rider/') || '/rider/dashboard', true);
      }
      return;
    }

    if (kind === 'customer-signup') {
      var customer = {
        name: fieldValue(form, 'name'),
        phone: fieldValue(form, 'phone'),
        email: fieldValue(form, 'email'),
        password: fieldRaw(form, 'password'),
        address: fieldValue(form, 'address')
      };
      var customerErrors = validateAccount(customer);
      if (!customer.address) customerErrors.address = 'Delivery address is required';
      if (hasErrors(customerErrors)) {
        showFormErrors(form, customerErrors);
        return;
      }
      var created = signupUser(Object.assign({}, customer, { role: 'customer' }));
      if (!created.ok) {
        setFieldError(form, 'email', created.error);
        return;
      }
      toast('Account created. Welcome to Tripti!');
      navigate('/');
      return;
    }

    if (kind === 'restaurant-signup') {
      var restaurant = {
        name: fieldValue(form, 'name'),
        restaurantName: fieldValue(form, 'restaurantName'),
        phone: fieldValue(form, 'phone'),
        email: fieldValue(form, 'email'),
        password: fieldRaw(form, 'password'),
        address: fieldValue(form, 'address'),
        logo: logoPreview
      };
      var restaurantErrors = validateAccount(restaurant);
      if (!restaurant.restaurantName) {
        restaurantErrors.restaurantName = 'Restaurant name is required';
      }
      if (!restaurant.address) {
        restaurantErrors.address = 'Restaurant address is required';
      }
      if (hasErrors(restaurantErrors)) {
        showFormErrors(form, restaurantErrors);
        return;
      }
      var createdRestaurant = signupUser(Object.assign({}, restaurant, { role: 'restaurant' }));
      if (!createdRestaurant.ok) {
        setFieldError(form, 'email', createdRestaurant.error);
        return;
      }
      toast('Restaurant account created!');
      navigate('/restaurant/dashboard');
      return;
    }

    if (kind === 'rider-signup') {
      var rider = {
        name: fieldValue(form, 'name'),
        phone: fieldValue(form, 'phone'),
        email: fieldValue(form, 'email'),
        password: fieldRaw(form, 'password'),
        vehicleType: fieldValue(form, 'vehicleType')
      };
      var riderErrors = validateAccount(rider);
      if (!rider.vehicleType) riderErrors.vehicleType = 'Choose a vehicle type';
      if (hasErrors(riderErrors)) {
        showFormErrors(form, riderErrors);
        return;
      }
      var createdRider = signupUser(Object.assign({}, rider, { role: 'rider' }));
      if (!createdRider.ok) {
        setFieldError(form, 'email', createdRider.error);
        return;
      }
      toast('Rider account created. Welcome aboard!');
      navigate('/rider/dashboard');
      return;
    }

    if (kind === 'checkout') {
      var state = loadState();
      if (!state.currentUser || state.currentUser.role !== 'customer') {
        toast('Please log in as a customer to place an order', 'error');
        navigate('/login');
        return;
      }
      if (!state.cart.length) {
        showFormError(form, 'Your cart is empty. Add some food first.');
        return;
      }

      var restaurant = state.restaurantMap[state.cart[0].food.restaurantId];
      var name = fieldValue(form, 'name');
      var phone = fieldValue(form, 'phone');
      var address = fieldValue(form, 'address');
      var note = fieldValue(form, 'note');
      var checkoutErrors = {};

      if (!name) checkoutErrors.name = 'Name is required';
      if (!phone) checkoutErrors.phone = 'Phone number is required';
      else if (!isPhone(phone)) checkoutErrors.phone = 'Enter a valid phone number';
      if (!address) checkoutErrors.address = 'Delivery address is required';
      if (!restaurant) checkoutErrors.form = 'This restaurant is no longer available';
      else if (!restaurant.isOpen) {
        checkoutErrors.form = 'This restaurant is currently closed. Try again later.';
      }

      showFormErrors(form, checkoutErrors);
      if (hasErrors(checkoutErrors)) return;

      var order = placeOrder({
        customerId: state.currentUser.id,
        customerName: name,
        phone: phone,
        address: address,
        note: note,
        restaurantId: restaurant.id,
        restaurantName: restaurant.restaurantName,
        restaurantAddress: restaurant.address,
        items: state.cart.map(function (item) {
          return {
            foodId: item.food.id,
            name: item.food.name,
            price: item.food.price,
            qty: item.qty
          };
        }),
        subtotal: state.subtotal,
        deliveryFee: state.deliveryFee,
        total: state.total
      });

      clearCart();
      toast('Order placed! Please pay cash on delivery.');
      navigate('/order-success/' + order.id);
      return;
    }

    if (kind === 'food') {
      var foodState = loadState();
      if (!foodState.currentUser || foodState.currentUser.role !== 'restaurant') return;

      var foodName = fieldValue(form, 'name');
      var description = fieldValue(form, 'description');
      var price = Number(fieldValue(form, 'price'));
      var foodCategory = fieldValue(form, 'category');
      var foodErrors = {};

      if (!foodName) foodErrors.name = 'Food name is required';
      if (!description) foodErrors.description = 'Description is required';
      if (!price || price <= 0) foodErrors.price = 'Enter a valid price';
      if (!foodCategory) foodErrors.category = 'Choose a category';
      if (!foodPreview) foodErrors.image = 'Upload a food image (JPG, PNG or WEBP)';

      if (hasErrors(foodErrors)) {
        showFormErrors(form, foodErrors);
        return;
      }

      var payload = {
        name: foodName,
        description: description,
        price: price,
        category: foodCategory,
        image: foodPreview
      };

      if (editingFoodId) {
        var owned = foodState.foods.some(function (entry) {
          return entry.id === editingFoodId && entry.restaurantId === foodState.currentUser.id;
        });
        if (!owned) {
          toast('Food item not found', 'error');
          return;
        }
        updateFoodItem(editingFoodId, payload);
        toast('Food item updated');
      } else {
        addFoodItem(Object.assign({}, payload, { restaurantId: foodState.currentUser.id }));
        toast('Food item added to your menu');
      }

      emptyFoodDraft();
      render();
    }
  });

  document.addEventListener('input', function (event) {
    if (event.target.id === 'food-search') {
      searchTerm = event.target.value;
      if (!homeLoading) refreshHomeResults();
      return;
    }

    if (event.target.closest('#food-form')) {
      var name = event.target.getAttribute('name');
      if (name) foodDraft[name] = event.target.value;
    }
  });

  document.addEventListener('change', function (event) {
    var input = event.target;

    if (input.matches('input[data-file="logo"]')) {
      var logoFile = input.files && input.files[0];
      if (!logoFile) return;
      var logoForm = input.closest('form');
      readImageFile(logoFile)
        .then(function (dataUrl) {
          logoPreview = dataUrl;
          var preview = document.getElementById('logo-preview');
          if (preview) {
            preview.innerHTML = imageTag(dataUrl, 'Restaurant logo preview', '');
          }
          if (logoForm) setFieldError(logoForm, 'logo', '');
        })
        .catch(function (error) {
          if (logoForm) setFieldError(logoForm, 'logo', error.message);
          input.value = '';
        });
      return;
    }

    if (input.matches('input[data-file="food-image"]')) {
      var foodFile = input.files && input.files[0];
      if (!foodFile) return;
      var foodForm = input.closest('form');
      readImageFile(foodFile)
        .then(function (dataUrl) {
          foodPreview = dataUrl;
          var slot = document.getElementById('food-preview-slot');
          if (slot) {
            slot.innerHTML = imageTag(dataUrl, 'Food preview', 'upload-preview');
          }
          if (foodForm) setFieldError(foodForm, 'image', '');
        })
        .catch(function (error) {
          if (foodForm) setFieldError(foodForm, 'image', error.message);
          toast(error.message, 'error');
          input.value = '';
        });
    }
  });

  document.addEventListener(
    'error',
    function (event) {
      var img = event.target;
      if (!img || img.tagName !== 'IMG' || img.getAttribute('data-fallback-applied')) return;
      img.setAttribute('data-fallback-applied', '1');
      img.src = FALLBACK_IMAGE;
    },
    true
  );

  window.addEventListener('hashchange', function () {
    window.scrollTo({ top: 0, behavior: 'auto' });
    render();
  });

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */

  if (!location.hash) {
    try {
      history.replaceState(null, '', '#/');
    } catch (error) {
      location.hash = '#/';
    }
  }

  render();
})();
