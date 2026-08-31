import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { COURSES } from '../data/coursesData';
import { Question, QuestionAttempt, CourseId, PracticeMode } from '../types/chuplingo';
import { useChuplingo } from '../context/ChuplingoContext';
import { ExitPracticeDialog } from '../components/practice/ExitPracticeDialog';
import { 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  X, 
  Timer, 
  Sparkles, 
  RefreshCw, 
  WifiOff, 
  Database,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

const PracticeQuestionScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    fetchQuestionsForSession, 
    toggleFavorite, 
    isFavorite, 
    recordSession, 
    isLoadingQuestions,
    isOnline,
    supabaseErrorMessage 
  } = useChuplingo();

  const courseParam = (searchParams.get('course') as CourseId) || 'literatura';
  const topicParam = searchParams.get('topic') || 'all';
  const modeParam = (searchParams.get('mode') as PracticeMode) || 'rapida';
  const difficultyParam = searchParams.get('difficulty') || 'todas';
  const universityParam = searchParams.get('university') || 'todas';

  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeCourse = COURSES.find(c => c.id === courseParam) || COURSES[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(modeParam === 'simulacro' ? 1500 : 0);
  const [showExitModal, setShowExitModal] = useState(false);

  const loadSession = async () => {
    setLoadError(null);
    setHasLoaded(false);

    const questionsCount = 
      modeParam === 'rapida' ? 10 :
      modeParam === 'estandar' ? 20 :
      modeParam === 'intensiva' ? 30 :
      modeParam === 'simulacro' ? 25 : 10;

    const result = await fetchQuestionsForSession({
      courseId: courseParam,
      topicId: topicParam,
      mode: modeParam,
      difficulty: difficultyParam,
      university: universityParam,
      count: questionsCount
    });

    if (result.questions && result.questions.length > 0) {
      setSessionQuestions(result.questions);
      setLoadError(null);
    } else {
      setLoadError(result.error || supabaseErrorMessage || 'No se encontraron preguntas en Supabase.');
    }
    setHasLoaded(true);
  };

  useEffect(() => {
    loadSession();
  }, [courseParam, topicParam, modeParam, difficultyParam, universityParam, fetchQuestionsForSession]);

  const currentQuestion = sessionQuestions[currentIndex];
  const isLastQuestion = currentIndex === sessionQuestions.length - 1;

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

  const handleExitConfirm = () => {
    setShowExitModal(false);
    navigate('/');
  };

  if (isLoadingQuestions || !hasLoaded) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-10 h-10 text-[#F05C54] animate-spin mb-3" />
        <p className="text-sm font-black text-[#183153] dark:text-white">Consultando Supabase...</p>
        <p className="text-xs text-slate-400 mt-1">Descargando preguntas de admisión en vivo</p>
      </div>
    );
  }

  if (loadError || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        {!isOnline ? (
          <WifiOff className="w-12 h-12 text-rose-500 mb-3 animate-pulse" />
        ) : (
          <Database className="w-12 h-12 text-[#F05C54] mb-3" />
        )}

        <h2 className="text-base font-black text-[#183153] dark:text-white">
          {!isOnline ? 'Sin conexión a Internet' : 'Estado de Supabase'}
        </h2>

        <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl p-3.5 mt-2 max-w-xs text-left">
          <p className="text-[11px] text-rose-800 dark:text-rose-200 font-medium leading-relaxed">
            {loadError || supabaseErrorMessage || 'No se pudieron recuperar las preguntas desde Supabase.'}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-5 w-full max-w-xs">
          <button
            onClick={loadSession}
            className="w-full py-3.5 bg-[#F05C54] hover:bg-[#E04B43] text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar conexión con Supabase</span>
          </button>

          <button
            onClick={() => navigate('/courses')}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-bold transition-colors"
          >
            Volver a Cursos
          </button>
        </div>
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
      topicId: currentQuestion.topicId || undefined,
      respuestaSeleccionada: optId,
      esCorrecta: isCorrect,
      tiempoSegundos: timeSpent,
      fecha: new Date().toISOString()
    };

    setAttempts(prev => [...prev, attempt]);
  };

  const handleNext = async () => {
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

      const newSession = await recordSession({
        courseId: modeParam === 'simulacro' ? undefined : activeCourse.id,
        courseName: modeParam === 'simulacro' ? 'Simulacro Tipo Admisión' : activeCourse.nombre,
        topicId: topicParam !== 'all' ? topicParam : undefined,
        topicName: modeParam === 'simulacro' ? 'Multi-curso (8 Áreas)' : (currentQuestion.topicName || 'Práctica General'),
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
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-slate-900 flex flex-col justify-between select-none transition-colors">
      {/* Dialogo Moderno de Salida */}
      <ExitPracticeDialog
        isOpen={showExitModal}
        onContinue={() => setShowExitModal(false)}
        onExit={handleExitConfirm}
        answeredCount={currentIndex}
        totalCount={sessionQuestions.length}
      />

      {/* Top Header & Progress Bar */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 shadow-xs sticky top-0 z-30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          {/* Botón de escape moderno con salida garantizada */}
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors shadow-2xs active:scale-90"
            title="Pausar o salir del test"
            aria-label="Salir de la práctica"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="text-center flex flex-col items-center">
            <span className="text-xs font-black text-[#183153] dark:text-white tracking-tight">
              {modeParam === 'simulacro' ? 'Simulacro de Admisión' : activeCourse.nombre}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-bold">
              Pregunta {currentIndex + 1} de {sessionQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {modeParam === 'simulacro' && (
              <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950 text-[#7354D9] dark:text-purple-300 px-2.5 py-1 rounded-xl text-xs font-black border border-purple-100 dark:border-purple-900">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}
            <button
              onClick={() => toggleFavorite(currentQuestion.id)}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                isCurrentFavorite 
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 shadow-xs ring-2 ring-amber-200 dark:ring-amber-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'
              }`}
              title="Guardar pregunta"
            >
              <Star className={`w-4 h-4 ${isCurrentFavorite ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Colorful Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full rounded-full transition-all duration-300 shadow-xs"
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: activeCourse.colorHex 
            }}
          />
        </div>
      </div>

      {/* Main Question Container */}
      <div className="p-4 flex-1 flex flex-col gap-3.5 max-w-[430px] mx-auto w-full">
        {/* Metadata Chips: Universidad y Tema */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Badge Oficial Universidad (UNMSM, UNI, UNSA, UNFV, UNSAAC) */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-xl bg-[#183153] dark:bg-slate-800 text-white shadow-xs border border-slate-700/50">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>{currentQuestion.fuente || 'UNMSM 2024-I'}</span>
          </span>

          <span 
            className="text-[10px] font-black px-2.5 py-1 rounded-xl text-white shadow-2xs"
            style={{ backgroundColor: activeCourse.colorHex }}
          >
            {currentQuestion.topicName || activeCourse.nombre}
          </span>

          <span className="text-[10px] font-black px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize border border-slate-200 dark:border-slate-700">
            Nivel {currentQuestion.dificultad}
          </span>
        </div>

        {/* Question Enunciation Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/80 transition-all">
          <h2 className="text-sm sm:text-base font-black text-[#183153] dark:text-white leading-relaxed">
            {currentQuestion.pregunta}
          </h2>
        </div>

        {/* Alternatives (A, B, C, D, E) */}
        <div className="flex flex-col gap-2.5">
          {currentQuestion.alternativas.map((alt) => {
            const isSelected = selectedAnswer === alt.id;
            const isCorrect = alt.id === currentQuestion.respuestaCorrecta;

            let optionStyle = 'bg-white dark:bg-[#1E293B] border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 shadow-2xs';
            let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

            if (isAnswerLocked) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-50/90 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-black shadow-sm';
                badgeStyle = 'bg-emerald-500 text-white font-black';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-50/90 dark:bg-rose-950/70 border-2 border-rose-500 text-rose-950 dark:text-rose-200 font-black shadow-sm';
                badgeStyle = 'bg-rose-500 text-white font-black';
              } else {
                optionStyle = 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 text-slate-400 opacity-55';
              }
            } else if (isSelected) {
              optionStyle = 'bg-white dark:bg-[#1E293B] border-2 shadow-md';
              badgeStyle = 'bg-[#183153] dark:bg-purple-600 text-white';
            }

            return (
              <button
                key={alt.id}
                disabled={isAnswerLocked}
                onClick={() => handleSelectOption(alt.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all active:scale-[0.99] ${optionStyle}`}
              >
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors shadow-2xs ${badgeStyle}`}>
                  {alt.id}
                </span>
                <span className="text-xs sm:text-sm pt-0.5 leading-snug flex-1 font-semibold">
                  {alt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pedagogical Feedback */}
        {isAnswerLocked && (
          <div className={`p-4 rounded-3xl border animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-xs ${
            selectedAnswer === currentQuestion.respuestaCorrecta
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}>
            <div className="flex items-center gap-2 mb-1 font-black text-sm">
              {selectedAnswer === currentQuestion.respuestaCorrecta ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡Excelente! Respuesta correcta (+10 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Respuesta incorrecta</span>
                </>
              )}
            </div>

            {currentQuestion.explicacion && (
              <div className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-white/60 dark:border-slate-800">
                <strong className="block text-[#183153] dark:text-white mb-1 flex items-center gap-1 font-black">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Fundamentación académica:
                </strong>
                {currentQuestion.explicacion}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Floating Bar */}
      <div className="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] transition-colors">
        <div className="max-w-[430px] mx-auto">
          {isAnswerLocked ? (
            <button
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              style={{ backgroundColor: activeCourse.colorHex }}
            >
              <span>{isLastQuestion ? 'Finalizar y Ver Resultados 🎉' : 'Siguiente pregunta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-center py-2 text-xs font-bold text-slate-400 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <span>Toca una alternativa para validar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestionScreen;