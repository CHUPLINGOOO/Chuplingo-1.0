import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { ChuplingoMascot, AVATAR_OPTIONS } from '../components/mascot/ChuplingoMascot';
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
  Smartphone,
  Moon,
  Sun,
  Camera,
  X
} from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../data/coursesData';
import { toast } from 'sonner';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { ChuplingoMascot, AVATAR_OPTIONS } from '../components/mascot/ChuplingoMascot';
import { motion, AnimatePresence } from 'framer-motion';
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
  Smartphone,
  Moon,
  Sun,
  Camera,
  X
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
    updateUserAvatar,
    updateUserEmail,
    updateUserPassword,
    updateUserPreferences, 
    toggleDarkMode,
    isDarkMode,
    logoutUser,
    deleteUserAccount,
    exportUserDataJSON
  } = useChuplingo();
  
  const { totalQuestions, overallAccuracy } = getOverallStats();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.nombre);
  const [tempLastName, setTempLastName] = useState(user.apellido);

  // Avatar Modal state
  const [showAvatarModal, setShowAvatarModal] = useState(false);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 pb-10"
    >
      {/* Violet Header */}
      <AppHeader
        title="Mi Perfil"
        subtitle="Progreso, avatares y configuración"
        iconEmoji="👤"
        bgGradient="from-[#7354D9] to-[#9176EA]"
        rightAction={
          <div className="flex items-center gap-2">
            {/* Quick Dark Mode toggle in header */}
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-transform active:scale-90"
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-100" />}
            </button>

            {user.rol === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </div>
        }
      />

      {/* Modal para elegir Avatar */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🦜</span>
                  <h3 className="text-sm font-black text-[#183153] dark:text-white">Elige tu Avatar Chuplingo</h3>
                </div>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {AVATAR_OPTIONS.map((opt) => {
                  const isSelected = user.avatar === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        updateUserAvatar(opt.id);
                        setShowAvatarModal(false);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                        isSelected
                          ? 'border-[#7354D9] bg-purple-50 dark:bg-purple-950/50 shadow-sm'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <ChuplingoMascot avatarId={opt.id} size="sm" mood="happy" />
                      <span className="text-xs font-black text-[#183153] dark:text-white leading-tight">
                        {opt.name}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-black text-[#7354D9] uppercase tracking-wider">
                          ✓ Activo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Card */}
      <motion.div variants={itemVariants} className="mx-4 -mt-6 bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative z-20 flex flex-col items-center text-center">
        {/* Avatar with change button */}
        <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
          <ChuplingoMascot avatarId={user.avatar} mood="happy" size="md" />
          <button 
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#7354D9] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800 transition-transform group-hover:scale-110 active:scale-95"
            title="Cambiar foto de perfil"
            aria-label="Cambiar foto de perfil"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Name and Email */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-sm font-black text-[#183153] dark:text-white bg-slate-100 dark:bg-slate-700 border-b-2 border-[#7354D9] text-center px-1 py-0.5 rounded-lg w-24"
              />
              <input
                type="text"
                value={tempLastName}
                onChange={(e) => setTempLastName(e.target.value)}
                className="text-sm font-black text-[#183153] dark:text-white bg-slate-100 dark:bg-slate-700 border-b-2 border-[#7354D9] text-center px-1 py-0.5 rounded-lg w-24"
              />
              <button
                onClick={handleSaveName}
                className="w-7 h-7 rounded-full bg-[#7354D9] text-white flex items-center justify-center shadow-xs"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-[#183153] dark:text-white">
                {user.nombre} {user.apellido}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Editar nombre"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 font-medium">{user.email}</p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs font-bold text-[#7354D9]">
            Nivel {user.nivel} • {user.tituloNivel}
          </span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            Plan {user.suscripcion.planId}
          </span>
        </div>

        {/* Level XP Bar */}
        <div className="w-full mt-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>{user.xp} XP</span>
            <span>{nextLevelThreshold.xpMinimo} XP</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#7354D9] to-[#FF9418]"
            />
          </div>
        </div>

        {/* Stats Chips */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40">
            <Flame className="w-4 h-4 text-[#FF5722] mx-auto mb-0.5" />
            <span className="text-xs font-black text-[#183153] dark:text-white block">{user.rachaActual} {user.rachaActual === 1 ? 'día' : 'días'}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Racha</span>
          </div>

          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40">
            <Target className="w-4 h-4 text-[#12B7E8] mx-auto mb-0.5" />
            <span className="text-xs font-black text-[#183153] dark:text-white block">{overallAccuracy}%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Precisión</span>
          </div>

          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40">
            <Star className="w-4 h-4 text-amber-500 mx-auto mb-0.5 fill-amber-400" />
            <span className="text-xs font-black text-[#183153] dark:text-white block">{totalQuestions}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Preguntas</span>
          </div>
        </div>
      </motion.div>

      {/* Theme Mode Toggle Banner */}
      <motion.div variants={itemVariants} className="px-4">
        <div 
          onClick={toggleDarkMode}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-amber-950 text-amber-400' : 'bg-slate-100 text-slate-700'}`}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-black text-[#183153] dark:text-white">
                Tema {isDarkMode ? 'Oscuro' : 'Claro'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isDarkMode ? 'Toca para cambiar al modo claro' : 'Toca para cambiar al modo oscuro'}
              </p>
            </div>
          </div>

          <div className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-[#7354D9]' : 'bg-slate-300'}`}>
            <motion.div
              animate={{ x: isDarkMode ? 24 : 0 }}
              className="w-4 h-4 rounded-full bg-white absolute top-1 left-1 shadow-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Download App Link */}
      <motion.div variants={itemVariants} className="px-4">
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
      </motion.div>

      {/* Subscription Plan CTA Card */}
      <motion.div variants={itemVariants} className="px-4">
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
      </motion.div>

      {/* Logros link */}
      <motion.div variants={itemVariants} className="px-4">
        <div 
          onClick={() => navigate('/achievements')}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-[#7354D9] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#183153] dark:text-white">
                Insignias y Logros
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {achievements.filter(a => a.desbloqueadoEn).length} de {achievements.length} desbloqueados
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </motion.div>

      {/* Settings Options */}
      <div className="px-4 flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#183153] dark:text-slate-200 uppercase tracking-wide">
          Configuración y Seguridad
        </h3>

        {/* Daily Goal Option */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950 text-[#FF9418] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#183153] dark:text-white block">Meta diaria de preguntas</span>
              <span className="text-[11px] text-slate-400">Objetivo para mantener tu racha</span>
            </div>
          </div>

          <select
            value={user.preferencias.metaDiaria}
            onChange={(e) => updateUserPreferences({ metaDiaria: Number(e.target.value) })}
            className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2.5 py-1.5 text-xs font-black text-[#183153] dark:text-white"
          >
            <option value={10}>10 preguntas</option>
            <option value={20}>20 preguntas</option>
            <option value={30}>30 preguntas</option>
            <option value={50}>50 preguntas</option>
          </select>
        </motion.div>

        {/* Sound toggle */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#12B7E8] flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#183153] dark:text-white block">Efectos de sonido</span>
              <span className="text-[11px] text-slate-400">Audio al responder y subir de nivel</span>
            </div>
          </div>

          <button
            onClick={() => updateUserPreferences({ sonido: !user.preferencias.sonido })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              user.preferencias.sonido ? 'bg-[#67C66A]' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <motion.div
              animate={{ x: user.preferencias.sonido ? 20 : 0 }}
              className="w-4 h-4 rounded-full bg-white absolute top-1 left-1 shadow-sm"
            />
          </button>
        </motion.div>

        {/* Export Data */}
        <motion.button
          variants={itemVariants}
          onClick={handleExportData}
          className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#183153] dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#7354D9]" />
            <span>Descargar mis datos (JSON)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </motion.button>

        {/* Security Settings Accordion */}
        <motion.button
          variants={itemVariants}
          onClick={() => setShowSecurityModal(!showSecurityModal)}
          className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#183153] dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F05C54]" />
            <span>Seguridad: Cambiar correo o clave</span>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showSecurityModal ? 'rotate-90' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {showSecurityModal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                {/* Change Email */}
                <form onSubmit={handleChangeEmail} className="flex flex-col gap-2">
                  <label className="text-[11px] font-black text-[#183153] dark:text-slate-200">Cambiar correo electrónico</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="nuevo@correo.com"
                      value={newEmailInput}
                      onChange={(e) => setNewEmailInput(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-bold text-[#183153] dark:text-white"
                    />
                    <button type="submit" className="px-3 py-2 bg-[#183153] text-white rounded-xl text-xs font-black">
                      Actualizar
                    </button>
                  </div>
                </form>

                {/* Change Password */}
                <form onSubmit={handleChangePassword} className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <label className="text-[11px] font-black text-[#183153] dark:text-slate-200">Cambiar contraseña</label>
                  <input
                    type="password"
                    required
                    placeholder="Contraseña actual"
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-bold text-[#183153] dark:text-white"
                  />
                  <input
                    type="password"
                    required
                    placeholder="Nueva contraseña (mínimo 8)"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-bold text-[#183153] dark:text-white"
                  />
                  <button type="submit" className="py-2.5 bg-[#F05C54] text-white rounded-xl text-xs font-black mt-1">
                    Guardar nueva contraseña
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout & Delete Account */}
        <motion.div variants={itemVariants} className="pt-2 flex flex-col gap-2 pb-20">
          <button
            onClick={async () => {
              await logoutUser();
              navigate('/login');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-[#183153] dark:text-white font-black text-xs flex items-center justify-center gap-2 transition-colors"
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
            className="w-full py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Eliminar cuenta</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileScreen;