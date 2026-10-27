import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Terminal, 
  BarChart3, 
  Table, 
  Sparkles, 
  BookOpen, 
  Layers,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'notebook' | 'dataset' | 'insights';
  setActiveTab: (tab: 'dashboard' | 'notebook' | 'dataset' | 'insights') => void;
  selectedDataset: 'india' | 'us' | 'custom';
  setSelectedDataset: (dataset: 'india' | 'us' | 'custom') => void;
  onUploadClick: () => void;
  onExportCSV: () => void;
  onExportNotebook: () => void;
  totalRecords: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDataset,
  setSelectedDataset,
  onUploadClick,
  onExportCSV,
  onExportNotebook,
  totalRecords,
  onResetData
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo and Titles */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-mono font-bold text-lg">
              UA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Unemployment Analysis with Python
                </h1>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-mono">
                  CodeAlpha Task 2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Exploratory Data Analysis, COVID-19 Shock Modeling &amp; Jupyter Lab
              </p>
            </div>
          </div>

          {/* Dataset Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center rounded-lg bg-slate-800/90 p-1 border border-slate-700/70 text-xs">
              <button
                onClick={() => setSelectedDataset('india')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedDataset === 'india'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🇮🇳 India (2019–2020)
              </button>
              <button
                onClick={() => setSelectedDataset('us')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedDataset === 'us'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🇺🇸 US BLS Series
              </button>
              {selectedDataset === 'custom' && (
                <button
                  onClick={() => setSelectedDataset('custom')}
                  className="px-2.5 py-1 rounded-md font-medium bg-emerald-600 text-white shadow-sm flex items-center gap-1"
                >
                  📁 Custom CSV
                </button>
              )}
            </div>

            <button
              onClick={onUploadClick}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Upload your own unemployment_data.csv"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload CSV</span>
            </button>

            <div className="flex items-center gap-1 border-l border-slate-700/60 pl-2">
              <button
                onClick={onExportNotebook}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Download .ipynb Jupyter Notebook"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .ipynb</span>
              </button>
              <button
                onClick={onExportCSV}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Download Cleaned CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cleaned CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-slate-800/80 mt-3 pt-2">
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Visual EDA &amp; Shock Trends</span>
            </button>

            <button
              onClick={() => setActiveTab('notebook')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'notebook'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Python Code Lab (Steps 1–6)</span>
            </button>

            <button
              onClick={() => setActiveTab('dataset')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dataset'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Dataset Explorer</span>
              <span className="px-1.5 py-0.2 bg-slate-800 rounded text-[10px] text-slate-400">
                {totalRecords}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'insights'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Policy &amp; Economic Insights</span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Kernel Ready (Python 3.11 / Pandas 2.2)</span>
          </div>
        </div>

      </div>
    </header>
  );
};
