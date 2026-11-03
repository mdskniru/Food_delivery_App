import { createContext, useContext, useState } from 'react';
import { KEYS, read, write, uid } from '../utils/db';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => read(KEYS.users, []));
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(KEYS.session));

  const currentUser = users.find((u) => u.id === sessionId) || null;
  const restaurants = users.filter((u) => u.role === 'restaurant');

  const startSession = (id) => {
    localStorage.setItem(KEYS.session, id);
    setSessionId(id);
  };

  const signup = (data) => {
    const email = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: 'An account with this email already exists' };
    }
    const user = {
      id: uid(data.role),
      createdAt: new Date().toISOString(),
      ...data,
      email,
      ...(data.role === 'restaurant' ? { isOpen: true } : {}),
    };
    const next = [...users, user];
    setUsers(next);
    write(KEYS.users, next);
    startSession(user.id);
    return { ok: true, user };
  };

  const login = (email, password, role) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: 'Incorrect email or password' };
    if (role && user.role !== role) {
      const label = user.role === 'restaurant' ? 'restaurant owner' : user.role === 'rider' ? 'rider' : 'customer';
      return { ok: false, error: `This email belongs to a ${label} account.` };
    }
    startSession(user.id);
    return { ok: true, user };
  };

  const logout = () => {
    localStorage.removeItem(KEYS.session);
    setSessionId(null);
  };

  const updateUser = (patch) => {
    if (!currentUser) return;
    const next = users.map((u) => (u.id === currentUser.id ? { ...u, ...patch } : u));
    setUsers(next);
    write(KEYS.users, next);
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, restaurants, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
