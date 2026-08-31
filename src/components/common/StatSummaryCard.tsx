import React from 'react';
import { Flame, Star, Target, TrendingUp } from 'lucide-react';
import { useChuplingo } from '../../context/ChuplingoContext';

export const StatSummaryCard: React.FC = () => {
  const { user, getOverallStats } = useChuplingo();
  const { overallAccuracy } = getOverallStats();

  const stats = [
    {
      label: 'Racha',
      value: `${user.rachaActual} días`,
      icon: Flame,
      color: 'text-[#FF5722]',
      bg: 'bg-orange-50 dark:bg-orange-950/60'
    },
    {
      label: 'XP Total',
      value: `${user.xp} XP`,
      icon: Star,
      color: 'text-[#F5A623]',
      bg: 'bg-amber-50 dark:bg-amber-950/60'
    },
    {
      label: 'Meta diaria',
      value: `${user.preguntasRespondidasHoy} / ${user.preferencias.metaDiaria}`,
      icon: Target,
      color: 'text-[#12B7E8]',
      bg: 'bg-cyan-50 dark:bg-cyan-950/60'
    },
    {
      label: 'Precisión',
      value: `${overallAccuracy}%`,
      icon: TrendingUp,
      color: 'text-[#67C66A]',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-850 dark:bg-[#1E293B] rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/80 mx-4 -mt-4 relative z-20 transition-colors">
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800"
            >
              <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-2xs`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block truncate">
                  {item.label}
                </span>
                <span className="text-sm font-black text-[#183153] dark:text-white block truncate">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};