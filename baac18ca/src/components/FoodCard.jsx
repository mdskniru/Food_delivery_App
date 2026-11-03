import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { money } from '../utils/format';
import SmartImage from './SmartImage';

export default function FoodCard({ food, restaurant }) {
  const { addItem } = useCart();
  const toast = useToast();
  const isOpen = Boolean(restaurant?.isOpen);
  const canOrder = isOpen && food.available;

  const handleAdd = () => {
    const result = addItem(food.id);
    if (!result.ok) {
      toast(result.error, 'error');
      return;
    }
    toast(`${food.name} added to cart`);
  };

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <SmartImage
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white ${
            isOpen ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        >
          {isOpen ? 'Open' : 'Closed'}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white">
          {food.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-bold text-slate-900">{food.name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{restaurant?.restaurantName || 'Restaurant'}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-lg font-extrabold text-slate-900">{money(food.price)}</span>
          <button onClick={handleAdd} disabled={!canOrder} className="btn-primary px-3.5 py-2 text-xs">
            {!isOpen ? 'Closed' : !food.available ? 'Unavailable' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
