import React from 'react';
import { WifiOff, RefreshCw, Globe } from 'lucide-react';
import { useChuplingo } from '../../context/ChuplingoContext';

export const NetworkStatusBanner: React.FC = () => {
  const { isOnline, fetchQuestionsFromSupabase, isLoadingQuestions } = useChuplingo();

  if (isOnline) return null;

  return (
    <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-md sticky top-0 z-50 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
        <span>Sin conexión a Internet. Chuplingo requiere Internet para sincronizar preguntas.</span>
      </div>

      <button
        onClick={() => fetchQuestionsFromSupabase()}
        disabled={isLoadingQuestions}
        className="px-2.5 py-1 bg-white text-rose-700 rounded-lg text-[11px] font-black shrink-0 hover:bg-rose-50 flex items-center gap-1 transition-transform active:scale-95"
      >
        <RefreshCw className={`w-3 h-3 ${isLoadingQuestions ? 'animate-spin' : ''}`} />
        <span>Reintentar</span>
      </button>
    </div>
  );
};