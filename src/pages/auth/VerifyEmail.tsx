import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useChuplingo } from '../../context/ChuplingoContext';
import { ChuplingoMascot } from '../../components/mascot/ChuplingoMascot';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, verifyUserEmail } = useChuplingo();

  const emailParam = searchParams.get('email') || user.email;
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      toast.success(`Correo de verificación reenviado a ${emailParam}`);
    }, 1000);
  };

  const handleSimulateVerification = () => {
    verifyUserEmail(emailParam);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between p-5 text-center select-none">
      <div className="max-w-sm mx-auto w-full pt-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#FF9418] flex items-center justify-center mb-3 shadow-inner">
          <Mail className="w-8 h-8" />
        </div>

        <ChuplingoMascot mood="happy" size="md" />

        <h1 className="text-2xl font-black text-[#183153] mt-3">
          Revisa tu correo
        </h1>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Hemos enviado un enlace de confirmación a:
        </p>

        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-black text-[#183153] my-3">
          {emailParam}
        </div>

        <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
          Haz clic en el botón dentro del correo para activar tu cuenta y acceder a todas las funciones.
        </p>

        {/* Action<dyad-write path="src/pages/auth/VerifyEmail.tsx" description="Email verification screen with resend, simulation controls and email template preview">
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useChuplingo } from '../../context/ChuplingoContext';
import { ChuplingoMascot } from '../../components/mascot/ChuplingoMascot';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, verifyUserEmail } = useChuplingo();

  const emailParam = searchParams.get('email') || user.email;
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      toast.success(`Correo de verificación reenviado a ${emailParam}`);
    }, 1000);
  };

  const handleSimulateVerification = () => {
    verifyUserEmail(emailParam);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between p-5 text-center select-none">
      <div className="max-w-sm mx-auto w-full pt-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#FF9418] flex items-center justify-center mb-3 shadow-inner">
          <Mail className="w-8 h-8" />
        </div>

        <ChuplingoMascot mood="happy" size="md" />

        <h1 className="text-2xl font-black text-[#183153] mt-3">
          Revisa tu correo
        </h1>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Hemos enviado un enlace de confirmación a:
        </p>

        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-black text-[#183153] my-3">
          {emailParam}
        </div>

        <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
          Haz clic en el botón dentro del correo para activar tu cuenta y acceder a todas las funciones.
        </p>

        <div className="flex flex-col gap-3 w-full mt-6">
          <button
            onClick={handleSimulateVerification}
            className="w-full py-4 px-6 rounded-2xl bg-[#67C66A] hover:bg-[#58B25B] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar verificación ahora</span>
          </button>

          <button
            onClick={handleResend}
            disabled={isResending}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#183153] font-bold text-xs border border-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>{isResending ? 'Reenviando...' : 'Reenviar correo'}</span>
          </button>

          <Link
            to="/email-templates"
            className="text-xs font-bold text-[#12B7E8] hover:underline flex items-center justify-center gap-1 mt-1"
          >
            <span>Ver diseño del correo transaccional</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="pb-4 text-center">
        <Link
          to="/login"
          className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio de sesión</span>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;