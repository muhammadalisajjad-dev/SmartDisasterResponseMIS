interface BadgeProps {
  value: string;
  variant?: 'severity' | 'status' | 'team' | 'approval' | 'txn' | 'role' | 'action';
}

const SEVERITY: Record<string, string> = {
  low:      'bg-blue-900/50   text-blue-300   border-blue-700',
  medium:   'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  high:     'bg-orange-900/50 text-orange-300 border-orange-700',
  critical: 'bg-red-900/50    text-red-300    border-red-700',
};

const STATUS: Record<string, string> = {
  open:        'bg-slate-700    text-slate-300   border-slate-600',
  assigned:    'bg-blue-900/50  text-blue-300    border-blue-700',
  in_progress: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  resolved:    'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  closed:      'bg-slate-800    text-slate-500   border-slate-700',
  available:   'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  busy:        'bg-red-900/50   text-red-300     border-red-700',
  completed:   'bg-slate-700    text-slate-400   border-slate-600',
  pending:     'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  approved:    'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  rejected:    'bg-red-900/50   text-red-300     border-red-700',
};

const ACTION: Record<string, string> = {
  CREATE:  'bg-blue-900/50    text-blue-300    border-blue-700',
  UPDATE:  'bg-yellow-900/50  text-yellow-300  border-yellow-700',
  DELETE:  'bg-red-900/50     text-red-300     border-red-700',
  LOGIN:   'bg-slate-700      text-slate-300   border-slate-600',
  APPROVE: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  REJECT:  'bg-red-900/50     text-red-300     border-red-700',
};

const TXN: Record<string, string> = {
  donation:    'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  expense:     'bg-red-900/50     text-red-300     border-red-700',
  procurement: 'bg-blue-900/50    text-blue-300    border-blue-700',
};

export default function Badge({ value, variant = 'status' }: BadgeProps) {
  let cls = '';
  if (variant === 'severity') cls = SEVERITY[value] ?? SEVERITY.low;
  else if (variant === 'action') cls = ACTION[value] ?? '';
  else if (variant === 'txn')   cls = TXN[value] ?? '';
  else cls = STATUS[value] ?? STATUS.open;

  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {(value || '').replace(/_/g, ' ')}
    </span>
  );
}
