import React from 'react';
import { Mail, Phone, Trash2, Calendar, Loader2, UserCheck, ArrowRight } from 'lucide-react';
import type { ILead, LeadStatus } from '../types/lead';

interface LeadTableProps {
  leads: ILead[];
  isLoading: boolean;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onDeleteClick: (lead: ILead) => void;
  updatingId: string | null;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  onUpdateStatus,
  onDeleteClick,
  updatingId,
}) => {
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      default:
        return 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20';
    }
  };

  const getNextStatusAction = (status: LeadStatus): LeadStatus | null => {
    if (status === 'New') return 'Contacted';
    if (status === 'Contacted') return 'Converted';
    return null;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="flex animate-pulse items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-48 rounded bg-slate-100 dark:bg-slate-800/60" />
                  </div>
                </div>
                <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40">
          <UserCheck className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          No leads found
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          No records match your query. Add a new lead above or reset your search & filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Lead Name
              </th>
              <th scope="col" className="px-6 py-3.5">
                Email
              </th>
              <th scope="col" className="px-6 py-3.5">
                Phone
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5">
                Created
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.map((lead) => {
              const nextStatus = getNextStatusAction(lead.status);
              const isUpdating = updatingId === lead._id;

              return (
                <tr
                  key={lead._id}
                  className="transition-colors hover:bg-slate-50/75 dark:hover:bg-slate-800/40"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-xs font-bold text-white shadow-xs">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {lead.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                    >
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{lead.email}</span>
                    </a>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </a>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          onUpdateStatus(lead._id, e.target.value as LeadStatus)
                        }
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                      </select>
                      {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {nextStatus && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(lead._id, nextStatus)}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <span>{nextStatus}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteClick(lead)}
                        title="Delete Lead"
                        className="inline-flex items-center gap-1 rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {leads.map((lead) => {
          const nextStatus = getNextStatusAction(lead.status);
          const isUpdating = updatingId === lead._id;

          return (
            <div key={lead._id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-xs">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {lead.name}
                    </h4>
                    <span className="text-xs text-slate-400">
                      Added {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <select
                    value={lead.status}
                    disabled={isUpdating}
                    onChange={(e) =>
                      onUpdateStatus(lead._id, e.target.value as LeadStatus)
                    }
                    className={`rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none ${getStatusBadge(
                      lead.status
                    )}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                {nextStatus && (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(lead._id, nextStatus)}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <span>Mark as {nextStatus}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteClick(lead)}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
