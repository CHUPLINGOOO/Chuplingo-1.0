import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { CourseId } from '../types/chuplingo';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Clock, Zap, ArrowRight, Check, Sparkles } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useChuplingo();

  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<number>(20);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('19:00');
  const [selectedCourses, setSelectedCourses] = useState<CourseId[]>([
    'literatura',
    'psicologia',
    'razonamiento-verbal',
    'biologia'
  ]);

  const toggleCourse = (id: CourseId) => {
    if (selectedCourses.includes(id)) {
      if (selectedCourses.length > 1) {
        setSelectedCourses(selectedCourses.filter(c => c !== id));
      }
    } else {
      setSelectedCourses([...selectedCourses, id]);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      metaDiaria: selectedGoal,
      horarioEstudio: selectedSchedule,
      cursosFavoritos: selectedCourses
    });
    navigate('/register');
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F05C54] via-[#F76A62] to-[#F7F8FC] flex flex-col justify-between p-5 text-center select-none">
      {/* Top Header with step indicators and Skip */}
      <div className="pt-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map(idx => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step 
                  ? 'w-6 bg-white' 
                  : idx < step 
                    ? 'w-2 bg-white/80' 
                    : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={handleSkip}
          className="text-xs font-black text-white/90 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-all"
        >
          Omitir
        </button>
      </div>

      {/* Dynamic Content by Step */}
      <div className="my-auto py-3 max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                <ChuplingoMascot mood="happy" size="xl" />
              </div>

              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-black uppercase tracking-wider mb-2">
                <span>🦜</span> CHUPLINGO 2.0
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Únete a la bandada
              </h1>

              <p className="text-sm font-bold text-amber-200 mt-1">
                Practica como nunca antes
              </p>

              <p className="text-xs text-white/90 max-w-xs mt-3 leading-relaxed">
                Preparación preuniversitaria intensiva y gamificada en los 8 cursos esenciales.
              </p>

              {/* 3 highlights */}
              <div className="grid grid-cols-3 gap-2 w-full mt-6">
                <div className="bg-white/95 rounded-2xl p-2.5 shadow-sm flex flex-col items-center">
                  <BookOpen className="w-4 h-4 text-[#F05C54] mb-1" />
                  <span className="text-[11px] font-black text-[#183153]">8 Cursos</span>
                  <span className="text-[9px] text-slate-500">Exclusivos</span>
                </div>
                <div className="bg-white/95 rounded-2xl p-2.5 shadow-sm flex flex-col items-center">
                  <Zap className="w-4 h-4 text-[#FF9418] mb-1" />
                  <span className="text-[11px] font-black text-[#183153]">Rachas & XP</span>
                  <span className="text-[9px] text-slate-500">Motivación</span>
                </div>
                <div className="bg-white/95 rounded-2xl p-2.5 shadow-sm flex flex-col items-center">
                  <Target className="w-4 h-4 text-[#12B7E8] mb-1" />
                  <span className="text-[11px] font-black text-[#183153]">Simulacros</span>
                  <span className="text-[9px] text-slate-500">Examen real</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <ChuplingoMascot mood="thinking" size="md" />
              <h2 className="text-2xl font-black text-white mt-3">
                Construye tu hábito
              </h2>
              <p className="text-xs text-white/90 mt-1 mb-5">
                ¿Cuántas preguntas quieres responder al día para mantener tu racha?
              </p>

              <div className="grid grid-cols-2 gap-3 w-full">
                {[
                  { count: 10, label: 'Relajado', desc: '5 min / día' },
                  { count: 20, label: 'Estándar', desc: '10 min / día' },
                  { count: 30, label: 'Intensivo', desc: '20 min / día' },
                  { count: 50, label: 'Imparable', desc: '35 min / día' }
                ].map(opt => (
                  <button
                    key={opt.count}
                    onClick={() => setSelectedGoal(opt.count)}
                    className={`p-3.5 rounded-2xl border-2 transition-all text-left ${
                      selectedGoal === opt.count
                        ? 'bg-white border-amber-300 shadow-md text-[#183153]'
                        : 'bg-white/80 border-transparent text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-[#F05C54]">{opt.count}</span>
                      {selectedGoal === opt.count && <Check className="w-4 h-4 text-[#F05C54]" />}
                    </div>
                    <div className="text-xs font-bold mt-1">{opt.label}</div>
                    <div className="text-[10px] text-slate-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <ChuplingoMascot mood="happy" size="md" />
              <h2 className="text-2xl font-black text-white mt-3">
                Personaliza tu preparación
              </h2>
              <p className="text-xs text-white/90 mt-1 mb-4">
                Elige los cursos prioritarios en los que deseas enfocarte:
              </p>

              <div className="grid grid-cols-2 gap-2 w-full max-h-60 overflow-y-auto pr-1">
                {COURSES.map(c => {
                  const isSelected = selectedCourses.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCourse(c.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        isSelected
                          ? 'bg-white border-amber-300 text-[#183153] shadow-xs'
                          : 'bg-white/70 border-transparent text-slate-600'
                      }`}
                    >
                      <span className="text-xs font-black truncate">{c.nombre}</span>
                      {isSelected && (
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
                          style={{ backgroundColor: c.colorHex }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <ChuplingoMascot mood="curious" size="md" />
              <h2 className="text-2xl font-black text-white mt-3">
                Horario de Estudio
              </h2>
              <p className="text-xs text-white/90 mt-1 mb-5">
                Chuplingo te recordará practicar para proteger tu racha sin interrumpirte:
              </p>

              <div className="flex flex-col gap-2.5 w-full">
                {[
                  { time: '08:00', label: 'Mañanas productivas (8:00 AM)' },
                  { time: '14:00', label: 'Tarde de repaso (2:00 PM)' },
                  { time: '19:00', label: 'Noche tranquila (7:00 PM)' },
                  { time: '21:30', label: 'Antes de dormir (9:30 PM)' }
                ].map(h => (
                  <button
                    key={h.time}
                    onClick={() => setSelectedSchedule(h.time)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      selectedSchedule === h.time
                        ? 'bg-white border-amber-300 text-[#183153] font-black shadow-sm'
                        : 'bg-white/80 border-transparent text-slate-700 font-bold hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-[#F05C54]" />
                      <span>{h.label}</span>
                    </div>
                    {selectedSchedule === h.time && <Check className="w-4 h-4 text-[#F05C54]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <ChuplingoMascot mood="celebrating" size="lg" />
              <h2 className="text-2xl font-black text-white mt-3">
                ¡Todo listo para volar! 🚀
              </h2>
              <p className="text-xs text-white/90 mt-2 max-w-xs leading-relaxed">
                Crea tu cuenta gratis para sincronizar tu progreso, guardar tus favoritos y desbloquear insignias.
              </p>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 mt-6 w-full text-left border border-white/40">
                <div className="flex items-center gap-2 text-xs font-black text-[#183153] mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Tu plan de estudio personalizado:</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li>• Meta diaria: <strong>{selectedGoal} preguntas</strong></li>
                  <li>• Recordatorio: <strong>{selectedSchedule}</strong></li>
                  <li>• Cursos activos: <strong>{selectedCourses.length} cursos seleccionados</strong></li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-sm mx-auto pb-4">
        {step < 4 ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            className="w-full py-4 px-6 rounded-2xl bg-[#183153] hover:bg-[#10223A] text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>{step === 0 ? '¡Comenzar experiencia!' : 'Siguiente'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleFinish}
              className="w-full py-4 px-6 rounded-2xl bg-[#183153] hover:bg-[#10223A] text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Crear mi cuenta gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                completeOnboarding();
                navigate('/login');
              }}
              className="w-full py-2 text-xs font-black text-white/90 hover:text-white"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;