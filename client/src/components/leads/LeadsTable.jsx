import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import LeadActions from './LeadActions';
import Loader from '../ui/Loader';
import EmptyState from '../ui/EmptyState';

const LeadsTable = ({ leads, loading, emptyStateText, onEdit, onDelete }) => {
  if (loading) {
    return <Loader label="Loading leads…" className="p-10" />;
  }

  if (!leads?.length) {
    return (
      <EmptyState
        title="No leads found"
        description={emptyStateText ?? 'Try adjusting your filters or add a new lead to get started.'}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-white/5">
            {['Name', 'Email', 'Phone', 'Source', 'Status', 'Actions'].map((heading) => (
              <th key={heading} className="text-left text-xs font-semibold text-dark-50/50 uppercase tracking-wider px-5 py-3">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-5 py-3.5">
                <Link to={`/leads/${lead._id}`} className="font-semibold text-white hover:text-brand-400 transition-colors">
                  {lead.name}
                </Link>
              </td>
              <td className="px-5 py-3.5 text-dark-50/70">{lead.email || '—'}</td>
              <td className="px-5 py-3.5 text-dark-50/70">{lead.phone || '—'}</td>
              <td className="px-5 py-3.5 text-dark-50/70 capitalize">{lead.source?.replace('_', ' ') || '—'}</td>
              <td className="px-5 py-3.5">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-5 py-3.5">
                <LeadActions lead={lead} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
