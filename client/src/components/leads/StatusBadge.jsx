const STATUS_CLASSES = {
  new: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  contacted: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  qualified: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  proposal: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  won: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  lost: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const StatusBadge = ({ status }) => {
  const label = status || 'unknown';
  const classes = STATUS_CLASSES[status] ?? 'text-dark-50 bg-dark-800 border-white/10';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${classes}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
