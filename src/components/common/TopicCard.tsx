import React from 'react';
import { Topic, Course } from '../../types/chuplingo';
import { useChuplingo } from '../../context/ChuplingoContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { getCourseEmoji } from '../../utils/topicFormatter';

interface TopicCardProps {
  topic: Topic;
  course: Course;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, course }) => {
  const navigate = useNavigate();
  const { getTopicProgress, topicQuestionCounts } = useChuplingo();
  const { accuracy, status } = getTopicProgress(topic.id);

  const formatNumber = (num: number) => String(num).padStart(2, '0');
  const questionsInTopic = topicQuestionCounts[topic.id] || 100;
  const courseEmoji = getCourseEmoji(course.id);

  const statusLabel = 
    status === 'dominado' 
      ? 'Dominado' 
      : status === 'en_progreso' 
        ? 'En progreso' 
        : 'No iniciado';

  const statusBadge = {
    dominado: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    en_progreso: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    no_iniciado: 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
  }[status];

  return (
    <div 
      onClick={() => navigate(`/practice-setup/${course.id}/${topic.id}`)}
      className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/80 cursor-pointer group transition-all duration-200 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 active:scale-[0.99] flex items-center gap-3.5"
    >
      {/* Big Topic Number */}
      <div 
        className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 font-black text-sm transition-transform group-hover:scale-105 shadow-2xs"
        style={{ 
          backgroundColor: `${course.colorHex}20`,
          color: course.colorHex 
        }}
      >
        <span className="text-xs">{courseEmoji}</span>
        <span className="text-sm font-black leading-none mt-0.5">{formatNumber(topic.numero)}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <h4 className="text-sm font-black text-[#183153] dark:text-white leading-snug truncate">
            {topic.nombre}
          </h4>
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold">
            {questionsInTopic} preg.
          </span>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-1 font-medium">
          {topic.descripcion}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge} inline-flex items-center gap-1`}>
            {status === 'dominado' && <CheckCircle className="w-2.5 h-2.5" />}
            {status === 'en_progreso' && <Clock className="w-2.5 h-2.5" />}
            {statusLabel}
          </span>
          <span className="text-[11px] font-extrabold text-[#183153] dark:text-slate-200">
            Dominio: <span style={{ color: course.colorHex }}>{accuracy}%</span>
          </span>
        </div>
      </div>

      {/* Action Chevron */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-white transition-colors shrink-0">
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};