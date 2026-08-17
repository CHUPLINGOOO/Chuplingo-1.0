import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { useChuplingo } from '../context/ChuplingoContext';
import { BookOpen, CheckCircle2, BarChart3, ArrowRight } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useChuplingo();

  const handleStart = () => {
    completeOnboarding();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F05C54] via-[#F76A62] to-[#F7F8FC] flex flex-col justify-between p-6 text-center select-none">
      {/* Top Brand Tag */}
      <div className="pt-6">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm">
          <span>🦜</span> Preparación Preuniversitaria
        </div>
      </div>

      {/* Mascot and Hero */}
      <div className="flex flex-col items-center my-auto py-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <ChuplingoMascot mood="happy" size="xl" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight leading-tight">
          Únete a la bandada
        </h1>
        
        <p className="text-lg font-bold text-amber-100 mt-1">
          Practica como nunca antes
        </p>

        <p className="text-xs text-white/90 max-w-xs mt-3 leading-relaxed">
          Literatura, Biología, Psicología, Geografía, Razonamiento Verbal, Cívica, Filosofía e Inglés.
        </p>

        {/* 3 mini feature badges */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs mt-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-sm flex flex-col items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#F05C54] mb-1" />
            <span className="text-[11px] font-black text-[#183153] leading-none">8 cursos</span>
            <span className="text-[9px] text-slate-500 font-medium mt-0.5">Completos</span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-sm flex flex-col items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-[#67C66A] mb-1" />
            <span className="text-[11px] font-black text-[#183153] leading-none">Personalizada</span>
            <span className="text-[9px] text-slate-500 font-medium mt-0.5">Práctica</span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-sm flex flex-col items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#12B7E8] mb-1" />
            <span className="text-[11px] font-black text-[#183153] leading-none">Seguimiento</span>
            <span className="text-[9px] text-slate-500 font-medium mt-0.5">Progreso</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pb-6 w-full max-w-xs mx-auto">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-[#183153] hover:bg-[#10223A] text-white font-black text-base shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 group"
        >
          <span>¡Comenzar a practicar!</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Welcome;