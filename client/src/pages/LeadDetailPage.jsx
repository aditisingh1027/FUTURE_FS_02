import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import leadService from '../services/leadService';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

const STATUS_COLORS = {
  new: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  contacted: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  qualified: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  proposal: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  won: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  lost: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-semibold text-dark-50/50 uppercase tracking-wider">{label}</span>
    <span className="text-sm text-dark-100 font-medium">{value || '—'}</span>
  </div>
);

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const ACTIVITY_TYPE_LABELS = {
    creation: 'Created lead',
    note: 'Note added',
    status_change: 'Status updated',
    deletion: 'Lead deleted',
  };

  const fetchLead = async () => {
    try {
      const res = await leadService.getLeadById(id);
      setLead(res.data.lead);
      setEditStatus(res.data.lead.status);
    } catch {
      toast.error('Lead not found.');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const res = await leadService.getActivities(id);
      setActivities(res.data.activities);
    } catch {
      toast.error('Unable to load activity timeline.');
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchLead();
    fetchActivities();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setEditStatus(newStatus);
    setSavingStatus(true);
    try {
      await leadService.updateLead(id, { status: newStatus });
      setLead((prev) => ({ ...prev, status: newStatus }));
      toast.success('Status updated.');
      fetchActivities();
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      const res = await leadService.addNote(id, noteText.trim());
      setLead((prev) => ({ ...prev, notes: res.data.lead.notes }));
      setNoteText('');
      toast.success('Note added.');
      fetchActivities();
    } catch {
      toast.error('Failed to add note.');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${lead.name}"? This cannot be undone.`)) return;
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted.');
      navigate('/leads');
    } catch {
      toast.error('Failed to delete lead.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-dark-50/50">
            <Link to="/leads" className="hover:text-brand-400 transition-colors">Leads</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            <span className="text-dark-100">{lead.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{lead.name}</h1>
          <p className="text-sm text-dark-50/60">Lead details, status, follow-up schedule, and notes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
          >
            Delete Lead
          </button>
          <div className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${STATUS_COLORS[lead.status] ?? 'text-dark-50 bg-dark-800 border-white/10'}`}>
            {lead.status}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#09101f]/80">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-dark-50/60">Contact</p>
              <p className="mt-2 text-lg font-semibold text-white">{lead.email || 'No email'}</p>
              <p className="text-sm text-dark-50/70">{lead.phone || 'No phone number provided'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-dark-50/60">Pipeline</p>
              <p className="mt-2 text-lg font-semibold text-white">{lead.source?.replace('_', ' ') || 'Unknown source'}</p>
              <p className="text-sm text-dark-50/70">Created on {new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-[#06101e] border border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-dark-50/60">Follow-up Date</p>
              <p className="mt-3 text-xl font-semibold text-white">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not scheduled'}</p>
            </div>
            <div className="rounded-3xl bg-[#06101e] border border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-dark-50/60">Current Status</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[lead.status] ?? 'text-dark-50 bg-dark-800 border-white/10'}`}>
                  {lead.status}
                </span>
                <select
                  value={editStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={savingStatus}
                  className="rounded-2xl border border-white/10 bg-dark-900 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-dark-950 text-white capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-[#08111d]/80 border border-white/10 p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Conversation Log</h2>
            <p className="text-sm text-dark-50/60">Keep track of what was discussed, next steps, and internal notes.</p>
          </div>
        </div>

        <form onSubmit={handleAddNote} className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto]">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a new note for this lead..."
            rows={3}
            className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-dark-900 px-4 py-4 text-sm text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
          <button
            type="submit"
            disabled={addingNote || !noteText.trim()}
            className="inline-flex h-fit items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addingNote ? 'Saving note…' : 'Add Note'}
          </button>
        </form>

        {lead.notes?.length ? (
          <div className="space-y-4">
            {[...(lead.notes || [])].reverse().map((note, index) => (
              <div key={note._id || index} className="rounded-3xl border border-white/10 bg-[#08121f] p-5">
                <p className="text-sm leading-relaxed text-dark-100">{note.content}</p>
                <p className="mt-3 text-xs text-dark-50/50">{note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Unknown time'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#08121f] p-8 text-center text-sm text-dark-50/60">
            No notes yet. Add your first note to keep the lead history in one place.
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-[#08121f]/90 border border-white/10 p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Activity Timeline</h2>
            <p className="text-sm text-dark-50/60">Recent actions and timeline events for this lead.</p>
          </div>
        </div>

        {loadingActivities ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          </div>
        ) : activities.length ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity._id} className="rounded-3xl border border-white/10 bg-[#09121f] p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{ACTIVITY_TYPE_LABELS[activity.type] || 'Activity'}</p>
                    <p className="mt-1 text-sm text-dark-100">{activity.description}</p>
                  </div>
                  <div className="text-xs text-dark-50/60 sm:text-right">
                    <p>{activity.performedBy?.name || 'System'}</p>
                    <p>{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Unknown time'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#08121f] p-8 text-center text-sm text-dark-50/60">
            No activity has been recorded yet for this lead.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetailPage;
