import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';
import { getAuditLogs } from '../api/client';
import type { AuditLog } from '../types';

const ROLE_LABELS: Record<string, string> = {
  admin:               'Admin',
  emergency_operator:  'Emergency Op.',
  field_officer:       'Field Officer',
  warehouse_manager:   'Warehouse Mgr.',
  finance_officer:     'Finance Officer',
};

export default function AuditLogs() {
  const [logs, setLogs]         = useState<AuditLog[]>([]);
  const [search, setSearch]     = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterRole, setFilterRole]     = useState('all');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getAuditLogs().then((d) => { setLogs(d); setLoading(false); });
  }, []);

  const filtered = logs.filter((l) => {
    const matchSearch = l.userName.toLowerCase().includes(search.toLowerCase()) ||
                        l.details.toLowerCase().includes(search.toLowerCase()) ||
                        l.tableName.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'all' || l.action === filterAction;
    const matchRole   = filterRole   === 'all' || l.role   === filterRole;
    return matchSearch && matchAction && matchRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit trail"
        description="Immutable-style event log: who changed what, when, and on which entity. In production this is fed by triggers and application middleware writing to an audit table."
      />

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input className="input pl-9" placeholder="Search user, action, details…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select className="input w-36" value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
            <option value="all">All Actions</option>
            {['CREATE','UPDATE','DELETE','LOGIN','APPROVE','REJECT'].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="input w-44" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-500">{filtered.length} records shown</p>

      {/* Timeline */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="table-th">Timestamp</th>
              <th className="table-th">User</th>
              <th className="table-th">Role</th>
              <th className="table-th">Action</th>
              <th className="table-th">Table</th>
              <th className="table-th">Record ID</th>
              <th className="table-th">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="table-td text-center py-12 text-slate-500">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="table-td text-center py-12 text-slate-500">No logs found</td></tr>}
            {filtered.map((log) => (
              <tr key={log.id} className="table-tr">
                <td className="table-td text-xs text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'medium' })}
                </td>
                <td className="table-td font-medium text-white">{log.userName}</td>
                <td className="table-td text-xs text-slate-400">{ROLE_LABELS[log.role]}</td>
                <td className="table-td"><Badge value={log.action} variant="action" /></td>
                <td className="table-td font-mono text-xs text-slate-400">{log.tableName}</td>
                <td className="table-td font-mono text-xs text-slate-500">#{log.recordId}</td>
                <td className="table-td text-xs text-slate-400 max-w-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
