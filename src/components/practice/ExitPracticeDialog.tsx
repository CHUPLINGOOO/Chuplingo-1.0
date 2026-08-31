import React from 'react';
import { ChuplingoMascot } from '../mascot/ChuplingoMascot';
import { Play, LogOut, Flame } from 'lucide-react';

interface ExitPracticeDialogProps {
  isOpen: boolean;
  onContinue: () => void;
  onExit: () => void;
  answeredCount: number;
  totalCount: number;
}

export const ExitPracticeDialog: React.FC<ExitPracticeDialogProps> = ({
  isOpen,
  onContinue,
  onExit,
  answeredCount,
  totalCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        
        {/* Mascot Thinking */}
        <ChuplingoMascot mood="thinking" size="md" className="mb-2" />

        <h3 className="text-xl font-black text-[#183153] tracking-tight mt-1">
          ¿Deseas pausar tu práctica?
        </h3>

        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[260px]">
          Llevas <strong>{answeredCount}</strong> de <strong>{totalCount}</strong> preguntas contestadas. ¡Cada pregunta cuenta para mantener tu racha activa!
        </p>

        <div className="flex items-center gap-1.5 bg-orange-50 text-[#FF9418] border border-orange-200/80 px-3 py-1.5 rounded-2xl text-[11px] font-black my-4">
          <Flame className="w-3.5 h-3.5 fill-[#FF9418]" />
          <span>¡Completa el test para ganar hasta +100 XP!</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onContinue}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#183153] hover:bg-[#10223A] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continuar practicando</span>
          </button>

          <button
            onClick={onExit}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir y descartar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};