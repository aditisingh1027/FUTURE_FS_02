import { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import leadService from '../services/leadService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LeadsCharts from '../components/dashboard/LeadsCharts';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/leads/StatusBadge';


const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [chartData, setChartData] = useState({ byStatus: [], bySource: [] });
  const [followUps, setFollowUps] = useState({ upcomingCount: 0, overdueCount: 0, upcoming: [], overdue: [] });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [loadingFollowUps, setLoadingFollowUps] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoadingStats(false));

    leadService.getLeads({ limit: 5, sort: '-createdAt' })
      .then((res) => setRecentLeads(res.data.leads || []))
      .catch(() => setRecentLeads([]))
      .finally(() => setLoadingLeads(false));

    dashboardService.getCharts()
      .then((res) => setChartData(res.data.charts || { byStatus: [], bySource: [] }))
      .catch(() => {
        toast.error('Unable to load dashboard charts.');
        setChartData({ byStatus: [], bySource: [] });
      })
      .finally(() => setLoadingCharts(false));

    dashboardService.getFollowUps()
      .then((res) => setFollowUps(res.data.followUps || { upcomingCount: 0, overdueCount: 0, upcoming: [], overdue: [] }))
      .catch(() => {
        toast.error('Unable to load follow-up tracking.');
        setFollowUps({ upcomingCount: 0, overdueCount: 0, upcoming: [], overdue: [] });
      })
      .finally(() => setLoadingFollowUps(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Command Center
        </h1>
        <p className="text-sm text-dark-50/60 mt-1">Snapshot of prospects, pipeline stage distribution, and follow-up action items.</p>
      </div>

      {/* Stats Grid */}
      {loadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 h-28 bg-[#0e1724] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Prospects"
            value={stats?.totalLeads ?? 0}
            accent="bg-brand-500/15 text-brand-500"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            label="New Prospects"
            value={stats?.newLeads ?? 0}
            accent="bg-blue-500/15 text-blue-400"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          <StatCard
            label="Converted"
            value={stats?.convertedLeads ?? 0}
            accent="bg-emerald-500/15 text-emerald-400"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
          <StatCard
            label="Conversion Rate"
            value={stats?.conversionRate ?? 0}
            suffix="%"
            accent="bg-purple-500/15 text-purple-400"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
      )}

      {/* Charts + Follow-up Tracking */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="glass-card rounded-3xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Lead Performance</h2>
              <p className="text-sm text-dark-50/60 mt-1">Track pipeline stages and prospect source mix for your active pipeline.</p>
            </div>
            <div className="text-xs text-dark-50/50">Updated just now</div>
          </div>

          {loadingCharts ? (
            <div className="h-72 flex items-center justify-center text-dark-50/60">Loading charts…</div>
          ) : (
            <LeadsCharts statusData={chartData.byStatus} sourceData={chartData.bySource} loading={loadingCharts} />
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-white/5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Follow-up Status</h3>
              <p className="text-sm text-dark-50/60 mt-1">Stay on top of urgent and upcoming reminders.</p>
            </div>

            {loadingFollowUps ? (
              <div className="h-48 flex items-center justify-center text-dark-50/60">Loading follow-ups…</div>
            ) : (
              <div className="grid gap-4">
                <div className="rounded-3xl bg-dark-900 p-5 border border-white/10">
                  <div className="flex items-center justify-between text-sm text-dark-50/60 mb-2">
                    <span>Overdue</span>
                    <span>{followUps.overdueCount}</span>
                  </div>
                  <p className="text-3xl font-semibold text-red-400">{followUps.overdueCount}</p>
                </div>
                <div className="rounded-3xl bg-dark-900 p-5 border border-white/10">
                  <div className="flex items-center justify-between text-sm text-dark-50/60 mb-2">
                    <span>Upcoming</span>
                    <span>{followUps.upcomingCount}</span>
                  </div>
                  <p className="text-3xl font-semibold text-emerald-400">{followUps.upcomingCount}</p>
                </div>
                <div className="rounded-3xl bg-dark-900 p-5 border border-white/10">
                  <h4 className="text-sm text-white mb-3">Next due</h4>
                  {followUps.upcoming.length ? (
                    <ul className="space-y-3 text-sm text-dark-50/70">
                      {followUps.upcoming.slice(0, 3).map((lead) => (
                        <li key={lead._id} className="flex items-center justify-between">
                          <span>{lead.name}</span>
                          <span className="text-xs text-dark-50/50">{new Date(lead.followUpDate).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-dark-50/50">No follow-ups scheduled.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Prospects</h2>
          <Link
            to="/leads"
            className="text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors flex items-center gap-1"
          >
            View pipeline
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
          {loadingLeads ? (
            <div className="p-8 text-center text-dark-50/50 text-sm">Loading leads…</div>
          ) : recentLeads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-dark-50/40 text-sm">No leads yet. Go add your first one!</p>
              <Link
                to="/leads"
                className="mt-4 inline-block px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
              >
                Add Lead
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-semibold text-dark-50/50 uppercase tracking-wider px-5 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-dark-50/50 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Email</th>
                  <th className="text-left text-xs font-semibold text-dark-50/50 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-dark-50/50 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <Link to={`/leads/${lead._id}`} className="font-semibold text-white hover:text-brand-400 transition-colors">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-dark-50/70 hidden md:table-cell">{lead.email || '—'}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-3.5 text-dark-50/70 capitalize hidden lg:table-cell">{lead.source || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
