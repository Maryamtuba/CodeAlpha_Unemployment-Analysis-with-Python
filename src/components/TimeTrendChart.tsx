import React, { useState } from 'react';
import { UnemploymentRecord } from '../types';
import { computeTimelineAggregates } from '../utils/dataProcessing';
import { Calendar, Info, Layers, Eye, Code } from 'lucide-react';

interface TimeTrendChartProps {
  records: UnemploymentRecord[];
}

export const TimeTrendChart: React.FC<TimeTrendChartProps> = ({ records }) => {
  const [showUrbanRural, setShowUrbanRural] = useState(true);
  const [showLpr, setShowLpr] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [showPythonSnippet, setShowPythonSnippet] = useState(false);

  const timelineData = computeTimelineAggregates(records);

  if (timelineData.length === 0) {
    return <div className="p-8 text-center text-slate-500">No time series data available.</div>;
  }

  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 45, left: 50 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Max value calculation
  const allRates = timelineData.flatMap(d => [
    d.avgRate,
    ...(showUrbanRural && d.urbanRate ? [d.urbanRate] : []),
    ...(showUrbanRural && d.ruralRate ? [d.ruralRate] : [])
  ]);
  const maxRate = Math.max(30, Math.ceil(Math.max(...allRates) / 5) * 5 + 5);
  const minRate = 0;

  // Scales
  const getX = (index: number) => padding.left + (index / (timelineData.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - ((val - minRate) / (maxRate - minRate)) * innerHeight;

  // Path generators
  const generatePath = (valKey: 'avgRate' | 'urbanRate' | 'ruralRate') => {
    return timelineData
      .map((d, i) => {
        const val = d[valKey];
        if (val === null || val === undefined) return '';
        const x = getX(i);
        const y = getY(val);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .filter(Boolean)
      .join(' ');
  };

  const avgPath = generatePath('avgRate');
  const urbanPath = generatePath('urbanRate');
  const ruralPath = generatePath('ruralRate');

  // Lockdown marker position (around March / April 2020)
  const lockdownIndex = timelineData.findIndex(d => d.date.startsWith('2020-03') || d.date.startsWith('2020-04'));
  const lockdownX = lockdownIndex !== -1 ? getX(lockdownIndex) : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl shadow-slate-950/40">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              1. Overall Unemployment Trend Over Time
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-mono">
              Seaborn lineplot()
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Temporal trajectory tracking the COVID-19 lockdown surge and economic reactivation
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUrbanRural(!showUrbanRural)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
              showUrbanRural
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-medium'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Split Urban / Rural</span>
          </button>

          <button
            onClick={() => setShowPythonSnippet(!showPythonSnippet)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
              showPythonSnippet
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-medium'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Inspect corresponding Python code"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Python Snippet Drawer */}
      {showPythonSnippet && (
        <div className="mb-4 bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto relative">
          <div className="text-[10px] text-slate-500 mb-1"># Python Seaborn Reproduction:</div>
          <pre>{`plt.figure(figsize=(14, 6))
trend_df = df.groupby('Date')['Estimated Unemployment Rate (%)'].mean().reset_index()
sns.lineplot(data=trend_df, x='Date', y='Estimated Unemployment Rate (%)', color='#0284c7', linewidth=2.5, marker='o')
plt.axvline(pd.to_datetime('2020-03-24'), color='red', linestyle='--', label='Lockdown Enacted')
plt.title('Overall Unemployment Rate Trend Over Time', fontsize=16, fontweight='bold')
plt.ylabel('Estimated Unemployment Rate (%)')
plt.xticks(rotation=45)
plt.show()`}</pre>
        </div>
      )}

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[650px] overflow-visible"
        >
          <defs>
            <linearGradient id="avgAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lockdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 10, 20, 30, 40, 50].filter(v => v <= maxRate).map(val => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="0.75"
              />
              <text
                x={padding.left - 8}
                y={getY(val) + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* COVID Lockdown Highlight Zone */}
          {lockdownX !== null && (
            <g>
              <rect
                x={lockdownX - 10}
                y={padding.top}
                width={innerWidth * 0.22}
                height={innerHeight}
                fill="url(#lockdownGradient)"
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />
              <line
                x1={lockdownX}
                y1={padding.top}
                x2={lockdownX}
                y2={padding.top + innerHeight}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text
                x={lockdownX + 6}
                y={padding.top + 16}
                className="text-[9px] fill-red-400 font-mono font-semibold"
              >
                ⚡ COVID-19 Lockdown Surge (Apr 2020)
              </text>
            </g>
          )}

          {/* Lines */}
          {showUrbanRural && (
            <>
              {/* Urban Line */}
              <path
                d={urbanPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="transition-all"
              />
              {/* Rural Line */}
              <path
                d={ruralPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="2 2"
                className="transition-all"
              />
            </>
          )}

          {/* Main Average Line */}
          <path
            d={avgPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {timelineData.map((d, i) => {
            const x = getX(i);
            const y = getY(d.avgRate);
            const isHovered = hoveredPoint && hoveredPoint.date === d.date;

            return (
              <g key={d.date} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(d)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3.5}
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all"
                />
                {/* Date Label on X-axis */}
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  transform={`rotate(40, ${x}, ${height - padding.bottom + 18})`}
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  {d.date.substring(0, 7)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-950/95 border border-cyan-500/40 p-3 rounded-lg shadow-2xl shadow-cyan-950 text-xs backdrop-blur-md"
            style={{
              top: '10px',
              right: '20px'
            }}
          >
            <div className="font-semibold text-white flex items-center gap-1.5 border-b border-slate-800 pb-1 mb-2 font-mono">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              {hoveredPoint.date}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">National Average:</span>
                <span className="font-bold text-cyan-400 font-mono">{hoveredPoint.avgRate}%</span>
              </div>
              {hoveredPoint.urbanRate && (
                <div className="flex justify-between gap-4">
                  <span className="text-amber-400">Urban Rate:</span>
                  <span className="font-bold text-white font-mono">{hoveredPoint.urbanRate}%</span>
                </div>
              )}
              {hoveredPoint.ruralRate && (
                <div className="flex justify-between gap-4">
                  <span className="text-emerald-400">Rural Rate:</span>
                  <span className="font-bold text-white font-mono">{hoveredPoint.ruralRate}%</span>
                </div>
              )}
              <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 text-[11px]">
                <span className="text-slate-500">Labor Participation:</span>
                <span className="text-slate-300 font-mono">{hoveredPoint.avgLpr}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-2 pt-3 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-cyan-400 rounded-full"></span>
            <span className="text-slate-200 font-medium">National Average (%)</span>
          </div>
          {showUrbanRural && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-amber-400 rounded-full border-dashed"></span>
                <span>Urban Areas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-emerald-400 rounded-full"></span>
                <span>Rural Areas</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-red-400 rounded-full"></span>
            <span className="text-red-300">Lockdown Inflection Zone</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          Hover data points for monthly values
        </div>
      </div>

    </div>
  );
};
