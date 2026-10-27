import React from 'react';
import { CovidImpactMetrics } from '../types';
import { TrendingUp, AlertTriangle, ShieldCheck, MapPin, Building2, Trees, Activity } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: CovidImpactMetrics;
  datasetName: string;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, datasetName }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Peak Lockdown Shock */}
      <div className="bg-slate-900/80 border border-red-500/30 rounded-xl p-4 relative overflow-hidden group hover:border-red-500/50 transition-all shadow-lg shadow-red-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all pointer-events-none"></div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Peak Lockdown Shock
          </span>
          <span className="text-[10px] bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded border border-red-800/60 font-mono">
            Apr–May 2020
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {metrics.lockdownPeakRate}%
          </span>
          <span className="text-xs font-semibold text-red-400 flex items-center">
            +{metrics.percentageSurge}% surge
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          vs. Pre-COVID baseline of <span className="text-slate-200 font-medium">{metrics.preCovidRate}%</span>
        </p>
      </div>

      {/* 2. Post-Lockdown Recovery */}
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-lg shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all pointer-events-none"></div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Reopening Recovery
          </span>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/60 font-mono">
            H2 2020 (Unlock)
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {metrics.postLockdownRate}%
          </span>
          <span className="text-xs font-semibold text-emerald-400">
            Stabilized
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Gradual decline as agricultural &amp; local manufacturing restarted
        </p>
      </div>

      {/* 3. Most Impacted State / Region */}
      <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-lg shadow-amber-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all pointer-events-none"></div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Severe Epicenter
          </span>
          <span className="text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/60 font-mono">
            Max State Surge
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight truncate max-w-[170px]" title={metrics.mostAffectedRegion.name}>
            {metrics.mostAffectedRegion.name}
          </span>
          <span className="text-sm font-bold text-amber-400 font-mono">
            {metrics.mostAffectedRegion.peak}%
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Spike delta of <span className="text-amber-300 font-semibold">+{metrics.mostAffectedRegion.delta}%</span> during restriction peak
        </p>
      </div>

      {/* 4. Urban vs Rural Vulnerability */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-lg shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all pointer-events-none"></div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Sector Disparity
          </span>
          <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/60 font-mono">
            Urban vs Rural
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-300">Urban Peak:</span>
            <span className="text-sm font-bold text-white font-mono">{metrics.urbanPeakRate}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-slate-300">Rural Peak:</span>
            <span className="text-sm font-bold text-white font-mono">{metrics.ruralPeakRate}%</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Urban areas faced stricter transport and factory stoppage
        </p>
      </div>

    </div>
  );
};
