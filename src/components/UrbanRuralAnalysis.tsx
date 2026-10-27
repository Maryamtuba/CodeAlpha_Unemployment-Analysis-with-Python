import React from 'react';
import { UnemploymentRecord } from '../types';
import { Building2, Trees } from 'lucide-react';

interface UrbanRuralAnalysisProps {
  records: UnemploymentRecord[];
}

export const UrbanRuralAnalysis: React.FC<UrbanRuralAnalysisProps> = ({ records }) => {
  const urbanRecords = records.filter(r => r.area === 'Urban');
  const ruralRecords = records.filter(r => r.area === 'Rural');

  if (urbanRecords.length === 0 || ruralRecords.length === 0) {
    return null;
  }

  const calcAvg = (arr: UnemploymentRecord[], key: 'unemploymentRate' | 'labourParticipationRate') => {
    return arr.length ? arr.reduce((acc, curr) => acc + curr[key], 0) / arr.length : 0;
  };

  const urbanAvgRate = calcAvg(urbanRecords, 'unemploymentRate');
  const ruralAvgRate = calcAvg(ruralRecords, 'unemploymentRate');

  const urbanLockdown = urbanRecords.filter(r => r.date >= '2020-03-01' && r.date <= '2020-06-30');
  const ruralLockdown = ruralRecords.filter(r => r.date >= '2020-03-01' && r.date <= '2020-06-30');

  const urbanLockAvg = calcAvg(urbanLockdown, 'unemploymentRate');
  const ruralLockAvg = calcAvg(ruralLockdown, 'unemploymentRate');

  const urbanLpr = calcAvg(urbanRecords, 'labourParticipationRate');
  const ruralLpr = calcAvg(ruralRecords, 'labourParticipationRate');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl shadow-slate-950/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              4. Urban vs. Rural Economic Fracture
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-mono">
              sns.boxplot
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Comparing mobility lockdown sensitivity, informal absorption, and agricultural resilience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <Building2 className="w-4 h-4" />
              Urban Economy
            </span>
            <span className="text-[11px] font-mono text-slate-400">Industrial &amp; Services Hub</span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Average Rate</div>
              <div className="text-xl font-bold font-mono text-white">{urbanAvgRate.toFixed(2)}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-red-900/40">
              <div className="text-[10px] text-red-400">Lockdown Shock</div>
              <div className="text-xl font-bold font-mono text-red-400">{urbanLockAvg.toFixed(2)}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Labour Participation</div>
              <div className="text-base font-bold font-mono text-cyan-300">{urbanLpr.toFixed(2)}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Shock Vulnerability</div>
              <div className="text-xs font-semibold text-amber-300 mt-1">Severe Stoppage</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Urban areas suffered sharper spikes due to non-essential business closures, factory shutdowns, and public transit freezes.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <Trees className="w-4 h-4" />
              Rural Economy
            </span>
            <span className="text-[11px] font-mono text-slate-400">Agricultural &amp; Safety Buffer</span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Average Rate</div>
              <div className="text-xl font-bold font-mono text-white">{ruralAvgRate.toFixed(2)}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-red-900/40">
              <div className="text-[10px] text-red-400">Lockdown Shock</div>
              <div className="text-xl font-bold font-mono text-red-400">{ruralLockAvg.toFixed(2)}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Labour Participation</div>
              <div className="text-base font-bold font-mono text-cyan-300">{ruralLpr.toFixed(2)}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Shock Cushion</div>
              <div className="text-xs font-semibold text-emerald-300 mt-1">Farming &amp; Relief</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rural sectors showed faster resilience thanks to crop harvesting and safety nets absorbing displaced migrant workers.
          </p>
        </div>
      </div>
    </div>
  );
};
