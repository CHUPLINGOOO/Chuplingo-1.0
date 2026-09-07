import React from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { Flame, BookOpen, Target, Trophy, Globe2, Languages, CheckCircle2, Star, Lock } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  BookOpen,
  Target,
  Trophy,
  Globe2,
  Languages,
  CheckCircle2,
  Star
};

const AchievementsScreen: React.FC = () => {
  const { achievements } = useChuplingo();

  const unlockedCount = achievements.filter(a => a.desbloqueadoEn).length;

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Logros e Insignias"
        subtitle={`${unlockedCount} de ${achievements.length} desbloqueados`}
        iconEmoji="🎖️"
        showBack={true}
        bgGradient="from-[#7354D9] to-[#9176EA]"
      />

      <div className="px-4 flex flex-col gap-3">
        {achievements.map((ach) => {
          const isUnlocked = !!ach.desbloqueadoEn;
          const Icon = ICON_MAP[ach.icono] || Trophy;

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                isUnlocked
                  ? 'bg-white border-slate-100 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isUnlocked
                    ? 'bg-purple-50 text-[#7354D9]'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-[#183153]">
                  {ach.nombre}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {ach.descripcion}
                </p>
                {isUnlocked && (
                  <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                    ✓ Desbloqueado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsScreen;