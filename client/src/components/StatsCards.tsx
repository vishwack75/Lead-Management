import React from 'react';
import { Users, Sparkles, PhoneCall, CheckCircle2 } from 'lucide-react';
import type { LeadStats } from '../types/lead';

interface StatsCardsProps {
  stats?: LeadStats;
  isLoading: boolean;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  isLoading,
  selectedStatus,
  onSelectStatus,
}) => {
  const cards = [
    {
      title: 'Total Leads',
      value: stats?.total ?? 0,
      icon: Users,
      statusKey: 'All',
      colorClasses: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:border-indigo-300',
      activeClasses: 'ring-2 ring-indigo-500 bg-indigo-50/70',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      title: 'New Leads',
      value: stats?.new ?? 0,
      icon: Sparkles,
      statusKey: 'New',
      colorClasses: 'text-sky-600 bg-sky-50 border-sky-100 hover:border-sky-300',
      activeClasses: 'ring-2 ring-sky-500 bg-sky-50/70',
      badgeColor: 'bg-sky-100 text-sky-700',
    },
    {
      title: 'Contacted',
      value: stats?.contacted ?? 0,
      icon: PhoneCall,
      statusKey: 'Contacted',
      colorClasses: 'text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300',
      activeClasses: 'ring-2 ring-amber-500 bg-amber-50/70',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Converted',
      value: stats?.converted ?? 0,
      icon: CheckCircle2,
      statusKey: 'Converted',
      colorClasses: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300',
      activeClasses: 'ring-2 ring-emerald-500 bg-emerald-50/70',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = selectedStatus === card.statusKey;

        return (
          <button
            key={card.title}
            type="button"
            onClick={() => onSelectStatus(card.statusKey)}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md ${
              isActive ? card.activeClasses : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={`rounded-xl p-2.5 transition-transform group-hover:scale-110 ${card.colorClasses}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {isLoading ? (
                  <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                ) : (
                  card.value
                )}
              </div>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${card.badgeColor}`}>
                {card.statusKey}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
