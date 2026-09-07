import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Star, 
  Play, 
  Home, 
  AlertCircle,
  Award,
  BookOpen
} from 'lucide-react';

const PracticeResults: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, user } = useChuplingo();

  const session = sessions.find((s) => s.id === sessionId) || sessions[0];

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Sesión no encontrada</p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="mt-4 px-4 py-2 bg-[#F05C54] text-white rounded-xl text-xs font-bold"
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  const course = COURSES.find((c) => c.id === session.courseId) || COURSES[0];
  const isPassed = session.porcentaje >= 70;
  const minutes = Math.floor(session.duracionSegundos / 60);
  const seconds = session.duracionSegundos % 60;
  const timeFormatted = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-slate-900 flex flex-col justify-between pb-8 transition-colors">
      {/* Top Banner */}
      <div className="bg-gradient-to-b from-[#183153] to-[#254A7A] text-white pt-8 pb-12 px-6 rounded-b-[36px] text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <ChuplingoMascot mood={isPassed ? 'celebrating' : 'thinking'} size="lg" />

          <h1 className="text-2xl font-black mt-3">
            {isPassed ? '¡Práctica completada! 🎉' : '¡Buen esfuerzo! 👏'}
          </h1>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            {session.courseName} • {session.topicName || 'Práctica General'}
          </p>

          {/* Big Circular Percentage */}
          <div className="mt-5 w-28 h-28 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 flex flex-col items-center justify-center shadow-inner">
            <span className="text-3xl font-black text-white">
              {session.porcentaje}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
              Precisión
            </span>
          </div>
        </div>
      </div>

      {/* Stats Breakdown Card */}
      <div className="px-4 -mt-6 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 block leading-none">
              {session.correctas}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              Correctas
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60">
            <XCircle className="w-4 h-4 text-rose-600 mx-auto mb-1" />
            <span className="text-lg font-black text-rose-700 dark:text-rose-300 block leading-none">
              {session.incorrectas}
            </span>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
              Incorrectas
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60">
            <Star className="w-4 h-4 text-amber-500 mx-auto mb-1 fill-amber-400" />
            <span className="text-lg font-black text-amber-700 dark:text-amber-300 block leading-none">
              +{session.xpGanado}
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
              XP ganado
            </span>
          </div>
        </div>

        {/* Time and Total Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-700 mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Tiempo empleado: <strong className="text-[#183153] dark:text-white">{timeFormatted}</strong></span>
          </div>

          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
            <Award className="w-4 h-4 text-purple-500" />
            <span>Nivel actual: <strong className="text-[#183153] dark:text-white">{user.nivel}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 flex flex-col gap-2.5 mt-6">
        {session.incorrectas > 0 && (
          <button
            onClick={() => navigate('/mistakes')}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-extrabold text-xs flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900 transition-transform active:scale-95 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Revisar {session.incorrectas} errores cometidos</span>
          </button>
        )}

        <button
          onClick={() => navigate(`/practice-setup/${session.courseId || 'literatura'}/${session.topicId || ''}`, { replace: true })}
          className="w-full py-4 px-4 rounded-2xl text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          style={{ backgroundColor: course.colorHex }}
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Continuar practicando</span>
        </button>

        <button
          onClick={() => navigate('/courses', { replace: true })}
          className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#183153] dark:text-white font-black text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Volver a Mis Cursos</span>
        </button>

        <button
          onClick={() => navigate('/', { replace: true })}
          className="w-full py-3 px-4 rounded-2xl bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Ir al Inicio</span>
        </button>
      </div>
    </div>
  );
};

export default PracticeResults;