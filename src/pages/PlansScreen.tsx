import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { CHUPLINGO_PLANS } from '../data/plansData';
import { PlanId } from '../types/chuplingo';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { Check, Star, Zap, Shield, Sparkles, ArrowRight, Upload, Clock, AlertCircle, X, Phone, Hash, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const PlansScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, changeUserPlan, submitSubscriptionRequest, userPendingRequest, isAuthenticated } = useChuplingo();

  const [selectedPlanForModal, setSelectedPlanForModal] = useState<any | null>(null);
  const [operationNumber, setOperationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPlan = (plan: any) => {
    if (!isAuthenticated) {
      toast.info('Debes iniciar sesión para suscribirte');
      navigate('/login');
      return;
    }

    if (user.suscripcion.planId === plan.id) {
      toast.info('Ya tienes este plan activo');
      return;
    }

    if (plan.id === 'gratis') {
      changeUserPlan('gratis');
      return;
    }

    if (userPendingRequest && userPendingRequest.status === 'pendiente') {
      toast.info(`Ya tienes una solicitud pendiente para el Plan ${userPendingRequest.plan}`);
      return;
    }

    setSelectedPlanForModal(plan);
  };

  const handleSendPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!operationNumber.trim() && !phoneNumber.trim() && !proofFile) {
      toast.error('Ingresa al menos el N° de Operación o tu número de teléfono');
      return;
    }

    setIsSubmitting(true);
    const success = await submitSubscriptionRequest({
      planId: selectedPlanForModal.id.toUpperCase() as 'FAN' | 'LOVER' | 'VIP',
      price: selectedPlanForModal.precio,
      operationNumber: operationNumber.trim(),
      phoneNumber: phoneNumber.trim(),
      proofFile: proofFile
    });

    setIsSubmitting(false);
    if (success) {
      setSelectedPlanForModal(null);
      setOperationNumber('');
      setPhoneNumber('');
      setProofFile(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Header Banner */}
      <AppHeader
        title="Encuentra tu plan"
        subtitle="Elige la mejor forma de prepararte"
        iconEmoji="⭐"
        showBack={true}
        bgGradient="from-[#F05C54] via-[#FF9418] to-[#F5A623]"
      />

      {/* Mascot & Active Status Card */}
      <div className="mx-4 -mt-6 bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative z-20 flex items-center gap-4">
        <ChuplingoMascot mood="celebrating" avatarId={user.avatar} size="sm" />
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-black text-[#FF9418] uppercase tracking-wider block">
            Potencia tu aprendizaje
          </span>
          <h2 className="text-sm font-black text-[#183153] dark:text-white leading-snug">
            Plan actual: <span className="text-[#F05C54] uppercase">{user.suscripcion.planId}</span>
          </h2>
          {userPendingRequest && userPendingRequest.status === 'pendiente' ? (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Solicitud Plan {userPendingRequest.plan} en revisión
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Acceso a los 8 cursos preuniversitarios oficiales.
            </p>
          )}
        </div>
      </div>

      {/* Pending Request Alert Badge */}
      {userPendingRequest && userPendingRequest.status === 'pendiente' && (
        <div className="mx-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-black block">Solicitud de suscripción pendiente</span>
            <span className="text-[11px]">
              Estamos verificando tu pago Yape de S/ {userPendingRequest.price} para el Plan {userPendingRequest.plan}. En breve se activará tu cuenta.
            </span>
          </div>
        </div>
      )}

      {/* 4 Plan Cards */}
      <div className="px-4 flex flex-col gap-3.5">
        {CHUPLINGO_PLANS.map((plan) => {
          const isCurrent = user.suscripcion.planId === plan.id;
          const isVIP = plan.id === 'vip';
          const isPendingThisPlan = userPendingRequest?.status === 'pendiente' && userPendingRequest.plan.toLowerCase() === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-5 transition-all relative overflow-hidden ${
                isVIP
                  ? 'bg-gradient-to-br from-[#183153] via-[#244572] to-[#162C4E] text-white shadow-xl border-2 border-amber-400'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
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
                    <h3 className={`text-base font-black ${isVIP ? 'text-white' : 'text-[#183153] dark:text-white'}`}>
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
                  <p className={`text-xs mt-0.5 font-medium ${isVIP ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {plan.subtitulo}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black">
                  S/ {plan.precio}
                </span>
                <span className={`text-xs font-bold ${isVIP ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
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
                    <span className={`leading-tight ${isVIP ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                      {ben}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Action */}
              <div className="mt-5">
                {isCurrent ? (
                  <div className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-center text-xs font-black">
                    ✓ Tu plan actual
                  </div>
                ) : isPendingThisPlan ? (
                  <div className="w-full py-3.5 px-4 rounded-2xl bg-amber-100 text-amber-900 text-center text-xs font-black flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Pago en revisión</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 text-white cursor-pointer"
                    style={{ backgroundColor: plan.colorHex }}
                  >
                    <span>{plan.precio === 0 ? 'Seleccionar Plan Gratis' : `Yapear y activar ${plan.nombre}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Pago Yape optimizado arriba y 100% visible */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-start justify-center p-3 pt-3 sm:pt-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col gap-3 my-0">
            {/* Header del modal */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="text-sm font-black text-[#183153] dark:text-white leading-tight">Pagar con Yape</h3>
                  <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400">Plan {selectedPlanForModal.nombre}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tarjeta con los datos de Yape */}
            <div className="bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-2xl p-3 text-center flex flex-col gap-1">
              <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300">
                Monto exacto a transferir:
              </span>
              <span className="text-2xl font-black text-purple-900 dark:text-purple-100">
                S/ {selectedPlanForModal.precio}.00
              </span>
              
              <div className="bg-white dark:bg-slate-800 py-2 px-3 rounded-xl border border-purple-100 dark:border-purple-900 mt-1 shadow-2xs flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Yape Oficial:</span>
                  <span className="text-sm font-black text-[#183153] dark:text-white tracking-wider font-mono">968 839 074</span>
                </div>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-lg">
                  Rufo H.
                </span>
              </div>
            </div>

            {/* Formulario para registrar comprobante */}
            <form onSubmit={handleSendPaymentProof} className="flex flex-col gap-2.5">
              <div>
                <label className="text-[11px] font-black text-[#183153] dark:text-slate-200 uppercase tracking-wide flex items-center gap-1 mb-1">
                  <Hash className="w-3.5 h-3.5 text-purple-500" />
                  <span>Número de Operación Yape</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: 14892018"
                  value={operationNumber}
                  onChange={(e) => setOperationNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-[#183153] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-[#183153] dark:text-slate-200 uppercase tracking-wide flex items-center gap-1 mb-1">
                  <Phone className="w-3.5 h-3.5 text-purple-500" />
                  <span>Teléfono con el que yapeaste</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 999 888 777"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-[#183153] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-[#183153] dark:text-slate-200 uppercase tracking-wide flex items-center gap-1 mb-1">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                  <span>Captura de comprobante (Opcional)</span>
                </label>
                <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-400 rounded-xl p-2.5 text-center cursor-pointer flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 transition-colors">
                  <Upload className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                    {proofFile ? proofFile.name : 'Adjuntar imagen o captura'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Botón principal de envío destacado */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#7354D9] to-[#9176EA] hover:from-[#603EC8] hover:to-[#7E61DD] disabled:opacity-60 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              >
                <span>{isSubmitting ? 'Enviando comprobante...' : 'Enviar y Activar Suscripción'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansScreen;