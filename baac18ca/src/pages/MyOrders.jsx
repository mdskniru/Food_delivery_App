import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { ORDER_STATUS, TRACK_STEPS } from '../utils/constants';
import { formatDate, money } from '../utils/format';

function OrderTracker({ status }) {
  if (status === ORDER_STATUS.REJECTED) {
    return (
      <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
        This order was rejected by the restaurant.
      </p>
    );
  }

  const currentIndex = TRACK_STEPS.indexOf(status);

  return (
    <div className="mt-4 rounded-xl bg-slate-50 p-3">
      <div className="grid grid-cols-6 gap-1">
        {TRACK_STEPS.map((step, index) => {
          const done = index <= currentIndex;
          return (
            <div key={step} className="flex flex-col items-center gap-1">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${
                  done ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`text-center text-[10px] leading-tight ${
                  done ? 'font-semibold text-slate-700' : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MyOrders() {
  const { currentUser } = useAuth();
  const { orders } = useOrders();

  const myOrders = orders
    .filter((order) => order.customerId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track your order from kitchen to doorstep.</p>
        </div>
        <Link to="/" className="btn-primary px-3.5 py-2">
          Order food
        </Link>
      </div>

      {myOrders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            emoji="🍔"
            title="No orders yet"
            description="When you place an order it will appear here with live status updates."
            action={
              <Link to="/" className="btn-primary">
                Browse the menu
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {myOrders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{order.restaurantName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    <span className="font-mono">{order.id}</span> · {formatDate(order.createdAt)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {order.items.map((item) => (
                  <li key={item.foodId} className="flex justify-between gap-3">
                    <span>
                      {item.qty} × {item.name}
                    </span>
                    <span>{money(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <p className="max-w-[70%] truncate text-xs text-slate-500">Deliver to: {order.address}</p>
                <p className="text-sm font-extrabold text-slate-900">{money(order.total)} · COD</p>
              </div>

              {order.riderName && (
                <p className="mt-2 text-xs font-medium text-slate-500">Rider: {order.riderName}</p>
              )}

              <OrderTracker status={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
