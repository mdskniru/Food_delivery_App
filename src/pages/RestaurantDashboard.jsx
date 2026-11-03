import { useMemo, useRef, useState } from 'react';
import EmptyState from '../components/EmptyState';
import SmartImage from '../components/SmartImage';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useFoods } from '../context/FoodsContext';
import { useOrders } from '../context/OrdersContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, ORDER_STATUS } from '../utils/constants';
import { formatDate, money } from '../utils/format';
import { readImageFile } from '../utils/image';

const emptyFood = { name: '', description: '', price: '', category: CATEGORIES[0] };

export default function RestaurantDashboard() {
  const { currentUser, updateUser } = useAuth();
  const { foods, addFood, updateFood, deleteFood } = useFoods();
  const { orders, updateStatus } = useOrders();
  const toast = useToast();

  const [tab, setTab] = useState('orders');
  const [form, setForm] = useState(emptyFood);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const myFoods = foods.filter((food) => food.restaurantId === currentUser.id);
  const myOrders = useMemo(
    () =>
      orders
        .filter((order) => order.restaurantId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders, currentUser.id]
  );

  const newOrders = myOrders.filter((order) => order.status === ORDER_STATUS.PLACED).length;
  const deliveredOrders = myOrders.filter((order) => order.status === ORDER_STATUS.DELIVERED).length;

  const toggleOpen = () => {
    updateUser({ isOpen: !currentUser.isOpen });
    toast(currentUser.isOpen ? 'Restaurant is now closed' : 'Restaurant is now open', 'info');
  };

  const acceptOrder = (order) => {
    updateStatus(order.id, ORDER_STATUS.ACCEPTED);
    toast('Order accepted');
  };

  const rejectOrder = (order) => {
    updateStatus(order.id, ORDER_STATUS.REJECTED);
    toast('Order rejected', 'info');
  };

  const markReady = (order) => {
    updateStatus(order.id, ORDER_STATUS.READY);
    toast('Order ready for pickup');
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const resetFoodForm = () => {
    setForm(emptyFood);
    setEditingId(null);
    setPreview('');
    setErrors({});
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      setPreview(dataUrl);
      setErrors((prev) => ({ ...prev, image: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, image: error.message }));
      toast(error.message, 'error');
      event.target.value = '';
    }
  };

  const submitFood = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Food name is required';
    if (!form.description.trim()) nextErrors.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Enter a valid price';
    if (!form.category) nextErrors.category = 'Choose a category';
    if (!preview) nextErrors.image = 'Upload a food image (JPG, PNG or WEBP)';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      image: preview,
    };

    if (editingId) {
      updateFood(editingId, payload);
      toast('Food item updated');
    } else {
      addFood({ ...payload, restaurantId: currentUser.id });
      toast('Food item added to your menu');
    }
    resetFoodForm();
  };

  const startEdit = (food) => {
    setEditingId(food.id);
    setForm({
      name: food.name,
      description: food.description,
      price: String(food.price),
      category: food.category,
    });
    setPreview(food.image);
    setErrors({});
    setTab('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAvailable = (food) => {
    updateFood(food.id, { available: !food.available });
    toast(food.available ? `${food.name} is now unavailable` : `${food.name} is available again`, 'info');
  };

  const handleDelete = (food) => {
    if (!window.confirm(`Delete "${food.name}" from your menu?`)) return;
    deleteFood(food.id);
    if (editingId === food.id) resetFoodForm();
    toast('Food item deleted', 'info');
  };

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {currentUser.logo ? (
            <img
              src={currentUser.logo}
              alt={currentUser.restaurantName}
              className="h-14 w-14 rounded-2xl object-cover"
            />
          ) : (
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-xl font-black text-white">
              {currentUser.restaurantName.charAt(0)}
            </span>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Restaurant dashboard
            </p>
            <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.restaurantName}</h1>
            <p className="text-sm text-slate-500">{currentUser.address}</p>
          </div>
        </div>

        <div className="card flex w-max items-center gap-3 px-4 py-3">
          <span className={`h-2.5 w-2.5 rounded-full ${currentUser.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <div>
            <p className="text-[11px] text-slate-500">Store status</p>
            <p className="text-sm font-bold text-slate-900">{currentUser.isOpen ? 'Open' : 'Closed'}</p>
          </div>
          <button
            onClick={toggleOpen}
            aria-label="Toggle restaurant open or closed"
            className={`relative ml-2 h-7 w-12 rounded-full transition ${
              currentUser.isOpen ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                currentUser.isOpen ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500">New orders</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{newOrders}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500">Menu items</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{myFoods.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500">Delivered orders</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{deliveredOrders}</p>
        </div>
      </div>

      <div className="mt-8 flex w-max gap-1 rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setTab('orders')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            tab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Orders
          {newOrders > 0 && (
            <span className="ml-2 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {newOrders}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('menu')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            tab === 'menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Menu
        </button>
      </div>

      {tab === 'orders' && (
        <div className="mt-5">
          {myOrders.length === 0 ? (
            <EmptyState
              emoji="🧾"
              title="No orders yet"
              description="New customer orders will show up here as soon as they are placed."
            />
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div key={order.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-1.5 font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-slate-900">{money(order.total)}</p>
                      <p className="text-[11px] font-semibold text-brand-600">COD</p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-1.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-700">Phone:</span> {order.phone}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">Address:</span> {order.address}
                    </p>
                    {order.note && (
                      <p className="sm:col-span-2">
                        <span className="font-semibold text-slate-700">Note:</span> {order.note}
                      </p>
                    )}
                  </div>

                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
                    {order.items.map((item) => (
                      <li key={item.foodId} className="flex justify-between gap-3">
                        <span>
                          {item.qty} × {item.name}
                        </span>
                        <span>{money(item.price * item.qty)}</span>
                      </li>
                    ))}
                  </ul>

                  {order.riderName && (
                    <p className="mt-2 text-xs font-medium text-slate-500">Rider: {order.riderName}</p>
                  )}

                  {order.status === ORDER_STATUS.PLACED && (
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => acceptOrder(order)} className="btn-primary flex-1 py-2 text-sm">
                        Accept order
                      </button>
                      <button
                        onClick={() => rejectOrder(order)}
                        className="btn-outline flex-1 border-rose-200 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {order.status === ORDER_STATUS.ACCEPTED && (
                    <button onClick={() => markReady(order)} className="btn-primary mt-4 w-full py-2 text-sm">
                      Mark Ready for Pickup
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'menu' && (
        <div className="mt-5 grid gap-6 lg:grid-cols-[380px,1fr]">
          <form onSubmit={submitFood} className="card h-max space-y-4 p-5" noValidate>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">{editingId ? 'Edit food item' : 'Add a food item'}</h2>
              {editingId && (
                <button type="button" onClick={resetFoodForm} className="text-xs font-semibold text-slate-400 hover:text-slate-600">
                  Cancel
                </button>
              )}
            </div>

            <div>
              <label className="label" htmlFor="foodName">
                Food name
              </label>
              <input
                id="foodName"
                className="input"
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                placeholder="Chicken Biryani"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div>
              <label className="label" htmlFor="foodDescription">
                Description
              </label>
              <textarea
                id="foodDescription"
                rows={2}
                className="input resize-none"
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                placeholder="Short description of the dish"
              />
              {errors.description && <p className="error-text">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="foodPrice">
                  Price (Rs)
                </label>
                <input
                  id="foodPrice"
                  type="number"
                  min="1"
                  className="input"
                  value={form.price}
                  onChange={(event) => setField('price', event.target.value)}
                  placeholder="320"
                />
                {errors.price && <p className="error-text">{errors.price}</p>}
              </div>
              <div>
                <label className="label" htmlFor="foodCategory">
                  Category
                </label>
                <select
                  id="foodCategory"
                  className="input"
                  value={form.category}
                  onChange={(event) => setField('category', event.target.value)}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="error-text">{errors.category}</p>}
              </div>
            </div>

            <div>
              <span className="label">Food image</span>
              <label className="block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-brand-300 hover:bg-brand-50/40">
                {preview ? (
                  <img src={preview} alt="Food preview" className="h-36 w-full object-cover" />
                ) : (
                  <span className="flex h-36 flex-col items-center justify-center gap-1 px-4 text-center text-xs text-slate-500">
                    <span className="text-2xl">📷</span>
                    Upload an image from your device
                    <span className="text-[11px] text-slate-400">JPG, PNG or WEBP · max 2MB</span>
                  </span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
              {preview ? (
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">Tap the image to change it.</p>
                  <button
                    type="button"
                    onClick={resetFoodForm}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Clear form
                  </button>
                </div>
              ) : (
                errors.image && <p className="error-text">{errors.image}</p>
              )}
              {preview && errors.image && <p className="error-text">{errors.image}</p>}
            </div>

            <button type="submit" className="btn-primary w-full">
              {editingId ? 'Save changes' : 'Add food item'}
            </button>
          </form>

          <div>
            <h2 className="font-bold text-slate-900">Your menu ({myFoods.length})</h2>
            {myFoods.length === 0 ? (
              <div className="mt-3">
                <EmptyState
                  emoji="🍳"
                  title="Your menu is empty"
                  description="Add your first dish using the form to start selling."
                />
              </div>
            ) : (
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {myFoods.map((food) => (
                  <div key={food.id} className="card overflow-hidden">
                    <SmartImage src={food.image} alt={food.name} className="h-36 w-full object-cover" />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">{food.name}</h3>
                          <p className="text-xs text-slate-500">
                            {food.category} · {money(food.price)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            food.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {food.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{food.description}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button
                          onClick={() => toggleAvailable(food)}
                          aria-label="Toggle food availability"
                          className={`relative h-5 w-9 rounded-full transition ${
                            food.available ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                              food.available ? 'left-[18px]' : 'left-0.5'
                            }`}
                          />
                        </button>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(food)} className="btn-outline px-3 py-1.5 text-xs">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(food)}
                            className="btn-outline border-rose-200 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
