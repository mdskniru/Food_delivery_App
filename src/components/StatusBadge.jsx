import { STATUS_STYLES } from '../utils/constants';

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex w-max items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 ring-slate-200'
      }`}
    >
      {status}
    </span>
  );
}
