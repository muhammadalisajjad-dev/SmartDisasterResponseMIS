import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getApprovals, reviewApproval } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { ApprovalRequest, ApprovalStatus } from '../types';

const TYPE_LABEL: Record<string, string> = {
  resource_dispatch: '📦 Resource Dispatch',
  rescue_deployment: '🚁 Rescue Deployment',
  financial:         '💰 Financial',
};

export default function Approvals() {
  const { hasRole } = useAuth();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [filter, setFilter]       = useState<'all' | ApprovalStatus>('all');
  const [selected, setSelected]   = useState<ApprovalRequest | null>(null);
  const [loading, setLoading]     = useState(true);

  const canApprove = hasRole('admin');

  useEffect(() => {
    getApprovals().then((d) => { setApprovals(d); setLoading(false); });
  }, []);

  const counts = {
    all:      approvals.length,
    pending:  approvals.filter((a) => a.status === 'pending').length,
    approved: approvals.filter((a) => a.status === 'approved').length,
    rejected: approvals.filter((a) => a.status === 'rejected').length,
  };

  const visible = filter === 'all' ? approvals : approvals.filter((a) => a.status === filter);

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    const updated = await reviewApproval(id, status);
    setApprovals((prev) => prev.map((a) => a.id === updated.id ? updated : a));
    if (selected?.id === id) setSelected(updated);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval queue"
        description="Resource dispatches, rescue deployments, and high-value financial postings stay pending until an authorised administrator confirms execution."
      />

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all','pending','approved','rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {status} <span className="ml-1 text-xs opacity-70">({counts[status]})</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading…</p>
      ) : (
        <div className="space-y-3">
          {visible.length === 0 && (
            <div className="card p-12 text-center text-slate-500">No {filter} requests</div>
          )}
          {visible.map((a) => (
            <div
              key={a.id}
              className={`card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer hover:border-slate-600 transition-colors ${
                a.status === 'pending' ? 'border-yellow-700/40' : ''
              }`}
              onClick={() => setSelected(a)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm text-slate-400">{TYPE_LABEL[a.type]}</span>
                  <Badge value={a.status} />
                </div>
                <p className="font-semibold text-white">{a.title}</p>
                <p className="text-sm text-slate-400 mt-0.5 truncate">{a.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>Requested by <span className="text-slate-300">{a.requestedBy}</span></span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.requestedAt).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                {a.reviewedBy && (
                  <p className="text-xs text-slate-500 mt-1">
                    {a.status === 'approved' ? '✓ Approved' : '✗ Rejected'} by <span className="text-slate-300">{a.reviewedBy}</span>
                    {a.reviewedAt && ` · ${new Date(a.reviewedAt).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}`}
                  </p>
                )}
              </div>

              {canApprove && a.status === 'pending' && (
                <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleReview(a.id, 'approved')} className="btn-success py-1.5 px-3 text-xs">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => handleReview(a.id, 'rejected')} className="btn-danger py-1.5 px-3 text-xs">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title ?? ''} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="label">Type</p><p className="text-sm text-white">{TYPE_LABEL[selected.type]}</p></div>
              <div><p className="label">Status</p><Badge value={selected.status} /></div>
              <div><p className="label">Requested By</p><p className="text-sm text-white">{selected.requestedBy}</p></div>
              <div><p className="label">Requested At</p><p className="text-sm text-white">{new Date(selected.requestedAt).toLocaleString('en-PK')}</p></div>
            </div>
            <div>
              <p className="label">Description</p>
              <p className="text-sm text-white bg-slate-900 rounded-lg p-3">{selected.description}</p>
            </div>
            {selected.reviewedBy && (
              <div className="grid grid-cols-2 gap-3">
                <div><p className="label">Reviewed By</p><p className="text-sm text-white">{selected.reviewedBy}</p></div>
                <div><p className="label">Reviewed At</p><p className="text-sm text-white">{selected.reviewedAt ? new Date(selected.reviewedAt).toLocaleString('en-PK') : '—'}</p></div>
              </div>
            )}
            {canApprove && selected.status === 'pending' && (
              <div className="flex gap-3 pt-2 border-t border-slate-700">
                <button onClick={() => handleReview(selected.id, 'approved')} className="btn-success flex-1 justify-center">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => handleReview(selected.id, 'rejected')} className="btn-danger flex-1 justify-center">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
