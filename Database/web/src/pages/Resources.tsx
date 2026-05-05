import { useEffect, useState } from 'react';
import { Package, AlertTriangle, Plus, Search } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getResources } from '../api/client';
import type { Resource, ResourceType } from '../types';

const TYPES: ResourceType[] = ['food','water','medicine','shelter','equipment'];
const TYPE_COLOR: Record<string, string> = {
  food: 'text-emerald-400', water: 'text-blue-400',
  medicine: 'text-red-400', shelter: 'text-yellow-400', equipment: 'text-purple-400',
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch]       = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterWh, setFilterWh]   = useState('all');
  const [selected, setSelected]   = useState<Resource | null>(null);
  const [showAlloc, setShowAlloc] = useState(false);
  const [loading, setLoading]     = useState(true);

  const [allocForm, setAllocForm] = useState({ resourceId: '', quantity: '', destination: '', reason: '' });

  useEffect(() => {
    getResources().then((d) => { setResources(d); setLoading(false); });
  }, []);

  const warehouses = [...new Set(resources.map((r) => r.warehouseName))];

  const filtered = resources.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'all' || r.type === filterType;
    const matchWh     = filterWh   === 'all' || r.warehouseName === filterWh;
    return matchSearch && matchType && matchWh;
  });

  const lowStockItems = resources.filter((r) => r.quantity <= r.threshold);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses & inventory"
        description={`${resources.length} SKUs across ${warehouses.length} depots. Thresholds drive low-stock alerts; dispatches should route through approvals in production.`}
        actions={
          <button type="button" onClick={() => setShowAlloc(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Request dispatch
          </button>
        }
      />

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-300">Low Stock Alert — {lowStockItems.length} item(s) below threshold</p>
            <p className="text-xs text-yellow-400 mt-0.5">{lowStockItems.map((r) => r.name).join(' · ')}</p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {TYPES.map((type) => {
          const count = resources.filter((r) => r.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? 'all' : type)}
              className={`card p-4 text-left transition-colors ${filterType === type ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className={`text-sm font-semibold capitalize ${TYPE_COLOR[type]}`}>{type}</p>
              <p className="text-2xl font-bold text-white mt-1">{count}</p>
              <p className="text-xs text-slate-500">items</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input className="input pl-9" placeholder="Search resources…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-40" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="input w-48" value={filterWh} onChange={(e) => setFilterWh(e.target.value)}>
          <option value="all">All Warehouses</option>
          {warehouses.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="table-th">Item</th>
              <th className="table-th">Type</th>
              <th className="table-th">Warehouse</th>
              <th className="table-th">Quantity</th>
              <th className="table-th">Threshold</th>
              <th className="table-th">Stock Level</th>
              <th className="table-th">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="table-td text-center py-12 text-slate-500">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="table-td text-center py-12 text-slate-500">No items found</td></tr>}
            {filtered.map((r) => {
              const pct = Math.min(100, (r.quantity / (r.threshold * 3)) * 100);
              const isLow = r.quantity <= r.threshold;
              return (
                <tr key={r.id} className="table-tr cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <Package className={`w-4 h-4 ${TYPE_COLOR[r.type]}`} />
                      <span className="font-medium text-white">{r.name}</span>
                    </div>
                  </td>
                  <td className="table-td capitalize"><Badge value={r.type} /></td>
                  <td className="table-td text-slate-400">{r.warehouseName}</td>
                  <td className="table-td font-semibold text-white">{r.quantity} <span className="text-slate-500 text-xs">{r.unit}</span></td>
                  <td className="table-td text-slate-500">{r.threshold} {r.unit}</td>
                  <td className="table-td w-32">
                    <div className="space-y-1">
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                      {isLow && <p className="text-xs text-red-400">⚠ Low</p>}
                    </div>
                  </td>
                  <td className="table-td text-slate-500 text-xs">{new Date(r.lastUpdated).toLocaleDateString('en-PK')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} size="sm">
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="label">Type</p><p className="text-sm text-white capitalize">{selected.type}</p></div>
              <div><p className="label">Warehouse</p><p className="text-sm text-white">{selected.warehouseName}</p></div>
              <div><p className="label">Quantity</p><p className="text-lg font-bold text-white">{selected.quantity} {selected.unit}</p></div>
              <div><p className="label">Threshold</p><p className="text-sm text-white">{selected.threshold} {selected.unit}</p></div>
            </div>
            {selected.quantity <= selected.threshold && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-sm text-red-300">⚠ Stock is at or below threshold. Restock recommended.</div>
            )}
            <div><p className="label">Last Updated</p><p className="text-sm text-white">{new Date(selected.lastUpdated).toLocaleString('en-PK')}</p></div>
          </div>
        )}
      </Modal>

      {/* Allocation request modal */}
      <Modal open={showAlloc} onClose={() => setShowAlloc(false)} title="Request Resource Allocation">
        <div className="space-y-4">
          <div>
            <label className="label">Resource</label>
            <select className="input" value={allocForm.resourceId} onChange={(e) => setAllocForm({ ...allocForm, resourceId: e.target.value })}>
              <option value="">-- Select resource --</option>
              {resources.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.quantity} {r.unit} available)</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantity</label>
              <input type="number" className="input" placeholder="0" value={allocForm.quantity} onChange={(e) => setAllocForm({ ...allocForm, quantity: e.target.value })} />
            </div>
            <div>
              <label className="label">Destination</label>
              <input className="input" placeholder="City / Zone" value={allocForm.destination} onChange={(e) => setAllocForm({ ...allocForm, destination: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Reason / Justification</label>
            <textarea className="input h-20 resize-none" placeholder="Why is this resource needed?" value={allocForm.reason} onChange={(e) => setAllocForm({ ...allocForm, reason: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setShowAlloc(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => { alert('Allocation request submitted for approval'); setShowAlloc(false); }} disabled={!allocForm.resourceId || !allocForm.quantity}>Submit Request</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
