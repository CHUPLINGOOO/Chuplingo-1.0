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
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative cursor-pointer group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
    >
      {/* Distinctive colored left border strip */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-2.5" 
        style={{ backgroundColor: course.colorHex }}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Course Icon */}
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
              style={{ 
                backgroundColor: `${course.colorHex}15`,
                color: course.colorHex 
              }}
            >
              <IconComponent className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-black text-[#183153] leading-tight truncate">
                {course.nombre}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {course.descripcion}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar & Info */}
        <div className="mt-4 pt-3 border-t border-slate-100/90">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-500">Progreso</span>
            <span className="font-black text-[#183153]">{masteryPercent}%</span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${masteryPercent}%`,
                backgroundColor: course.colorHex 
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 pt-1">
            <span className="text-[11px] font-medium text-slate-500">
              {completedTopicsCount} de {course.temas.length} temas dominados
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/courses/${course.id}`);
              }}
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl text-white shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: course.colorHex }}
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};