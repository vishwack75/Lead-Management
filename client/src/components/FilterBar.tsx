import React from 'react';
import { Search, X, RefreshCw } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
  isFetching: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  limit,
  onLimitChange,
  onRefresh,
  isFetching,
}) => {
  const statusOptions: { label: string; value: string; color: string }[] = [
    { label: 'All', value: 'All', color: 'hover:text-indigo-600' },
    { label: 'New', value: 'New', color: 'hover:text-sky-600' },
    { label: 'Contacted', value: 'Contacted', color: 'hover:text-amber-600' },
    { label: 'Converted', value: 'Converted', color: 'hover:text-emerald-600' },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 pr-9 pl-9 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {statusOptions.map((opt) => {
          const isActive = status === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-xl border border-slate-300 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>

        <button
          type="button"
          onClick={onRefresh}
          title="Refresh leads list"
          className="rounded-xl border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:border-slate-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>
    </div>
  );
};
