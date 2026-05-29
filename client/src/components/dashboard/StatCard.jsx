const StatCard = ({ label, value, icon, accent, suffix = '' }) => (
  <div className="glass-card rounded-3xl p-6 flex items-start gap-4">
    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-dark-50/60 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-white">
        {value ?? '—'}{suffix}
      </p>
    </div>
  </div>
);

export default StatCard;
