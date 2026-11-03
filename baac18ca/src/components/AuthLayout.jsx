export default function AuthLayout({ title, subtitle, badge, children, footer }) {
  return (
    <div className="container-page flex justify-center py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          {badge && (
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {badge}
            </span>
          )}
          <h1 className="mt-3 text-2xl font-extrabold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-4 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  );
}
