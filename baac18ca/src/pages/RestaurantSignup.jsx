import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { readImageFile } from '../utils/image';
import { hasErrors, validateAccount } from '../utils/validate';

const initialForm = {
  name: '',
  restaurantName: '',
  phone: '',
  email: '',
  password: '',
  address: '',
};

export default function RestaurantSignup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [logo, setLogo] = useState('');
  const fileRef = useRef(null);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleLogo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      setLogo(dataUrl);
      setErrors((prev) => ({ ...prev, logo: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, logo: error.message }));
      event.target.value = '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAccount(form);
    if (!form.restaurantName.trim()) nextErrors.restaurantName = 'Restaurant name is required';
    if (!form.address.trim()) nextErrors.address = 'Restaurant address is required';
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    const result = signup({ ...form, role: 'restaurant', logo });
    if (!result.ok) {
      setErrors({ email: result.error });
      return;
    }
    toast('Restaurant account created!');
    navigate('/restaurant/dashboard');
  };

  return (
    <AuthLayout
      badge="Restaurant owner"
      title="Register your restaurant"
      subtitle="Join Tripti and start receiving orders from hungry customers."
      footer={
        <>
          Already registered?{' '}
          <Link to="/restaurant/login" className="font-semibold text-brand-600 hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-100 text-xl font-black text-slate-400">
            {logo ? <img src={logo} alt="Restaurant logo preview" className="h-full w-full object-cover" /> : 'Logo'}
          </div>
          <div className="flex-1">
            <label className="btn-outline cursor-pointer px-3 py-2 text-xs">
              Upload logo
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleLogo}
              />
            </label>
            <p className="mt-1 text-[11px] text-slate-400">JPG, PNG or WEBP · max 2MB</p>
            {errors.logo && <p className="error-text">{errors.logo}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Owner name
            </label>
            <input
              id="name"
              className="input"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          <div>
            <label className="label" htmlFor="restaurantName">
              Restaurant name
            </label>
            <input
              id="restaurantName"
              className="input"
              value={form.restaurantName}
              onChange={(event) => setField('restaurantName', event.target.value)}
            />
            {errors.restaurantName && <p className="error-text">{errors.restaurantName}</p>}
          </div>
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
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
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
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
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
            Restaurant address
          </label>
          <textarea
            id="address"
            rows={2}
            className="input resize-none"
            value={form.address}
            onChange={(event) => setField('address', event.target.value)}
            placeholder="Street, area, city"
          />
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>

        <button type="submit" className="btn-primary w-full">
          Create restaurant account
        </button>
      </form>
    </AuthLayout>
  );
}
