import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Profile</h1>
          <p className="text-sm text-dark-50/60 mt-1">Review your account details, role, and profile settings.</p>
        </div>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center justify-center rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Back to dashboard
        </button>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 bg-dark-950 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-600 text-2xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.name || 'Unnamed user'}</h2>
              <p className="text-sm text-dark-50/70">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown role'}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-dark-50/70">
            <p className="font-semibold text-white">Member since</p>
            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-dark-900 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-dark-50/60">Email</p>
            <p className="mt-3 text-lg font-semibold text-white">{user?.email || 'Not available'}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-dark-900 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-dark-50/60">Role</p>
            <p className="mt-3 text-lg font-semibold text-white">{user?.role || 'Not assigned'}</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-dark-900 p-5">
          <p className="text-sm font-semibold text-white mb-3">Profile summary</p>
          <p className="text-sm leading-6 text-dark-50/70">
            This profile is tied to your current ClientPilot session. Use it to confirm the account email and role for the sales workspace.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
