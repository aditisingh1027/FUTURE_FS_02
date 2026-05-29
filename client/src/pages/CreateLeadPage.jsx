import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import leadService from '../services/leadService';
import toast from 'react-hot-toast';

const SOURCE_OPTIONS = ['website', 'referral', 'cold_call', 'email', 'social_media', 'other'];
const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  source: 'website',
  status: 'new',
  followUpDate: '',
};

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, error }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-medium text-dark-100">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-2xl border px-4 py-3 bg-dark-800/70 text-sm text-white transition-all outline-none focus:ring-2 focus:ring-brand-500/40 ${error ? 'border-red-500 text-red-100' : 'border-white/10'}`}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

const SelectField = ({ id, label, value, onChange, options, error }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-medium text-dark-100">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`w-full rounded-2xl border px-4 py-3 bg-dark-800/70 text-sm text-white transition-all outline-none focus:ring-2 focus:ring-brand-500/40 ${error ? 'border-red-500 text-red-100' : 'border-white/10'}`}
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-dark-950 text-white capitalize">
          {option.replace('_', ' ')}
        </option>
      ))}
    </select>
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

const CreateLeadPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = 'Lead name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.status) next.status = 'Status is required.';
    if (!form.source) next.source = 'Source is required.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await leadService.createLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        source: form.source,
        status: form.status,
        followUpDate: form.followUpDate || undefined,
      });
      toast.success('Lead created successfully.');
      navigate('/leads');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-[#09101f]/95 shadow-[0_35px_90px_rgba(0,0,0,0.25)]">
          <div className="bg-[#081222] px-8 py-8 border-b border-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Create Lead</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">New lead details</h1>
                <p className="mt-2 max-w-xl text-sm text-dark-50/70">Add a lead profile, track follow-up dates, and get started with your CRM workflow.</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-sky-500/15 to-cyan-500/10 border border-white/10 px-5 py-4 text-sm text-white">
                <p className="font-semibold text-white">Quick tips</p>
                <p className="mt-2 text-dark-50/70">Use accurate contact data and follow-up dates to keep the pipeline moving.</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#07101f]">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <InputField
                  id="name"
                  label="Name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  error={errors.name}
                />
                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  error={errors.email}
                />
                <InputField
                  id="phone"
                  label="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  error={errors.phone}
                />
                <SelectField
                  id="source"
                  label="Source"
                  value={form.source}
                  onChange={handleChange}
                  options={SOURCE_OPTIONS}
                  error={errors.source}
                />
                <SelectField
                  id="status"
                  label="Status"
                  value={form.status}
                  onChange={handleChange}
                  options={STATUS_OPTIONS}
                  error={errors.status}
                />
                <InputField
                  id="followUpDate"
                  label="Follow Up Date"
                  type="date"
                  value={form.followUpDate}
                  onChange={handleChange}
                  placeholder="Select date"
                  error={errors.followUpDate}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-dark-50/70">Fill all required fields and submit to create a new lead record.</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating lead…' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeadPage;
