import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { 
  Download, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Zap, 
  ArrowLeft,
  Share2,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

export const DownloadApp: React.FC = () => {
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);

  // Configuración de la versión
  const APP_CONFIG = {
    version: '1.0.0 (Build 34)',
    releaseDate: 'Marzo 2025',
    fileSize: '16.4 MB',
    androidReq: 'Android 7.0 (Nougat) o superior',
    apkDownloadUrl: '#download-apk-direct', // Reemplazable con la URL del hosting/CDN o release de GitHub/Drive
    supportEmail: 'soporte@chuplingo.pe',
    supportWhatsapp: '+51 968 839 074'
  };

  const handleDownloadClick = () => {
    toast.success('Iniciando descarga de Chuplingo APK...', {
      description: `Versión ${APP_CONFIG.version} (${APP_CONFIG.fileSize})`
    });

    // Simulación de descarga o trigger de enlace directo
    const link = document.createElement('a');
    link.href = APP_CONFIG.apkDownloadUrl;
    link.setAttribute('download', 'Chuplingo_v1.0.0.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Enlace de descarga copiado al portapapeles');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between select-none">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-b from-[#183153] via-[#1E3F6B] to-[#254A7A] text-white px-5 pt-8 pb-10 rounded-b-[36px] shadow-lg relative overflow-hidden text-center">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#F05C54]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-[#FF9418]/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
          {/* Top navigation back to web app */}
          <div className="w-full flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ir a la Web</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-colors"
              title="Compartir enlace"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copiado' : 'Compartir'}</span>
            </button>
          </div>

          {/* Chuplingo Mascot */}
          <ChuplingoMascot mood="celebrating" size="lg" className="my-1" />

          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F05C54] to-[#FF9418] px-3.5 py-1 rounded-full text-white text-[11px] font-black uppercase tracking-wider mt-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>App Oficial Android</span>
          </div>

          <h1 className="text-3xl font-black mt-2.5 tracking-tight text-white">
            Chuplingo
          </h1>
          <p className="text-xs text-amber-300 font-black mt-0.5 uppercase tracking-wide">
            Preparación Preuniversitaria Gamificada
          </p>

          <p className="text-xs text-slate-200 mt-2 leading-relaxed max-w-xs font-medium">
            Practica los 8 cursos clave con preguntas de admisión, estadísticas en tiempo real, rachas y simulacros 100% online.
          </p>
        </div>
      </div>

      {/* Main Download Card & Details */}
      <div className="px-4 -mt-6 relative z-20 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
        {/* Primary Download Card */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase block">Versión de Producción</span>
              <span className="text-sm font-black text-[#183153]">{APP_CONFIG.version}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase block">Tamaño</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {APP_CONFIG.fileSize}
              </span>
            </div>
          </div>

          {/* Main Action Button */}
          <button
            onClick={handleDownloadClick}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F05C54] to-[#FF9418] hover:from-[#E04B43] hover:to-[#E58514] text-white font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-transform active:scale-95"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>Descargar APK Directo</span>
          </button>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Seguro & Libre de virus
            </span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-4 h-4 text-[#12B7E8]" />
              Android 7.0+
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#183153] uppercase tracking-wide mb-3">
            <QrCode className="w-4 h-4 text-[#7354D9]" />
            <span>Escanear con tu celular</span>
          </div>

          {/* QR Container Visual with Decorative Corners */}
          <div className="relative p-3 bg-gradient-to-tr from-orange-50 via-slate-50 to-purple-50 rounded-2xl border-2 border-dashed border-slate-200">
            <svg 
              className="w-44 h-44 drop-shadow-xs" 
              viewBox="0 0 160 160" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* QR Background & Pattern Mock for instant high-contrast rendering */}
              <rect width="160" height="160" rx="12" fill="white" />
              
              {/* Top Left Marker */}
              <rect x="16" y="16" width="36" height="36" rx="6" fill="#183153" />
              <rect x="22" y="22" width="24" height="24" rx="3" fill="white" />
              <rect x="28" y="28" width="12" height="12" rx="2" fill="#F05C54" />

              {/* Top Right Marker */}
              <rect x="108" y="16" width="36" height="36" rx="6" fill="#183153" />
              <rect x="114" y="22" width="24" height="24" rx="3" fill="white" />
              <rect x="120" y="28" width="12" height="12" rx="2" fill="#FF9418" />

              {/* Bottom Left Marker */}
              <rect x="16" y="108" width="36" height="36" rx="6" fill="#183153" />
              <rect x="22" y="114" width="24" height="24" rx="3" fill="white" />
              <rect x="28" y="120" width="12" height="12" rx="2" fill="#7354D9" />

              {/* Central Pattern Blocks */}
              <rect x="62" y="16" width="8" height="8" fill="#183153" />
              <rect x="76" y="16" width="18" height="8" fill="#183153" />
              <rect x="62" y="30" width="16" height="8" fill="#183153" />
              <rect x="86" y="30" width="8" height="8" fill="#183153" />
              <rect x="62" y="44" width="32" height="8" fill="#183153" />

              {/* Middle Section */}
              <rect x="16" y="62" width="8" height="32" fill="#183153" />
              <rect x="30" y="62" width="16" height="8" fill="#183153" />
              <rect x="30" y="78" width="8" height="16" fill="#183153" />
              
              <rect x="60" y="60" width="40" height="40" rx="8" fill="#FFF3E0" stroke="#FF9418" strokeWidth="2" />
              <circle cx="80" cy="80" r="12" fill="#F05C54" />
              <text x="75" y="85" fill="white" fontSize="14" fontWeight="bold">🦜</text>

              <rect x="108" y="62" width="20" height="8" fill="#183153" />
              <rect x="136" y="62" width="8" height="20" fill="#183153" />
              <rect x="116" y="78" width="14" height="16" fill="#183153" />

              {/* Bottom Right Area */}
              <rect x="62" y="108" width="24" height="8" fill="#183153" />
              <rect x="70" y="124" width="16" height="20" fill="#183153" />
              <rect x="94" y="108" width="12" height="12" fill="#183153" />
              <rect x="114" y="116" width="30" height="8" fill="#183153" />
              <rect x="108" y="132" width="16" height="12" fill="#183153" />
              <rect x="132" y="132" width="12" height="12" fill="#183153" />
            </svg>
          </div>

          <p className="text-xs text-slate-500 mt-3 max-w-xs leading-relaxed font-medium">
            Apunta con la cámara de tu teléfono para descargar el archivo APK directamente en tu dispositivo Android.
          </p>
        </div>

        {/* 3 Step Installation Guide */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-xs font-black text-[#183153] uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#12B7E8]" />
            <span>¿Cómo instalar en 3 pasos?</span>
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F05C54] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="text-xs font-black text-[#183153]">Descarga el archivo APK</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Toca el botón <strong>Descargar APK</strong> o escanea el código QR desde tu navegador móvil.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F05C54] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="text-xs font-black text-[#183153]">Permite fuentes desconocidas</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Si Android muestra una advertencia de seguridad, pulsa en <em>Ajustes</em> y activa <strong>Permitir desde esta fuente</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F05C54] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h4 className="text-xs font-black text-[#183153]">¡Abre Chuplingo y empieza a volar!</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Inicia sesión con tu cuenta y tu racha de estudio se sincronizará automáticamente con la nube.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
            <BookOpen className="w-4 h-4 text-[#F05C54] mx-auto mb-1" />
            <span className="text-[11px] font-black text-[#183153] block">8 Cursos</span>
            <span className="text-[9px] text-slate-400 font-bold">Oficiales</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
            <Flame className="w-4 h-4 text-[#FF9418] mx-auto mb-1" />
            <span className="text-[11px] font-black text-[#183153] block">Rachas & XP</span>
            <span className="text-[9px] text-slate-400 font-bold">100% Online</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
            <Zap className="w-4 h-4 text-[#7354D9] mx-auto mb-1" />
            <span className="text-[11px] font-black text-[#183153] block">Simulacros</span>
            <span className="text-[9px] text-slate-400 font-bold">Tipo Admisión</span>
          </div>
        </div>

        {/* Support & Contact Footer Card */}
        <div className="bg-gradient-to-br from-[#183153] to-[#254A7A] text-white rounded-3xl p-5 shadow-sm text-center flex flex-col items-center gap-2 mb-6">
          <span className="text-xl">💬</span>
          <h4 className="text-sm font-black">¿Necesitas ayuda con la instalación?</h4>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
            Nuestro equipo de soporte está disponible para resolver dudas sobre tu cuenta o instalación.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
            <a
              href={`https://wa.me/51968839074?text=${encodeURIComponent('Hola Chuplingo, necesito ayuda para instalar el APK en mi celular.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>WhatsApp Soporte</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`mailto:${APP_CONFIG.supportEmail}`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{APP_CONFIG.supportEmail}</span>
            </a>
          </div>

          <div className="text-[10px] text-slate-400 pt-2 border-t border-white/10 w-full mt-1">
            © 2025 Chuplingo. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;