import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSES } from '../data/coursesData';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { PracticeMode, CourseId, UniversityTarget } from '../types/chuplingo';
import { Zap, Target, Flame, AlertCircle, Star, Timer, Building2, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const PracticeSetup: React.FC = () => {
  const { courseId: paramCourseId, topicId: paramTopicId } = useParams<{ courseId?: string; topicId?: string }>();
  const navigate = useNavigate();
  const { mistakes, favoriteQuestionIds } = useChuplingo();

  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>(
    (paramCourseId as CourseId) || 'literatura'
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    paramTopicId || 'all'
  );
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('rapida');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todas');
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityTarget>('todas');

  const activeCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];
  const activeMistakesCount = mistakes.filter((m) => !m.dominada).length;
  const favoritesCount = favoriteQuestionIds.length;

  const universities = [
    { id: 'todas', label: 'Todas las Universidades' },
    { id: 'unmsm', label: 'UNMSM (San Marcos)' },
    { id: 'uni', label: 'UNI (Ingeniería)' },
    { id: 'unsa', label: 'UNSA (Arequipa)' },
    { id: 'unfv', label: 'UNFV (Villareal)' },
    { id: 'unsaac', label: 'UNSAAC (Cusco)' },
    { id: 'pucp', label: 'PUCP (Católica)' }
  ];

  const modes = [
    {
      id: 'rapida' as PracticeMode,
      title: 'Práctica rápida',
      count: 10,
      description: '10 preguntas para mantener tu racha activa en 5 min.',
      icon: Zap,
      badge: '10 preguntas',
      color: '#12B7E8'
    },
    {
      id: 'estandar' as PracticeMode,
      title: 'Práctica estándar',
      count: 20,
      description: '20 preguntas para afianzar conceptos clave.',
      icon: Target,
      badge: '20 preguntas',
      color: '#FF9418'
    },
    {
      id: 'intensiva' as PracticeMode,
      count: 30,
      title: 'Práctica intensiva',
      description: '30 preguntas tipo examen para máxima retención.',
      icon: Flame,
      badge: '30 preguntas',
      color: '#F05C54'
    },
    {
      id: 'simulacro' as PracticeMode,
      count: 25,
      title: 'Simulacro Tipo Admisión',
      description: '25 preguntas cronometradas de los 8 cursos preuniversitarios.',
      icon: Timer,
      badge: 'Simulacro VIP',
      color: '#7354D9'
    },
    {
      id: 'errores' as PracticeMode,
      title: 'Repasar mis errores',
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
      description: `Practica tu colección personal (${favoritesCount} guardadas).`,
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
      difficulty: selectedDifficulty,
      university: selectedUniversity
    });

    navigate(`/practice?${query.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <AppHeader
        title="Personalizar Práctica"
        subtitle="Elige universidad, curso y modalidad"
        iconEmoji="🎯"
        showBack={true}
        fallbackRoute="/courses"
        bgGradient={activeCourse.bgGradient}
      />

      <div className="px-4 flex flex-col gap-4">
        {/* University Exam Filter */}
        {selectedMode !== 'simulacro' && selectedMode !== 'errores' && selectedMode !== 'favoritos' && (
          <div>
            <label className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Building2 className="w-3.5 h-3.5 text-[#183153] dark:text-slate-300" />
              <span>Universidad Objetivo</span>
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value as UniversityTarget)}
              className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 text-xs font-black text-[#183153] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F05C54] shadow-2xs"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  🏛️ {u.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Course selector */}
        {selectedMode !== 'simulacro' && selectedMode !== 'errores' && selectedMode !== 'favoritos' && (
          <div>
            <label className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide block mb-2">
              Curso Preuniversitario
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
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                      isSelected
                        ? 'bg-[#183153] dark:bg-purple-600 text-white border-[#183153] dark:border-purple-600 shadow-xs'
                        : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
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
            <label className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide block mb-2">
              Tema Específico
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 text-xs font-bold text-[#183153] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F05C54] shadow-2xs"
            >
              <option value="all">📚 Todos los temas de {activeCourse.nombre}</option>
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
            <label className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide block mb-2">
              Nivel de Dificultad
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'basico', label: 'Básico' },
                { id: 'intermedio', label: 'Medio' },
                { id: 'avanzado', label: 'Avanzado' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`py-2 rounded-xl transition-all text-center font-black ${
                    selectedDifficulty === d.id 
                      ? 'bg-white dark:bg-[#1E293B] text-[#183153] dark:text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400'
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
          <label className="text-xs font-black text-[#183153] dark:text-white uppercase tracking-wide block mb-2">
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
                  className={`p-3.5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    mode.disabled
                      ? 'opacity-45 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                      : isSelected
                        ? 'bg-white dark:bg-[#1E293B] border-2 shadow-md'
                        : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  style={{
                    borderColor: isSelected ? activeCourse.colorHex : undefined
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ 
                        backgroundColor: `${mode.color}20`,
                        color: mode.color 
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-[#183153] dark:text-white truncate">
                        {mode.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 line-clamp-1 font-medium">
                        {mode.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span 
                      className="text-[10px] font-black px-2.5 py-1 rounded-xl"
                      style={{ 
                        backgroundColor: `${mode.color}20`,
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
        <div className="pt-2 pb-2">
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
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