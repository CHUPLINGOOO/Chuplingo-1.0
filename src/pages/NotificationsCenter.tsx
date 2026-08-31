import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { Bell, Flame, Trophy, Award, Sparkles, Trash2, ArrowRight } from 'lucide-react';

const NOTIF_ICONS = {
  racha: Flame,
  desafio: Trophy,
  logro: Award,
  sistema: Sparkles,
  suscripcion: Bell
};

const NotificationsCenter: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, clearAllNotifications, user } = useChuplingo();

  const missingToday = Math.max(0, user.preferencias.metaDiaria - user.preguntasRespondidasHoy);

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Centro de Avisos"
        subtitle="Recordatorios de racha y metas de estudio"
        iconEmoji="🔔"
        showBack={true}
        bgGradient="from-[#183153] to-[#254A7A]"
        rightAction={
          notifications.length > 0 ? (
            <button
              onClick={clearAllNotifications}
              className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          ) : undefined
        }
      />

      {/* Racha Radar Banner */}
      <div className="mx-4 -mt-2 bg-gradient-to-r from-[#FF5722] to-[#FF9418] rounded-3xl p-4 text-white shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-200">
              Estado de tu Racha
            </h4>
            <p className="text-sm font-black mt-0.5">
              {missingToday === 0 
                ? `🔥 ¡Racha de ${user.rachaActual} días asegurada hoy!` 
                : `Te faltan ${missingToday} preguntas hoy`}
            </p>
          </div>
        </div>

        {missingToday > 0 && (
          <button
            <dyad-write path="src/pages/NotificationsCenter.tsx" description="Centro de Notificaciones creativo con avisos de racha en riesgo y simulacros">
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { Bell, Flame, Trophy, Award, Sparkles, Trash2, ArrowRight, Play } from 'lucide-react';

const NOTIF_ICONS = {
  racha: Flame,
  desafio: Trophy,
  logro: Award,
  sistema: Sparkles,
  suscripcion: Bell
};

const NotificationsCenter: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, clearAllNotifications, user } = useChuplingo();

  const missingToday = Math.max(0, user.preferencias.metaDiaria - user.preguntasRespondidasHoy);

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Centro de Avisos"
        subtitle="Recordatorios de racha y metas de estudio"
        iconEmoji="🔔"
        showBack={true}
        bgGradient="from-[#183153] to-[#254A7A]"
        rightAction={
          notifications.length > 0 ? (
            <button
              onClick={clearAllNotifications}
              className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          ) : undefined
        }
      />

      {/* Racha Radar Banner */}
      <div className="mx-4 -mt-2 bg-gradient-to-r from-[#FF5722] to-[#FF9418] rounded-3xl p-4 text-white shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-200">
              Estado de tu Racha
            </h4>
            <p className="text-sm font-black mt-0.5">
              {missingToday === 0 
                ? `🔥 ¡Racha de ${user.rachaActual} días asegurada hoy!` 
                : `Te faltan ${missingToday} preguntas hoy`}
            </p>
          </div>
        </div>

        {missingToday > 0 && (
          <button
            onClick={() => navigate('/practice-setup')}
            className="px-3.5 py-2 rounded-xl bg-white text-[#FF5722] font-black text-xs shadow-md shrink-0 transition-transform active:scale-95 flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5 fill-[#FF5722]" />
            <span>Salvar racha</span>
          </button>
        )}
      </div>

      <div className="px-4 flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-black text-slate-700">No tienes notificaciones pendientes</p>
            <p className="text-[11px] text-slate-400 mt-1">Aquí recibirás recordatorios para proteger tu racha y tus logros.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = NOTIF_ICONS[notif.tipo] || Bell;

            return (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.actionUrl) {
                    navigate(notif.actionUrl);
                  }
                }}
                className={`p-4 rounded-3xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                  notif.leido 
                    ? 'bg-white border-slate-100 opacity-75' 
                    : 'bg-white border-amber-200 shadow-xs ring-1 ring-amber-100/60'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF9418] flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#183153]">
                      {notif.titulo}
                    </h4>
                    {!notif.leido && (
                      <span className="w-2 h-2 rounded-full bg-[#FF9418] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                    {notif.mensaje}
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1.5">
                    {new Date(notif.fecha).toLocaleDateString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsCenter;