import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Play, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const ProgressScreen: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, getOverallStats, getCourseProgress, getWeeklyActivity, getRecommendedTopic } = useChuplingo();
  const [filterPeriod, setFilterPeriod] = useState<'7' | '30' | 'all'>('7');

  const { totalSessions, totalQuestions, totalCorrect, overallAccuracy, totalTimeSeconds } = getOverallStats();
  const weeklyData = getWeeklyActivity();
  const recommended = getRecommendedTopic();

  const maxWeeklyQuestions = Math.max(...weeklyData.map(d => d.questions), 10);
  const minutesTotal = Math.round(totalTimeSeconds / 60);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Exact Blue / Cyan Header requested */}
      <AppHeader
        title="Mi Progreso"
        subtitle="Tu historial de prácticas"
        iconEmoji="📊"
        bgGradient="from-[#12B7E8] to-[#36C7F0]"
      />

      {/* When NO sessions exist */}
      {sessions.length === 0 ? (
        <div className="px-4 py-8 flex flex-col items-center justify-center text-center">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 w-full flex flex-col items-center">
            <ChuplingoMascot mood="curious" size="lg" />

            <h3 className="text-xl font-black text-[#183153] dark:text-white mt-4">
              ¡Aún no hay prácticas!
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium max-w-xs mt-2 leading-relaxed">
              Completa una sesión de práctica para ver tu progreso, estadísticas por curso y gráficos aquí.
            </p>

            <button
              onClick={() => navigate('/courses')}
              className="mt-6 py-3.5 px-6 rounded-2xl bg-[#12B7E8] hover:bg-[#0EA5D3] text-white font-black text-xs shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>Empezar mi primer test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-4">
          {/* General Summary Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/80 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Resumen General
              </h3>
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  onClick={() => setFilterPeriod('7')}
                  className={`px-2 py-0.5 rounded-md ${filterPeriod === '7' ? 'bg-white dark:bg-[#1E293B] text-[#183153] dark:text-white shadow-xs' : 'text-slate-400'}`}
                >
                  7 días
                </button>
                <button
                  onClick={() => setFilterPeriod('30')}
                  className={`px-2 py-0.5 rounded-md ${filterPeriod === '30' ? 'bg-white dark:bg-[#1E293B] text-[#183153] dark:text-white shadow-xs' : 'text-slate-400'}`}
                >
                  30 días
                </button>
                <button
                  onClick={() => setFilterPeriod('all')}
                  className={`px-2 py-0.5 rounded-md ${filterPeriod === 'all' ? 'bg-white dark:bg-[#1E293B] text-[#183153] dark:text-white shadow-xs' : 'text-slate-400'}`}
                >
                  Todo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60">
                <span className="text-lg font-black text-[#12B7E8] block leading-none">
                  {totalSessions}
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                  Sesiones
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60">
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block leading-none">
                  {overallAccuracy}%
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                  Precisión
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/60">
                <span className="text-lg font-black text-[#FF9418] block leading-none">
                  {totalCorrect}
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                  Correctas
                </span>
              </div>
            </div>

            {/* Extra stats */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Preguntas: <strong className="text-[#183153] dark:text-white">{totalQuestions}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Tiempo: <strong className="text-[#183153] dark:text-white">{minutesTotal} min</strong></span>
              </div>
            </div>
          </div>

          {/* Weekly Activity Bar Chart */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/80 transition-colors">
            <h3 className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#12B7E8]" /> Actividad Semanal
            </h3>

            <div className="flex items-end justify-between gap-2 h-28 pt-4 px-1">
              {weeklyData.map((item, idx) => {
                const heightPercent = Math.max(8, Math.round((item.questions / maxWeeklyQuestions) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-300">
                      {item.questions > 0 ? item.questions : ''}
                    </span>
                    <div 
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${
                        item.isToday 
                          ? 'bg-[#12B7E8] shadow-sm' 
                          : item.questions > 0 
                            ? 'bg-slate-300 dark:bg-slate-700' 
                            : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className={`text-[10px] font-black ${item.isToday ? 'text-[#12B7E8]' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Recommendation Card */}
          {recommended && (
            <div className="bg-gradient-to-r from-[#7354D9] to-[#8C6EE8] text-white rounded-3xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-purple-200 block mb-1">
                    🧠 Recomendado para ti
                  </span>
                  <h4 className="text-sm font-black">
                    {recommended.courseName} — {recommended.topicName}
                  </h4>
                  <p className="text-xs text-purple-100 mt-0.5 font-medium">
                    Precisión actual: {recommended.accuracy}% • Refuerza este tema
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/practice-setup/${recommended.courseId}/${recommended.topicId}`)}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#7354D9] font-black text-xs shadow-sm shrink-0 transition-transform active:scale-95"
                >
                  Practicar ahora
                </button>
              </div>
            </div>
          )}

          {/* Progress By Course List */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/80 transition-colors">
            <h3 className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide mb-3">
              Progreso por curso
            </h3>

            <div className="flex flex-col gap-3">
              {COURSES.map((course) => {
                const { accuracy } = getCourseProgress(course.id);

                return (
                  <div key={course.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#183153] dark:text-white flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: course.colorHex }}
                        />
                        {course.nombre}
                      </span>
                      <span className="font-black text-[#183153] dark:text-white">
                        {accuracy}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${accuracy}%`,
                          backgroundColor: course.colorHex 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Practice History Button */}
          <button
            onClick={() => navigate('/history')}
            className="w-full py-3.5 px-4 rounded-3xl bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#183153] dark:text-white font-black text-xs border border-slate-200 dark:border-slate-700/80 flex items-center justify-between shadow-sm transition-colors"
          >
            <span>Ver historial completo de prácticas ({sessions.length})</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressScreen;