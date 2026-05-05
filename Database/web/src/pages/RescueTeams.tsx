import { useEffect, useState } from 'react';
import { Users2, MapPin, UserCheck, Plus } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getTeams, getReports, assignTeam } from '../api/client';
import type { RescueTeam, EmergencyReport } from '../types';

const TYPE_ICONS: Record<string, string> = { medical: '🏥', fire: '🔥', rescue: '🪖', search: '🔍' };

export default function RescueTeams() {
  const [teams, setTeams]     = useState<RescueTeam[]>([]);
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [selected, setSelected] = useState<RescueTeam | null>(null);
  const [assignModal, setAssignModal] = useState<RescueTeam | null>(null);
  const [chosenReport, setChosenReport] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTeams(), getReports()]).then(([t, r]) => {
      setTeams(t); setReports(r); setLoading(false);
    });
  }, []);

  const openReports = reports.filter((r) => r.status === 'open' || r.status === 'assigned');

  const handleAssign = async () => {
    if (!assignModal || !chosenReport) return;
    const updated = await assignTeam(assignModal.id, parseInt(chosenReport));
    setTeams((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    setAssignModal(null);
    setChosenReport('');
  };

  const stats = {
    available: teams.filter((t) => t.status === 'available').length,
    busy: teams.filter((t) => t.status === 'busy').length,
    assigned: teams.filter((t) => t.status === 'assigned').length,
    completed: teams.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rescue & medical teams"
        description={`${teams.length} registered units. Status follows Available → Assigned → Busy → Completed. Assign nearest-capable teams to open incidents.`}
      />

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4">
        {([['available','emerald'],['assigned','blue'],['busy','red'],['completed','slate']] as const).map(([status, color]) => (
          <div key={status} className={`card p-4 border-l-4 ${
            color === 'emerald' ? 'border-l-emerald-500' :
            color === 'blue'    ? 'border-l-blue-500' :
            color === 'red'     ? 'border-l-red-500' : 'border-l-slate-600'
          }`}>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{status}</p>
            <p className="text-3xl font-bold text-white mt-1">{stats[status]}</p>
          </div>
        ))}
      </div>

      {/* Team cards */}
      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team) => {
            const assignedReport = team.assignedReportId ? reports.find((r) => r.id === team.assignedReportId) : null;
            return (
              <div key={team.id} className="card p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{TYPE_ICONS[team.type]}</div>
                    <div>
                      <h3 className="font-semibold text-white">{team.name}</h3>
                      <p className="text-xs text-slate-400 capitalize">{team.type} Team</p>
                    </div>
                  </div>
                  <Badge value={team.status} />
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{team.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Leader: {team.leader}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users2 className="w-3.5 h-3.5" />
                    <span>{team.memberCount} members</span>
                  </div>
                </div>

                {assignedReport && (
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Assigned to</p>
                    <p className="text-sm text-white font-medium mt-0.5">{assignedReport.location}</p>
                    <p className="text-xs text-slate-400 truncate">{assignedReport.description.substring(0, 50)}…</p>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button onClick={() => setSelected(team)} className="btn-secondary flex-1 py-1.5 text-xs justify-center">Details</button>
                  {team.status === 'available' && (
                    <button onClick={() => setAssignModal(team)} className="btn-primary flex-1 py-1.5 text-xs justify-center">
                      <Plus className="w-3.5 h-3.5" /> Assign
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="label">Type</p><p className="text-sm text-white capitalize">{selected.type}</p></div>
              <div><p className="label">Status</p><Badge value={selected.status} /></div>
              <div><p className="label">Location</p><p className="text-sm text-white">{selected.location}</p></div>
              <div><p className="label">Members</p><p className="text-sm text-white">{selected.memberCount}</p></div>
              <div><p className="label">Leader</p><p className="text-sm text-white">{selected.leader}</p></div>
              <div><p className="label">Assigned Report</p><p className="text-sm text-white">{selected.assignedReportId ? `#${selected.assignedReportId}` : 'None'}</p></div>
            </div>
            <div><p className="label">Last Updated</p><p className="text-sm text-white">{new Date(selected.lastUpdated).toLocaleString('en-PK')}</p></div>
          </div>
        )}
      </Modal>

      {/* Assign modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title={`Assign ${assignModal?.name}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Select Incident Report</label>
            <select className="input" value={chosenReport} onChange={(e) => setChosenReport(e.target.value)}>
              <option value="">-- Select a report --</option>
              {openReports.map((r) => (
                <option key={r.id} value={r.id}>#{r.id} · {r.location} ({r.severity})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setAssignModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleAssign} disabled={!chosenReport}>Assign Team</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
