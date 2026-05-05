import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'red' | 'blue' | 'emerald' | 'yellow' | 'orange' | 'purple';
  sub?: string;
}

const COLORS = {
  red:     { bar: 'from-red-500 to-rose-600',     icon: 'text-red-300',     bg: 'bg-red-500/10' },
  blue:    { bar: 'from-sky-500 to-blue-600',     icon: 'text-sky-300',     bg: 'bg-sky-500/10' },
  emerald: { bar: 'from-emerald-500 to-teal-600', icon: 'text-emerald-300', bg: 'bg-emerald-500/10' },
  yellow:  { bar: 'from-amber-500 to-yellow-600', icon: 'text-amber-200',   bg: 'bg-amber-500/10' },
  orange:  { bar: 'from-orange-500 to-red-500',   icon: 'text-orange-300',  bg: 'bg-orange-500/10' },
  purple:  { bar: 'from-violet-500 to-purple-600', icon: 'text-violet-300',  bg: 'bg-violet-500/10' },
};

export default function StatCard({ label, value, icon: Icon, color = 'blue', sub }: StatCardProps) {
  const c = COLORS[color];
  return (
    <div className="card relative overflow-hidden p-5">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-90 ${c.bar}`} />
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-3 ring-1 ring-white/5 ${c.bg}`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums tracking-tight text-white">{value}</p>
          {sub && <p className="mt-1 text-[11px] text-slate-500">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
