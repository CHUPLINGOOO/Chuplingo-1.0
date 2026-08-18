import React from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { Bell, Flame, Trophy, Award, Sparkles, Check, Trash2 } from 'lucide-react';

const NOTIF_ICONS = {
  racha: Flame,
  desafio: Trophy,
  logro: Award,
  sistema: Sparkles,
  suscripcion: Bell
};

const NotificationsCenter: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useChuplingo();

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Notificaciones"
        subtitle="Avisos de racha, desafíos y logros"
        iconEmoji="🔔"
        showBack={true}
        bgGradient="from-[#183153] to-[#254A7A]"
        rightAction={
          notifications.length > 0 ? (
            <button
              onClick={clearAllNotifications}
              className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          ) : undefined
        }
      />

      <div className="px-4 flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No tienes notificaciones pendientes</p>
            <p className="text-[11px] text-slate-400 mt-1">Aquí recibirás recordatorios para proteger tu racha y tus logros.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = NOTIF_ICONS[notif.tipo] || Bell;

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  notif.leido 
                    ? 'bg-white border-slate-100 opacity-75' 
                    : 'bg-white border-amber-200 shadow-sm ring-1 ring-amber-100'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF9418] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#183153]">
                      {notif.titulo}
                    </h4>
                    {!notif.leido && (
                      <span className="w-2 h-2 rounded-full bg-[#FF9418]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {notif.mensaje}
                  </p>
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