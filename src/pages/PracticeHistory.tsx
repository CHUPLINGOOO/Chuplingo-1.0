import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const PracticeHistory: React.FC = () => {
  const navigate = useNavigate();
  const { sessions } = useChuplingo();

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Historial de Prácticas"
        subtitle={`${sessions.length} sesiones completadas`}
        iconEmoji="📜"
        showBack={true}
        bgGradient="from-[#163A63] to-[#254A7A]"
      />

      <div className="px-4 flex flex-col gap-3">
        {sessions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-500">Aún no has completado ninguna sesión de práctica.</p>
          </div>
        ) : (
          sessions.map((session) => {
            const course = COURSES.find(c => c.id === session.courseId) || COURSES[0];

            return (
              <div
                key={session.id}
                onClick={() => navigate(`/results/${session.id}`)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm text-white"
                    style={{ backgroundColor: course.colorHex }}
                  >
                    {session.porcentaje}%
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-[#183153] truncate">
                      {session.courseName}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {session.topicName || 'Práctica General'}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {formatDate(session.fecha)} • {session.correctas}/{session.totalPreguntas} aciertos
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PracticeHistory;