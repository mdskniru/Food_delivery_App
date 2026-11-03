import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RestaurantLogin() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/restaurant/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password');
      return;
    }
    const result = login(form.email, form.password, 'restaurant');
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast('Welcome back to your kitchen!');
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout
      badge="Restaurant owner"
      title="Restaurant login"
      subtitle="Manage your menu and incoming orders."
      footer={
        <>
          New restaurant?{' '}
          <Link to="/restaurant/signup" className="font-semibold text-brand-600 hover:underline">
            Register here
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            placeholder="owner@restaurant.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="••••••"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Login to dashboard
        </button>
      </form>

      <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-600">Demo restaurant</p>
        <p>owner@tripti.com · 123456 (Spice Garden)</p>
        <p>owner2@tripti.com · 123456 (Burger Hub)</p>
        <p>owner4@tripti.com · 123456 (Sweet Tooth Cafe — closed)</p>
      </div>

      <div className="mt-4 text-center text-xs font-medium text-slate-400">
        <Link to="/login" className="hover:text-brand-600">
          Customer login
        </Link>
        <span className="mx-2">·</span>
        <Link to="/rider/login" className="hover:text-brand-600">
          Rider login
        </Link>
      </div>
    </AuthLayout>
  );
}
