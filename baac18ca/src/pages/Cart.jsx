import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import SmartImage from '../components/SmartImage';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';

export default function Cart() {
  const { items, subtotal, deliveryFee, total, increase, decrease, removeItem } = useCart();
  const { currentUser } = useAuth();

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">Your cart</h1>
        <div className="mt-6">
          <EmptyState
            emoji="🛒"
            title="Your cart is empty"
            description="Add something delicious from the menu to get started."
            action={
              <Link to="/" className="btn-primary">
                Browse food
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-extrabold text-slate-900">Your cart</h1>
      <p className="mt-1 text-sm text-slate-500">
        {items.length} item{items.length > 1 ? 's' : ''} from one restaurant
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="space-y-3">
          {items.map(({ food, qty }) => (
            <div key={food.id} className="card flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
              <SmartImage src={food.image} alt={food.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{food.name}</p>
                <p className="text-xs text-slate-500">{money(food.price)} each</p>
                <button
                  onClick={() => removeItem(food.id)}
                  className="mt-1 text-xs font-semibold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center rounded-xl border border-slate-200">
                  <button
                    onClick={() => decrease(food.id)}
                    className="h-8 w-8 text-lg font-bold text-slate-500 hover:bg-slate-50"
                    aria-label={`Decrease ${food.name} quantity`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => increase(food.id)}
                    className="h-8 w-8 text-lg font-bold text-slate-500 hover:bg-slate-50"
                    aria-label={`Increase ${food.name} quantity`}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-bold text-slate-900">{money(food.price * qty)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-max p-5">
          <h2 className="text-base font-bold text-slate-900">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery fee</span>
              <span>{money(deliveryFee)}</span>
            </div>
            <div className="my-2 h-px bg-slate-100" />
            <div className="flex justify-between text-base font-extrabold text-slate-900">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn-primary mt-5 w-full">
            Proceed to Checkout
          </Link>
          {!currentUser && (
            <p className="mt-2 text-center text-xs text-slate-500">You will be asked to log in first.</p>
          )}
          <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-center text-xs font-medium text-brand-700">
            Cash on Delivery only
          </p>
          <Link to="/" className="mt-3 block text-center text-xs font-semibold text-brand-600 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
