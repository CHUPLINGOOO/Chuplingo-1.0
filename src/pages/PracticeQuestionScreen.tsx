import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { COURSES } from '../data/coursesData';
import { Question, QuestionAttempt, CourseId, PracticeMode } from '../types/chuplingo';
import { useChuplingo } from '../context/ChuplingoContext';
import { Star, ArrowRight, CheckCircle2, XCircle, Clock, Lightbulb, ArrowLeft, Timer } from 'lucide-react';
import { toast } from 'sonner';

const PracticeQuestionScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allQuestions, mistakes, favoriteQuestionIds, toggleFavorite, isFavorite, recordSession } = useChuplingo();

  const courseParam = (searchParams.get('course') as CourseId) || 'literatura';
  const topicParam = searchParams.get('topic') || 'all';
  const modeParam = (searchParams.get('mode') as PracticeMode) || 'rapida';
  const difficultyParam = searchParams.get('difficulty') || 'todas';

  // Filter relevant questions for this session
  const sessionQuestions = useMemo(() => {
    let list: Question[] = [];

    if (modeParam === 'simulacro') {
      // Shuffled multi-course questions across all 8 courses
      list = [...allQuestions].sort(() => Math.random() - 0.5);
    } else if (modeParam === 'errores') {
      const mistakenIds = mistakes.filter(m => !m.dominada).map(m => m.questionId);
      list = allQuestions.filter(q => mistakenIds.includes(q.id));
    } else if (modeParam === 'favoritos') {
      list = allQuestions.filter(q => favoriteQuestionIds.includes(q.id));
    } else {
      list = allQuestions.filter(q => {
        const matchesCourse = q.courseId === courseParam;
        const matchesTopic = topicParam === 'all' || q.topicId === topicParam;
        const matchesDiff = difficultyParam === 'todas' || q.dificultad === difficultyParam;
        return matchesCourse && matchesTopic && matchesDiff;
      });
    }

    if (list.length === 0) {
      list = allQuestions.filter(q => q.courseId === courseParam);
    }
    if (list.length === 0) {
      list = allQuestions;
    }

    const limit = modeParam === 'rapida' ? 10 : modeParam === 'estandar' ? 20 : modeParam === 'intensiva' ? 30 : modeParam === 'simulacro' ? 20 : list.length;
    return list.slice(0, Math.min(limit, list.length));
  }, [allQuestions, courseParam, topicParam, modeParam, difficultyParam, mistakes, favoriteQuestionIds]);

  const activeCourse = COURSES.find(c => c.id === courseParam) || COURSES[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(modeParam === 'simulacro' ? 1200 : 0);

  const currentQuestion = sessionQuestions[currentIndex];
  const isLastQuestion = currentIndex === sessionQuestions.length - 1;

  // Countdown timer for simulacro mode
  useEffect(() => {
    if (modeParam !== 'simulacro') return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.warning('¡Tiempo agotado para el simulacro!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [modeParam]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
  }, [currentIndex]);

  if (!currentQuestion) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-bold text-slate-600">No se encontraron preguntas para esta configuración.</p>
        <button
          onClick={() => navigate('/practice-setup')}
          className="mt-4 px-4 py-2 bg-[#F05C54] text-white rounded-xl text-xs font-bold"
        >
          Volver a Selección
        </button>
      </div>
    );
  }

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (isAnswerLocked) return;

    setSelectedAnswer(optId);
    setIsAnswerLocked(true);

    const isCorrect = optId === currentQuestion.respuestaCorrecta;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      courseId: currentQuestion.courseId,
      topicId: currentQuestion.topicId,
      respuestaSeleccionada: optId,
      esCorrecta: isCorrect,
      tiempoSegundos: timeSpent,
      fecha: new Date().toISOString()
    };

    setAttempts(prev => [...prev, attempt]);
  };

  const handleNext = () => {
    if (!isAnswerLocked) {
      toast.info('Selecciona una alternativa antes de continuar');
      return;
    }

    if (isLastQuestion) {
      const totalDuration = Math.round((Date.now() - startTime) / 1000);
      const total = attempts.length;
      const correctas = attempts.filter(a => a.esCorrecta).length;
      const incorrectas = total - correctas;
      const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;

      const newSession = recordSession({
        courseId: modeParam === 'simulacro' ? undefined : activeCourse.id,
        courseName: modeParam === 'simulacro' ? 'Simulacro Tipo Admisión' : activeCourse.nombre,
        topicId: topicParam !== 'all' ? topicParam : undefined,
        topicName: modeParam === 'simulacro' ? 'Multi-curso (8 Áreas)' : currentQuestion.topicName,
        mode: modeParam,
        duracionSegundos: totalDuration,
        totalPreguntas: total,
        correctas,
        incorrectas,
        porcentaje,
        isSimulacro: modeParam === 'simulacro',
        attempts
      });

      navigate(`/results/${newSession.id}`);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const isCurrentFavorite = isFavorite(currentQuestion.id);
  const progressPercent = Math.round(((currentIndex + 1) / sessionQuestions.length) * 100);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      {/* Top Header & Progress */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              if (window.confirm('¿Seguro que deseas salir de la sesión actual?')) {
                navigate(-1);
              }
            }}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-xs font-black text-[#183153]">
              {modeParam === 'simulacro' ? 'Simulacro de Admisión' : activeCourse.nombre}
            </span>
            <span className="text-[11px] text-slate-400 font-bold block">
              Pregunta {currentIndex + 1} de {sessionQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {modeParam === 'simulacro' && (
              <div className="flex items-center gap-1 bg-purple-50 text-[#7354D9] px-2 py-1 rounded-xl text-xs font-black">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}
            <button
              onClick={() => toggleFavorite(currentQuestion.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isCurrentFavorite 
                  ? 'bg-amber-50 text-amber-500' 
                  : 'bg-slate-100 text-slate-400 hover:text-amber-500'
              }`}
              title="Guardar pregunta"
            >
              <Star className={`w-4 h-4 ${isCurrentFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: activeCourse.colorHex 
            }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-4 flex-1 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
        {/* Metadata Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className="text-[10px] font-black px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: activeCourse.colorHex }}
          >
            {currentQuestion.topicName}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 capitalize">
            Nivel {currentQuestion.dificultad}
          </span>
          {currentQuestion.fuente && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {currentQuestion.fuente}
            </span>
          )}
        </div>

        {/* Question Text */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm sm:text-base font-bold text-[#183153] leading-relaxed">
            {currentQuestion.pregunta}
          </h2>
        </div>

        {/* Alternatives (A-E) */}
        <div className="flex flex-col gap-2.5">
          {currentQuestion.alternativas.map((alt) => {
            const isSelected = selectedAnswer === alt.id;
            const isCorrect = alt.id === currentQuestion.respuestaCorrecta;

            let optionStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';
            let badgeStyle = 'bg-slate-100 text-slate-600';

            if (isAnswerLocked) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold';
                badgeStyle = 'bg-emerald-500 text-white font-black';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-50 border-2 border-rose-500 text-rose-950';
                badgeStyle = 'bg-rose-500 text-white font-black';
              } else {
                optionStyle = 'bg-slate-50/70 border-slate-100 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-white border-2 shadow-sm';
              badgeStyle = 'bg-[#183153] text-white';
            }

            return (
              <button
                key={alt.id}
                disabled={isAnswerLocked}
                onClick={() => handleSelectOption(alt.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all active:scale-[0.99] ${optionStyle}`}
              >
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${badgeStyle}`}>
                  {alt.id}
                </span>
                <span className="text-xs sm:text-sm pt-0.5 leading-snug flex-1">
                  {alt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Immediate Pedagogical Feedback */}
        {isAnswerLocked && (
          <div className={`p-4 rounded-2xl border animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            selectedAnswer === currentQuestion.respuestaCorrecta
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2 mb-1.5 font-black text-sm">
              {selectedAnswer === currentQuestion.respuestaCorrecta ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡Respuesta correcta! (+10 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Respuesta incorrecta</span>
                </>
              )}
            </div>

            {currentQuestion.explicacion && (
              <div className="mt-2 text-xs leading-relaxed text-slate-700 bg-white/80 p-2.5 rounded-xl">
                <strong className="block text-[#183153] mb-0.5 flex items-center gap-1 font-black">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Explicación:
                </strong>
                {currentQuestion.explicacion}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Floating Bar */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 sticky bottom-0 z-30">
        <div className="max-w-[430px] mx-auto">
          {isAnswerLocked ? (
            <button
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              style={{ backgroundColor: activeCourse.colorHex }}
            >
              <span>{isLastQuestion ? 'Finalizar y Ver Resultados 🎉' : 'Siguiente pregunta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-center py-2 text-xs font-bold text-slate-400">
              Selecciona una alternativa para continuar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestionScreen;