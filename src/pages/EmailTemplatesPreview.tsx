import React, { useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { Mail, Check, Sparkles, Send } from 'lucide-react';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  asunto: string;
  categoria: string;
  cuerpo: (nombre: string) => string;
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: 'bienvenida',
    asunto: '¡Bienvenido a la bandada de Chuplingo! 🦜',
    categoria: 'Cuenta',
    cuerpo: (n) => `Hola ${n},\n\n¡Qué alegría tenerte en Chuplingo! Tu cuenta está lista para que empieces a practicar los 8 cursos preuniversitarios: Literatura, Psicología, Geografía, Razonamiento Verbal, Cívica, Filosofía, Inglés y Biología.\n\nCompleta tu primera práctica hoy para iniciar tu racha de estudio.`
  },
  {
    id: 'verificacion',
    asunto: 'Verifica tu cuenta en Chuplingo',
    categoria: 'Seguridad',
    cuerpo: (n) => `Hola ${n},\n\nPara activar todas las funciones y proteger tu progreso, por favor haz clic en el siguiente enlace de verificación:\n\n[VERIFICAR MI CUENTA]\n\nSi no creaste esta cuenta, puedes ignorar este mensaje.`
  },
  {
    id: 'recuperacion',
    asunto: 'Recuperación de contraseña en Chuplingo',
    categoria: 'Seguridad',
    cuerpo: (n) => `Hola ${n},\n\nHemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón a continuación para ingresar una nueva clave:\n\n[RESTABLECER CONTRASEÑA]\n\nEste enlace expira en 60 minutos.`
  },
  {
    id: 'cambio_clave',
    asunto: 'Confirmación de cambio de contraseña',
    categoria: 'Seguridad',
    cuerpo: (n) => `Hola ${n},\n\nTe informamos que tu contraseña ha sido cambiada exitosamente. Si fuiste tú, no necesitas hacer nada más.`
  },
  {
    id: 'suscripcion_activada',
    asunto: '¡Tu suscripción Chuplingo VIP está activa! ⭐',
    categoria: 'Suscripciones',
    cuerpo: (n) => `Hola ${n},\n\n¡Felicitaciones! Ahora eres miembro VIP de Chuplingo. Tienes acceso total a simulacros avanzados, banco de preguntas completo y repaso inteligente.`
  },
  {
    id: 'recordatorio_racha',
    asunto: '🔥 ¡Tu racha de estudio está en riesgo hoy!',
    categoria: 'Gamificación',
    cuerpo: (n) => `Hola ${n},\n\nAún no has respondido tus preguntas diarias en Chuplingo. ¡Solo te tomará 5 minutos mantener tu racha activa hoy!`
  },
  {
    id: 'logro_desbloqueado',
    asunto: '🏆 ¡Nuevo logro desbloqueado en Chuplingo!',
    categoria: 'Gamificación',
    cuerpo: (n) => `Hola ${n},\n\n¡Tu constancia da frutos! Has desbloqueado una nueva insignia en tu perfil. Entra a ver tu progreso.`
  },
  {
    id: 'resumen_semanal',
    asunto: '📊 Tu resumen de rendimiento de la semana',
    categoria: 'Progreso',
    cuerpo: (n) => `Hola ${n},\n\nEsta semana respondiste 85 preguntas con una precisión del 88%. ¡Excelente trabajo!`
  }
];

const EmailTemplatesPreview: React.FC = () => {
  const { user } = useChuplingo();
  const [selectedId, setSelectedId] = useState<string>('bienvenida');

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) || TEMPLATES[0];

  const handleSimulateSend = () => {
    toast.success(`Simulación: Correo "${selectedTemplate.asunto}" enviado a ${user.email}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Plantillas de Correo"
        subtitle="Previsualización de emails transaccionales"
        iconEmoji="✉️"
        showBack={true}
        bgGradient="from-[#163A63] to-[#254A7A]"
      />

      <div className="px-4 flex flex-col gap-3">
        {/* Selector */}
        <div>
          <label className="text-xs font-black text-[#183153] uppercase tracking-wide block mb-1.5">
            Seleccionar plantilla
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs font-bold text-[#183153]"
          >
            {TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>
                [{t.categoria}] {t.asunto}
              </option>
            ))}
          </select>
        </div>

        {/* Email Mock Container */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <div className="text-[11px] text-slate-400 font-bold">De: hola@chuplingo.pe</div>
            <div className="text-[11px] text-slate-400 font-bold">Para: {user.email}</div>
            <div className="text-xs font-black text-[#183153] mt-1">{selectedTemplate.asunto}</div>
          </div>

          <div className="bg-[#FFF5F4] p-4 rounded-2xl text-center mb-4 border border-[#F05C54]/20">
            <span className="text-xl">🦜</span>
            <h3 className="text-base font-black text-[#F05C54] mt-1">CHUPLINGO</h3>
            <p className="text-[10px] text-slate-500 font-bold">Preparación Preuniversitaria</p>
          </div>

          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {selectedTemplate.cuerpo(user.nombre)}
          </p>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>© 2025 Chuplingo. Todos los derechos reservados.</span>
          </div>
        </div>

        <button
          onClick={handleSimulateSend}
          className="w-full py-3.5 rounded-2xl bg-[#183153] text-white font-black text-xs shadow-md flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Simular envío de prueba</span>
        </button>
      </div>
    </div>
  );
};

export default EmailTemplatesPreview;