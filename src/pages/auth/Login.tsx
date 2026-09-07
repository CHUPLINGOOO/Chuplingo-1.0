import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChuplingo } from '../../context/ChuplingoContext';
import { ChuplingoMascot } from '../../components/mascot/ChuplingoMascot';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useChuplingo();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    const success = await loginUser({ email, password });
    setLoading(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between p-5 select-none">
      <div className="max-w-sm mx-auto w-full pt-6">
        {/* Mascot & Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <ChuplingoMascot mood="happy" size="md" />
          <h1 className="text-2xl font-black text-[#183153] mt-2">
            ¡Bienvenido de nuevo! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingresa a tu cuenta para continuar con tu racha de estudio
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black text-[#183153] uppercase tracking-wide">
                Contraseña
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-[#F05C54] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-10 py-3.5 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-4 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#F05C54] focus:ring-[#F05C54] w-4 h-4"
              />
              <span>Recordar mi sesión</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 px-6 rounded-2xl bg-[#183153] hover:bg-[#10223A] disabled:opacity-60 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="font-black text-[#F05C54] hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;