import { useMemo } from 'react';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useToast } from '../context/ToastContext';
import { ORDER_STATUS } from '../utils/constants';
import { formatDate, money } from '../utils/format';

export default function RiderDashboard() {
  const { currentUser } = useAuth();
  const { orders, updateStatus } = useOrders();
  const toast = useToast();

  const available = useMemo(
    () =>
      orders
        .filter((order) => order.status === ORDER_STATUS.READY && !order.riderId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [orders]
  );

  const active = orders.filter(
    (order) =>
      order.riderId === currentUser.id &&
      [ORDER_STATUS.PICKED_UP, ORDER_STATUS.ON_THE_WAY].includes(order.status)
  );

  const history = orders
    .filter((order) => order.riderId === currentUser.id && order.status === ORDER_STATUS.DELIVERED)
    .sort((a, b) => new Date(b.deliveredAt || b.updatedAt) - new Date(a.deliveredAt || a.updatedAt));

  const pickUp = (order) => {
    updateStatus(order.id, ORDER_STATUS.PICKED_UP, {
      riderId: currentUser.id,
      riderName: currentUser.name,
      pickedUpAt: new Date().toISOString(),
    });
    toast('Order picked up — head to the customer');
  };

  const advance = (order) => {
    if (order.status === ORDER_STATUS.PICKED_UP) {
      updateStatus(order.id, ORDER_STATUS.ON_THE_WAY);
      toast('Marked as On the Way');
      return;
    }
    updateStatus(order.id, ORDER_STATUS.DELIVERED, { deliveredAt: new Date().toISOString() });
    toast(`Delivered! Collect ${money(order.total)} cash`);
  };

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Rider dashboard</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Hey, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-sm text-slate-500">
            Vehicle: <span className="font-medium text-slate-700">{currentUser.vehicleType}</span>
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          Available for delivery
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500">Ready for pickup</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{available.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500">Active deliveries</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{active.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500">Delivered by you</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{history.length}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-slate-900">Available orders</h2>
        <p className="mt-0.5 text-xs text-slate-500">Orders marked ready by the restaurant.</p>

        {available.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              emoji="📦"
              title="No orders ready right now"
              description="Check back in a moment — new pickups appear here as restaurants mark orders ready."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            {available.map((order) => (
              <div key={order.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">
                      Pickup
                    </p>
                    <p className="font-bold text-slate-900">{order.restaurantName}</p>
                    <p className="text-xs text-slate-500">{order.restaurantAddress}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3 text-xs">
                    <p className="font-semibold text-slate-700">
                      Deliver to · {order.customerName}
                    </p>
                    <p className="mt-1 text-slate-500">{order.address}</p>
                    <p className="mt-1 text-slate-500">{order.phone}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-xs">
                    <p className="font-semibold text-slate-700">Items</p>
                    <ul className="mt-1 space-y-0.5 text-slate-500">
                      {order.items.map((item) => (
                        <li key={item.foodId}>
                          {item.qty} × {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {order.note && <p className="mt-2 text-xs text-slate-500">Note: {order.note}</p>}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <p className="text-sm text-slate-500">
                    Collect COD <span className="text-base font-extrabold text-slate-900">{money(order.total)}</span>
                  </p>
                  <button onClick={() => pickUp(order)} className="btn-primary px-4 py-2 text-sm">
                    Pick Up Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-slate-900">My active delivery</h2>
        <p className="mt-0.5 text-xs text-slate-500">Update the status as you progress.</p>

        {active.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              emoji="🛵"
              title="No active delivery"
              description="Pick up an available order to start delivering."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            {active.map((order) => (
              <div key={order.id} className="card border-brand-100 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-bold text-slate-400">{order.id}</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {order.restaurantName} → {order.customerName}
                    </p>
                    <p className="text-xs text-slate-500">{order.address}</p>
                    <p className="text-xs text-slate-500">{order.phone}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <ul className="mt-3 space-y-1 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  {order.items.map((item) => (
                    <li key={item.foodId} className="flex justify-between gap-3">
                      <span>
                        {item.qty} × {item.name}
                      </span>
                      <span>{money(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <p className="text-sm text-slate-500">
                    Collect COD <span className="text-base font-extrabold text-slate-900">{money(order.total)}</span>
                  </p>
                  <button onClick={() => advance(order)} className="btn-primary px-4 py-2 text-sm">
                    {order.status === ORDER_STATUS.PICKED_UP ? 'Mark On the Way' : 'Mark Delivered'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-slate-900">Delivery history</h2>

        {history.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              emoji="🕘"
              title="No completed deliveries yet"
              description="Delivered orders will appear here."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {history.map((order) => (
              <div key={order.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-mono text-[11px] font-bold text-slate-400">{order.id}</p>
                  <p className="font-semibold text-slate-900">
                    {order.restaurantName} → {order.customerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Delivered {formatDate(order.deliveredAt || order.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-slate-900">{money(order.total)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
