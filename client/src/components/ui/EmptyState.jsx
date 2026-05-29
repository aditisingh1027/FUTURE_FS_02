const EmptyState = ({ title = 'Nothing to show yet', description, action }) => (
  <div className="rounded-3xl border border-white/10 bg-dark-950/80 p-8 text-center text-dark-50/60">
    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-500/10 text-brand-300">
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h12" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {description && <p className="mt-2 text-sm text-dark-50/60">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
