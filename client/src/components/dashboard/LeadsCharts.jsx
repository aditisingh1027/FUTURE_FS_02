import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const STATUS_COLORS = {
  new: '#38bdf8',
  contacted: '#facc15',
  qualified: '#c084fc',
  proposal: '#fb923c',
  won: '#34d399',
  lost: '#f87171',
};

const SOURCE_COLORS = [
  '#38bdf8',
  '#f97316',
  '#a78bfa',
  '#34d399',
  '#f43f5e',
  '#94a3b8',
];

const LeadsCharts = ({ statusData = [], sourceData = [], loading }) => {
  const statusChartData = statusData.map((item) => ({ name: item.status, value: item.count }));
  const sourceChartData = sourceData.map((item) => ({ name: item.source.replace('_', ' '), value: item.count }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-[#07101f] p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-dark-50/60">Pipeline Stage</p>
            <h2 className="mt-2 text-xl font-bold text-white">Stage distribution</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          </div>
        ) : statusChartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-dark-50/60">No status data available yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={statusChartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} paddingAngle={4}>
                {statusChartData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16 }}
                formatter={(value) => [value, 'Leads']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#cbd5e1' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#07101f] p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-dark-50/60">Prospect Source</p>
            <h2 className="mt-2 text-xl font-bold text-white">Source breakdown</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          </div>
        ) : sourceChartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-dark-50/60">No source data available yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={sourceChartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16 }}
                formatter={(value) => [value, 'Leads']}
              />
              <Legend wrapperStyle={{ color: '#cbd5e1' }} />
              <Bar dataKey="value" fill="#38bdf8" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default LeadsCharts;
