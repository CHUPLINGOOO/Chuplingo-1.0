import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { INITIAL_CHALLENGES } from '../data/challengesData';
import { StatSummaryCard } from '../components/common/StatSummaryCard';
import { DailyGoalCard } from '../components/common/DailyGoalCard';
import { CourseCard } from '../components/common/CourseCard';
import { ChallengeCard } from '../components/common/ChallengeCard';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { Play, ArrowRight, Sparkles, BookOpen, AlertCircle, Star, Timer, Bell, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, sessions, getRecommendedTopic, notifications } = useChuplingo();

  const lastSession = sessions.length > 0 ? sessions[0] : null;
  const recommended = getRecommendedTopic();
  const dailyChallenges = INITIAL_CHALLENGES.filter(c => c.periodo === 'diario').slice(0, 2);
  const unreadNotifs = notifications.filter(n => !n.leido).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#F05C54] to-[#FF9418] text-white px-5 pt-7 pb-8 rounded-b-[32px] shadow-md relative overflow-hidden">
        <div className="absolute right-0 -top-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Nivel {user.nivel} • {user.tituloNivel}</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-white text-[#F05C54] px-2 py-0.5 rounded-full shadow-xs">
                {user.suscripcion.planId}
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight">
              ¡Hola, {user.nombre}! 👋
            </h1>
            <p className="text-xs font-semibold text-white/90 mt-0.5">
              {user.preguntasRespondidasHoy >= user.preferencias.metaDiaria 
                ? '¡Meta diaria completada por hoy!' 
                : '¿Listo para avanzar en tus 8 cursos?'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/notifications')}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white relative transition-transform active:scale-95"
              aria-label="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-[#183153] font-black text-[9px] rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            <div 
              onClick={() => navigate('/profile')} 
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <ChuplingoMascot mood="happy" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stat Summary */}
      <StatSummaryCard />

      {/* Daily Goal Card */}
      <DailyGoalCard />

      {/* Quick Simulacro Action Card */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-[#7354D9] to-[#8C6EE8] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-purple-200 bg-white/10 px-2 py-0.5 rounded-md mb-1">
              <Timer className="w-3 h-3" />
              <span>Simulacro Tipo Admisión</span>
            </div>
            <h3 className="text-sm font-black truncate">Test General de los 8 Cursos</h3>
            <p className="text-xs text-purple-100 mt-0.5">20 preguntas cronometradas</p>
          </div>

          <button
            onClick={() => navigate('/practice?mode=simulacro')}
            className="px-3.5 py-2 rounded-xl bg-white text-[#7354D9] font-black text-xs shadow-md shrink-0 transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-[#7354D9]" />
            <span>Iniciar</span>
          </button>
        </div>
      </div>

      {/* Quick Continue / Recommendation Card */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-[#163A63] to-[#1F4E85] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 block mb-1">
                {lastSession ? 'Continuar practicando' : 'Empieza tu primera práctica'}
              </span>

              {lastSession ? (
                <>
                  <h3 className="text-base font-black truncate">
                    {lastSession.courseName}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                    {lastSession.topicName || 'Práctica general'} • Último resultado: {lastSession.porcentaje}%
                  </p>
                </>
              ) : recommended ? (
                <>
                  <h3 className="text-base font-black truncate">
                    {recommended.courseName}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                    Tema: {recommended.topicName}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-black">Literatura</h3>
                  <p className="text-xs text-slate-200">Géneros y figuras literarias</p>
                </>
              )}
            </div>

            <button
              onClick={() => {
                if (lastSession) {
                  navigate(`/practice-setup/${lastSession.courseId}/${lastSession.topicId || ''}`);
                } else if (recommended) {
                  navigate(`/practice-setup/${recommended.courseId}/${recommended.topicId}`);
                } else {
                  navigate('/practice-setup/literatura/lit-1');
                }
              }}
              className="w-11 h-11 rounded-2xl bg-[#FF9418] hover:bg-[#F05C54] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 shrink-0"
              aria-label="Comenzar práctica"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
            <button
              onClick={() => navigate('/mistakes')}
              className="flex items-center gap-1.5 text-white/90 hover:text-white font-bold transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-300" />
              <span>Repasar mis errores</span>
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="flex items-center gap-1.5 text-white/90 hover:text-white font-bold transition-colors justify-end"
            >
              <Star className="w-3.5 h-3.5 text-amber-300" />
              <span>Preguntas guardadas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mis Cursos Header & Preview */}
      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#F05C54]" />
            <h2 className="text-base font-black text-[#183153]">
              Mis Cursos
            </h2>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="text-xs font-bold text-[#F05C54] hover:underline flex items-center gap-1"
          >
            <span>Ver todos (8)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {COURSES.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Desafíos de Hoy Preview */}
      <div className="px-4 flex flex-col gap-3 mb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#183153] flex items-center gap-2">
            <span>🏆</span> Desafíos de Hoy
          </h2>
          <button
            onClick={() => navigate('/challenges')}
            className="text-xs font-bold text-[#FF9418] hover:underline flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {dailyChallenges.map((ch) => (
            <ChallengeCard key={ch.id} challenge={ch} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;