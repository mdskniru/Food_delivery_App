import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { hasErrors, validateAccount } from '../utils/validate';

const VEHICLES = ['Bike', 'Scooter', 'Bicycle', 'Car'];

export default function RiderSignup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    vehicleType: 'Bike',
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAccount(form);
    if (!form.vehicleType) nextErrors.vehicleType = 'Choose a vehicle type';
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    const result = signup({ ...form, role: 'rider' });
    if (!result.ok) {
      setErrors({ email: result.error });
      return;
    }
    toast('Rider account created. Welcome aboard!');
    navigate('/rider/dashboard');
  };

  return (
    <AuthLayout
      badge="Rider"
      title="Become a Tripti rider"
      subtitle="Deliver food around the city and earn on every order."
      footer={
        <>
          Already a rider?{' '}
          <Link to="/rider/login" className="font-semibold text-brand-600 hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

        <div className="grid gap-4 sm:grid-cols-2">
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
          <div>
            <label className="label" htmlFor="vehicleType">
              Vehicle type
            </label>
            <select
              id="vehicleType"
              className="input"
              value={form.vehicleType}
              onChange={(event) => setField('vehicleType', event.target.value)}
            >
              {VEHICLES.map((vehicle) => (
                <option key={vehicle} value={vehicle}>
                  {vehicle}
                </option>
              ))}
            </select>
            {errors.vehicleType && <p className="error-text">{errors.vehicleType}</p>}
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
            value={form.email}
            onChange={(event) => setField('email', event.target.value)}
            placeholder="you@example.com"
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
            value={form.password}
            onChange={(event) => setField('password', event.target.value)}
            placeholder="At least 6 characters"
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" className="btn-primary w-full">
          Create rider account
        </button>
      </form>
    </AuthLayout>
  );
}
