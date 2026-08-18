"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  PracticeSession, 
  QuestionAttempt, 
  MistakeRecord, 
  Question, 
  CourseId, 
  Achievement,
  Challenge,
  NotificationItem,
  PlanId
} from '../types/chuplingo';
import { COURSES, INITIAL_QUESTIONS, LEVEL_THRESHOLDS } from '../data/coursesData';
import { INITIAL_CHALLENGES } from '../data/challengesData';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import { toast } from 'sonner';
import { triggerConfetti } from '../utils/confetti';

interface AuthCredentials {
  nombre: string;
  apellido: string;
  email: string;
  passwordHash: string;
}

interface ChuplingoContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  sessions: PracticeSession[];
  favoriteQuestionIds: string[];
  mistakes: MistakeRecord[];
  allQuestions: Question[];
  achievements: Achievement[];
  claimedChallengeIds: string[];
  notifications: NotificationItem[];
  // Auth Operations
  registerUser: (data: { nombre: string; apellido: string; email: string; password: string }) => boolean;
  loginUser: (data: { email: string; password: string }) => boolean;
  verifyUserEmail: (email?: string) => void;
  requestPasswordReset: (email: string) => boolean;
  resetUserPassword: (email: string, newPassword: string) => boolean;
  updateUserEmail: (newEmail: string) => boolean;
  updateUserPassword: (oldPassword: string, newPassword: string) => boolean;
  logoutUser: () => void;
  deleteUserAccount: () => void;
  exportUserDataJSON: () => string;
  // Session & Practice
  recordSession: (sessionData: Omit<PracticeSession, 'id' | 'userId' | 'fecha' | 'xpGanado'>) => PracticeSession;
  toggleFavorite: (questionId: string) => boolean;
  isFavorite: (questionId: string) => boolean;
  // Preferences & Plans
  updateUserPreferences: (prefs: Partial<UserProfile['preferencias']>) => void;
  updateUserName: (name: string, lastName?: string) => void;
  changeUserPlan: (planId: PlanId) => void;
  claimChallengeReward: (challengeId: string) => void;
  resetAllProgress: () => void;
  completeOnboarding: (prefs?: { metaDiaria?: number; horarioEstudio?: string; cursosFavoritos?: CourseId[] }) => void;
  // Admin Operations
  addQuestionToBank: (newQ: Omit<Question, 'id'>) => Question;
  updateQuestionInBank: (id: string, updatedQ: Partial<Question>) => boolean;
  deleteQuestionFromBank: (id: string) => boolean;
  importQuestionsJSON: (questions: Question[]) => number;
  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  // Computed helpers
  getCourseProgress: (courseId: CourseId) => { accuracy: number; questionsAnswered: number; masteryPercent: number; completedTopicsCount: number };
  getTopicProgress: (topicId: string) => { attempts: number; correct: number; accuracy: number; status: 'no_iniciado' | 'en_progreso' | 'dominado' };
  getWeeklyActivity: () => { day: string; dateStr: string; questions: number; isToday: boolean }[];
  getOverallStats: () => {
    totalSessions: number;
    totalQuestions: number;
    totalCorrect: number;
    totalIncorrect: number;
    overallAccuracy: number;
    totalTimeSeconds: number;
  };
  getRecommendedTopic: () => { courseId: CourseId; topicId: string; topicName: string; courseName: string; accuracy: number } | null;
  getChallengeProgress: (challenge: Challenge) => { current: number; max: number; completed: boolean; claimed: boolean };
}

const STORAGE_KEYS = {
  USER: 'chuplingo_user_v2.0',
  AUTH_DB: 'chuplingo_auth_accounts_v2.0',
  SESSIONS: 'chuplingo_sessions_v2.0',
  FAVORITES: 'chuplingo_favorites_v2.0',
  MISTAKES: 'chuplingo_mistakes_v2.0',
  CUSTOM_QUESTIONS: 'chuplingo_custom_questions_v2.0',
  ACHIEVEMENTS: 'chuplingo_achievements_v2.0',
  CLAIMED_CHALLENGES: 'chuplingo_claimed_challenges_v2.0',
  NOTIFICATIONS: 'chuplingo_notifications_v2.0'
};

