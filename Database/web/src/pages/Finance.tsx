import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Plus, Search } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getTransactions, createTransaction } from '../api/client';
import type { FinancialTransaction, TransactionType } from '../types';

const fmt = (n: number) =>
  n >= 1e6 ? `PKR ${(n / 1e6).toFixed(2)}M` : `PKR ${n.toLocaleString()}`;

export default function Finance() {
  const [txns, setTxns]       = useState<FinancialTransaction[]>([]);
  const [search, setSearch]   = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    type: 'donation' as TransactionType,
    amount: '', description: '', category: '', party: '',
  });

  useEffect(() => {
    getTransactions().then((d) => { setTxns(d); setLoading(false); });
  }, []);

  const totalDonations   = txns.filter((t) => t.type === 'donation').reduce((s, t) => s + t.amount, 0);
  const totalExpenses    = txns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalProcurement = txns.filter((t) => t.type === 'procurement').reduce((s, t) => s + t.amount, 0);
  const balance          = totalDonations - totalExpenses - totalProcurement;

  const filtered = txns.filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.party.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'all' || t.type === filterType;
    return matchSearch && matchType;
  });

  const categoryData = [...new Set(txns.map((t) => t.category))].map((cat) => ({
    name: cat,
    amount: txns.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0) / 1000,
  }));

  const handleCreate = async () => {
    const nt = await createTransaction({ ...form, amount: parseFloat(form.amount) });
    setTxns((prev) => [nt, ...prev]);
    setShowForm(false);
    setForm({ type: 'donation', amount: '', description: '', category: '', party: '' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ledger & disaster budgets"
        description={`${txns.length} ledger lines: donations, operational expenses, and procurement. Tie each event to categories for MIS roll-ups and audit.`}
        actions={
          <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Post transaction
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-emerald-400" /><p className="text-xs text-slate-400">Total Donations</p></div>
          <p className="text-xl font-bold text-emerald-400">{fmt(totalDonations)}</p>
        </div>
        <div className="card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-400" /><p className="text-xs text-slate-400">Total Expenses</p></div>
          <p className="text-xl font-bold text-red-400">{fmt(totalExpenses)}</p>
        </div>
        <div className="card p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-2"><ShoppingCart className="w-4 h-4 text-blue-400" /><p className="text-xs text-slate-400">Procurement</p></div>
          <p className="text-xl font-bold text-blue-400">{fmt(totalProcurement)}</p>
        </div>
        <div className={`card p-5 border-l-4 ${balance >= 0 ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400">Net Balance</p></div>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmt(Math.abs(balance))}</p>
        </div>
      </div>

      {/* Category chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Spending by Category (PKR thousands)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={categoryData} barSize={28}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => [`PKR ${(v * 1000).toLocaleString()}`, 'Amount']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
            <Bar dataKey="amount" fill="#3b82f6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction table */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input className="input pl-9" placeholder="Search transactions…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-36" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="donation">Donation</option>
          <option value="expense">Expense</option>
          <option value="procurement">Procurement</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="table-th">#</th>
              <th className="table-th">Type</th>
              <th className="table-th">Description</th>
              <th className="table-th">Party</th>
              <th className="table-th">Category</th>
              <th className="table-th">Amount</th>
              <th className="table-th">Date</th>
              <th className="table-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8} className="table-td text-center py-12 text-slate-500">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={8} className="table-td text-center py-12 text-slate-500">No transactions found</td></tr>}
            {filtered.map((t) => (
              <tr key={t.id} className="table-tr">
                <td className="table-td font-mono text-slate-500">#{t.id}</td>
                <td className="table-td"><Badge value={t.type} variant="txn" /></td>
                <td className="table-td text-white max-w-xs truncate">{t.description}</td>
                <td className="table-td text-slate-400">{t.party}</td>
                <td className="table-td text-slate-400">{t.category}</td>
                <td className={`table-td font-semibold ${t.type === 'donation' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.type === 'donation' ? '+' : '-'} PKR {t.amount.toLocaleString()}
                </td>
                <td className="table-td text-slate-500">{t.date}</td>
                <td className="table-td"><Badge value={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create transaction modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Record Transaction">
        <div className="space-y-4">
          <div>
            <label className="label">Transaction Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}>
              <option value="donation">Donation</option>
              <option value="expense">Expense</option>
              <option value="procurement">Procurement</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount (PKR)</label>
              <input type="number" className="input" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <input className="input" placeholder="e.g. Operations" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Party (Donor / Vendor)</label>
            <input className="input" placeholder="Name of organization or individual" value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input h-20 resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleCreate} disabled={!form.amount || !form.party}>Save Transaction</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
