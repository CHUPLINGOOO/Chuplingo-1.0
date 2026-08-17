import React from 'react';
import { Target, CheckCircle2, Flame } from 'lucide-react';
import { useChuplingo } from '../../context/ChuplingoContext';
import { useNavigate } from 'react-router-dom';

export const DailyGoalCard: React.FC = () => {
  const { user } = useChuplingo();
  const navigate = useNavigate();

  const progressPercent = Math.min(100, Math.round((user.preguntasRespondidasHoy / user.preferencias.metaDiaria) * 100));
  const isCompleted = user.metaDiariaCumplidaHoy || user.preguntasRespondidasHoy >= user.preferencias.metaDiaria;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mx-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF9418] flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#183153] uppercase tracking-wide">
              Meta Diaria
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {isCompleted ? '🎉 ¡Meta cumplida por hoy!' : `Te faltan ${Math.max(0, user.preferencias.metaDiaria - user.preguntasRespondidasHoy)} preguntas`}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm font-black text-[#183153]">
            {user.preguntasRespondidasHoy}
          </span>
          <span className="text-xs text-slate-400 font-bold">
            {' '}/ {user.preferencias.metaDiaria}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-2 relative">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isCompleted 
              ? 'bg-gradient-to-r from-[#67C66A] to-[#48BB78]' 
              : 'bg-gradient-to-r from-[#FF9418] to-[#F05C54]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
          <Flame className="w-4 h-4 text-[#FF5722]" />
          <span>Racha: <strong className="text-[#183153]">{user.rachaActual} días</strong></span>
        </div>

        {!isCompleted ? (
          <button
            onClick={() => navigate('/practice-setup')}
            className="text-xs font-black px-3 py-1.5 rounded-xl bg-[#F05C54] hover:bg-[#E04B43] text-white shadow-sm transition-transform active:scale-95"
          >
            Completar meta →
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> +50 XP Obtenido
          </span>
        )}
      </div>
    </div>
  );
};