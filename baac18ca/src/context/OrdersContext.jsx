import { createContext, useContext, useState } from 'react';
import { KEYS, read, write } from '../utils/db';

const OrdersContext = createContext(null);
export const useOrders = () => useContext(OrdersContext);

const createOrderId = () => `TRP-${Math.floor(100000 + Math.random() * 900000)}`;

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => read(KEYS.orders, []));

  const persist = (next) => {
    setOrders(next);
    write(KEYS.orders, next);
  };

  const placeOrder = (data) => {
    const order = {
      id: createOrderId(),
      status: 'Placed',
      payment: 'COD',
      riderId: null,
      riderName: '',
      createdAt: new Date().toISOString(),
      ...data,
    };
    persist([order, ...orders]);
    return order;
  };

  const updateStatus = (orderId, status, extra = {}) => {
    persist(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status, ...extra, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, updateStatus }}>{children}</OrdersContext.Provider>
  );
}
