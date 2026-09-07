import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { AlertCircle, CheckCircle2, Play, ArrowRight } from 'lucide-react';

const MistakesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { mistakes, allQuestions } = useChuplingo();

  const activeMistakes = mistakes.filter(m => !m.dominada);
  const dominatedMistakes = mistakes.filter(m => m.dominada);

  const getQuestion = (qId: string) => allQuestions.find(q => q.id === qId);

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Mis Errores"
        subtitle="Repasa las preguntas que has fallado"
        iconEmoji="❌"
        showBack={true}
        bgGradient="from-[#E53E3E] to-[#F56565]"
      />

      <div className="px-4 flex flex-col gap-4">
        {activeMistakes.length > 0 && (
          <button
            onClick={() => navigate('/practice?mode=errores')}
            className="w-full py-4 px-6 rounded-2xl bg-[#E53E3E] hover:bg-[#C53030] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practicar mis {activeMistakes.length} errores pendientes</span>
          </button>
        )}

        {/* Pending Mistakes list */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-[#183153] uppercase tracking-wide">
            Preguntas por dominar ({activeMistakes.length})
          </h3>

          {activeMistakes.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">¡Excelente! No tienes errores pendientes.</p>
              <p className="text-[11px] text-slate-400 mt-1">Sigue practicando en tus cursos para mantener el ritmo.</p>
            </div>
          ) : (
            activeMistakes.map(m => {
              const q = getQuestion(m.questionId);
              if (!q) return null;

              return (
                <div key={m.questionId} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                      Fallada {m.fallosConsecutivos} {m.fallosConsecutivos === 1 ? 'vez' : 'veces'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {q.topicName}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#183153] leading-snug">
                    {q.pregunta}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">
                      Respuesta correcta: <strong className="text-emerald-700">Opción {q.respuestaCorrecta}</strong>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dominated questions history */}
        {dominatedMistakes.length > 0 && (
          <div className="flex flex-col gap-2 pt-2">
            <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wide">
              Errores ya dominados ({dominatedMistakes.length})
            </h3>
            {dominatedMistakes.map(m => {
              const q = getQuestion(m.questionId);
              if (!q) return null;
              return (
                <div key={m.questionId} className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200/60 flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#183153] truncate">{q.pregunta}</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">Dominada ✓</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MistakesScreen;