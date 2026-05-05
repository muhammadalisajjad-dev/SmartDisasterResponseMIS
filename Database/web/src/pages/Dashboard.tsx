import { useEffect, useState } from 'react';
import { AlertTriangle, Users2, Package, DollarSign, CheckSquare, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';
import { getReports, getTeams, getResources, getApprovals, getTransactions } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { EmergencyReport, RescueTeam, Resource, ApprovalRequest, FinancialTransaction } from '../types';

const PIE_COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6'];

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports]   = useState<EmergencyReport[]>([]);
  const [teams, setTeams]       = useState<RescueTeam[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [txns, setTxns]         = useState<FinancialTransaction[]>([]);

  useEffect(() => {
    getReports().then(setReports);
    getTeams().then(setTeams);
    getResources().then(setResources);
    getApprovals().then(setApprovals);
    getTransactions().then(setTxns);
  }, []);

  const openReports   = reports.filter((r) => r.status === 'open').length;
  const criticalCount = reports.filter((r) => r.severity === 'critical').length;
  const activeTeams   = teams.filter((t) => t.status === 'busy' || t.status === 'assigned').length;
  const lowStock      = resources.filter((r) => r.quantity <= r.threshold).length;
  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;
  const totalDonations = txns.filter((t) => t.type === 'donation').reduce((s, t) => s + t.amount, 0);

  const barData = [
    { name: 'Open',        value: reports.filter((r) => r.status === 'open').length },
    { name: 'Assigned',    value: reports.filter((r) => r.status === 'assigned').length },
    { name: 'In Progress', value: reports.filter((r) => r.status === 'in_progress').length },
    { name: 'Resolved',    value: reports.filter((r) => r.status === 'resolved').length },
  ];

  const pieData = [
    { name: 'Flood',      value: reports.filter((r) => r.disasterType === 'flood').length },
    { name: 'Earthquake', value: reports.filter((r) => r.disasterType === 'earthquake').length },
    { name: 'Fire',       value: reports.filter((r) => r.disasterType === 'fire').length },
    { name: 'Cyclone',    value: reports.filter((r) => r.disasterType === 'cyclone').length },
    { name: 'Other',      value: reports.filter((r) => !['flood','earthquake','fire','cyclone'].includes(r.disasterType)).length },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command overview"
        description={`Signed in as ${user?.name}. Live snapshot of open incidents, deployed teams, warehouse risk, approvals, and funding — ${new Date().toLocaleDateString('en-PK', { dateStyle: 'full' })}.`}
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Open Reports"      value={openReports}          icon={AlertTriangle} color="red"     sub={`${criticalCount} critical`} />
        <StatCard label="Active Teams"      value={activeTeams}          icon={Users2}        color="orange"  sub={`${teams.length} total`} />
        <StatCard label="Low Stock"         value={lowStock}             icon={Package}       color="yellow"  sub="need restock" />
        <StatCard label="Pending Approvals" value={pendingApprovals}     icon={CheckSquare}   color="purple"  sub="awaiting review" />
        <StatCard label="Donations (PKR)"   value={`${(totalDonations/1e6).toFixed(1)}M`} icon={DollarSign} color="emerald" sub="total received" />
        <StatCard label="Total Incidents"   value={reports.length}       icon={TrendingUp}    color="blue"    sub="all time" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Reports by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
              <Bar dataKey="value" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Disaster Types Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent reports */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-white">Recent Incidents</h3>
          </div>
          <div className="divide-y divide-slate-700">
            {reports.slice(0, 5).map((r) => (
              <div key={r.id} className="px-5 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.location}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.description ? r.description.substring(0, 60) : 'No description'}…</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(r.reportedAt).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
                <div className="shrink-0 space-y-1 text-right">
                  <Badge value={r.severity} variant="severity" />
                  <br />
                  <Badge value={r.status} variant="status" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending approvals */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Pending Approvals</h3>
          </div>
          <div className="divide-y divide-slate-700">
            {approvals.filter((a) => a.status === 'pending').length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No pending approvals</p>
            )}
            {approvals.filter((a) => a.status === 'pending').map((a) => (
              <div key={a.id} className="px-5 py-3">
                <p className="text-sm font-medium text-white">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">Requested by {a.requestedBy}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.requestedAt).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource health */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
          <Package className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-semibold text-white">Resource Stock Levels</h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {resources.map((r) => {
            const pct = Math.min(100, (r.quantity / (r.threshold * 3)) * 100);
            const color = r.quantity <= r.threshold ? 'bg-red-500' : r.quantity <= r.threshold * 1.5 ? 'bg-yellow-500' : 'bg-emerald-500';
            return (
              <div key={r.id}>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span className="truncate">{r.name}</span>
                  <span>{r.quantity} {r.unit}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                </div>
                {r.quantity <= r.threshold && (
                  <p className="text-xs text-red-400 mt-1">⚠ Low stock</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
