import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSES } from '../data/coursesData';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { PracticeMode, CourseId, QuestionDifficulty } from '../types/chuplingo';
import { Zap, Target, Flame, AlertCircle, Star, Sparkles, Check, ArrowRight, Timer } from 'lucide-react';
import { toast } from 'sonner';

const PracticeSetup: React.FC = () => {
  const { courseId: paramCourseId, topicId: paramTopicId } = useParams<{ courseId?: string; topicId?: string }>();
  const navigate = useNavigate();
  const { mistakes, favoriteQuestionIds, user } = useChuplingo();

  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>(
    (paramCourseId as CourseId) || 'literatura'
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    paramTopicId || 'all'
  );
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('rapida');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todas');

  const activeCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];
  const activeMistakesCount = mistakes.filter((m) => !m.dominada).length;
  const favoritesCount = favoriteQuestionIds.length;

  const modes = [
    {
      id: 'rapida' as PracticeMode,
      title: 'Práctica rápida',
      count: 10,
      description: '10 preguntas para un repaso ágil y mantener la racha.',
      icon: Zap,
      badge: '10 preguntas',
      color: '#12B7E8'
    },
    {
      id: 'estandar' as PracticeMode,
      title: 'Práctica estándar',
      count: 20,
      description: '20 preguntas con dificultad progresiva.',
      icon: Target,
      badge: '20 preguntas',
      color: '#FF9418'
    },
    {
      id: 'intensiva' as PracticeMode,
      count: 30,
      title: 'Práctica intensiva',
      description: '30 preguntas para afianzar retención máxima.',
      icon: Flame,
      badge: '30 preguntas',
      color: '#F05C54'
    },
    {
      id: 'simulacro' as PracticeMode,
      count: 25,
      title: 'Simulacro Tipo Admisión',
      description: 'Preguntas aleatorias de los 8 cursos con temporizador.',
      icon: Timer,
      badge: 'Simulacro VIP',
      color: '#7354D9'
    },
    {
      id: 'errores' as PracticeMode,
      title: 'Repasar errores',
      count: activeMistakesCount,
      description: `Entrena las preguntas que fallaste (${activeMistakesCount} pendientes).`,
      icon: AlertCircle,
      badge: `${activeMistakesCount} errores`,
      color: '#E53E3E',
      disabled: activeMistakesCount === 0
    },
    {
      id: 'favoritos' as PracticeMode,
      title: 'Preguntas guardadas',
      count: favoritesCount,
      description: `Practica tu banco de favoritas (${favoritesCount} guardadas).`,
      icon: Star,
      badge: `${favoritesCount} guardadas`,
      color: '#F5A623',
      disabled: favoritesCount === 0
    }
  ];

  const handleStart = () => {
    const query = new URLSearchParams({
      course: selectedCourseId,
      topic: selectedTopicId,
      mode: selectedMode,
      difficulty: selectedDifficulty
    });

    navigate(`/practice?${query.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Seleccionar Práctica"
        subtitle="Configura tu sesión de estudio"
        iconEmoji="🎯"
        showBack={true}
        bgGradient={activeCourse.bgGradient}
      />

      <div className="px-4 flex flex-col gap-4">
        {/* Course selector (hidden during multi-course simulacro) */}
        {selectedMode !== 'simulacro' && selectedMode !== 'errores' && selectedMode !== 'favoritos' && (
          <div>
            <label className="text-xs font-black text-[#183153] uppercase tracking-wide block mb-2">
              Curso
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {COURSES.map((course) => {
                const isSelected = course.id === selectedCourseId;
                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setSelectedTopicId('all');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                      isSelected
                        ? 'bg-[#183153] text-white border-[#183153] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: course.colorHex }}
                    />
                    {course.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Topic selector */}
        {selectedMode !== 'simulacro' && selectedMode !== 'errores' && selectedMode !== 'favoritos' && (
          <div>
            <label className="text-xs font-black text-[#183153] uppercase tracking-wide block mb-2">
              Tema
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
            >
              <option value="all">Todos los temas de {activeCourse.nombre}</option>
              {activeCourse.temas.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  Tema {String(topic.numero).padStart(2, '0')}: {topic.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Difficulty Filter */}
        {selectedMode !== 'errores' && (
          <div>
            <label className="text-xs font-black text-[#183153] uppercase tracking-wide block mb-2">
              Nivel de Dificultad
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'basico', label: 'Básico' },
                { id: 'intermedio', label: 'Medio' },
                { id: 'avanzado', label: 'Avanzado' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`py-1.5 rounded-xl transition-all text-center ${
                    selectedDifficulty === d.id ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Practice Mode Options */}
        <div>
          <label className="text-xs font-black text-[#183153] uppercase tracking-wide block mb-2">
            Modalidad de práctica
          </label>

          <div className="flex flex-col gap-2.5">
            {modes.map((mode) => {
              const isSelected = selectedMode === mode.id;
              const Icon = mode.icon;

              return (
                <div
                  key={mode.id}
                  onClick={() => {
                    if (mode.disabled) {
                      toast.info('No hay preguntas en esta categoría todavía');
                      return;
                    }
                    setSelectedMode(mode.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    mode.disabled
                      ? 'opacity-45 bg-slate-50 border-slate-200 cursor-not-allowed'
                      : isSelected
                        ? 'bg-white border-2 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  style={{
                    borderColor: isSelected ? activeCourse.colorHex : undefined
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ 
                        backgroundColor: `${mode.color}15`,
                        color: mode.color 
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-[#183153] truncate">
                        {mode.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {mode.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span 
                      className="text-[10px] font-black px-2 py-1 rounded-lg"
                      style={{ 
                        backgroundColor: `${mode.color}15`,
                        color: mode.color 
                      }}
                    >
                      {mode.badge}
                    </span>

                    {isSelected && (
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: activeCourse.colorHex }}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-3 pb-4">
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{ backgroundColor: activeCourse.colorHex }}
          >
            <span>Iniciar Práctica Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeSetup;