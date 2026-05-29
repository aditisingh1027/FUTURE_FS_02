import { Link } from 'react-router-dom';

const LeadActions = ({ lead, onEdit, onDelete }) => (
  <div className="flex items-center gap-2 opacity-100 transition-opacity">
    <Link
      to={`/leads/${lead._id}`}
      className="p-1.5 rounded-lg hover:bg-brand-500/15 text-dark-50/60 hover:text-brand-400 transition-colors"
      title="View"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </Link>
    <button
      type="button"
      onClick={() => onEdit(lead)}
      className="p-1.5 rounded-lg hover:bg-yellow-500/15 text-dark-50/60 hover:text-yellow-400 transition-colors"
      title="Edit"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
    <button
      type="button"
      onClick={() => onDelete(lead._id, lead.name)}
      className="p-1.5 rounded-lg hover:bg-red-500/15 text-dark-50/60 hover:text-red-400 transition-colors"
      title="Delete"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
);

export default LeadActions;
