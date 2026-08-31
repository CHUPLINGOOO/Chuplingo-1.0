import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSES } from '../data/coursesData';
import { AppHeader } from '../components/layout/AppHeader';
import { TopicCard } from '../components/common/TopicCard';
import { useChuplingo } from '../context/ChuplingoContext';
import { Play, Sparkles } from 'lucide-react';
import { CourseId } from '../types/chuplingo';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { getCourseProgress } = useChuplingo();

  const course = COURSES.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Curso no encontrado</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-4 py-2 bg-[#F05C54] text-white rounded-xl text-xs font-bold"
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  const { masteryPercent, completedTopicsCount } = getCourseProgress(course.id as CourseId);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Course Colored Header */}
      <AppHeader
        title={course.nombre}
        subtitle={`${course.temas.length} temas disponibles`}
        iconEmoji="📚"
        showBack={true}
        onBack={() => navigate('/courses')}
        bgGradient={course.bgGradient}
      />

      {/* Course Summary Card */}
      <div className="mx-4 -mt-6 bg-white dark:bg-[#1E293B] rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/80 relative z-20 transition-colors">
        <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-medium">
          {course.descripcion}
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block uppercase">Dominio global</span>
            <span className="text-base font-black text-[#183153] dark:text-white">{masteryPercent}%</span>
          </div>

          <button
            onClick={() => navigate(`/practice-setup/${course.id}`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-black text-xs shadow-sm transition-transform active:scale-95"
            style={{ backgroundColor: course.colorHex }}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Practicar Curso</span>
          </button>
        </div>
      </div>

      {/* Topics list */}
      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#183153] dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Temas del Curso</span>
          </h3>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
            {completedTopicsCount}/{course.temas.length} listos
          </span>
        </div>

        {course.temas.map((topic) => (
          <TopicCard key={topic.id} topic={topic} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;