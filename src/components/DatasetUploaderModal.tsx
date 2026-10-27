import React, { useState } from 'react';
import Papa from 'papaparse';
import { UnemploymentRecord } from '../types';
import { Upload, X, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface DatasetUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (records: UnemploymentRecord[], name: string) => void;
}

export const DatasetUploaderModal: React.FC<DatasetUploaderModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [parsedRecords, setParsedRecords] = useState<UnemploymentRecord[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setError(null);

    Papa.parse(selected, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const raw = results.data as any[];
          if (raw.length === 0) {
            setError('The uploaded CSV file is empty.');
            return;
          }

          // Step 3 cleaning logic: strip header whitespace
          const cleanedRecords: UnemploymentRecord[] = [];
          let id = 1;

          for (const row of raw) {
            // Find keys ignoring whitespace and casing
            const getVal = (possibleKeys: string[]) => {
              for (const key of Object.keys(row)) {
                const normalized = key.trim().toLowerCase();
                for (const target of possibleKeys) {
                  if (normalized.includes(target.toLowerCase())) {
                    return row[key];
                  }
                }
              }
              return null;
            };

            const region = getVal(['region', 'state', 'location']) || 'National';
            const dateStr = getVal(['date', 'month', 'year-month', 'period']) || '2020-04-01';
            const rateStr = getVal(['unemployment rate', 'unemployment', 'rate', 'est_unemployment']);
            const empStr = getVal(['employed', 'employment', 'labour_employed']) || '0';
            const lprStr = getVal(['labour participation', 'participation', 'lpr']) || '40.0';
            const areaStr = getVal(['area', 'sector', 'type']) || 'All';

            const unempRate = parseFloat(String(rateStr).replace('%', ''));
            if (isNaN(unempRate)) continue;

            const date = String(dateStr).trim();
            const yearMatch = date.match(/\d{4}/);
            const year = yearMatch ? parseInt(yearMatch[0]) : 2020;
            const monthMatch = date.match(/-(\d{2})/);
            const month = monthMatch ? parseInt(monthMatch[1]) : 4;

            const areaVal: 'Urban' | 'Rural' | 'National' =
              areaStr.toLowerCase().includes('urban') ? 'Urban' :
              areaStr.toLowerCase().includes('rural') ? 'Rural' : 'National';

            cleanedRecords.push({
              id: `custom-${id++}`,
              region: String(region).trim(),
              date: date,
              frequency: 'Monthly',
              unemploymentRate: unempRate,
              employed: parseInt(String(empStr).replace(/,/g, '')) || 1000000,
              labourParticipationRate: parseFloat(String(lprStr)) || 42.0,
              area: areaVal,
              year,
              month,
              monthName: 'Data'
            });
          }

          if (cleanedRecords.length === 0) {
            setError('Could not extract unemployment rate column. Ensure columns like "Region", "Date", and "Estimated Unemployment Rate (%)" exist.');
            return;
          }

          setParsedRecords(cleanedRecords);
          setPreviewRows(cleanedRecords.slice(0, 5));
        } catch (err: any) {
          setError(err.message || 'Error parsing CSV file');
        }
      },
      error: (err) => {
        setError(`Parser error: ${err.message}`);
      }
    });
  };

  const handleApply = () => {
    if (parsedRecords.length > 0) {
      onDatasetLoaded(parsedRecords, file?.name || 'custom_dataset.csv');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Upload Custom Unemployment CSV
            </h3>
            <p className="text-xs text-slate-400">
              Compatible with CodeAlpha datasets, Kaggle, BLS, and government files
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition-colors block">
          <FileText className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-xs font-semibold text-white">
            {file ? file.name : 'Choose CSV file or drag & drop'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Accepts .csv with columns: Region, Date, Unemployment Rate (%)
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-xs text-red-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {previewRows.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Parsed {parsedRecords.length} records successfully!
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300 max-h-32 overflow-y-auto">
              {previewRows.map((r, i) => (
                <div key={i} className="truncate">
                  {r.region} | {r.date} | {r.unemploymentRate}% | {r.area}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={parsedRecords.length === 0}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-40 transition-all shadow-md shadow-cyan-900/40"
          >
            Load Dataset into Studio
          </button>
        </div>
      </div>
    </div>
  );
};
