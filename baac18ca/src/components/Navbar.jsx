import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
  }`;

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { count } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [partnerMenu, setPartnerMenu] = useState(false);

  const closeMenus = () => {
    setMobileOpen(false);
    setUserMenu(false);
    setPartnerMenu(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    toast('You have been logged out', 'info');
    navigate('/');
  };

  const dashboardLink =
    currentUser?.role === 'restaurant'
      ? '/restaurant/dashboard'
      : currentUser?.role === 'rider'
        ? '/rider/dashboard'
        : null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenus}>
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-base font-black text-white sm:h-9 sm:w-9 sm:text-lg">
            T
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">Tripti</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Menu
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            <span className="inline-flex items-center gap-1.5">
              Cart
              {count > 0 && (
                <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
          </NavLink>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!currentUser ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setPartnerMenu((open) => !open)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  For Partners <span className="text-[10px]">▼</span>
                </button>
                {partnerMenu && (
                  <>
                    <button
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={() => setPartnerMenu(false)}
                      aria-label="Close partner menu"
                    />
                    <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
                      <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Partner portals
                      </p>
                      <Link
                        to="/restaurant/login"
                        onClick={closeMenus}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Restaurant Owner
                      </Link>
                      <Link
                        to="/rider/login"
                        onClick={closeMenus}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Rider
                      </Link>
                    </div>
                  </>
                )}
              </div>
              <Link to="/login" className="btn-outline px-3.5 py-2">
                Login
              </Link>
              <Link to="/signup" className="btn-primary px-3.5 py-2">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {dashboardLink && (
                <Link to={dashboardLink} className="btn-soft px-3.5 py-2">
                  Dashboard
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={() => setUserMenu((open) => !open)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[8rem] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>
                {userMenu && (
                  <>
                    <button
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={() => setUserMenu(false)}
                      aria-label="Close user menu"
                    />
                    <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-semibold text-slate-800">{currentUser.name}</p>
                        <p className="text-[11px] capitalize text-slate-400">
                          {currentUser.role === 'restaurant' ? 'Restaurant owner' : currentUser.role}
                        </p>
                      </div>
                      <div className="my-1 h-px bg-slate-100" />
                      {currentUser.role === 'customer' && (
                        <Link
                          to="/my-orders"
                          onClick={closeMenus}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                          My Orders
                        </Link>
                      )}
                      {dashboardLink && (
                        <Link
                          to={dashboardLink}
                          onClick={closeMenus}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/cart"
            onClick={closeMenus}
            className="relative rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
            aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h7.8a2 2 0 0 0 2-1.6L21 7H6" />
              <circle cx="10" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-[1rem] place-items-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          {!currentUser ? (
            <>
              <Link
                to="/login"
                onClick={closeMenus}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:px-3 sm:text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenus}
                className="rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 sm:px-3 sm:text-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              to={dashboardLink || (currentUser.role === 'customer' ? '/my-orders' : '/')}
              onClick={closeMenus}
              className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
              aria-label={dashboardLink ? 'Dashboard' : 'My Orders'}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 md:hidden"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="container-page space-y-1 py-3">
            <Link to="/" onClick={closeMenus} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Menu
            </Link>
            <Link
              to="/cart"
              onClick={closeMenus}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <span>Cart</span>
              {count > 0 && (
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>
              )}
            </Link>
            {currentUser?.role === 'customer' && (
              <Link
                to="/my-orders"
                onClick={closeMenus}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                My Orders
              </Link>
            )}
            {dashboardLink && (
              <Link
                to={dashboardLink}
                onClick={closeMenus}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>
            )}
            <div className="my-2 h-px bg-slate-100" />
            {!currentUser ? (
              <>
                <p className="px-3 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Partner portals
                </p>
                <Link
                  to="/restaurant/login"
                  onClick={closeMenus}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Restaurant Owner Login
                </Link>
                <Link
                  to="/rider/login"
                  onClick={closeMenus}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Rider Login
                </Link>
                <div className="mt-2 grid grid-cols-2 gap-2 px-1">
                  <Link to="/login" onClick={closeMenus} className="btn-outline">
                    Login
                  </Link>
                  <Link to="/signup" onClick={closeMenus} className="btn-primary">
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
