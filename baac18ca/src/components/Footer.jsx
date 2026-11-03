import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white">
      <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-black text-white">T</span>
            <span className="text-lg font-extrabold text-slate-900">Tripti</span>
          </div>
          <p className="mt-2 max-w-xs text-xs text-slate-500">
            Fresh food from local kitchens, delivered to your door with cash on delivery.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-600">Menu</Link>
          <Link to="/restaurant/login" className="hover:text-brand-600">Restaurant Owner</Link>
          <Link to="/rider/login" className="hover:text-brand-600">Rider</Link>
        </div>
        <p className="text-xs text-slate-400">© 2026 Tripti · College project demo — data stays in your browser.</p>
      </div>
    </footer>
  );
}
