import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { hasErrors, validateAccount } from '../utils/validate';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  password: '',
  address: '',
};

export default function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAccount(form);
    if (!form.address.trim()) nextErrors.address = 'Delivery address is required';
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    const result = signup({ ...form, role: 'customer' });
    if (!result.ok) {
      setErrors({ email: result.error });
      return;
    }
    toast('Account created. Welcome to Tripti!');
    navigate('/');
  };

  return (
    <AuthLayout
      badge="Customer"
      title="Create your account"
      subtitle="Sign up to start ordering food in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="input"
              placeholder="Aarav Shrestha"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
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
              placeholder="98XXXXXXXX"
              value={form.phone}
              onChange={(event) => setField('phone', event.target.value)}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => setField('email', event.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(event) => setField('password', event.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div>
          <label className="label" htmlFor="address">
            Delivery address
          </label>
          <textarea
            id="address"
            rows={2}
            className="input resize-none"
            placeholder="Street, area, city"
            value={form.address}
            onChange={(event) => setField('address', event.target.value)}
          />
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>

        <button type="submit" className="btn-primary w-full">
          Create account
        </button>
      </form>
    </AuthLayout>
  );
}
