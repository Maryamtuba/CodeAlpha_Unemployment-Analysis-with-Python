import React, { useState, useMemo } from 'react';
import { UnemploymentRecord } from '../types';
import { exportToCSV } from '../utils/dataProcessing';
import { Search, Filter, Download, ArrowUpDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface DataTableProps {
  records: UnemploymentRecord[];
}

export const DataTable: React.FC<DataTableProps> = ({ records }) => {
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState<'All' | 'Urban' | 'Rural'>('All');
  const [sortField, setSortField] = useState<keyof UnemploymentRecord>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.region.toLowerCase().includes(search.toLowerCase()) || r.date.includes(search);
      const matchArea = areaFilter === 'All' || r.area === areaFilter;
      return matchSearch && matchArea;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? (aVal as string).localeCompare(bVal as string) : (bVal as string).localeCompare(aVal as string);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [records, search, areaFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentRecords = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: keyof UnemploymentRecord) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl shadow-slate-950/40">
      
      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Dataset Explorer &amp; Preprocessed Records
          </h3>
          <p className="text-xs text-slate-400">
            Audit cleaned rows, check column headers, and inspect individual historical entries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search region or date..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          {/* Area Filter */}
          <select
            value={areaFilter}
            onChange={(e) => { setAreaFilter(e.target.value as any); setPage(1); }}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Areas</option>
            <option value="Urban">Urban Only</option>
            <option value="Rural">Rural Only</option>
          </select>

          {/* Export button */}
          <button
            onClick={() => exportToCSV(filtered, 'filtered_unemployment_data.csv')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export View</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
            <tr>
              <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort('region')}>
                <div className="flex items-center gap-1">
                  <span>Region</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('unemploymentRate')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Unemp. Rate (%)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('employed')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Employed</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('labourParticipationRate')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Labour Part. (%)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">Area</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No records match your filter criteria.
                </td>
              </tr>
            ) : (
              currentRecords.map((r) => {
                const isHighShock = r.unemploymentRate >= 25.0;
                return (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-medium text-white">{r.region}</td>
                    <td className="p-3 font-mono text-cyan-300">{r.date}</td>
                    <td className="p-3 text-right font-mono font-bold">
                      <span className={isHighShock ? 'text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/50' : 'text-slate-200'}>
                        {r.unemploymentRate}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">{r.employed.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-slate-400">{r.labourParticipationRate}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        r.area === 'Urban'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                          : r.area === 'Rural'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {r.area}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 mt-3 pt-2 gap-2">
        <div>
          Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
