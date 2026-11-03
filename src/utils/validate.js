export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isPhone = (value) => /^\d{7,15}$/.test(value.replace(/[\s-]/g, ''));

export function validateAccount({ name, email, phone, password }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!isEmail(email)) errors.email = 'Enter a valid email address';
  if (!phone.trim()) errors.phone = 'Phone number is required';
  else if (!isPhone(phone)) errors.phone = 'Enter a valid phone number';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
}

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
