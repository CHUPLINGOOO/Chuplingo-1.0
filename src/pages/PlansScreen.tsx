import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { CHUPLINGO_PLANS } from '../data/plansData';
import { PlanId } from '../types/chuplingo';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { Check, Star, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const PlansScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, changeUserPlan } = useChuplingo();

  const handleSelectPlan = (planId: PlanId) => {
    if (user.suscripcion.planId === planId) {
      toast.info('Ya tienes este plan activo');
      return;
    }
    changeUserPlan(planId);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Banner */}
      <AppHeader
        title="Encuentra tu plan"
        subtitle="Elige la mejor forma de prepararte"
        iconEmoji="⭐"
        showBack={true}
        bgGradient="from-[#F05C54] via-[#FF9418] to-[#F5A623]"
      />

      {/* Mascot Card */}
      <div className="mx-4 -mt-6 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative z-20 flex items-center gap-4">
        <ChuplingoMascot mood="celebrating" size="sm" />
        <div className="min-w-0">
          <span className="text-[10px] font-black text-[#FF9418] uppercase tracking-wider block">
            Potencia tu aprendizaje
          </span>
          <h2 className="text-sm font-black text-[#183153] leading-snug">
            Plan actual: <span className="text-[#F05C54] uppercase">{user.suscripcion.planId}</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Acceso a los 8 cursos preuniversitarios oficiales.
          </p>
        </div>
      </div>

      {/* 4 Plan Cards */}
      <div className="px-4 flex flex-col gap-3.5">
        {CHUPLINGO_PLANS.map((plan) => {
          const isCurrent = user.suscripcion.planId === plan.id;
          const isVIP = plan.id === 'vip';

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-5 transition-all relative overflow-hidden ${
                isVIP
                  ? 'bg-gradient-to-br from-[#183153] via-[#244572] to-[#162C4E] text-white shadow-xl border-2 border-amber-400'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {/* Highlight ribbon */}
              {plan.destacado && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-[#FF9418] text-[#183153] font-black text-[10px] uppercase px-4 py-1 rounded-bl-2xl shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Recomendado</span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-black ${isVIP ? 'text-white' : 'text-[#183153]'}`}>
                      {plan.nombre}
                    </h3>
                    {plan.badge && (
                      <span 
                        className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: plan.colorHex }}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 font-medium ${isVIP ? 'text-slate-300' : 'text-slate-500'}`}>
                    {plan.subtitulo}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black">
                  S/ {plan.precio}
                </span>
                <span className={`text-xs font-bold ${isVIP ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.precio === 0 ? 'para siempre' : `/${plan.periodo}`}
                </span>
              </div>

              {/* Benefits list */}
              <div className="mt-4 pt-3 border-t border-slate-200/30 flex flex-col gap-2">
                {plan.beneficios.map((ben, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
                      style={{ backgroundColor: plan.colorHex }}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className={`leading-tight ${isVIP ? 'text-slate-200' : 'text-slate-700 font-medium'}`}>
                      {ben}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Action */}
              <div className="mt-5">
                {isCurrent ? (
                  <div className="w-full py-3 rounded-2xl bg-white/20 text-center text-xs font-black">
                    ✓ Tu plan actual
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 text-white"
                    style={{ backgroundColor: plan.colorHex }}
                  >
                    <span>{plan.precio === 0 ? 'Seleccionar Plan Gratis' : `Actualizar a ${plan.nombre}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansScreen;