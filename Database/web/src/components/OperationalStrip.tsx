import { useEffect, useState } from 'react';
import { Activity, Database, ShieldCheck } from 'lucide-react';

const MOCK = import.meta.env.VITE_MOCK_MODE !== 'false';

export default function OperationalStrip() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const dateStr = now.toLocaleDateString('en-PK', {
    timeZone: 'Asia/Karachi',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="h-9 shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 text-[11px] sm:text-xs border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-400">
      <div className="flex items-center gap-2 min-w-0">
        <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden />
        <span className="font-mono tabular-nums text-slate-300 truncate">
          <span className="text-slate-500 hidden sm:inline">Ops time (PKT) </span>
          {timeStr}
          <span className="text-slate-600 mx-1.5 hidden sm:inline">·</span>
          <span className="text-slate-500 hidden sm:inline">{dateStr}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {MOCK ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-700/50 bg-amber-950/40 px-2 py-0.5 text-amber-200/90">
            <Database className="w-3 h-3 text-amber-400" aria-hidden />
            <span className="hidden sm:inline">Data source:</span> Mock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700/50 bg-emerald-950/40 px-2 py-0.5 text-emerald-200/90">
            <ShieldCheck className="w-3 h-3 text-emerald-400" aria-hidden />
            <span className="hidden sm:inline">Data source:</span> Live API
          </span>
        )}
      </div>
    </div>
  );
}