const getTodayDateString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
};

const calculateLevelInfo = (xp: number) => {
  let level = 1;
  let title = 'Aspirante';
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xpMinimo) {
      level = threshold.nivel;
      title = threshold.titulo;
    }
  }
  return { level, title };
};

const INITIAL_USER: UserProfile = {
  id: 'guest-student',
  nombre: 'Estudiante',
  apellido: 'Chuplingo',
  email: 'estudiante@chuplingo.pe',
  emailVerificado: false,
  avatar: 'parrot',
  creadoEn: new Date().toISOString(),
  suscripcion: {
    planId: 'gratis',
    estado: 'activa',
    fechaInicio: getTodayDateString(),
    fechaRenovacion: '2026-12-31'
  },
  xp: 0,
  nivel: 1,
  tituloNivel: 'Aspirante',
  rachaActual: 0,
  mejorRacha: 0,
  ultimaFechaRacha: '',
  preguntasRespondidasHoy: 0,
  fechaPreguntasHoy: getTodayDateString(),
  metaDiariaCumplidaHoy: false,
  preferencias: {
    metaDiaria: 20,
    horarioEstudio: '19:00',
    cursosFavoritos: ['literatura', 'psicologia', 'razonamiento-verbal'],
    sonido: true,
    vibracion: true,
    recordatorios: true,
    temaOscuro: false,
    notificaciones: {
      metaDiaria: true,
      rachaEnRiesgo: true,
      desafios: true,
      logros: true,
      resumenSemanal: true,
      promocionales: false
    }
  },
  onboardingCompletado: false,
  rol: 'estudiante'
};

const ChuplingoContext = createContext<ChuplingoContextType | undefined>(undefined);

