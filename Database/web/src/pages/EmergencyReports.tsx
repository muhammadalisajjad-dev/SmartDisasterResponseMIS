import { useEffect, useState } from 'react';
import { Plus, Search, Filter, MapPin, Clock } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getReports, createReport } from '../api/client';
import type { EmergencyReport, DisasterType, Severity } from '../types';

const DISASTER_TYPES: DisasterType[] = ['flood','earthquake','fire','cyclone','landslide','other'];
const SEVERITIES: Severity[]         = ['low','medium','high','critical'];

export default function EmergencyReports() {
  const [reports, setReports]       = useState<EmergencyReport[]>([]);
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSev, setFilterSev]   = useState('all');
  const [showForm, setShowForm]     = useState(false);
  const [selected, setSelected]     = useState<EmergencyReport | null>(null);
  const [loading, setLoading]       = useState(true);

  const [form, setForm] = useState({
    location: '', disasterType: 'flood' as DisasterType,
    severity: 'medium' as Severity, description: '', reportedBy: 'Citizen App',
  });

  useEffect(() => {
    getReports().then((d) => { setReports(d); setLoading(false); });
  }, []);

  const filtered = reports.filter((r) => {
    const matchSearch = (r.location || '').toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'all' || r.disasterType === filterType;
    const matchSev    = filterSev  === 'all' || r.severity     === filterSev;
    return matchSearch && matchType && matchSev;
  });

  const handleCreate = async () => {
    const nr = await createReport(form);
    setReports((prev) => [nr, ...prev]);
    setShowForm(false);
    setForm({ location: '', disasterType: 'flood', severity: 'medium', description: '', reportedBy: 'Citizen App' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident reports"
        description={`${reports.length} records from citizen app, helpline 1122, and monitoring feeds. Filter by type and severity to prioritise response.`}
        actions={
          <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Log new incident
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input className="input pl-9" placeholder="Search location or description…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select className="input w-36" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            {DISASTER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="input w-36" value={filterSev} onChange={(e) => setFilterSev(e.target.value)}>
            <option value="all">All Severity</option>
            {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="table-th">#</th>
              <th className="table-th">Location</th>
              <th className="table-th">Type</th>
              <th className="table-th">Severity</th>
              <th className="table-th">Status</th>
              <th className="table-th">Reported</th>
              <th className="table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="table-td text-center py-12 text-slate-500">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="table-td text-center py-12 text-slate-500">No reports found</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="table-tr cursor-pointer" onClick={() => setSelected(r)}>
                <td className="table-td font-mono text-slate-500">#{r.id}</td>
                <td className="table-td">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-medium text-white">{r.location}</span>
                  </div>
                </td>
                <td className="table-td capitalize">{r.disasterType}</td>
                <td className="table-td"><Badge value={r.severity} variant="severity" /></td>
                <td className="table-td"><Badge value={r.status} /></td>
                <td className="table-td">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(r.reportedAt).toLocaleDateString('en-PK')}
                  </div>
                </td>
                <td className="table-td">
                  <button onClick={(e) => { e.stopPropagation(); setSelected(r); }} className="btn-secondary py-1 px-2 text-xs">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Incident #${selected?.id} — ${selected?.location}`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="label">Disaster Type</p><p className="text-sm text-white capitalize">{selected.disasterType}</p></div>
              <div><p className="label">Severity</p><Badge value={selected.severity} variant="severity" /></div>
              <div><p className="label">Status</p><Badge value={selected.status} /></div>
              <div><p className="label">Reported By</p><p className="text-sm text-white">{selected.reportedBy}</p></div>
              <div><p className="label">Reported At</p><p className="text-sm text-white">{new Date(selected.reportedAt).toLocaleString('en-PK')}</p></div>
              <div><p className="label">Team Assigned</p><p className="text-sm text-white">{selected.teamAssigned ? `Team #${selected.teamAssigned}` : 'None'}</p></div>
            </div>
            <div><p className="label">Description</p><p className="text-sm text-white bg-slate-900 rounded-lg p-3">{selected.description}</p></div>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Emergency Report">
        <div className="space-y-4">
          <div>
            <label className="label">Location *</label>
            <input className="input" placeholder="City, Province" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Disaster Type</label>
              <select className="input" value={form.disasterType} onChange={(e) => setForm({ ...form, disasterType: e.target.value as DisasterType })}>
                {DISASTER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Severity</label>
              <select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}>
                {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Reported By</label>
            <input className="input" value={form.reportedBy} onChange={(e) => setForm({ ...form, reportedBy: e.target.value })} />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea className="input h-24 resize-none" placeholder="Describe the emergency situation…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleCreate} disabled={!form.location || !form.description}>Submit Report</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
