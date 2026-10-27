import React, { useState } from 'react';
import { UnemploymentRecord } from '../types';
import { computeRegionalStats } from '../utils/dataProcessing';
import { ArrowUpDown, Filter, Code, MapPin } from 'lucide-react';

interface RegionalBarChartProps {
  records: UnemploymentRecord[];
}

export const RegionalBarChart: React.FC<RegionalBarChartProps> = ({ records }) => {
  const [sortBy, setSortBy] = useState<'avgDesc' | 'avgAsc' | 'surgeDesc'>('avgDesc');
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [showCode, setShowCode] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<any | null>(null);

  const regionalStats = computeRegionalStats(records);

  const sorted = [...regionalStats].sort((a, b) => {
    if (sortBy === 'avgDesc') return b.avgRate - a.avgRate;
    if (sortBy === 'avgAsc') return a.avgRate - b.avgRate;
    if (sortBy === 'surgeDesc') return b.surgeDelta - a.surgeDelta;
    return 0;
  });

  const displayed = sorted.slice(0, displayCount);
  const maxVal = Math.max(30, Math.ceil(Math.max(...displayed.map(d => sortBy === 'surgeDesc' ? d.surgeDelta : d.avgRate)) / 5) * 5 + 5);

  // Viridis / Mako color gradient interpolator
  const getColor = (val: number, max: number) => {
    const ratio = Math.min(1, Math.max(0, val / max));
    if (ratio > 0.75) return '#f43f5e'; // Rose / severe
    if (ratio > 0.5) return '#fb923c'; // Orange
    if (ratio > 0.3) return '#38bdf8'; // Sky blue
    return '#34d399'; // Emerald
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl shadow-slate-950/40">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              2. Regional Disparity Comparison
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono">
              Seaborn barplot()
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Cross-state comparison exposing geographic fault lines and local economic fragility
          </p>
        </div>

        {/* Action Buttons & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-800 p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setSortBy('avgDesc')}
              className={`px-2 py-1 rounded transition-all ${
                sortBy === 'avgDesc' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              Highest Avg
            </button>
            <button
              onClick={() => setSortBy('surgeDesc')}
              className={`px-2 py-1 rounded transition-all ${
                sortBy === 'surgeDesc' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              ⚡ Peak Shock Surge
            </button>
            <button
              onClick={() => setSortBy('avgAsc')}
              className={`px-2 py-1 rounded transition-all ${
                sortBy === 'avgAsc' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lowest Avg
            </button>
          </div>

          <select
            value={displayCount}
            onChange={(e) => setDisplayCount(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value={10}>Top 10 States</option>
            <option value={20}>Top 20 States</option>
            <option value={30}>All States</option>
          </select>

          <button
            onClick={() => setShowCode(!showCode)}
            className={`px-2 py-1 text-xs rounded-lg border flex items-center gap-1 transition-all ${
              showCode
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Python Code Drawer */}
      {showCode && (
        <div className="mb-4 bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
          <div className="text-[10px] text-slate-500 mb-1"># Python Seaborn Reproduction:</div>
          <pre>{`plt.figure(figsize=(14, 6))
order = df.groupby('Region')['Estimated Unemployment Rate (%)'].mean().sort_values(ascending=False).index
sns.barplot(data=df, x='Region', y='Estimated Unemployment Rate (%)', order=order, palette='viridis', errorbar=None)
plt.title('Average Unemployment Rate by Region', fontsize=16, fontweight='bold')
plt.xlabel('Region', fontsize=12)
plt.ylabel('Unemployment Rate (%)', fontsize=12)
plt.xticks(rotation=90)
plt.tight_layout()
plt.show()`}</pre>
        </div>
      )}

      {/* Horizontal Bar Chart for high readability with state names */}
      <div className="space-y-2 mt-2">
        {displayed.map((item, idx) => {
          const val = sortBy === 'surgeDesc' ? item.surgeDelta : item.avgRate;
          const percentage = Math.min(100, Math.max(3, (val / maxVal) * 100));
          const barColor = getColor(val, maxVal);
          const isHovered = hoveredRegion && hoveredRegion.region === item.region;

          return (
            <div
              key={item.region}
              onMouseEnter={() => setHoveredRegion(item)}
              onMouseLeave={() => setHoveredRegion(null)}
              className={`p-2 rounded-lg transition-all border ${
                isHovered
                  ? 'bg-slate-800/80 border-cyan-500/50 shadow-md'
                  : 'bg-slate-950/40 border-transparent hover:border-slate-800 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 w-4">{idx + 1}</span>
                  <span className="font-semibold text-white tracking-tight">{item.region}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  {sortBy === 'surgeDesc' ? (
                    <span className="font-bold text-red-400">+{item.surgeDelta}% surge</span>
                  ) : (
                    <span className="font-bold text-cyan-300">{item.avgRate}% avg</span>
                  )}
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    (Peak: <span className="text-white font-medium">{item.peakRate}%</span>)
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden flex items-center">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: barColor
                  }}
                />
              </div>

              {/* Sub-bar context when hovered */}
              {isHovered && (
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1.5 mt-1 border-t border-slate-800 font-mono">
                  <span>Pre-COVID: <strong className="text-slate-200">{item.preCovidAvg}%</strong></span>
                  <span>Lockdown Peak: <strong className="text-red-400">{item.lockdownAvg}%</strong></span>
                  <span>Reopening: <strong className="text-emerald-400">{item.postCovidAvg}%</strong></span>
                  <span>Labor Part.: <strong className="text-cyan-300">{item.avgLabourParticipation}%</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800">
        <span>Color key: <span className="text-emerald-400 font-medium">Low</span> → <span className="text-sky-400 font-medium">Moderate</span> → <span className="text-amber-400 font-medium">Elevated</span> → <span className="text-rose-400 font-medium">Severe Shock</span></span>
        <span>Showing {displayed.length} of {sorted.length} regions</span>
      </div>

    </div>
  );
};
