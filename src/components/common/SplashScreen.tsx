import React, { useState, useEffect } from 'react';
import { ChuplingoMascot } from '../mascot/ChuplingoMascot';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  isLoadingData: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isLoadingData }) => {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Iniciando Chuplingo...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusMessage('Cargando los 8 cursos preuniversitarios...');
    }, 350);

    const t2 = setTimeout(() => {
      setProgress(75);
      setStatusMessage('Sincronizando tus preguntas y rachas...');
    }, 700);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusMessage('¡Todo listo para volar!');
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    // Si ya completó la barra y ya terminó de cargar Supabase (o transcurrieron 1.4s mínimos de suavidad)
    if (progress >= 100 && !isLoadingData) {
      const exitTimer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 400); // Duración de la transición de salida
      }, 300);

      return () => clearTimeout(exitTimer);
    }
  }, [progress, isLoadingData, onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-gradient-to-b from-[#183153] via-[#1E3F6B] to-[#12243D] flex flex-col items-center justify-between p-6 select-none transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/4 -left-12 w-48 h-48 bg-[#F05C54]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-12 w-48 h-48 bg-[#FF9418]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-8 relative z-10 animate-in fade-in duration-500">
        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-wider border border-white/10 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Preparación Preuniversitaria</span>
        </div>
      </div>

      {/* Center Mascot & Logo */}
      <div className="my-auto flex flex-col items-center text-center relative z-10 max-w-xs animate-in zoom-in-95 duration-500">
        <div className="relative mb-3">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#F05C54]/30 to-[#FF9418]/30 rounded-full blur-2xl animate-pulse" />
          <ChuplingoMascot mood="celebrating" size="xl" className="animate-bounce duration-1000" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-2 flex items-center justify-center gap-2">
          <span>CHUPLINGO</span>
        </h1>

        <p className="text-xs font-bold text-amber-300 uppercase tracking-widest mt-1">
          Aprende y repasa cada día
        </p>

        <p className="text-[11px] text-slate-300 max-w-[240px] mt-2 font-medium leading-relaxed">
          8 Cursos • Simulacros Tipo Admisión • Rachas & XP 100% Online
        </p>
      </div>

      {/* Bottom Loading Bar & Step */}
      <div className="w-full max-w-xs mx-auto pb-6 relative z-10 flex flex-col items-center gap-2">
        <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden p-0.5 backdrop-blur-xs">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#F05C54] via-[#FF9418] to-[#67C66A] transition-all duration-400 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[11px] text-slate-300 font-bold px-1 mt-0.5">
          <span className="truncate max-w-[220px]">{statusMessage}</span>
          <span className="text-amber-300 font-mono">{progress}%</span>
        </div>
      </div>
    </div>
  );
};