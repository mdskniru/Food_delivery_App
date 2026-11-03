import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFoods } from '../context/FoodsContext';
import FoodCard from '../components/FoodCard';
import EmptyState from '../components/EmptyState';
import { CATEGORIES } from '../utils/constants';

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="h-44 animate-pulse bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-8 w-full animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function Home() {
  const { foods } = useFoods();
  const { restaurants } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const restaurantMap = useMemo(
    () => Object.fromEntries(restaurants.map((restaurant) => [restaurant.id, restaurant])),
    [restaurants]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return foods.filter((food) => {
      const restaurant = restaurantMap[food.restaurantId];
      const matchesSearch =
        !term ||
        food.name.toLowerCase().includes(term) ||
        (restaurant?.restaurantName || '').toLowerCase().includes(term);
      const matchesCategory = category === 'All' || food.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [foods, restaurantMap, search, category]);

  const openCount = restaurants.filter((restaurant) => restaurant.isOpen).length;

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 via-orange-50/40 to-slate-50">
        <div className="container-page py-12 text-center sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            🛵 Fast delivery · Cash on Delivery
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Hungry? <span className="text-brand-600">Tripti</span> it.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600 sm:text-base">
            Order from your favourite local restaurants and pay cash when it arrives at your door.
          </p>

          <div className="relative mx-auto mt-7 max-w-xl">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food or restaurant..."
              className="input h-12 pl-11 pr-4 text-base shadow-card"
            />
          </div>
        </div>
      </section>

      <div className="container-page py-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', ...CATEGORIES].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            {category === 'All' ? 'All food' : category}
          </h2>
          <p className="text-xs text-slate-500">
            {filtered.length} items · {openCount} restaurants open
          </p>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              emoji="🔍"
              title="No food found"
              description="Try a different search term or category."
              action={
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('All');
                  }}
                  className="btn-primary"
                >
                  Clear filters
                </button>
              }
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((food) => (
              <FoodCard key={food.id} food={food} restaurant={restaurantMap[food.restaurantId]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
