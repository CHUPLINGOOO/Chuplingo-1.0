import React from 'react';
import { COURSES } from '../data/coursesData';
import { AppHeader } from '../components/layout/AppHeader';
import { CourseCard } from '../components/common/CourseCard';
import { Sparkles } from 'lucide-react';

const CoursesList: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Exact Coral Header requested */}
      <AppHeader
        title="Mis Cursos"
        subtitle="8 cursos disponibles"
        iconEmoji="📚"
        bgGradient="from-[#F05C54] to-[#FF7B74]"
        rightAction={
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Preuniversitario</span>
          </div>
        }
      />

      <div className="px-4 flex flex-col gap-3.5 pt-1 pb-4">
        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesList;