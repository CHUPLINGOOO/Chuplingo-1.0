import React from 'react';
import { COURSES } from '../data/coursesData';
import { AppHeader } from '../components/layout/AppHeader';
import { CourseCard } from '../components/common/CourseCard';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CoursesList: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Coral de Cursos */}
      <AppHeader
        title="Mis Cursos"
        subtitle="8 cursos • Banco Oficial (+8,058 preguntas)"
        iconEmoji="📚"
        bgGradient="from-[#F05C54] to-[#FF7B74]"
        rightAction={
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Preuniversitario</span>
          </div>
        }
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-4 flex flex-col gap-3.5 pt-1 pb-10"
      >
        {COURSES.map((course) => (
          <motion.div key={course.id} variants={itemVariants}>
            <CourseCard course={course} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CoursesList;
