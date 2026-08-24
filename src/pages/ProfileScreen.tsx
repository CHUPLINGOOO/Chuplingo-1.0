import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { ChuplingoMascot } from '../components/mascot/ChuplingoMascot';
import { 
  Flame, 
  Star, 
  Award, 
  Target, 
  Volume2, 
  Shield, 
  RotateCcw, 
  ChevronRight,
  Edit2,
  Check,
  CreditCard,
  Download,
  LogOut,
  Smartphone
} from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../data/coursesData';
import { toast } from 'sonner';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    getOverallStats, 
    achievements, 
    updateUserName, 
    updateUserEmail,
    updateUserPassword,
    updateUserPreferences, 
    logoutUser,
    deleteUserAccount,
    exportUserDataJSON
  } = useChuplingo();
  
  const { totalQuestions, overallAccuracy } = getOverallStats();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.nombre);
  const [tempLastName, setTempLastName] = useState(user.apellido);

  // Security modals state
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const currentLevelThreshold = LEVEL_THRESHOLDS.find(l => l.nivel === user.nivel) || LEVEL_THRESHOLDS[0];
  const nextLevelThreshold = LEVEL_THRESHOLDS.find(l => l.nivel === user.nivel + 1) || { xpMinimo: user.xp + 500 };

  const currentLevelXP = user.xp - currentLevelThreshold.xpMinimo;
  const neededLevelXP = nextLevelThreshold.xpMinimo - currentLevelThreshold.xpMinimo;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXP / neededLevelXP) * 100));

  const handleSaveName = () => {
    updateUserName(tempName, tempLastName);
    setIsEditingName(false);
  };

  const handleExportData = () => {
    const dataStr = exportUserDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chuplingo-datos-${user.nombre.toLowerCase()}.json`;
    a.click();
    toast.success('Tus datos de práctica se han descargado correctamente');
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.includes('@')) {
      toast.error('Ingresa un correo válido');
      return;
    }
    const ok = await updateUserEmail(newEmailInput);
    if (ok) {
      setNewEmailInput('');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    const ok = await updateUserPassword(oldPasswordInput, newPasswordInput);
    if (ok) {
      setOldPasswordInput('');
      setNewPasswordInput('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Violet Header */}
      <AppHeader
        title="Mi Perfil"
        subtitle="Progreso y configuración de cuenta"
        iconEmoji="👤"
        bgGradient="from-[#7354D9] to-[#9176EA]"
        rightAction={
          user.rol === 'admin' ? (
            <button
              onClick={() => navigate('/admin')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          ) : undefined
        }
      />

      {/* Profile Card */}
      <div className="mx-4 -mt-6 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative z-20 flex flex-col items-center text-center">
        <ChuplingoMascot mood="happy" size="md" />

        {/* Name and Email */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-sm font-black text-[#183153] border-b-2 border-[#7354D9] text-center px-1 py-0.5 w-24"
              />
              <input
                type="text"
                value={tempLastName}
                onChange={(e) => setTempLastName(e.target.value)}
                className="text-sm font-black text-[#183153] border-b-2 border-[#7354D9] text-center px-1 py-0.5 w-24"
              />
              <button
                onClick={handleSaveName}
                className="w-7 h-7 rounded-full bg-[#7354D9] text-white flex items-center justify-center"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-[#183153]">
                {user.nombre} {user.apellido}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Editar nombre"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 font-medium">{user.email}</p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-bold text-[#7354D9]">
            Nivel {user.nivel} • {user.tituloNivel}
          </span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            Plan {user.suscripcion.planId}
          </span>
        </div>

        {/* Level XP Bar */}
        <div className="w-full mt-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span>{user.xp} XP</span>
            <span>{nextLevelThreshold.xpMinimo} XP</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#7354D9] to-[#FF9418] transition-all duration-500"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Stats Chips */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-100">
          <div className="p-2 rounded-xl bg-orange-50">
            <Flame className="w-4 h-4 text-[#FF5722] mx-auto mb-0.5" />
            <span className="text-xs font-black text-[#183153] block">{user.rachaActual} días</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Racha</span>
          </div>

          <div className="p-2 rounded-xl bg-cyan-50">
            <Target className="w-4 h-4 text-[#12B7E8] mx-auto mb-0.5" />
            <span className="text-xs font-black text-[#183153] block">{overallAccuracy}%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Precisión</span>
          </div>

          <div className="p-2 rounded-xl bg-amber-50">
            <Star className="w-4 h-4 text-amber-500 mx-auto mb-0.5 fill-amber-400" />
            <span className="text-xs font-black text-[#183153] block">{totalQuestions}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Preguntas</span>
          </div>
        </div>
      </div>

      {/* Download App Link */}
      <div className="px-4">
        <div 
          onClick={() => navigate('/descargar')}
          className="bg-gradient-to-r from-[#183153] to-[#254A7A] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 block">App Android</span>
              <h4 className="text-sm font-black">Descargar APK Chuplingo</h4>
              <p className="text-[11px] text-slate-200">Instala la app oficial con QR y enlace directo</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80" />
        </div>
      </div>

      {/* Subscription Plan CTA Card */}
      <div className="px-4">
        <div 
          onClick={() => navigate('/plans')}
          className="bg-gradient-to-r from-[#F05C54] to-[#FF9418] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-200 block">Suscripción</span>
              <h4 className="text-sm font-black">Plan {user.suscripcion.planId.toUpperCase()}</h4>
              <p className="text-[11px] text-white/90">Ver planes y beneficios VIP</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80" />
        </div>
      </div>

      {/* Logros link */}
      <div className="px-4">
        <div 
          onClick={() => navigate('/achievements')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7354D9] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#183153]">
                Insignias y Logros
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {achievements.filter(a => a.desbloqueadoEn).length} de {achievements.length} desbloqueados
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Settings Options */}
      <div className="px-4 flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#183153] uppercase tracking-wide">
          Configuración y Seguridad
        </h3>

        {/* Daily Goal Option */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF9418] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#183153] block">Meta diaria de preguntas</span>
              <span className="text-[11px] text-slate-400">Objetivo para mantener tu racha</span>
            </div>
          </div>

          <select
            value={user.preferencias.metaDiaria}
            onChange={(e) => updateUserPreferences({ metaDiaria: Number(e.target.value) })}
            className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-black text-[#183153]"
          >
            <option value={10}>10 preguntas</option>
            <option value={20}>20 preguntas</option>
            <option value={30}>30 preguntas</option>
            <option value={50}>50 preguntas</option>
          </select>
        </div>

        {/* Sound toggle */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#12B7E8] flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#183153] block">Efectos de sonido</span>
              <span className="text-[11px] text-slate-400">Audio al responder y subir de nivel</span>
            </div>
          </div>

          <button
            onClick={() => updateUserPreferences({ sonido: !user.preferencias.sonido })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              user.preferencias.sonido ? 'bg-[#67C66A]' : 'bg-slate-300'
            }`}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                user.preferencias.sonido ? 'left-6' : 'left-1'
              }`} 
            />
          </button>
        </div>

        {/* Export Data */}
        <button
          onClick={handleExportData}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#183153] font-bold text-xs border border-slate-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#7354D9]" />
            <span>Descargar mis datos (JSON)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Security Settings Accordion */}
        <button
          onClick={() => setShowSecurityModal(!showSecurityModal)}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#183153] font-bold text-xs border border-slate-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F05C54]" />
            <span>Seguridad: Cambiar correo o clave</span>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showSecurityModal ? 'rotate-90' : ''}`} />
        </button>

        {showSecurityModal && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col gap-4 animate-in fade-in">
            {/* Change Email */}
            <form onSubmit={handleChangeEmail} className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-[#183153]">Cambiar correo electrónico</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="nuevo@correo.com"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  className="flex-1 bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold"
                />
                <button type="submit" className="px-3 py-2 bg-[#183153] text-white rounded-xl text-xs font-black">
                  Actualizar
                </button>
              </div>
            </form>

            {/* Change Password */}
            <form onSubmit={handleChangePassword} className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-black text-[#183153]">Cambiar contraseña</label>
              <input
                type="password"
                required
                placeholder="Contraseña actual"
                value={oldPasswordInput}
                onChange={(e) => setOldPasswordInput(e.target.value)}
                className="bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold"
              />
              <input
                type="password"
                required
                placeholder="Nueva contraseña (mínimo 8)"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                className="bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold"
              />
              <button type="submit" className="py-2.5 bg-[#F05C54] text-white rounded-xl text-xs font-black mt-1">
                Guardar nueva contraseña
              </button>
            </form>
          </div>
        )}

        {/* Logout & Delete Account */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={async () => {
              await logoutUser();
              navigate('/login');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#183153] font-black text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>

          <button
            onClick={async () => {
              if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Se borrarán todos tus datos.')) {
                await deleteUserAccount();
                navigate('/welcome');
              }
            }}
            className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Eliminar cuenta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;