import { Bell, LogOut, ChevronDown, Radio } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS: Record<string, string> = {
  admin:               'Administrator',
  emergency_operator:  'Emergency Operator',
  field_officer:       'Field Officer',
  warehouse_manager:   'Warehouse Manager',
  finance_officer:     'Finance Officer',
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-900/70 px-4 backdrop-blur-md sm:px-6">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded border border-slate-600/50 bg-slate-950/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            <Radio className="h-2.5 w-2.5 text-emerald-400" aria-hidden />
            Secure
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-600 sm:inline">·</span>
          <span className="hidden truncate text-[11px] text-slate-500 sm:inline">Session encrypted · PK region</span>
        </div>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-100 sm:text-base">
          National Disaster Response Center
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-slate-900" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-slate-800 sm:gap-2 sm:pl-2 sm:pr-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-slate-800 text-xs font-bold text-white shadow-inner ring-1 ring-white/10">
              {user?.name.charAt(0)}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-white">{user?.name}</p>
              <p className="text-[11px] leading-tight text-slate-400">{ROLE_LABELS[user?.role ?? '']}</p>
            </div>
            <ChevronDown className={`hidden h-3.5 w-3.5 text-slate-500 transition-transform sm:block ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/95 py-1 shadow-2xl backdrop-blur-md">
              <div className="border-b border-slate-800 px-3 py-2.5">
                <p className="truncate text-xs font-medium text-white">{user?.name}</p>
                <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-300 transition-colors hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4 text-slate-500" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
