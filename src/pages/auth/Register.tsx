import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChuplingo } from '../../context/ChuplingoContext';
import { ChuplingoMascot } from '../../components/mascot/ChuplingoMascot';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useChuplingo();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  // Password strength check
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Excelente'];
  const strengthColors = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-600'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !apellido.trim()) {
      toast.error('Por favor ingresa tu nombre y apellido');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Ingresa un correo electrónico válido');
      return;
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);
    const success = await registerUser({
      nombre,
      apellido,
      email,
      password
    });
    setLoading(false);

    if (success) {
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between p-5 select-none">
      <div className="max-w-sm mx-auto w-full pt-4">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <ChuplingoMascot mood="happy" size="md" />
          <h1 className="text-2xl font-black text-[#183153] mt-2">
            Crear cuenta en Chuplingo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Únete a la plataforma preuniversitaria de los 8 cursos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-black text-[#183153] uppercase tracking-wide block mb-1">
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Carlos"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-3 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-[#183153] uppercase tracking-wide block mb-1">
                Apellido
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Gómez"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-3 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>

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
                className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-3 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-[#183153] uppercase tracking-wide block mb-1">
              Contraseña (mínimo 8 caracteres)
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-10 py-3 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength meter */}
            {password.length > 0 && (
              <div className="mt-1.5">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map(level => (
                    <div 
                      key={level} 
                      className={`flex-1 rounded-full transition-all ${
                        strength >= level ? strengthColors[strength] : 'bg-slate-200'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                  Seguridad: {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-black text-[#183153] uppercase tracking-wide block mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-3 text-xs font-bold text-[#183153] focus:outline-none focus:ring-2 focus:ring-[#F05C54]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#F05C54] focus:ring-[#F05C54]"
            />
            <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight">
              Acepto los términos de servicio, política de privacidad y protección de datos académicos de Chuplingo.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-4 px-6 rounded-2xl bg-[#F05C54] hover:bg-[#E04B43] disabled:opacity-60 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link to="/login" className="font-black text-[#F05C54] hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;