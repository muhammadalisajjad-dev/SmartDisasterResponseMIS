import { useEffect, useState } from 'react';
import { Hospital as HospitalIcon, Phone, BedDouble, AlertCircle, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getHospitals } from '../api/client';
import type { Hospital } from '../types';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHospitals().then((d) => { setHospitals(d); setLoading(false); });
  }, []);

  const totalBeds     = hospitals.reduce((s, h) => s + h.totalBeds, 0);
  const totalAvail    = hospitals.reduce((s, h) => s + h.availableBeds, 0);
  const totalCritical = hospitals.reduce((s, h) => s + h.criticalCases, 0);
  const overloaded    = hospitals.filter((h) => h.availableBeds < 20).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital network"
        description={`${hospitals.length} facilities reporting bed state and critical census. Use this view for load balancing and patient routing decisions.`}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs text-slate-400">Total Beds</p>
          <p className="text-2xl font-bold text-white mt-1">{totalBeds.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400">Available Beds</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{totalAvail.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400">Critical Cases</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{totalCritical}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400">Overloaded (&lt;20 beds)</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">{overloaded}</p>
        </div>
      </div>

      {/* Hospital cards */}
      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {hospitals.map((h) => {
            const occupancyPct = ((h.admittedPatients / h.totalBeds) * 100).toFixed(0);
            const isCritical = h.availableBeds < 20;
            return (
              <div key={h.id} className={`card p-5 space-y-4 ${isCritical ? 'border-red-700/60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isCritical ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                      <HospitalIcon className={`w-5 h-5 ${isCritical ? 'text-red-400' : 'text-blue-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{h.name}</h3>
                      <p className="text-xs text-slate-400">{h.location}</p>
                    </div>
                  </div>
                  {isCritical && (
                    <span className="flex items-center gap-1 text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full border border-red-700">
                      <AlertCircle className="w-3 h-3" /> Near Capacity
                    </span>
                  )}
                </div>

                {/* Bed occupancy bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Bed Occupancy</span>
                    <span>{occupancyPct}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        parseInt(occupancyPct) >= 90 ? 'bg-red-500' :
                        parseInt(occupancyPct) >= 70 ? 'bg-yellow-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900 rounded-lg p-2">
                    <div className="flex justify-center mb-1"><BedDouble className="w-4 h-4 text-blue-400" /></div>
                    <p className="text-lg font-bold text-white">{h.availableBeds}</p>
                    <p className="text-xs text-slate-500">Available</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2">
                    <div className="flex justify-center mb-1"><Users className="w-4 h-4 text-slate-400" /></div>
                    <p className="text-lg font-bold text-white">{h.admittedPatients}</p>
                    <p className="text-xs text-slate-500">Admitted</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2">
                    <div className="flex justify-center mb-1"><AlertCircle className="w-4 h-4 text-red-400" /></div>
                    <p className="text-lg font-bold text-red-400">{h.criticalCases}</p>
                    <p className="text-xs text-slate-500">Critical</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400 pt-1 border-t border-slate-700">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{h.contactNumber}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
