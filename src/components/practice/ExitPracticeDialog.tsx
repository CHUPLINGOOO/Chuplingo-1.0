import React, { useEffect } from 'react';
import { ChuplingoMascot } from '../mascot/ChuplingoMascot';
import { Play, LogOut, Home, BookOpen } from 'lucide-react';

interface ExitPracticeDialogProps {
  isOpen: boolean;
  onContinue: () => void;
  onExitHome: () => void;
  onExitCourses?: () => void;
  answeredCount: number;
  totalCount: number;
}

export const ExitPracticeDialog: React.FC<ExitPracticeDialogProps> = ({
  isOpen,
  onContinue,
  onExitHome,
  onExitCourses,
  answeredCount,
  totalCount
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onContinue();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onContinue]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
      onClick={onContinue}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <ChuplingoMascot mood="thinking" size="md" className="mb-2" />

        <h3 className="text-lg font-black text-[#183153] dark:text-white tracking-tight">
          ¿Deseas salir de la práctica?
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed max-w-[260px] font-medium">
          Llevas contestadas <strong>{answeredCount}</strong> de <strong>{totalCount}</strong> preguntas.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full mt-4">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#183153] dark:bg-purple-600 hover:bg-[#10223A] dark:hover:bg-purple-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continuar practicando</span>
          </button>

          {onExitCourses && (
            <button
              type="button"
              onClick={onExitCourses}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#183153] dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F05C54]" />
              <span>Volver a la lista de Cursos</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExitHome}
            className="w-full py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 border border-rose-200 dark:border-rose-900 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Salir e ir al Inicio</span>
          </button>
        </div>
      </div>
    </div>
  );
};