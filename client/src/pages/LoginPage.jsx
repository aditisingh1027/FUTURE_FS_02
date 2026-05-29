import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, required, error }) => (
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
      required={required}
      className={`w-full px-4 py-3 rounded-2xl bg-dark-800/70 border text-sm transition-all outline-none focus:ring-2 focus:ring-brand-500/40 ${error ? 'border-red-400 text-white' : 'border-white/10 text-dark-100'} ${error ? 'focus:border-red-400' : 'focus:border-brand-500'}`}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = { email: '', password: '', general: '' };
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
    if (errors[e.target.id]) setErrors((prev) => ({ ...prev, [e.target.id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060b16] px-4 py-10 text-white overflow-hidden">
      <div className="relative w-full max-w-md">
        <div className="rounded-[2rem] border border-white/10 bg-[#09101f] shadow-lg overflow-hidden">
          <div className="px-8 py-10 bg-[#07101f] border-b border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-3xl bg-brand-600 flex items-center justify-center text-xl font-bold text-white">
                A
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Antigravity CRM</p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">Sign in</h1>
              </div>
            </div>
<p className="text-sm text-slate-300/80">Sign in to access your Command Center and manage prospect workflows.</p>
          </div>

          <div className="px-8 py-8 bg-[#0f192b] space-y-6">
            {errors.general && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                id="email"
                label="Email address"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hello@company.com"
                required
                error={errors.email}
              />

              <InputField
                id="password"
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                error={errors.password}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="pt-2 text-center text-sm text-slate-400">
              Don’t have an account?{' '}
              <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
