import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((c) => !c)}
        onMobileToggle={() => setMobileOpen((open) => !open)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="lg:pl-0">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-dark-950/95 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-dark-900 text-white transition hover:border-brand-500 hover:text-brand-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-base font-semibold text-white">Antigravity CRM</div>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-dark-900 text-white transition hover:border-brand-500 hover:text-brand-400"
            aria-label="Toggle sidebar width"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <main className={`transition-all duration-300 ease-in-out min-h-screen ${collapsed ? 'lg:pl-16' : 'lg:pl-60'} pl-0`}>
          <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
