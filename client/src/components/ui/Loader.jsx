const Loader = ({ label = 'Loading...', className = '' }) => (
  <div className={`flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-dark-950/80 p-8 text-center text-sm text-dark-50/70 ${className}`}>
    <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    <p>{label}</p>
  </div>
);

export default Loader;
