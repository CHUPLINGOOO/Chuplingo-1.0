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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
        
        {/* Mascot Thinking */}
        <ChuplingoMascot mood="thinking" size="md" className="mb-2" />

        <h3 className="text-xl font-black text-[#183153] dark:text-white tracking-tight mt-1">
          ¿Deseas pausar tu práctica?
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-300 mt-1.5 leading-relaxed max-w-[260px] font-medium">
          Llevas <strong>{answeredCount}</strong> de <strong>{totalCount}</strong> preguntas contestadas.
        </p>

        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/60 text-[#FF9418] border border-orange-200/80 dark:border-orange-900/60 px-3 py-1.5 rounded-2xl text-[11px] font-black my-4">
          <Flame className="w-3.5 h-3.5 fill-[#FF9418]" />
          <span>¡Completa el test para ganar hasta +100 XP!</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onContinue}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#183153] dark:bg-purple-600 hover:bg-[#10223A] dark:hover:bg-purple-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continuar practicando</span>
          </button>

          <button
            onClick={onExit}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 border border-slate-200 dark:border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir y descartar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};