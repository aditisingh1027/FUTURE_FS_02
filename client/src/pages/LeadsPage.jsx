import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import leadService from '../services/leadService';
import toast from 'react-hot-toast';
import LeadsTable from '../components/leads/LeadsTable';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const SOURCE_OPTIONS = ['website', 'referral', 'cold_call', 'email', 'social_media', 'other'];

const EMPTY_FORM = { name: '', email: '', phone: '', source: 'website', status: 'new', notes: '' };

// ── Modal ─────────────────────────────────────────────────────────────────────
const LeadModal = ({ lead, onClose, onSaved }) => {
  const isEdit = Boolean(lead?._id);
  const [form, setForm] = useState(
    isEdit
      ? { name: lead.name, email: lead.email || '', phone: lead.phone || '', source: lead.source || 'website', status: lead.status, notes: '' }
      : EMPTY_FORM
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required.'); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await leadService.updateLead(lead._id, form);
        toast.success('Lead updated.');
      } else {
        await leadService.createLead(form);
        toast.success('Lead created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg glass-card rounded-2xl border border-white/10 p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-dark-50/60 hover:text-white transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'name', label: 'Full Name *', placeholder: 'John Smith' },
              { name: 'email', label: 'Email', placeholder: 'john@company.com', type: 'email' },
              { name: 'phone', label: 'Phone', placeholder: '+1 555 000 0000' },
            ].map(({ name, label, placeholder, type = 'text' }) => (
              <div key={name} className={name === 'name' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-dark-50/70 mb-1.5">{label}</label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 placeholder-dark-50/30 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-dark-50/70 mb-1.5">Source</label>
              <select name="source" value={form.source} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all appearance-none cursor-pointer">
                {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-50/70 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all appearance-none cursor-pointer">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {!isEdit && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-dark-50/70 mb-1.5">Initial Note</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Optional initial note…"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 placeholder-dark-50/30 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all resize-none"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-dark-100 text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all shadow-lg shadow-brand-600/20 disabled:opacity-60 cursor-pointer">
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [modal, setModal] = useState(null); // null | 'create' | lead object

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        status: filterStatus || undefined,
        source: filterSource || undefined,
        sort: '-createdAt',
      };
      const res = await leadService.getLeads(params);
      setLeads(res.data.leads || []);
    } catch {
      toast.error('Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterSource]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted.');
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch {
      toast.error('Failed to delete lead.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Leads</h1>
          <p className="text-sm text-dark-50/60 mt-1">{leads.length} total leads</p>
        </div>
        <button
          id="add-lead-btn"
          onClick={() => setModal('create')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 placeholder-dark-50/40 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 text-sm focus:outline-none focus:border-brand-500/60 transition-all appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 text-sm focus:outline-none focus:border-brand-500/60 transition-all appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((source) => (
            <option key={source} value={source}>{source.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <LeadsTable
              leads={leads}
              loading={loading}
              emptyStateText={search || filterStatus || filterSource ? 'No leads match your filters.' : 'No leads yet. Click "Add Lead" to get started.'}
              onEdit={setModal}
              onDelete={handleDelete}
            />
          </div>
      {/* Modal */}
      {modal && (
        <LeadModal
          lead={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchLeads}
        />
      )}
    </div>
  );
};

export default LeadsPage;
