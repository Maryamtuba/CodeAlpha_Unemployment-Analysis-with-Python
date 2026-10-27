import React, { useState } from 'react';
import { UnemploymentRecord } from '../types';
import { computeHeatmapMatrix } from '../utils/dataProcessing';
import { Code, Flame, Info } from 'lucide-react';

interface MonthlyHeatmapProps {
  records: UnemploymentRecord[];
}

export const MonthlyHeatmap: React.FC<MonthlyHeatmapProps> = ({ records }) => {
  const [showCode, setShowCode] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ year: number; monthName: string; val: number } | null>(null);

  const { matrix, monthLabels } = computeHeatmapMatrix(records);

  const nonNullVals = matrix.flatMap(r => r.months.filter((v): v is number => v !== null));
  const minVal = nonNullVals.length ? Math.min(...nonNullVals) : 5;
  const maxVal = nonNullVals.length ? Math.max(...nonNullVals) : 30;

  const getHeatmapColor = (val: number | null) => {
    if (val === null) return 'bg-slate-950/40 text-slate-700';
    const normalized = (val - minVal) / (maxVal - minVal);
    if (normalized > 0.7) {
      return 'bg-red-600/90 text-white font-bold border-red-400/50 shadow-md shadow-red-950/40';
    } else if (normalized > 0.45) {
      return 'bg-amber-600/80 text-white font-semibold border-amber-400/40';
    } else if (normalized > 0.25) {
      return 'bg-amber-500/40 text-amber-100 font-medium border-amber-600/30';
    } else if (normalized > 0.1) {
      return 'bg-blue-600/40 text-blue-100 font-medium border-blue-500/30';
    } else {
      return 'bg-blue-900/40 text-blue-200 border-blue-800/20';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl shadow-slate-950/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              3. Seasonality &amp; COVID-19 Heatmap (Year × Month)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800 font-mono">
              Seaborn heatmap()
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Revealing standard agrarian cycles vs. the sudden March–May 2020 systemic rupture
          </p>
        </div>

        <button
          onClick={() => setShowCode(!showCode)}
          className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
            showCode
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-medium'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>
      </div>

      {showCode && (
        <div className="mb-4 bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
          <div className="text-[10px] text-slate-500 mb-1"># Python Seaborn Reproduction:</div>
          <pre>{`pivot_table = df.pivot_table(
    values='Estimated Unemployment Rate (%)',
    index='Year',
    columns='Month',
    aggfunc='mean'
)
plt.figure(figsize=(10, 6))
sns.heatmap(pivot_table, annot=True, cmap='coolwarm', fmt='.1f')
plt.title('Heatmap of Unemployment Rate by Year and Month', fontsize=14, fontweight='bold')
plt.xlabel('Month')
plt.ylabel('Year')
plt.tight_layout()
plt.show()`}</pre>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-13 gap-1.5 mb-2 text-center text-xs font-mono font-medium text-slate-400">
            <div className="text-left font-bold text-slate-300 pl-1">Year</div>
            {monthLabels.map((m, i) => (
              <div key={m} className={`py-1 rounded ${i === 3 || i === 4 ? 'bg-red-950/40 text-red-400 font-bold' : ''}`}>
                {m}
              </div>
            ))}
          </div>

          {matrix.map((row) => (
            <div key={row.year} className="grid grid-cols-13 gap-1.5 mb-2 items-center">
              <div className="text-xs font-mono font-bold text-white pl-1 flex items-center gap-1">
                {row.year}
                {row.year === 2020 && <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />}
              </div>

              {row.months.map((val, mIdx) => {
                const isLockdownAnomaly = row.year === 2020 && (mIdx === 3 || mIdx === 4);
                return (
                  <div
                    key={`${row.year}-${mIdx}`}
                    onMouseEnter={() => val !== null && setHoveredCell({ year: row.year, monthName: monthLabels[mIdx], val })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${getHeatmapColor(val)} ${
                      isLockdownAnomaly ? 'ring-2 ring-red-400 ring-offset-1 ring-offset-slate-900' : ''
                    }`}
                  >
                    {val !== null ? (
                      <>
                        <span className="text-xs font-mono">{val}%</span>
                        {isLockdownAnomaly && (
                          <span className="text-[8px] uppercase tracking-wider text-red-200">
                            Shock
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-600 text-xs font-mono">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono text-[11px]">Intensity (Rate %):</span>
          <div className="flex items-center gap-1">
            <span className="w-5 h-3 rounded bg-blue-900/60 border border-blue-700/40"></span>
            <span className="text-[10px] text-slate-400">~{minVal.toFixed(1)}%</span>
            <span className="w-12 h-1.5 bg-gradient-to-r from-blue-700 via-amber-500 to-red-600 rounded-full mx-1"></span>
            <span className="w-5 h-3 rounded bg-red-600 border border-red-400"></span>
            <span className="text-[10px] text-red-300 font-semibold">{maxVal.toFixed(1)}%+</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Notice the sharp April–May 2020 spike breaking historical seasonality.</span>
        </div>
      </div>
    </div>
  );
};
