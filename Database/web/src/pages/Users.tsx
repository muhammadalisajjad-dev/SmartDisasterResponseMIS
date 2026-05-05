import { useEffect, useState } from 'react';
import { Plus, Shield, Mail, UserCheck } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getUsers } from '../api/client';
import type { User, UserRole } from '../types';

const ROLE_LABELS: Record<UserRole, string> = {
  admin:               'Administrator',
  emergency_operator:  'Emergency Operator',
  field_officer:       'Field Officer',
  warehouse_manager:   'Warehouse Manager',
  finance_officer:     'Finance Officer',
};

const ROLE_PERMS: Record<UserRole, string[]> = {
  admin:               ['Full system access', 'Approve/reject requests', 'Manage users', 'View audit logs'],
  emergency_operator:  ['Create/manage reports', 'Assign rescue teams', 'View hospital data'],
  field_officer:       ['View/update reports', 'Request resources', 'Update mission status'],
  warehouse_manager:   ['Manage inventory', 'Dispatch resources', 'View warehouse stock'],
  finance_officer:     ['Record transactions', 'View financial reports', 'Request financial approvals'],
};

export default function Users() {
  const [users, setUsers]     = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', role: 'field_officer' as UserRole, password: '' });

  useEffect(() => {
    getUsers().then((d) => { setUsers(d); setLoading(false); });
  }, []);

  const roleCount = (role: UserRole) => users.filter((u) => u.role === role).length;

  const AVATAR_COLORS: Record<UserRole, string> = {
    admin: 'bg-red-600', emergency_operator: 'bg-orange-600',
    field_officer: 'bg-yellow-600', warehouse_manager: 'bg-blue-600',
    finance_officer: 'bg-emerald-600',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & RBAC"
        description={`${users.length} identities in this demo directory. Fine-grained CRUD rules should be enforced in your API and mirrored in SQL views for least-privilege reporting.`}
        actions={
          <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Provision user
          </button>
        }
      />

      {/* Role summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
          <div key={role} className="card p-4">
            <div className={`w-8 h-8 ${AVATAR_COLORS[role]} rounded-lg flex items-center justify-center mb-2`}>
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-slate-400 leading-tight">{ROLE_LABELS[role]}</p>
            <p className="text-2xl font-bold text-white mt-1">{roleCount(role)}</p>
          </div>
        ))}
      </div>

      {/* User cards */}
      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="card p-5 flex items-center gap-4 cursor-pointer hover:border-slate-600 transition-colors"
              onClick={() => setSelected(u)}
            >
              <div className={`w-12 h-12 ${AVATAR_COLORS[u.role]} rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0`}>
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{u.name}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{u.email}</span>
                </div>
                <div className="mt-2">
                  <Badge value={u.role.replace(/_/g, ' ')} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${AVATAR_COLORS[selected.role]} rounded-2xl flex items-center justify-center text-2xl font-bold text-white`}>
                {selected.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-white">{selected.name}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selected.email}</p>
                <div className="mt-1"><Badge value={selected.role.replace(/_/g, ' ')} /></div>
              </div>
            </div>
            <div>
              <p className="label flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />Permissions</p>
              <ul className="space-y-1.5 mt-2">
                {ROLE_PERMS[selected.role].map((perm) => (
                  <li key={perm} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Create user modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add New User" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="user@disaster.gov" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
              {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Temporary Password</label>
            <input type="password" className="input" placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" disabled={!form.name || !form.email} onClick={() => { alert('User created (mock)'); setShowForm(false); }}>Create User</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
