export const KEYS = {
  users: 'tripti_users',
  foods: 'tripti_foods',
  orders: 'tripti_orders',
  cart: 'tripti_cart',
  session: 'tripti_session',
};

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

const now = Date.now();

const seedUsers = [
  {
    id: 'user_demo',
    role: 'customer',
    name: 'Aarav Shrestha',
    email: 'demo@tripti.com',
    password: '123456',
    phone: '9800000001',
    address: 'Baneshwor, Kathmandu',
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: false,
  },
  {
    id: 'rider_demo',
    role: 'rider',
    name: 'Suman Rai',
    email: 'rider@tripti.com',
    password: '123456',
    phone: '9800000002',
    vehicleType: 'Bike',
  },
];

const seedFoods = [
  {
    id: 'food_biryani',
    restaurantId: 'rest_spice',
    name: 'Chicken Biryani',
    category: 'Indian',
    price: 320,
    description: 'Fragrant basmati rice cooked with tender chicken and traditional spices.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_paneer',
    restaurantId: 'rest_spice',
    name: 'Paneer Butter Masala',
    category: 'Indian',
    price: 280,
    description: 'Creamy tomato gravy with soft paneer cubes. Served best with naan.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_momo',
    restaurantId: 'rest_spice',
    name: 'Steamed Veg Momo',
    category: 'Chinese',
    price: 180,
    description: 'Ten juicy vegetable dumplings steamed fresh, with spicy tomato chutney.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_cheeseburger',
    restaurantId: 'rest_burger',
    name: 'Classic Cheeseburger',
    category: 'Burger',
    price: 350,
    description: 'Beef patty, cheddar, lettuce, tomato and house sauce in a toasted bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_chickenburger',
    restaurantId: 'rest_burger',
    name: 'Crispy Chicken Burger',
    category: 'Burger',
    price: 380,
    description: 'Crunchy fried chicken with slaw and chipotle mayo.',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_fries',
    restaurantId: 'rest_burger',
    name: 'Peri Peri Fries',
    category: 'Sides',
    price: 180,
    description: 'Crispy fries tossed in smoky peri peri seasoning.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_margherita',
    restaurantId: 'rest_pizza',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 450,
    description: 'Wood-fired crust with tomato sauce, mozzarella and fresh basil.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_pepperoni',
    restaurantId: 'rest_pizza',
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: 550,
    description: 'Loaded with spicy pepperoni and extra cheese. A crowd favourite.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_garlicbread',
    restaurantId: 'rest_pizza',
    name: 'Cheesy Garlic Bread',
    category: 'Sides',
    price: 200,
    description: 'Toasted baguette with garlic butter and melted mozzarella.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_lavacake',
    restaurantId: 'rest_sweet',
    name: 'Chocolate Lava Cake',
    category: 'Dessert',
    price: 220,
    description: 'Warm chocolate cake with a gooey molten centre.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_cheesecake',
    restaurantId: 'rest_sweet',
    name: 'New York Cheesecake',
    category: 'Dessert',
    price: 250,
    description: 'Creamy baked cheesecake on a buttery biscuit base.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: 'food_latte',
    restaurantId: 'rest_sweet',
    name: 'Iced Latte',
    category: 'Drinks',
    price: 160,
    description: 'Chilled milk coffee brewed with locally roasted beans.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
];

const seedOrders = [
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
      { foodId: 'food_paneer', name: 'Paneer Butter Masala', price: 280, qty: 1 },
    ],
    subtotal: 600,
    deliveryFee: 50,
    total: 650,
    payment: 'COD',
    status: 'Placed',
    riderId: null,
    riderName: '',
    createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
  },
];

export function seedDatabase() {
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, seedUsers);
  if (!localStorage.getItem(KEYS.foods)) write(KEYS.foods, seedFoods);
  if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, seedOrders);
}

seedDatabase();
