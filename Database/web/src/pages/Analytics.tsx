import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import { getReports, getTeams, getResources, getTransactions } from '../api/client';
import type { EmergencyReport, RescueTeam, Resource, FinancialTransaction } from '../types';

const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6'];

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' },
};

export default function Analytics() {
  const [reports, setReports]     = useState<EmergencyReport[]>([]);
  const [teams, setTeams]         = useState<RescueTeam[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [txns, setTxns]           = useState<FinancialTransaction[]>([]);

  useEffect(() => {
    getReports().then(setReports);
    getTeams().then(setTeams);
    getResources().then(setResources);
    getTransactions().then(setTxns);
  }, []);

  // -- Charts data --
  const reportsByType = ['flood','earthquake','fire','cyclone','landslide','other'].map((t) => ({
    name: t, count: reports.filter((r) => r.disasterType === t).length,
  })).filter((d) => d.count > 0);

  const reportsBySeverity = ['low','medium','high','critical'].map((s) => ({
    name: s, count: reports.filter((r) => r.severity === s).length,
  }));

  const teamUtilization = ['available','assigned','busy','completed'].map((s) => ({
    name: s, count: teams.filter((t) => t.status === s).length,
  }));

  const resourceByType = ['food','water','medicine','shelter','equipment'].map((t) => ({
    name: t,
    quantity: resources.filter((r) => r.type === t).reduce((s, r) => s + r.quantity, 0),
  }));

  const financeSummary = [
    { name: 'Donations',    amount: txns.filter((t) => t.type === 'donation').reduce((s, t) => s + t.amount, 0) / 1e6 },
    { name: 'Expenses',     amount: txns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / 1e6 },
    { name: 'Procurement',  amount: txns.filter((t) => t.type === 'procurement').reduce((s, t) => s + t.amount, 0) / 1e6 },
  ];

  const responseTimeMock = [
    { day: 'Apr 28', avg: 42 }, { day: 'Apr 29', avg: 35 }, { day: 'Apr 30', avg: 55 },
    { day: 'May 1',  avg: 28 }, { day: 'May 2',  avg: 22 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="MIS & analytics"
        description="Drill-down charts for incident mix, response-time trend (illustrative), team posture, inventory mass, and finance — aligned with coursework reporting expectations."
      />

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Incidents by Disaster Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reportsByType} barSize={36}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {reportsByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Incidents by Severity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={reportsBySeverity} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {reportsBySeverity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Average Response Time (minutes)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={responseTimeMock}>
              <defs>
                <linearGradient id="responseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="avg" stroke="#3b82f6" fill="url(#responseGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Team Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={teamUtilization} barSize={36}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {teamUtilization.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Resource Inventory by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={resourceByType} barSize={36} layout="vertical">
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="quantity" radius={[0,4,4,0]}>
                {resourceByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Financial Overview (PKR millions)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={financeSummary} barSize={48}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`PKR ${v.toFixed(2)}M`, 'Amount']} {...TOOLTIP_STYLE} />
              <Bar dataKey="amount" radius={[4,4,0,0]}>
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
                <Cell fill="#3b82f6" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary table */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-white">MIS Summary Report</h3>
        </div>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="table-th">Metric</th>
                <th className="table-th">Value</th>
                <th className="table-th">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Total Incidents',        value: reports.length,                             note: 'All disaster types' },
                { metric: 'Critical Incidents',     value: reports.filter((r) => r.severity === 'critical').length, note: 'Require immediate response' },
                { metric: 'Open Reports',           value: reports.filter((r) => r.status === 'open').length, note: 'Awaiting assignment' },
                { metric: 'Active Rescue Teams',    value: teams.filter((t) => ['assigned','busy'].includes(t.status)).length, note: 'Currently deployed' },
                { metric: 'Total Team Members',     value: teams.reduce((s, t) => s + t.memberCount, 0), note: 'Across all teams' },
                { metric: 'Resource Line Items',    value: resources.length,                           note: '3 warehouses' },
                { metric: 'Low Stock Alerts',       value: resources.filter((r) => r.quantity <= r.threshold).length, note: 'Below threshold' },
                { metric: 'Total Donations (PKR)',  value: `${(txns.filter((t) => t.type==='donation').reduce((s,t)=>s+t.amount,0)/1e6).toFixed(2)}M`, note: 'Including government funding' },
              ].map((row) => (
                <tr key={row.metric} className="table-tr">
                  <td className="table-td font-medium text-white">{row.metric}</td>
                  <td className="table-td font-bold text-slate-100">{row.value}</td>
                  <td className="table-td text-slate-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
