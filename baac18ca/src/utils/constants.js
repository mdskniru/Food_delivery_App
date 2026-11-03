export const CATEGORIES = ['Pizza', 'Burger', 'Indian', 'Chinese', 'Sides', 'Dessert', 'Drinks'];

export const ORDER_STATUS = {
  PLACED: 'Placed',
  ACCEPTED: 'Accepted',
  READY: 'Ready for Pickup',
  PICKED_UP: 'Picked Up',
  ON_THE_WAY: 'On the Way',
  DELIVERED: 'Delivered',
  REJECTED: 'Rejected',
};

export const TRACK_STEPS = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.READY,
  ORDER_STATUS.PICKED_UP,
  ORDER_STATUS.ON_THE_WAY,
  ORDER_STATUS.DELIVERED,
];

export const STATUS_STYLES = {
  Placed: 'bg-amber-50 text-amber-700 ring-amber-200',
  Accepted: 'bg-sky-50 text-sky-700 ring-sky-200',
  'Ready for Pickup': 'bg-violet-50 text-violet-700 ring-violet-200',
  'Picked Up': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'On the Way': 'bg-blue-50 text-blue-700 ring-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export const DELIVERY_FEE = 50;
