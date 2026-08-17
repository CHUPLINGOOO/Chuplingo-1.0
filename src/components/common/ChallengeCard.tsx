import React from 'react';
import { Challenge } from '../../types/chuplingo';
import { useChuplingo } from '../../context/ChuplingoContext';
import { CheckCircle2, HelpCircle, Target, Layers, Award, Flame, Zap, GraduationCap, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChallengeCardProps {
  challenge: Challenge;
}

const CHALLENGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle2,
  HelpCircle,
  Target,
  Layers,
  Award,
  Flame,
  Zap,
  GraduationCap
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { getChallengeProgress, claimChallengeReward } = useChuplingo();
  const navigate = useNavigate();
  const { current, max, completed, claimed } = getChallengeProgress(challenge);
  const percent = Math.min(100, Math.round((current / max) * 100));

  const IconComponent = CHALLENGE_ICONS[challenge.icono] || Target;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* Left Icon */}
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF9418] flex items-center justify-center shrink-0 shadow-sm">
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Center Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-[#183153] leading-snug">
            {challenge.titulo}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {challenge.descripcion}
          </p>
        </div>

        {/* Right XP Reward badge */}
        <div className="shrink-0 text-right">
          <span className="inline-block font-black text-xs px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
            +{challenge.recompensaXP} XP
          </span>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="pt-2 border-t border-slate-100/90 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-500">
            {current} / {max} {challenge.tipo === 'accuracy_target' ? '%' : ''}
          </span>
          <span className="font-bold text-slate-400">
            {percent}%
          </span>
        </div>

        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#FF9418] to-[#F05C54] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-end pt-1">
          {claimed ? (
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> Reclamado
            </span>
          ) : completed ? (
            <button
              onClick={() => claimChallengeReward(challenge.id)}
              className="text-xs font-black px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm animate-bounce transition-transform active:scale-95"
            >
              ¡Reclamar +{challenge.recompensaXP} XP!
            </button>
          ) : (
            <button
              onClick={() => navigate('/practice-setup')}
              className="text-xs font-bold text-[#FF9418] hover:text-[#E07E0F] hover:underline"
            >
              Ir a practicar →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};