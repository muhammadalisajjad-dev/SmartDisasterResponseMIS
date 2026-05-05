import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, AlertTriangle, Users2, Package,
  Hospital, DollarSign, CheckSquare, BarChart3,
  Shield, Users, PanelLeftClose, PanelLeft,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Operations',
    items: [
      { path: '/',          label: 'Command overview', icon: LayoutDashboard, roles: ['admin','emergency_operator','field_officer','warehouse_manager','finance_officer'] },
      { path: '/reports',   label: 'Incident reports', icon: AlertTriangle,   roles: ['admin','emergency_operator','field_officer'] },
      { path: '/teams',     label: 'Rescue teams',     icon: Users2,          roles: ['admin','emergency_operator'] },
      { path: '/hospitals', label: 'Hospital network', icon: Hospital,        roles: ['admin','emergency_operator'] },
    ],
  },
  {
    title: 'Logistics',
    items: [
      { path: '/resources', label: 'Warehouses & stock', icon: Package, roles: ['admin','warehouse_manager','field_officer'] },
    ],
  },
  {
    title: 'Finance & compliance',
    items: [
      { path: '/finance',   label: 'Ledger & budgets', icon: DollarSign,  roles: ['admin','finance_officer'] },
      { path: '/approvals', label: 'Approval queue',   icon: CheckSquare, roles: ['admin','emergency_operator','field_officer','warehouse_manager','finance_officer'] },
      { path: '/analytics', label: 'MIS & analytics',  icon: BarChart3,   roles: ['admin','finance_officer','emergency_operator'] },
    ],
  },
  {
    title: 'Administration',
    items: [
      { path: '/audit', label: 'Audit trail',    icon: Shield, roles: ['admin'] },
      { path: '/users', label: 'Users & RBAC',   icon: Users,  roles: ['admin'] },
    ],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? 'w-[4.25rem]' : 'w-64'} flex shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-sm transition-[width] duration-200 ease-out`}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-800/80 px-3">
        {!collapsed && (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-900 shadow-lg ring-1 ring-red-500/30">
              <AlertTriangle className="h-4 w-4 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">NDRC</p>
              <p className="truncate text-sm font-semibold text-white">Response MIS</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-900 ring-1 ring-red-500/30">
            <AlertTriangle className="h-4 w-4 text-white" aria-hidden />
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4">
        {GROUPS.map((group) => {
          const items = group.items.filter((n) => user && n.roles.includes(user.role));
          if (items.length === 0) return null;
          return (
            <div key={group.title}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === '/'}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-sky-600/15 text-sky-100 shadow-sm ring-1 ring-sky-500/35'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-sky-300' : 'text-slate-500'}`} />
                        {!collapsed && <span className="truncate leading-snug">{label}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="shrink-0 border-t border-slate-800/80 px-4 py-3">
          <p className="text-[10px] leading-relaxed text-slate-600">
            Training / demo build · v1.0 · For official use, connect live API and disable mock data.
          </p>
        </div>
      )}
    </aside>
  );
}
