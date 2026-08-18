import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChuplingo } from '../../context/ChuplingoContext';
import { ChuplingoMascot } from '../../components/mascot/ChuplingoMascot';
import { Mail, ArrowLeft, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, resetUserPassword } = useChuplingo();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Ingresa un correo válido');
      return;
    }
    const sent = requestPasswordReset(email);
    if (sent) {
      setStep('reset');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener mínimo 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const success = resetUserPassword(email, newPassword);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between p-5 select-none">
      <div className="max-w-sm mx-auto w-full pt-8">
        <div className="flex flex-col items-center text-center mb-6">
          <ChuplingoMascot mood="thinking" size="md" />
          <h1 className="text-2xl font-black text-[#183153] mt-2">
            Recuperar Contraseña
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {step === 'request'
              ? 'Te enviaremos las instrucciones para restablecer tu cuenta'
              : 'Ingresa tu nueva contraseña segura'}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequest} className="flex flex-col gap-3.5">
            <div>
              <label className="text-[11px] font-black text-[#183153] uppercase tracking-wide block mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="estudiante@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-3.5 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-4 px-6 rounded-2xl bg-[#F05C54] hover:bg-[#E04B43] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Enviar Enlace de Recuperación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-3.5">
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
              ✓ Hemos validado la solicitud para <strong>{email}</strong>
            </div>

            <div>
              <label className="text-[11px] font-black text-[#183153] uppercase tracking-wide block mb-1">
                Nueva Contraseña (mínimo 8 caracteres)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-3.5 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-[#183153] uppercase tracking-wide block mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-3.5 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-4 px-6 rounded-2xl bg-[#67C66A] hover:bg-[#58B25B] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Nueva Contraseña</span>
            </button>
          </form>
        )}
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

export default ForgotPassword;