export const ChuplingoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        const today = getTodayDateString();
        if (parsed.fechaPreguntasHoy !== today) {
          parsed.preguntasRespondidasHoy = 0;
          parsed.fechaPreguntasHoy = today;
          parsed.metaDiariaCumplidaHoy = false;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading user from localStorage', e);
    }
    return INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return user.id !== 'guest-student' || user.onboardingCompletado;
  });

  const [sessions, setSessions] = useState<PracticeSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [favoriteQuestionIds, setFavoriteQuestionIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [claimedChallengeIds, setClaimedChallengeIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLAIMED_CHALLENGES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return stored ? JSON.parse(stored) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : [
        {
          id: 'notif-welcome',
          titulo: '¡Bienvenido a Chuplingo!',
          mensaje: 'Explora los 8 cursos y empieza a construir tu racha diaria.',
          tipo: 'sistema',
          leido: false,
          fecha: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const allQuestions = [...INITIAL_QUESTIONS, ...customQuestions];

  // Local persistence sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteQuestionIds));
  }, [favoriteQuestionIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLAIMED_CHALLENGES, JSON.stringify(claimedChallengeIds));
  }, [claimedChallengeIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(customQuestions));
  }, [customQuestions]);

  // Audio feedback helper
  const playSoundEffect = (type: 'correct' | 'complete' | 'level') => {
    if (!user.preferencias.sonido) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'complete' || type === 'level') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Ignored if browser policy restricts context before interaction
    }
  };

  // Auth Functions
  const getAuthDB = (): AuthCredentials[] => {
    try {
      const db = localStorage.getItem(STORAGE_KEYS.AUTH_DB);
      return db ? JSON.parse(db) : [];
    } catch {
      return [];
    }
  };

  const saveAuthDB = (db: AuthCredentials[]) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_DB, JSON.stringify(db));
  };

  const registerUser = (data: { nombre: string; apellido: string; email: string; password: string }): boolean => {
    const emailNorm = data.email.trim().toLowerCase();
    const db = getAuthDB();

    if (db.some(acc => acc.email === emailNorm)) {
      toast.error('Ya existe una cuenta con este correo electrónico');
      return false;
    }

    const newAcc: AuthCredentials = {
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      email: emailNorm,
      passwordHash: simpleHash(data.password)
    };

    saveAuthDB([...db, newAcc]);

    const newUser: UserProfile = {
      ...INITIAL_USER,
      id: `user-${Date.now()}`,
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      email: emailNorm,
      emailVerificado: false,
      creadoEn: new Date().toISOString(),
      onboardingCompletado: true
    };

    setUser(newUser);
    setIsAuthenticated(true);
    toast.success('¡Registro exitoso! Te enviamos un correo de verificación.');
    return true;
  };

  const loginUser = (data: { email: string; password: string }): boolean => {
    const emailNorm = data.email.trim().toLowerCase();
    const db = getAuthDB();
    const acc = db.find(a => a.email === emailNorm);

    if (!acc || acc.passwordHash !== simpleHash(data.password)) {
      // Admin demo fallback bypass
      if (emailNorm === 'admin@chuplingo.pe' && data.password === 'Admin1234') {
        const adminUser: UserProfile = {
          ...INITIAL_USER,
          id: 'admin-01',
          nombre: 'Administrador',
          apellido: 'Chuplingo',
          email: 'admin@chuplingo.pe',
          emailVerificado: true,
          rol: 'admin',
          suscripcion: {
            planId: 'vip',
            estado: 'activa',
            fechaInicio: getTodayDateString(),
            fechaRenovacion: '2029-12-31'
          }
        };
        setUser(adminUser);
        setIsAuthenticated(true);
        toast.success('Sesión iniciada como Administrador');
        return true;
      }

      toast.error('Correo o contraseña incorrectos');
      return false;
    }

    const updatedUser: UserProfile = {
      ...user,
      id: `user-${simpleHash(emailNorm)}`,
      nombre: acc.nombre,
      apellido: acc.apellido,
      email: acc.email,
      onboardingCompletado: true
    };

    setUser(updatedUser);
    setIsAuthenticated(true);
    toast.success(`¡Bienvenido de nuevo, ${acc.nombre}!`);
    return true;
  };

  const verifyUserEmail = (email?: string) => {
    const targetEmail = email || user.email;
    setUser(prev => ({ ...prev, email: targetEmail, emailVerificado: true }));
    toast.success('¡Tu cuenta ha sido verificada correctamente!');
    triggerConfetti();
  };

  const requestPasswordReset = (email: string): boolean => {
    const emailNorm = email.trim().toLowerCase();
    const db = getAuthDB();
    const exists = db.some(a => a.email === emailNorm);

    if (exists || emailNorm.includes('@')) {
      toast.success('Enlace de recuperación enviado. Revisa tu bandeja de entrada.');
      return true;
    }
    toast.error('No encontramos una cuenta con ese correo');
    return false;
  };

  const resetUserPassword = (email: string, newPassword: string): boolean => {
    const emailNorm = email.trim().toLowerCase();
    const db = getAuthDB();
    const idx = db.findIndex(a => a.email === emailNorm);

    if (idx >= 0) {
      db[idx].passwordHash = simpleHash(newPassword);
      saveAuthDB(db);
      toast.success('Contraseña actualizada con éxito');
      return true;
    }
    toast.error('No se pudo restablecer la contraseña');
    return false;
  };

  const updateUserEmail = (newEmail: string): boolean => {
    const emailNorm = newEmail.trim().toLowerCase();
    const db = getAuthDB();

    if (db.some(a => a.email === emailNorm && a.email !== user.email)) {
      toast.error('Ese correo ya está registrado por otro usuario');
      return false;
    }

    const idx = db.findIndex(a => a.email === user.email);
    if (idx >= 0) {
      db[idx].email = emailNorm;
      saveAuthDB(db);
    }

    setUser(prev => ({ ...prev, email: emailNorm, emailVerificado: false }));
    toast.success('Correo actualizado. Revisa el mensaje de verificación.');
    return true;
  };

  const updateUserPassword = (oldPassword: string, newPassword: string): boolean => {
    const db = getAuthDB();
    const acc = db.find(a => a.email === user.email);

    if (acc && acc.passwordHash !== simpleHash(oldPassword)) {
      toast.error('La contraseña actual es incorrecta');
      return false;
    }

    if (acc) {
      acc.passwordHash = simpleHash(newPassword);
      saveAuthDB(db);
    }

    toast.success('Tu contraseña ha sido cambiada de forma segura');
    return true;
  };

  const logoutUser = () => {
    setUser({ ...INITIAL_USER, onboardingCompletado: true });
    setIsAuthenticated(false);
    toast.info('Sesión cerrada');
  };

  const deleteUserAccount = () => {
    const db = getAuthDB().filter(a => a.email !== user.email);
    saveAuthDB(db);
    resetAllProgress();
    setIsAuthenticated(false);
    toast.success('Tu cuenta ha sido eliminada por completo');
  };

  const exportUserDataJSON = (): string => {
    const exportData = {
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        suscripcion: user.suscripcion,
        xp: user.xp,
        nivel: user.nivel,
        rachaActual: user.rachaActual,
        mejorRacha: user.mejorRacha,
        creadoEn: user.creadoEn
      },
      sesiones: sessions,
      errores: mistakes,
      favoritos: favoriteQuestionIds,
      logros: achievements.filter(a => a.desbloqueadoEn),
      fechaExportacion: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  };

  // Plan Management
  const changeUserPlan = (planId: PlanId) => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    setUser(prev => ({
      ...prev,
      suscripcion: {
        planId,
        estado: 'activa',
        fechaInicio: getTodayDateString(),
        fechaRenovacion: nextMonth.toISOString().split('T')[0],
        proveedor: planId === 'gratis' ? undefined : 'Culqi / MercadoPago'
      }
    }));

    playSoundEffect('complete');
    triggerConfetti();
    toast.success(`🎉 ¡Plan actualizado a ${planId.toUpperCase()}!`);
  };

  // Check achievements against stats
  const checkAchievements = (
    currentXp: number, 
    currentStreak: number, 
    totalQuestionsAnswered: number, 
    bestAccuracy: number,
    practicedCourses: Set<CourseId>,
    dominatedMistakes: number
  ) => {
    let changed = false;
    const updated = achievements.map(ach => {
      if (ach.desbloqueadoEn) return ach;
      let unlocked = false;

      if (ach.id === 'ach-1' && currentStreak >= 3) unlocked = true;
      if (ach.id === 'ach-2' && totalQuestionsAnswered >= 100) unlocked = true;
      if (ach.id === 'ach-3' && bestAccuracy >= 90) unlocked = true;
      if (ach.id === 'ach-4' && currentStreak >= 30) unlocked = true;
      if (ach.id === 'ach-5' && practicedCourses.size >= 8) unlocked = true;
      if (ach.id === 'ach-6' && practicedCourses.has('ingles')) unlocked = true;
      if (ach.id === 'ach-7' && dominatedMistakes >= 5) unlocked = true;
      if (ach.id === 'ach-8' && favoriteQuestionIds.length >= 10) unlocked = true;

      if (unlocked) {
        changed = true;
        toast.success(`🏆 ¡Logro desbloqueado: ${ach.nombre}!`, {
          description: ach.descripcion,
          duration: 4500
        });
        triggerConfetti();
        return { ...ach, desbloqueadoEn: new Date().toISOString() };
      }
      return ach;
    });

    if (changed) {
      setAchievements(updated);
    }
  };

  // Record practice session
  const recordSession = (sessionData: Omit<PracticeSession, 'id' | 'userId' | 'fecha' | 'xpGanado'>): PracticeSession => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    let sessionXP = (sessionData.correctas * 10) + (sessionData.isSimulacro ? 60 : 30);
    const newQuestionsToday = (user.fechaPreguntasHoy === today ? user.preguntasRespondidasHoy : 0) + sessionData.totalPreguntas;
    const willAchieveGoal = !user.metaDiariaCumplidaHoy && newQuestionsToday >= user.preferencias.metaDiaria;
    
    if (willAchieveGoal) {
      sessionXP += 50;
    }

    const newSessionId = `session-${Date.now()}`;
    const newSession: PracticeSession = {
      ...sessionData,
      id: newSessionId,
      userId: user.id,
      fecha: new Date().toISOString(),
      xpGanado: sessionXP
    };

    // Update Mistakes
    const updatedMistakes = [...mistakes];
    sessionData.attempts.forEach(attempt => {
      const existingIdx = updatedMistakes.findIndex(m => m.questionId === attempt.questionId);
      if (!attempt.esCorrecta) {
        if (existingIdx >= 0) {
          updatedMistakes[existingIdx] = {
            ...updatedMistakes[existingIdx],
            fallosConsecutivos: updatedMistakes[existingIdx].fallosConsecutivos + 1,
            dominada: false,
            ultimoIntento: new Date().toISOString()
          };
        } else {
          updatedMistakes.push({
            questionId: attempt.questionId,
            courseId: attempt.courseId,
            topicId: attempt.topicId,
            fallosConsecutivos: 1,
            vecesAcertadaDespues: 0,
            dominada: false,
            ultimoIntento: new Date().toISOString()
          });
        }
      } else {
        if (existingIdx >= 0) {
          const times = updatedMistakes[existingIdx].vecesAcertadaDespues + 1;
          updatedMistakes[existingIdx] = {
            ...updatedMistakes[existingIdx],
            vecesAcertadaDespues: times,
            dominada: times >= 2,
            ultimoIntento: new Date().toISOString()
          };
        }
      }
    });
    setMistakes(updatedMistakes);

    // XP & Streak Calculation
    const newXP = user.xp + sessionXP;
    const { level: newLevel, title: newTitle } = calculateLevelInfo(newXP);
    
    let newStreak = user.rachaActual;
    let newBestStreak = user.mejorRacha;
    let newLastStreakDate = user.ultimaFechaRacha;

    if (willAchieveGoal) {
      if (user.ultimaFechaRacha === yesterday) {
        newStreak += 1;
      } else if (user.ultimaFechaRacha !== today) {
        newStreak = 1;
      }
      newLastStreakDate = today;
      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }
      toast.success(`🎯 ¡Meta diaria completada! (+50 XP)`, {
        description: `Racha activa: 🔥 ${newStreak} días seguidos.`
      });
      triggerConfetti();
    }

    if (newLevel > user.nivel) {
      playSoundEffect('level');
      toast.success(`🎉 ¡Subiste de Nivel! Ahora eres Nivel ${newLevel} (${newTitle})`, {
        duration: 5000
      });
      triggerConfetti();
    } else {
      playSoundEffect('complete');
    }

    const updatedUser: UserProfile = {
      ...user,
      xp: newXP,
      nivel: newLevel,
      tituloNivel: newTitle,
      rachaActual: newStreak,
      mejorRacha: newBestStreak,
      ultimaFechaRacha: newLastStreakDate,
      preguntasRespondidasHoy: newQuestionsToday,
      fechaPreguntasHoy: today,
      metaDiariaCumplidaHoy: user.metaDiariaCumplidaHoy || willAchieveGoal,
    };

    setUser(updatedUser);
    setSessions(prev => [newSession, ...prev]);

    // Check achievements
    const allSessionsList = [newSession, ...sessions];
    const totalQ = allSessionsList.reduce((acc, s) => acc + s.totalPreguntas, 0);
    const practicedCourses = new Set<CourseId>(allSessionsList.map(s => s.courseId).filter(Boolean) as CourseId[]);
    const dominatedCount = updatedMistakes.filter(m => m.dominada).length;

    checkAchievements(newXP, newStreak, totalQ, sessionData.porcentaje, practicedCourses, dominatedCount);

    return newSession;
  };

  const toggleFavorite = (questionId: string): boolean => {
    let isFav = false;
    setFavoriteQuestionIds(prev => {
      if (prev.includes(questionId)) {
        isFav = false;
        toast.info('Pregunta eliminada de favoritos');
        return prev.filter(id => id !== questionId);
      } else {
        isFav = true;
        toast.success('⭐ Pregunta guardada en tus favoritos');
        return [...prev, questionId];
      }
    });
    return isFav;
  };

  const isFavorite = (questionId: string) => favoriteQuestionIds.includes(questionId);

  const updateUserPreferences = (prefs: Partial<UserProfile['preferencias']>) => {
    setUser(prev => ({
      ...prev,
      preferencias: {
        ...prev.preferencias,
        ...prefs
      }
    }));
    toast.success('Preferencias guardadas');
  };

  const updateUserName = (name: string, lastName?: string) => {
    if (!name.trim()) return;
    setUser(prev => ({ 
      ...prev, 
      nombre: name.trim(),
      apellido: lastName !== undefined ? lastName.trim() : prev.apellido 
    }));
    toast.success('Perfil actualizado');
  };

  const claimChallengeReward = (challengeId: string) => {
    const challenge = INITIAL_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge || claimedChallengeIds.includes(challengeId)) return;

    setClaimedChallengeIds(prev => [...prev, challengeId]);
    const newXP = user.xp + challenge.recompensaXP;
    const { level: newLevel, title: newTitle } = calculateLevelInfo(newXP);

    setUser(prev => ({
      ...prev,
      xp: newXP,
      nivel: newLevel,
      tituloNivel: newTitle
    }));

    playSoundEffect('complete');
    triggerConfetti();
    toast.success(`🎉 ¡Recompensa reclamada! +${challenge.recompensaXP} XP`);
  };

  const completeOnboarding = (prefs?: { metaDiaria?: number; horarioEstudio?: string; cursosFavoritos?: CourseId[] }) => {
    setUser(prev => ({
      ...prev,
      onboardingCompletado: true,
      preferencias: {
        ...prev.preferencias,
        metaDiaria: prefs?.metaDiaria || prev.preferencias.metaDiaria,
        horarioEstudio: prefs?.horarioEstudio || prev.preferencias.horarioEstudio,
        cursosFavoritos: prefs?.cursosFavoritos || prev.preferencias.cursosFavoritos
      }
    }));
    setIsAuthenticated(true);
  };

  const resetAllProgress = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setSessions([]);
    setFavoriteQuestionIds([]);
    setMistakes([]);
    setClaimedChallengeIds([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setCustomQuestions([]);
    toast.info('Se han restablecido todos los datos locales');
  };

  // Admin Question Bank Operations
  const addQuestionToBank = (newQ: Omit<Question, 'id'>): Question => {
    const q: Question = {
      ...newQ,
      id: `custom-q-${Date.now()}`
    };
    setCustomQuestions(prev => [q, ...prev]);
    toast.success('Pregunta añadida exitosamente al banco');
    return q;
  };

  const updateQuestionInBank = (id: string, updatedQ: Partial<Question>): boolean => {
    let found = false;
    setCustomQuestions(prev => prev.map(q => {
      if (q.id === id) {
        found = true;
        return { ...q, ...updatedQ };
      }
      return q;
    }));
    if (found) {
      toast.success('Pregunta actualizada en el banco');
      return true;
    }
    toast.info('Las preguntas base del sistema son de solo lectura');
    return false;
  };

  const deleteQuestionFromBank = (id: string): boolean => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
    toast.success('Pregunta eliminada del banco');
    return true;
  };

  const importQuestionsJSON = (imported: Question[]): number => {
    if (!Array.isArray(imported)) return 0;
    const valid = imported.filter(q => q.courseId && q.pregunta && q.respuestaCorrecta && q.alternativas?.length === 5);
    setCustomQuestions(prev => [...valid, ...prev]);
    toast.success(`Se importaron ${valid.length} preguntas correctamente`);
    return valid.length;
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.info('Notificaciones limpiadas');
  };

  // Progress Helpers
  const getCourseProgress = (courseId: CourseId) => {
    const courseSessions = sessions.filter(s => s.courseId === courseId);
    if (courseSessions.length === 0) {
      return { accuracy: 0, questionsAnswered: 0, masteryPercent: 0, completedTopicsCount: 0 };
    }

    const totalQuestions = courseSessions.reduce((acc, s) => acc + s.totalPreguntas, 0);
    const totalCorrect = courseSessions.reduce((acc, s) => acc + s.correctas, 0);
    const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

    const completedTopics = new Set<string>();
    courseSessions.forEach(s => {
      if (s.topicId && s.porcentaje >= 70) {
        completedTopics.add(s.topicId);
      }
    });

    const courseObj = COURSES.find(c => c.id === courseId);
    const totalTopicsInCourse = courseObj?.temas.length || 10;
    const masteryPercent = Math.min(100, Math.round((completedTopics.size / totalTopicsInCourse) * 100));

    return {
      accuracy,
      questionsAnswered: totalQuestions,
      masteryPercent,
      completedTopicsCount: completedTopics.size
    };
  };

  const getTopicProgress = (topicId: string) => {
    const topicSessions = sessions.filter(s => s.topicId === topicId);
    if (topicSessions.length === 0) {
      return { attempts: 0, correct: 0, accuracy: 0, status: 'no_iniciado' as const };
    }

    const totalQ = topicSessions.reduce((acc, s) => acc + s.totalPreguntas, 0);
    const correctQ = topicSessions.reduce((acc, s) => acc + s.correctas, 0);
    const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;

    let status: 'no_iniciado' | 'en_progreso' | 'dominado' = 'en_progreso';
    if (accuracy >= 85 && totalQ >= 5) {
      status = 'dominado';
    } else if (totalQ === 0) {
      status = 'no_iniciado';
    }

    return {
      attempts: totalQ,
      correct: correctQ,
      accuracy,
      status
    };
  };

  const getWeeklyActivity = () => {
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = days[d.getDay()];

      const questionsOnDay = sessions
        .filter(s => s.fecha.startsWith(dateStr))
        .reduce((sum, s) => sum + s.totalPreguntas, 0);

      result.push({
        day: dayLabel,
        dateStr,
        questions: questionsOnDay,
        isToday: i === 0
      });
    }

    return result;
  };

  const getOverallStats = () => {
    const totalSessions = sessions.length;
    const totalQuestions = sessions.reduce((acc, s) => acc + s.totalPreguntas, 0);
    const totalCorrect = sessions.reduce((acc, s) => acc + s.correctas, 0);
    const totalIncorrect = sessions.reduce((acc, s) => acc + s.incorrectas, 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const totalTimeSeconds = sessions.reduce((acc, s) => acc + s.duracionSegundos, 0);

    return {
      totalSessions,
      totalQuestions,
      totalCorrect,
      totalIncorrect,
      overallAccuracy,
      totalTimeSeconds
    };
  };

  const getRecommendedTopic = () => {
    if (sessions.length === 0) {
      return {
        courseId: 'literatura' as CourseId,
        topicId: 'lit-1',
        topicName: 'Géneros y Figuras Literarias',
        courseName: 'Literatura',
        accuracy: 0
      };
    }

    let lowestAcc = 100;
    let candidate = null;

    for (const course of COURSES) {
      for (const topic of course.temas) {
        const prog = getTopicProgress(topic.id);
        if (prog.attempts > 0 && prog.accuracy < lowestAcc && prog.accuracy < 70) {
          lowestAcc = prog.accuracy;
          candidate = {
            courseId: course.id,
            topicId: topic.id,
            topicName: topic.nombre,
            courseName: course.nombre,
            accuracy: prog.accuracy
          };
        }
      }
    }

    if (!candidate) {
      for (const course of COURSES) {
        for (const topic of course.temas) {
          const prog = getTopicProgress(topic.id);
          if (prog.attempts === 0) {
            return {
              courseId: course.id,
              topicId: topic.id,
              topicName: topic.nombre,
              courseName: course.nombre,
              accuracy: 0
            };
          }
        }
      }
    }

    return candidate;
  };

  const getChallengeProgress = (challenge: Challenge) => {
    const isClaimed = claimedChallengeIds.includes(challenge.id);
    const today = getTodayDateString();

    let current = 0;

    if (challenge.tipo === 'tests_completed') {
      if (challenge.periodo === 'diario') {
        current = sessions.filter(s => s.fecha.startsWith(today)).length;
      } else {
        current = sessions.length;
      }
    } else if (challenge.tipo === 'questions_answered') {
      if (challenge.periodo === 'diario') {
        current = user.fechaPreguntasHoy === today ? user.preguntasRespondidasHoy : 0;
      } else {
        current = sessions.reduce((acc, s) => acc + s.totalPreguntas, 0);
      }
    } else if (challenge.tipo === 'accuracy_target') {
      const todaySessions = sessions.filter(s => s.fecha.startsWith(today));
      const hasHitAccuracy = todaySessions.some(s => s.porcentaje >= challenge.meta);
      current = hasHitAccuracy ? challenge.meta : (todaySessions[0]?.porcentaje || 0);
    } else if (challenge.tipo === 'courses_practiced') {
      const relevantSessions = challenge.periodo === 'diario' 
        ? sessions.filter(s => s.fecha.startsWith(today))
        : sessions;
      const uniqueCourses = new Set(relevantSessions.map(s => s.courseId).filter(Boolean));
      current = uniqueCourses.size;
    } else if (challenge.tipo === 'streak_days') {
      current = user.rachaActual;
    }

    const completed = current >= challenge.meta;

    return {
      current: Math.min(current, challenge.meta),
      max: challenge.meta,
      completed,
      claimed: isClaimed
    };
  };

  return (
    <ChuplingoContext.Provider
      value={{
        user,
        isAuthenticated,
        sessions,
        favoriteQuestionIds,
        mistakes,
        allQuestions,
        achievements,
        claimedChallengeIds,
        notifications,
        registerUser,
        loginUser,
        verifyUserEmail,
        requestPasswordReset,
        resetUserPassword,
        updateUserEmail,
        updateUserPassword,
        logoutUser,
        deleteUserAccount,
        exportUserDataJSON,
        recordSession,
        toggleFavorite,
        isFavorite,
        updateUserPreferences,
        updateUserName,
        changeUserPlan,
        claimChallengeReward,
        resetAllProgress,
        completeOnboarding,
        addQuestionToBank,
        updateQuestionInBank,
        deleteQuestionFromBank,
        importQuestionsJSON,
        markNotificationAsRead,
        clearAllNotifications,
        getCourseProgress,
        getTopicProgress,
        getWeeklyActivity,
        getOverallStats,
        getRecommendedTopic,
        getChallengeProgress,
      }}
    >
      {children}
    </ChuplingoContext.Provider>
  );
};

export const useChuplingo = () => {
  const context = useContext(ChuplingoContext);
  if (!context) {
    throw new Error('useChuplingo must be used within a ChuplingoProvider');
  }
  return context;
};