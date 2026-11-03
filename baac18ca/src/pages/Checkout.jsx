import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useToast } from '../context/ToastContext';
import { money } from '../utils/format';
import { isPhone } from '../utils/validate';

export default function Checkout() {
  const { currentUser, restaurants } = useAuth();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    note: '',
  });
  const [errors, setErrors] = useState({});

  const restaurant = restaurants.find((item) => item.id === items[0]?.food.restaurantId);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">Checkout</h1>
        <div className="mt-6">
          <EmptyState
            emoji="🛒"
            title="Nothing to check out"
            description="Your cart is empty. Add some food first."
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required';
    else if (!isPhone(form.phone)) nextErrors.phone = 'Enter a valid phone number';
    if (!form.address.trim()) nextErrors.address = 'Delivery address is required';
    if (!restaurant) nextErrors.form = 'This restaurant is no longer available';
    else if (!restaurant.isOpen) nextErrors.form = 'This restaurant is currently closed. Try again later.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const order = placeOrder({
      customerId: currentUser.id,
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      note: form.note.trim(),
      restaurantId: restaurant.id,
      restaurantName: restaurant.restaurantName,
      restaurantAddress: restaurant.address,
      items: items.map(({ food, qty }) => ({
        foodId: food.id,
        name: food.name,
        price: food.price,
        qty,
      })),
      subtotal,
      deliveryFee,
      total,
    });

    clearCart();
    toast('Order placed! Please pay cash on delivery.');
    navigate(`/order-success/${order.id}`);
  };

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">Ordering from {restaurant?.restaurantName}</p>
        </div>
        <Link to="/cart" className="text-sm font-semibold text-brand-600 hover:underline">
          Edit cart
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr,360px]" noValidate>
        <div className="card space-y-4 p-5 sm:p-6">
          <h2 className="text-base font-bold text-slate-900">Delivery details</h2>

          {errors.form && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {errors.form}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="input"
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                placeholder="Your name"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div>
              <label className="label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                className="input"
                value={form.phone}
                onChange={(event) => setField('phone', event.target.value)}
                placeholder="98XXXXXXXX"
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="address">
              Delivery address
            </label>
            <textarea
              id="address"
              rows={3}
              className="input resize-none"
              value={form.address}
              onChange={(event) => setField('address', event.target.value)}
              placeholder="House, street, area, city"
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>

          <div>
            <label className="label" htmlFor="note">
              Delivery note <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="note"
              rows={2}
              className="input resize-none"
              value={form.note}
              onChange={(event) => setField('note', event.target.value)}
              placeholder="Landmark, gate colour, extra napkins..."
            />
          </div>

          <div>
            <p className="label">Payment method</p>
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
              <div className="flex items-center gap-3">
                <input type="radio" checked readOnly className="h-4 w-4 accent-brand-600" aria-label="Cash on Delivery" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Cash on Delivery (COD)</p>
                  <p className="text-xs text-slate-600">Pay {money(total)} in cash when your order arrives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card h-max p-5">
          <h2 className="text-base font-bold text-slate-900">Your order</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map(({ food, qty }) => (
              <li key={food.id} className="flex justify-between gap-3 text-slate-600">
                <span className="min-w-0 truncate">
                  {qty} × {food.name}
                </span>
                <span className="whitespace-nowrap">{money(food.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="my-3 h-px bg-slate-100" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery fee</span>
              <span>{money(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-5 w-full">
            Place Order · {money(total)}
          </button>
          <p className="mt-2 text-center text-xs text-slate-400">No online payment required.</p>
        </div>
      </form>
    </div>
  );
}
