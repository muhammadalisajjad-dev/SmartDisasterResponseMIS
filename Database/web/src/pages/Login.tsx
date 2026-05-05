import { useState } from 'react';
import { AlertTriangle, Eye, EyeOff, Zap, Lock, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { login as apiLogin } from '../api/client';

const MOCK = import.meta.env.VITE_MOCK_MODE !== 'false';

const DEMO_ACCOUNTS = [
  { email: 'admin@disaster.gov',     role: 'Administrator',        chip: 'bg-red-500/15 text-red-300 ring-red-500/25' },
  { email: 'sara@disaster.gov',      role: 'Emergency Operator',   chip: 'bg-orange-500/15 text-orange-200 ring-orange-500/25' },
  { email: 'ali@disaster.gov',       role: 'Field Officer',        chip: 'bg-amber-500/15 text-amber-200 ring-amber-500/25' },
  { email: 'zara@disaster.gov',      role: 'Warehouse Manager',    chip: 'bg-sky-500/15 text-sky-200 ring-sky-500/25' },
  { email: 'omar@disaster.gov',      role: 'Finance Officer',      chip: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/25' },
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, token } = await apiLogin(email, password);
      login(user, token);
    } catch {
      setError('Sign-in failed. In demo mode, use a listed account email with any password.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const { user, token } = await apiLogin(demoEmail, 'password');
      login(user, token);
    } catch {
      setError('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-sky-950/40 via-surface-950 to-red-950/30" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        {/* Left — institutional */}
        <div className="flex flex-1 flex-col justify-between border-b border-slate-800/60 p-8 pb-10 lg:border-b-0 lg:border-r lg:p-12">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-900 shadow-lg ring-1 ring-red-400/20">
              <AlertTriangle className="h-6 w-6 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Government of Pakistan</p>
              <p className="mt-1 text-lg font-bold leading-tight text-white">National Disaster Response Center</p>
              <p className="mt-0.5 text-sm text-slate-400">Management Information System — operations portal</p>
            </div>
          </div>

          <div className="mt-10 max-w-md space-y-6 lg:mt-0">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Coordinate relief across incidents, teams, hospitals, and supply lines.
            </h1>
            <ul className="space-y-3 text-sm leading-relaxed text-slate-400">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                Role-based workspaces for operators, field staff, warehouses, and finance.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                Approval workflows and audit-friendly activity history (backed by your SQL layer).
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                Connect this interface to your API when <code className="rounded bg-slate-800 px-1 py-0.5 font-mono text-xs text-slate-300">VITE_MOCK_MODE=false</code>.
              </li>
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-[11px] text-slate-600 lg:mt-0">
            <span className="rounded border border-slate-700 bg-slate-900/60 px-2 py-1 font-mono uppercase tracking-wider text-slate-500">
              Unclassified · Training UI
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Academic project build · May 2026</span>
          </div>
        </div>

        {/* Right — sign in */}
        <div className="flex w-full max-w-md flex-col justify-center px-6 py-12 sm:px-10 lg:max-w-lg lg:px-12">
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-slate-400">
              <Lock className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm font-medium">Secure sign-in</span>
              {MOCK && (
                <span className="ml-auto rounded-md border border-amber-600/40 bg-amber-950/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">
                  Demo data
                </span>
              )}
            </div>

            <h2 className="text-xl font-semibold text-white">Access your workspace</h2>
            <p className="mt-1 text-sm text-slate-500">Use your official email. Password check is relaxed while mock mode is on.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label" htmlFor="email">Email</label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    className="input pl-10"
                    placeholder="name@disaster.gov.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="input pr-10"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-2.5 text-slate-500 transition-colors hover:text-white"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-800/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? 'Signing in…' : 'Sign in to portal'}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-800 pt-6">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-amber-400" aria-hidden />
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Demo roles — one tap</p>
              </div>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((a) => (
                  <button
                    key={a.email}
                    type="button"
                    onClick={() => quickLogin(a.email)}
                    disabled={loading}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-700/60 bg-slate-950/40 px-3 py-2.5 text-left transition-colors hover:border-slate-600 hover:bg-slate-800/50"
                  >
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${a.chip}`}>{a.role}</span>
                    <span className="truncate font-mono text-[11px] text-slate-500">{a.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-600">
            By continuing you agree to organizational monitoring and audit of session activity.
          </p>
        </div>
      </div>
    </div>
  );
}
