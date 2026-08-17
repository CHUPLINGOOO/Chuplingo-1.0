import React, { useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { INITIAL_CHALLENGES } from '../data/challengesData';
import { ChallengeCard } from '../components/common/ChallengeCard';
import { useChuplingo } from '../context/ChuplingoContext';
import { Trophy, Calendar, Sparkles } from 'lucide-react';

const ChallengesScreen: React.FC = () => {
  const { user } = useChuplingo();
  const [activeTab, setActiveTab] = useState<'diario' | 'semanal'>('diario');

  const filteredChallenges = INITIAL_CHALLENGES.filter(
    (c) => c.periodo === activeTab
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Exact Orange Header requested */}
      <AppHeader
        title="Desafíos"
        subtitle="Completa desafíos y gana XP"
        iconEmoji="🏆"
        bgGradient="from-[#FF9418] to-[#FFA738]"
        rightAction={
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{user.xp} XP</span>
          </div>
        }
      />

      {/* Tabs */}
      <div className="px-4">
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center">
          <button
            onClick={() => setActiveTab('diario')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'diario'
                ? 'bg-white text-[#183153] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>📅 Desafíos de Hoy</span>
          </button>

          <button
            onClick={() => setActiveTab('semanal')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'semanal'
                ? 'bg-white text-[#183153] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-[#FF9418]" />
            <span>Desafíos Semanales</span>
          </button>
        </div>
      </div>

      {/* List of Challenge Cards */}
      <div className="px-4 flex flex-col gap-3">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
};

export default ChallengesScreen;