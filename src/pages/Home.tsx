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
import { motion } from 'framer-motion';
import {
  Play, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  AlertCircle, 
  Star, 
  Timer, 
  Bell, 
  GraduationCap, 
  Building2,
  Flame
} from 'lucide-react';

const TOP_UNIVERSITIES = [
  { id: 'unmsm', name: 'UNMSM', year: '2024-I', color: 'from-blue-600 to-indigo-700' },
  { id: 'uni', name: 'UNI', year: '2023-II', color: 'from-red-600 to-rose-700' },
  { id: 'unsa', name: 'UNSA', year: '2023', color: 'from-amber-600 to-orange-700' },
  { id: 'unfv', name: 'UNFV', year: '2023', color: 'from-orange-500 to-amber-600' },
  { id: 'unsaac', name: 'UNSAAC', year: '2022', color: 'from-purple-600 to-indigo-800' },
  { id: 'pucp', name: 'PUCP', year: 'Admisión', color: 'from-cyan-600 to-blue-700' }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, sessions, getRecommendedTopic, notifications } = useChuplingo();

  const lastSession = sessions.length > 0 ? sessions[0] : null;
  const recommended = getRecommendedTopic();
  const dailyChallenges = INITIAL_CHALLENGES.filter(c => c.periodo === 'diario').slice(0, 2);
  const unreadNotifs = notifications.filter(n => !n.leido).length;
  const missingQuestionsToday = Math.max(0, user.preferencias.metaDiaria - user.preguntasRespondidasHoy);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 pb-20"
    >
      {/* Header Banner */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#F05C54] via-[#FF7B54] to-[#FF9418] text-white px-5 pt-7 pb-8 rounded-b-[36px] shadow-md relative overflow-hidden">
        <div className="absolute right-0 -top-4 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute left-10 -bottom-8 w-28 h-28 bg-amber-300/15 rounded-full blur-lg pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Nivel {user.nivel} • {user.tituloNivel}</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-white text-[#F05C54] px-2.5 py-0.5 rounded-full shadow-xs">
                Plan {user.suscripcion.planId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              ¡Hola, {user.nombre}! 👋
            </h1>
            <p className="text-xs font-bold text-white/90 mt-0.5">
              {missingQuestionsToday === 0 
                ? '🎉 ¡Meta diaria completada por hoy!' 
                : `🔥 Faltan ${missingQuestionsToday} preguntas para proteger tu racha`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white relative transition-transform active:scale-95 shadow-sm"
              aria-label="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-300 text-[#183153] font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#F05C54]">
                  {unreadNotifs}
                </span>
              )}
            </button>

            <div 
              onClick={() => navigate('/profile')} 
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <ChuplingoMascot mood="happy" avatarId={user.avatar} size="sm" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Stat Summary */}
      <motion.div variants={itemVariants}>
        <StatSummaryCard />
      </motion.div>

      {/* Daily Goal Card */}
      <motion.div variants={itemVariants}>
        <DailyGoalCard />
      </motion.div>

      {/* Selector Rápido de Banco de Preguntas por Universidad */}
      <motion.div variants={itemVariants} className="px-4">
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#F05C54]" />
              <span>Exámenes de Admisión Oficiales</span>
            </h3>
            <span className="text-[10px] font-black text-[#F05C54]">Banco 2024</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TOP_UNIVERSITIES.map(u => (
              <button
                key={u.id}
                onClick={() => navigate(`/practice-setup?university=${u.id}`)}
                className="p-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-all flex flex-col items-center text-center group active:scale-95"
              >
                <span className="text-xs font-black text-[#183153] dark:text-white group-hover:text-[#F05C54] transition-colors">
                  {u.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 mt-0.5">
                  {u.year}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Simulacro Action Card */}
      <motion.div variants={itemVariants} className="px-4">
        <div className="bg-gradient-to-r from-[#7354D9] via-[#8363E8] to-[#9176EA] text-white rounded-3xl p-4 shadow-sm flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
          
          <div className="min-w-0 relative z-10">
            <div className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-purple-200 bg-white/15 px-2.5 py-0.5 rounded-lg mb-1">
              <Timer className="w-3 h-3" />
              <span>Simulacro Tipo Admisión</span>
            </div>
            <h3 className="text-sm font-black truncate">Test General de los 8 Cursos</h3>
            <p className="text-xs text-purple-100 mt-0.5 font-medium">25 preguntas cronometradas</p>
          </div>

          <button
            onClick={() => navigate('/practice?mode=simulacro')}
            className="px-4 py-2.5 rounded-2xl bg-white text-[#7354D9] font-black text-xs shadow-md shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 relative z-10"
          >
            <Play className="w-3.5 h-3.5 fill-[#7354D9]" />
            <span>Iniciar</span>
          </button>
        </div>
      </motion.div>

      {/* Quick Continue / Recommendation Card */}
      <motion.div variants={itemVariants} className="px-4">
        <div className="bg-gradient-to-br from-[#163A63] via-[#1C4677] to-[#1F4E85] text-white rounded-3xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 block mb-1">
                {lastSession ? 'Continuar donde te quedaste' : 'Empieza tu primera práctica'}
              </span>

              {lastSession ? (
                <>
                  <h3 className="text-base font-black truncate">
                    {lastSession.courseName}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 font-medium">
                    {lastSession.topicName || 'Práctica general'} • Último resultado: {lastSession.porcentaje}%
                  </p>
                </>
              ) : recommended ? (
                <>
                  <h3 className="text-base font-black truncate">
                    {recommended.courseName}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 font-medium">
                    Tema: {recommended.topicName}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-black">Literatura</h3>
                  <p className="text-xs text-slate-200 font-medium">Géneros y figuras literarias</p>
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
              <AlertCircle className="w-3.5 h-3.5 text-rose-300" />
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
      </motion.div>

      {/* Mis Cursos Header & Preview */}
      <motion.div variants={itemVariants} className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#F05C54]" />
            <h2 className="text-base font-black text-[#183153] dark:text-white">
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
      </motion.div>

      {/* Desafíos de Hoy Preview */}
      <motion.div variants={itemVariants} className="px-4 flex flex-col gap-3 mb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#183153] dark:text-white flex items-center gap-2">
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
      </motion.div>
    </motion.div>
  );
};

export default Home;