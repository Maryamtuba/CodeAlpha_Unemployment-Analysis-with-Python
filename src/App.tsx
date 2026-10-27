/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { TimeTrendChart } from './components/TimeTrendChart';
import { RegionalBarChart } from './components/RegionalBarChart';
import { MonthlyHeatmap } from './components/MonthlyHeatmap';
import { UrbanRuralAnalysis } from './components/UrbanRuralAnalysis';
import { PythonLabNotebook } from './components/PythonLabNotebook';
import { DataTable } from './components/DataTable';
import { InsightsPolicySection } from './components/InsightsPolicySection';
import { DatasetUploaderModal } from './components/DatasetUploaderModal';
import { defaultIndiaData } from './data/indiaUnemploymentData';
import { generateUSDataset } from './data/usUnemploymentData';
import { computeCovidImpact, exportToCSV, exportJupyterNotebook } from './utils/dataProcessing';
import { UnemploymentRecord } from './types';
import { 
  BarChart3, 
  Terminal, 
  Table, 
  Sparkles, 
  FileCode2, 
  Layers,
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notebook' | 'dataset' | 'insights'>('dashboard');
  const [datasetType, setDatasetType] = useState<'india' | 'us' | 'custom'>('india');
  const [customData, setCustomData] = useState<UnemploymentRecord[]>([]);
  const [customName, setCustomName] = useState<string>('');
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // Active records based on selected dataset
  const activeRecords = useMemo(() => {
    if (datasetType === 'india') return defaultIndiaData;
    if (datasetType === 'us') return generateUSDataset();
    if (datasetType === 'custom' && customData.length > 0) return customData;
    return defaultIndiaData;
  }, [datasetType, customData]);

  const covidMetrics = useMemo(() => {
    return computeCovidImpact(activeRecords);
  }, [activeRecords]);

  const handleDatasetLoaded = (records: UnemploymentRecord[], filename: string) => {
    setCustomData(records);
    setCustomName(filename);
    setDatasetType('custom');
  };

  const handleExportCSV = () => {
    const filename = datasetType === 'india' 
      ? 'cleaned_india_unemployment_2019_2020.csv' 
      : datasetType === 'us' 
      ? 'cleaned_us_bls_unemployment.csv' 
      : 'cleaned_unemployment_data.csv';
    exportToCSV(activeRecords, filename);
  };

  const handleExportNotebook = () => {
    exportJupyterNotebook(activeRecords.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDataset={datasetType}
        setSelectedDataset={setDatasetType}
        onUploadClick={() => setIsUploaderOpen(true)}
        onExportCSV={handleExportCSV}
        onExportNotebook={handleExportNotebook}
        totalRecords={activeRecords.length}
        onResetData={() => setDatasetType('india')}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Dataset Meta Callout if Custom or US */}
        {datasetType !== 'india' && (
          <div className="mb-4 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs flex items-center justify-between">
            <span className="text-slate-300">
              Active Dataset: <strong className="text-cyan-400">{datasetType === 'us' ? 'United States BLS Historical Series' : customName}</strong> ({activeRecords.length} records)
            </span>
            <button
              onClick={() => setDatasetType('india')}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Switch back to standard CodeAlpha India Dataset
            </button>
          </div>
        )}

        {/* Tab 1: Dashboard & Visual EDA */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key KPI Metrics */}
            <MetricsOverview
              metrics={covidMetrics}
              datasetName={datasetType === 'india' ? 'India' : 'US / Custom'}
            />

            {/* Chart 1: Time Trend with Milestones */}
            <TimeTrendChart records={activeRecords} />

            {/* Chart 2 & 3: Regional Disparities & Seasonality Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionalBarChart records={activeRecords} />
              <MonthlyHeatmap records={activeRecords} />
            </div>

            {/* Chart 4: Urban vs Rural Fracture */}
            <UrbanRuralAnalysis records={activeRecords} />

            {/* Quick Link to Python Lab */}
            <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-indigo-500/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>Looking for the CodeAlpha Python code submission?</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Inspect and execute the complete Step 1 to Step 6 Python pipeline with Pandas, Matplotlib, and Seaborn.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('notebook')}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-all shadow-md shadow-indigo-900/40"
              >
                <span>Open Python Code Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Python Code Lab (Jupyter Notebook Steps 1-6) */}
        {activeTab === 'notebook' && (
          <PythonLabNotebook
            records={activeRecords}
            onOpenVisualizer={() => setActiveTab('dashboard')}
          />
        )}

        {/* Tab 3: Dataset Explorer */}
        {activeTab === 'dataset' && (
          <DataTable records={activeRecords} />
        )}

        {/* Tab 4: Policy & Economic Insights */}
        {activeTab === 'insights' && (
          <InsightsPolicySection
            metrics={covidMetrics}
            records={activeRecords}
          />
        )}

      </main>

      {/* CSV Uploader Modal */}
      <DatasetUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onDatasetLoaded={handleDatasetLoaded}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CodeAlpha Data Science Internship • Task 2: Unemployment Analysis with Python</span>
          <span>Pandas 2.2 • Matplotlib • Seaborn • Jupyter Lab Export Ready</span>
        </div>
      </footer>

    </div>
  );
}
