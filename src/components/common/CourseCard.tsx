import React from 'react';
import { Course } from '../../types/chuplingo';
import { useChuplingo } from '../../context/ChuplingoContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Dna, Brain, Globe, SpellCheck, Scale, Sparkles, Languages } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Dna,
  Brain,
  Globe,
  SpellCheck,
  Scale,
  Sparkles,
  Languages
};

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const { getCourseProgress } = useChuplingo();
  const { masteryPercent, completedTopicsCount } = getCourseProgress(course.id);

  const IconComponent = ICON_MAP[course.icono] || BookOpen;

  return (
    <div 
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 overflow-hidden relative cursor-pointer group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
    >
      {/* Barra de color lateral del curso */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-2.5" 
        style={{ backgroundColor: course.colorHex }}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Ícono temático */}
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
              style={{ 
                backgroundColor: `${course.colorHex}20`,
                color: course.colorHex 
              }}
            >
              <IconComponent className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-base font-black text-[#183153] dark:text-white leading-tight truncate">
                  {course.nombre}
                </h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-200 shrink-0">
                  +1,000 preguntas
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed font-medium">
                {course.descripcion}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="mt-4 pt-3 border-t border-slate-100/90 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Dominio del curso</span>
            <span className="font-black text-[#183153] dark:text-white">{masteryPercent}%</span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${masteryPercent}%`,
                backgroundColor: course.colorHex 
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 pt-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300">
              {completedTopicsCount} de {course.temas.length} temas dominados
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/courses/${course.id}`);
              }}
              className="inline-flex items-center gap-1 text-xs font-black px-3.5 py-1.5 rounded-xl text-white shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: course.colorHex }}
            >
              <span>Practicar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};