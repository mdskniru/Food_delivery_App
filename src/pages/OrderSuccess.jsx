import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { useOrders } from '../context/OrdersContext';
import { formatDate, money } from '../utils/format';

export default function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <div className="container-page py-10">
        <EmptyState
          emoji="🧾"
          title="Order not found"
          description="We could not find that order in this browser."
          action={
            <Link to="/my-orders" className="btn-primary">
              Go to My Orders
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6 text-center sm:p-8">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-600">
            ✓
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Order placed!</h1>
          <p className="mt-1 text-sm text-slate-500">
            {order.restaurantName} will review your order shortly.
          </p>
          <div className="mt-5 flex flex-col items-center gap-2">
            <span className="rounded-full bg-slate-100 px-4 py-1.5 font-mono text-sm font-bold text-slate-700">
              {order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Placed on</span>
              <span className="font-medium text-slate-700">{formatDate(order.createdAt)}</span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-slate-500">Deliver to</span>
              <span className="max-w-[65%] text-right font-medium text-slate-700">{order.address}</span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-slate-500">Phone</span>
              <span className="font-medium text-slate-700">{order.phone}</span>
            </div>
            {order.note && (
              <div className="mt-2 flex justify-between gap-3">
                <span className="text-slate-500">Note</span>
                <span className="max-w-[65%] text-right font-medium text-slate-700">{order.note}</span>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 p-4 text-left">
            <h2 className="text-sm font-bold text-slate-900">Order summary</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              {order.items.map((item) => (
                <li key={item.foodId} className="flex justify-between gap-3">
                  <span>
                    {item.qty} × {item.name}
                  </span>
                  <span>{money(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm font-extrabold text-slate-900">
              <span>Total (Cash on Delivery)</span>
              <span>{money(order.total)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/my-orders" className="btn-primary flex-1">
              Track My Orders
            </Link>
            <Link to="/" className="btn-outline flex-1">
              Order more food
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
