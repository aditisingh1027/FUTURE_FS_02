import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, required }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-dark-100">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 placeholder-dark-50/40 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
    />
  </div>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center font-bold text-white text-lg">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-white tracking-tight">Antigravity CRM</h1>
            <p className="text-xs text-dark-50/50 font-medium">Create your workspace</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#09101f] p-8 border border-white/10 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-1">Get started</h2>
          <p className="text-sm text-dark-50/60 mb-7">Create your account to start managing leads</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="name"
              label="Full name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
            />
            <InputField
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-sm font-medium text-dark-100">Role</label>
              <select
                id="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-white/8 text-dark-100 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all appearance-none cursor-pointer"
              >
                <option value="sales">Sales Representative</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              id="register-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-50/60 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
