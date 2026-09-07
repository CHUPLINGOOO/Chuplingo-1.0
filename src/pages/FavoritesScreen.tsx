import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { Star, Play, Trash2 } from 'lucide-react';

const FavoritesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteQuestionIds, allQuestions, toggleFavorite } = useChuplingo();

  const savedQuestions = allQuestions.filter(q => favoriteQuestionIds.includes(q.id));

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Preguntas Guardadas"
        subtitle={`${savedQuestions.length} preguntas en tu colección`}
        iconEmoji="⭐"
        showBack={true}
        bgGradient="from-[#F5A623] to-[#F7BC59]"
      />

      <div className="px-4 flex flex-col gap-4">
        {savedQuestions.length > 0 && (
          <button
            onClick={() => navigate('/practice?mode=favoritos')}
            className="w-full py-4 px-6 rounded-2xl bg-[#F5A623] hover:bg-[#E09618] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practicar mis {savedQuestions.length} preguntas guardadas</span>
          </button>
        )}

        <div className="flex flex-col gap-3">
          {savedQuestions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100">
              <Star className="w-8 h-8 text-amber-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No tienes preguntas guardadas aún.</p>
              <p className="text-[11px] text-slate-400 mt-1">Toca el ícono de estrella durante cualquier práctica para guardarla aquí.</p>
            </div>
          ) : (
            savedQuestions.map(q => (
              <div key={q.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                    {q.topicName}
                  </span>
                  <button
                    onClick={() => toggleFavorite(q.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Quitar de favoritos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs font-bold text-[#183153] leading-snug">
                  {q.pregunta}
                </p>

                {q.explicacion && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                    💡 {q.explicacion}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesScreen;