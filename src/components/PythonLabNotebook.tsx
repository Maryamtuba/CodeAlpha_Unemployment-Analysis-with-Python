import React, { useState } from 'react';
import { UnemploymentRecord } from '../types';
import { calculateSummaryStats, computeRegionalStats, exportJupyterNotebook } from '../utils/dataProcessing';
import { 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Terminal,
  FileCode2,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface PythonLabNotebookProps {
  records: UnemploymentRecord[];
  onOpenVisualizer: () => void;
}

export const PythonLabNotebook: React.FC<PythonLabNotebookProps> = ({ records, onOpenVisualizer }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [executedCells, setExecutedCells] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [isExecuting, setIsExecuting] = useState<number | null>(null);

  // Compute live statistics for cell outputs
  const rates = records.map(r => r.unemploymentRate);
  const stats = calculateSummaryStats(rates);
  const regionalStats = computeRegionalStats(records).slice(0, 5);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRunCell = (stepNum: number) => {
    setIsExecuting(stepNum);
    setTimeout(() => {
      setExecutedCells(prev => ({ ...prev, [stepNum]: true }));
      setIsExecuting(null);
    }, 400);
  };

  const handleRunAll = () => {
    setIsExecuting(999);
    setTimeout(() => {
      setExecutedCells({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true });
      setIsExecuting(null);
    }, 700);
  };

  const handleResetNotebook = () => {
    setExecutedCells({});
  };

  const steps = [
    {
      step: 1,
      title: "Step 1: Import Required Libraries",
      tag: "Environment Setup",
      desc: "Load numerical, data manipulation, and visualization libraries. Configure seaborn themes and matplotlib canvas sizes.",
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Configure visual styles for high-fidelity presentations
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'

print("NumPy version:", np.__version__)
print("Pandas version:", pd.__version__)
print("Seaborn theme initialized successfully!")`,
      output: (
        <div className="font-mono text-xs text-emerald-400 space-y-1">
          <div>NumPy version: 1.26.4</div>
          <div>Pandas version: 2.2.2</div>
          <div>Seaborn theme initialized successfully! Visual environment ready.</div>
        </div>
      )
    },
    {
      step: 2,
      title: "Step 2: Load and Inspect the Dataset",
      tag: "Data Ingestion",
      desc: "Ingest unemployment_data.csv into a pandas DataFrame and examine column structures, null values, and first rows.",
      code: `# Load the CodeAlpha unemployment dataset
df = pd.read_csv('unemployment_data.csv')

# Display basic structural information
print("Dataset Shape:", df.shape)
print("\\nDataset Info:")
print(df.info())

print("\\nFirst 5 Rows:")
display(df.head())`,
      output: (
        <div className="space-y-3 font-mono text-xs">
          <div className="text-slate-300">
            <span className="text-cyan-400">Dataset Shape:</span> ({records.length}, 7)
          </div>
          <div className="text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] leading-relaxed">
            &lt;class 'pandas.core.frame.DataFrame'&gt;<br />
            RangeIndex: {records.length} entries, 0 to {records.length - 1}<br />
            Data columns (total 7 columns):<br />
            # &nbsp; Column &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Non-Null Count &nbsp; Dtype<br />
            --- &nbsp;------ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -------------- &nbsp; -----<br />
            0 &nbsp; Region &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {records.length} non-null &nbsp;&nbsp; object<br />
            1 &nbsp; Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {records.length} non-null &nbsp;&nbsp; object<br />
            2 &nbsp; Frequency &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {records.length} non-null &nbsp;&nbsp; object<br />
            3 &nbsp; Estimated Unemployment Rate (%) &nbsp;&nbsp;&nbsp; {records.length} non-null &nbsp;&nbsp; float64<br />
            4 &nbsp; Estimated Employed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {records.length} non-null &nbsp;&nbsp; int64<br />
            5 &nbsp; Estimated Labour Participation Rate (%) {records.length} non-null &nbsp;&nbsp; float64<br />
            6 &nbsp; Area &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {records.length} non-null &nbsp;&nbsp; object<br />
            dtypes: float64(2), int64(1), object(4)<br />
            memory usage: ~{Math.round(records.length * 0.065)} KB
          </div>
          {/* Table Preview */}
          <div className="overflow-x-auto border border-slate-800 rounded">
            <table className="w-full text-left text-[11px] font-sans">
              <thead className="bg-slate-800/90 text-slate-300">
                <tr>
                  <th className="p-2">Region</th>
                  <th className="p-2">Date</th>
                  <th className="p-2 text-right">Unemp. Rate (%)</th>
                  <th className="p-2 text-right">Employed</th>
                  <th className="p-2 text-right">Labour Part. (%)</th>
                  <th className="p-2">Area</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {records.slice(0, 4).map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="p-2 font-medium text-white">{r.region}</td>
                    <td className="p-2 font-mono text-cyan-300">{r.date}</td>
                    <td className="p-2 text-right font-mono font-bold text-amber-300">{r.unemploymentRate}%</td>
                    <td className="p-2 text-right font-mono">{r.employed.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">{r.labourParticipationRate}%</td>
                    <td className="p-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.area === 'Urban' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                        {r.area}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      step: 3,
      title: "Step 3: Data Cleaning & Preprocessing",
      tag: "Data Sanitization",
      desc: "Strip leading/trailing column name whitespace, audit null entries, and transform dates into year, month, and calendar features.",
      code: `# Strip leading/trailing spaces from column names (common in raw CSV exports)
df.columns = df.columns.str.strip()

# Check for missing values
print("Missing values per column:")
print(df.isnull().sum())

# Drop missing records if any exist
df = df.dropna()

# Convert Date column to datetime format
if 'Date' in df.columns:
    df['Date'] = pd.to_datetime(df['Date'])
    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.month
    df['Month_Name'] = df['Date'].dt.strftime('%b')

print("\\nColumns after sanitization:")
print(list(df.columns))
print(f"Cleaned dataset contains {len(df)} records without missing values.")`,
      output: (
        <div className="font-mono text-xs space-y-2">
          <div className="text-slate-400">
            Missing values per column:<br />
            Region: 0<br />
            Date: 0<br />
            Frequency: 0<br />
            Estimated Unemployment Rate (%): 0<br />
            Estimated Employed: 0<br />
            Estimated Labour Participation Rate (%): 0<br />
            Area: 0
          </div>
          <div className="text-emerald-400">
            ✓ Cleaned dataset contains {records.length} records. Datetime parsed with Year and Month dimensions generated.
          </div>
        </div>
      )
    },
    {
      step: 4,
      title: "Step 4: Exploratory Data Analysis (EDA)",
      tag: "Statistical Synthesis",
      desc: "Compute 5-number summaries, central tendency, standard deviation, and group by Region to reveal territorial disparities.",
      code: `# Summary statistics for numerical variables
print("Summary Statistics:")
display(df.describe())

# Average unemployment by Region
if 'Region' in df.columns and 'Estimated Unemployment Rate (%)' in df.columns:
    region_unemp = df.groupby('Region')['Estimated Unemployment Rate (%)'].mean().reset_index()
    print("\\nTop 5 Regions with Highest Average Unemployment:")
    display(region_unemp.sort_values(by='Estimated Unemployment Rate (%)', ascending=False).head(5))`,
      output: (
        <div className="space-y-3 font-mono text-xs">
          <div className="overflow-x-auto border border-slate-800 rounded">
            <table className="w-full text-left text-[11px] font-sans">
              <thead className="bg-slate-800/90 text-slate-300">
                <tr>
                  <th className="p-2">Metric</th>
                  <th className="p-2 text-right">Unemp. Rate (%)</th>
                  <th className="p-2 text-right">Labour Part. Rate (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2 font-medium">count</td>
                  <td className="p-2 text-right font-mono">{stats.count}</td>
                  <td className="p-2 text-right font-mono">{stats.count}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">mean</td>
                  <td className="p-2 text-right font-mono font-bold text-cyan-300">{stats.mean}%</td>
                  <td className="p-2 text-right font-mono">41.8%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">std</td>
                  <td className="p-2 text-right font-mono">{stats.std}</td>
                  <td className="p-2 text-right font-mono">7.8</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">min</td>
                  <td className="p-2 text-right font-mono">{stats.min}%</td>
                  <td className="p-2 text-right font-mono">28.0%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">25% (Q1)</td>
                  <td className="p-2 text-right font-mono">{stats.q25}%</td>
                  <td className="p-2 text-right font-mono">37.2%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">50% (Median)</td>
                  <td className="p-2 text-right font-mono font-bold text-white">{stats.median}%</td>
                  <td className="p-2 text-right font-mono">41.1%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">75% (Q3)</td>
                  <td className="p-2 text-right font-mono">{stats.q75}%</td>
                  <td className="p-2 text-right font-mono">45.5%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">max</td>
                  <td className="p-2 text-right font-mono font-bold text-red-400">{stats.max}%</td>
                  <td className="p-2 text-right font-mono">52.5%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-slate-300 pt-1">
            <span className="text-amber-400 font-semibold">Highest Regional Averages:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {regionalStats.map(r => (
                <div key={r.region} className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  <div className="font-semibold text-white truncate">{r.region}</div>
                  <div className="text-cyan-400 font-mono font-bold">{r.avgRate}% avg</div>
                  <div className="text-red-400 text-[10px]">Peak: {r.peakRate}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      step: 5,
      title: "Step 5: Visualizations & COVID-19 Impact",
      tag: "Matplotlib & Seaborn",
      desc: "Generate the three core project charts: Timeline Lineplot, Regional Bar Chart, and Seasonality Heatmap.",
      code: `# 1. Overall Unemployment Trend Over Time
plt.figure()
trend_df = df.groupby('Date')['Estimated Unemployment Rate (%)'].mean().reset_index()
sns.lineplot(data=trend_df, x='Date', y='Estimated Unemployment Rate (%)', color='b', linewidth=2.5)
plt.title('Overall Unemployment Rate Trend Over Time', fontsize=16, fontweight='bold')
plt.xlabel('Date')
plt.ylabel('Estimated Unemployment Rate (%)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 2. Regional Comparison Bar Chart
plt.figure(figsize=(14, 6))
sns.barplot(data=df, x='Region', y='Estimated Unemployment Rate (%)', palette='viridis', errorbar=None)
plt.title('Average Unemployment Rate by Region', fontsize=16, fontweight='bold')
plt.xticks(rotation=90)
plt.tight_layout()
plt.show()

# 3. Monthly / Seasonal Trends Heatmap
pivot_table = df.pivot_table(values='Estimated Unemployment Rate (%)', index='Year', columns='Month', aggfunc='mean')
plt.figure(figsize=(10, 6))
sns.heatmap(pivot_table, annot=True, cmap='coolwarm', fmt='.1f')
plt.title('Heatmap of Unemployment Rate by Year and Month', fontsize=14, fontweight='bold')
plt.show()`,
      output: (
        <div className="space-y-3 text-xs">
          <div className="text-slate-300 font-medium flex items-center justify-between">
            <span>Rendered Plots (3 figures generated):</span>
            <button
              onClick={onOpenVisualizer}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 text-[11px]"
            >
              <span>Explore Interactive High-Res Charts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="h-16 bg-slate-900 rounded flex items-center justify-center border border-slate-800 text-cyan-400">
                <TrendingUp className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-[11px] font-semibold text-white mt-1.5">Figure 1: Trendline</div>
              <div className="text-[10px] text-slate-400">Lockdown spike visible</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="h-16 bg-slate-900 rounded flex items-center justify-center border border-slate-800 text-emerald-400">
                <div className="flex items-end gap-1 h-8">
                  <span className="w-2 bg-emerald-500 h-8 rounded-t"></span>
                  <span className="w-2 bg-emerald-500 h-6 rounded-t"></span>
                  <span className="w-2 bg-emerald-500 h-4 rounded-t"></span>
                  <span className="w-2 bg-emerald-500 h-7 rounded-t"></span>
                </div>
              </div>
              <div className="text-[11px] font-semibold text-white mt-1.5">Figure 2: Regional Bars</div>
              <div className="text-[10px] text-slate-400">Ranked by severity</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="h-16 bg-slate-900 rounded flex items-center justify-center border border-slate-800 text-amber-400">
                <div className="grid grid-cols-4 gap-1">
                  <span className="w-3 h-3 bg-blue-700 rounded-sm"></span>
                  <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
                  <span className="w-3 h-3 bg-red-600 rounded-sm"></span>
                  <span className="w-3 h-3 bg-blue-800 rounded-sm"></span>
                </div>
              </div>
              <div className="text-[11px] font-semibold text-white mt-1.5">Figure 3: Heatmap</div>
              <div className="text-[10px] text-slate-400">Apr–May anomaly</div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 6,
      title: "Step 6: Key Insights & Policy Recommendations",
      tag: "Executive Report",
      desc: "Synthesize empirical results into actionable labor market policy recommendations for crisis mitigation.",
      code: `# Synthesize findings and formulate policy guidance
insights = """
COVID-19 IMPACT SUMMARY:
1. Lockdown Spike: Extreme surge occurred in April-May 2020 as non-essential commerce stalled.
2. Regional Disparities: Industrial and tourist states faced higher unemployment rates than agrarian regions.
3. Urban vs Rural: Urban casual labor lacked fallback cushions compared to agricultural employment.

POLICY RECOMMENDATIONS:
- Targeted Economic Stimulus: Rapid Direct Benefit Transfer (DBT) to unorganized/informal workers.
- Rural Safety Net Expansion: Increase MGNREGA budget allocations during systemic crises.
- Skill Development & Digital Resilience: Invest in digital literacy to enable remote employment.
"""
print(insights)`,
      output: (
        <div className="bg-slate-950 p-3 rounded border border-slate-800 font-sans text-xs space-y-2">
          <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
            Executive Findings &amp; Policy Guidance
          </div>
          <div className="text-slate-300 space-y-1 leading-relaxed">
            <p><strong>• COVID-19 Impact:</strong> Rapid national jump to &gt;23% during April 2020 nationwide lockdown, followed by a phased recovery as unlock guidelines took effect.</p>
            <p><strong>• Regional Asymmetry:</strong> States with heavy migrant workforce exposure and hospitality dependence (e.g., Puducherry, Haryana, Bihar) experienced 3×–5× shock spikes.</p>
            <p><strong>• Recommended Policy Levers:</strong> Expansion of automatic fiscal stabilizers, emergency liquidity for MSMEs, and robust portable social security cards for informal workers.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Notebook Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Interactive Jupyter Notebook Laboratory
            </h2>
            <p className="text-[11px] text-slate-400">
              Execute Python data cleaning, EDA, and seaborn visualization pipelines step-by-step
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAll}
            disabled={isExecuting !== null}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-900/30 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting === 999 ? 'Running All...' : 'Run All Steps'}</span>
          </button>

          <button
            onClick={handleResetNotebook}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Reset cell execution state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => exportJupyterNotebook(records.length)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ipynb</span>
          </button>
        </div>
      </div>

      {/* Notebook Cells */}
      <div className="space-y-5">
        {steps.map((item, idx) => {
          const isDone = executedCells[item.step];
          const isRunning = isExecuting === item.step || isExecuting === 999;

          return (
            <div
              key={item.step}
              className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-slate-950/30 transition-all hover:border-slate-700"
            >
              {/* Cell Header */}
              <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    In [{isDone ? item.step : ' '}]
                  </span>
                  <span className="text-xs font-semibold text-white tracking-tight">
                    {item.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {item.tag}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item.code, idx)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy Python Code"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleRunCell(item.step)}
                    disabled={isRunning}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 text-cyan-400 fill-current" />
                    <span>{isRunning ? 'Running...' : 'Run'}</span>
                  </button>
                </div>
              </div>

              {/* Cell Description */}
              <div className="px-4 py-2 bg-slate-900/40 text-xs text-slate-400 border-b border-slate-800/40">
                {item.desc}
              </div>

              {/* Code Box */}
              <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto selection:bg-cyan-500/30">
                <pre className="leading-relaxed">{item.code}</pre>
              </div>

              {/* Simulated Output Area */}
              {isDone && (
                <div className="border-t border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    <span className="text-emerald-400 font-bold">Out [{item.step}]:</span>
                    <span>Execution Completed</span>
                  </div>
                  <div>{item.output}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
