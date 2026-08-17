import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { 
  Flame, 
  Star, 
  Award, 
  Target, 
  Volume2, 
  Bell, 
  Smartphone, 
  RotateCcw, 
  ChevronRight,
  Edit2,
  Check
} from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../data/coursesData';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, getOverallStats, achievements, updateUserName, updateUserPreferences, resetAllProgress } = useChuplingo();
  const { totalSessions, totalQuestions, overallAccuracy } = getOverallStats();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.nombre);

  const currentLevelThreshold = LEVEL_THRESHOLDS.find(l => l.nivel === user.nivel) || LEVEL_THRESHOLDS[0];
  const nextLevelThreshold = LEVEL_THRESHOLDS.find(l => l.nivel === user.nivel + 1) || { xpMinimo: user.xp + 500 };

  const currentLevelXP = user.xp - currentLevelThreshold.xpMinimo;
  const neededLevelXP = nextLevelThreshold.xpMinimo - currentLevelThreshold.xpMinimo;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXP / neededLevelXP) * 100));

  const handleSaveName = () => {
    updateUserName(tempName);
    setIsEditingName(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Violet Header */}
      <AppHeader
        title="Mi Perfil"
        subtitle="Progreso y configuración de cuenta"
        iconEmoji="👤"
        bgGradient="from-[#7354D9] to-[#9176EA]"
      />

      {/* Profile Avatar & Level Card */}
      <div className="mx-4 -mt-6 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative z-20 flex flex-col items-center text-center">
        <ChuplingoMascot mood="happy" size="md" />

        {/* Editable Name */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-base font-black text-[#183153] border-b-2 border-[#7354D9] text-center focus:outline-none px-2 py-0.5"
                maxLength={24}
              />
              <button
                onClick={handleSaveName}
                className="w-7 h-7 rounded-full bg-[#7354D9] text-white flex items-center justify-center"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-[#183153]">
                {user.nombre}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Editar nombre"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <span className="text-xs font-bold text-[#7354D9] mt-0.5">
          Nivel {user.nivel} • {user.tituloNivel}
        </span>

        {/* Level XP Bar */}
        <div className="w-full mt-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span>{user.xp} XP</span>
            <span>{nextLevelThreshold.xpMinimo} XP</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#7354D9] to-[#FF9418] transition-all duration-500"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick stat chips */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-100">
          <div className="p-2 rounded-xl bg-orange-50">
            <Flame className="w-4 h-4 text-[#FF5722] mx-auto mb-0.5" />
            <span className="text-xs font-black text-[#183153] block">{user.rachaActual} días</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Racha</span>
          </div>

          <div className="p-2 rounded-xl bg-cyan-50">
            <Target className="w-4 h-4 text-[#12B7E8] mx-auto mb-0.5" />
            <span className="text-xs font-black text-[#183153] block">{overallAccuracy}%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Precisión</span>
          </div>

          <div className="p-2 rounded-xl bg-amber-50">
            <Star className="w-4 h-4 text-amber-500 mx-auto mb-0.5 fill-amber-400" />
            <span className="text-xs font-black text-[#183153] block">{totalQuestions}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Preguntas</span>
          </div>
        </div>
      </div>

      {/* Logros link card */}
      <div className="px-4">
        <div 
          onClick={() => navigate('/achievements')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7354D9] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#183153]">
                Insignias y Logros
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {achievements.filter(a => a.desbloqueadoEn).length} de {achievements.length} desbloqueados
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Config / Settings Section */}
      <div className="px-4 flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#183153] uppercase tracking-wide">
          Configuración de Estudio
        </h3>

        {/* Daily Goal Option */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF9418] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#183153] block">Meta diaria de preguntas</span>
              <span className="text-[11px] text-slate-400">Objetivo para mantener tu racha</span>
            </div>
          </div>

          <select
            value={user.preferencias.metaDiaria}
            onChange={(e) => updateUserPreferences({ metaDiaria: Number(e.target.value) })}
            className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-black text-[#183153]"
          >
            <option value={10}>10 preguntas</option>
            <option value={20}>20 preguntas</option>
            <option value={30}>30 preguntas</option>
            <option value={50}>50 preguntas</option>
          </select>
        </div>

        {/* Sound toggle */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#12B7E8] flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#183153] block">Efectos de sonido</span>
              <span className="text-[11px] text-slate-400">Audio al acertar y subir de nivel</span>
            </div>
          </div>

          <button
            onClick={() => updateUserPreferences({ sonido: !user.preferencias.sonido })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              user.preferencias.sonido ? 'bg-[#67C66A]' : 'bg-slate-300'
            }`}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                user.preferencias.sonido ? 'left-6' : 'left-1'
              }`} 
            />
          </button>
        </div>

        {/* Reset progress dangerous button */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar todas tus estadísticas y progreso en Chuplingo?')) {
                resetAllProgress();
              }
            }}
            className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer datos de práctica</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;