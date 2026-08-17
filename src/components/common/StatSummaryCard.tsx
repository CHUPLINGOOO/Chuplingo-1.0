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
      bg: 'bg-orange-50'
    },
    {
      label: 'XP',
      value: `${user.xp} XP`,
      icon: Star,
      color: 'text-[#F5A623]',
      bg: 'bg-amber-50'
    },
    {
      label: 'Meta diaria',
      value: `${user.preguntasRespondidasHoy} / ${user.preferencias.metaDiaria}`,
      icon: Target,
      color: 'text-[#12B7E8]',
      bg: 'bg-cyan-50'
    },
    {
      label: 'Precisión',
      value: `${overallAccuracy}%`,
      icon: TrendingUp,
      color: 'text-[#67C66A]',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mx-4 -mt-3 relative z-20">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100/80"
            >
              <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-500 font-medium block truncate">
                  {item.label}
                </span>
                <span className="text-sm font-extrabold text-[#183153] block truncate">
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