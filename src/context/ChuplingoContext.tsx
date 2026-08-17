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
  Challenge
} from '../types/chuplingo';
import { COURSES, INITIAL_QUESTIONS, LEVEL_THRESHOLDS } from '../data/coursesData';
import { INITIAL_CHALLENGES } from '../data/challengesData';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface ChuplingoContextType {
  user: UserProfile;
  sessions: PracticeSession[];
  favoriteQuestionIds: string[];
  mistakes: MistakeRecord[];
  allQuestions: Question[];
  achievements: Achievement[];
  claimedChallengeIds: string[];
  // Actions
  recordSession: (sessionData: Omit<PracticeSession, 'id' | 'fecha' | 'xpGanado'>) => PracticeSession;
  toggleFavorite: (questionId: string) => boolean;
  isFavorite: (questionId: string) => boolean;
  updateUserPreferences: (prefs: Partial<UserProfile['preferencias']>) => void;
  updateUserName: (name: string) => void;
  claimChallengeReward: (challengeId: string) => void;
  resetAllProgress: () => void;
  completeOnboarding: () => void;
  // Helpers
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
  USER: 'chuplingo_user_v2',
  SESSIONS: 'chuplingo_sessions_v2',
  FAVORITES: 'chuplingo_favorites_v2',
  MISTAKES: 'chuplingo_mistakes_v2',
  CUSTOM_QUESTIONS: 'chuplingo_custom_questions_v2',
  ACHIEVEMENTS: 'chuplingo_achievements_v2',
  CLAIMED_CHALLENGES: 'chuplingo_claimed_challenges_v2'
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
  id: 'chuplingo-user-1',
  nombre: 'Estudiante',
  avatar: 'parrot',
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
    sonido: true,
    vibracion: true,
    recordatorios: true,
    temaOscuro: false,
  },
  onboardingCompletado: false
};

const ChuplingoContext = createContext<ChuplingoContextType | undefined>(undefined);

export const ChuplingoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load State safely from localStorage
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        const today = getTodayDateString();
        // Check if day changed for daily counter
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

  const [allQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  // Sync state to local storage
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
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'complete' || type === 'level') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Check achievements against current stats
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
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        return { ...ach, desbloqueadoEn: new Date().toISOString() };
      }
      return ach;
    });

    if (changed) {
      setAchievements(updated);
    }
  };

  // Record practice session
  const recordSession = (sessionData: Omit<PracticeSession, 'id' | 'fecha' | 'xpGanado'>): PracticeSession => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    // XP calculation: 10 XP per correct + 30 XP for completing test
    let sessionXP = (sessionData.correctas * 10) + 30;
    
    // Check daily goal bonus
    const newQuestionsToday = (user.fechaPreguntasHoy === today ? user.preguntasRespondidasHoy : 0) + sessionData.totalPreguntas;
    const willAchieveGoal = !user.metaDiariaCumplidaHoy && newQuestionsToday >= user.preferencias.metaDiaria;
    
    if (willAchieveGoal) {
      sessionXP += 50; // Daily goal bonus
    }

    const newSessionId = `session-${Date.now()}`;
    const newSession: PracticeSession = {
      ...sessionData,
      id: newSessionId,
      fecha: new Date().toISOString(),
      xpGanado: sessionXP
    };

    // Update Mistakes Bank
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
        // Correct answer - if previously mistaken, increment mastery count
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

    // Update User XP, Streak and Levels
    const newXP = user.xp + sessionXP;
    const { level: newLevel, title: newTitle } = calculateLevelInfo(newXP);
    
    // Streak logic
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
        description: `Racha actual: 🔥 ${newStreak} días continuos.`,
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    if (newLevel > user.nivel) {
      playSoundEffect('level');
      toast.success(`🎉 ¡Subiste de Nivel! Ahora eres Nivel ${newLevel} (${newTitle})`, {
        duration: 5000
      });
      confetti({ particleCount: 100, spread: 90 });
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

    // Check for achievements
    const allSessionsList = [newSession, ...sessions];
    const totalQ = allSessionsList.reduce((acc, s) => acc + s.totalPreguntas, 0);
    const practicedCourses = new Set<CourseId>(allSessionsList.map(s => s.courseId));
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
        toast.success('⭐ Pregunta guardada en favoritos');
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

  const updateUserName = (name: string) => {
    if (!name.trim()) return;
    setUser(prev => ({ ...prev, nombre: name.trim() }));
    toast.success('Nombre actualizado');
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
    confetti({ particleCount: 70, spread: 60 });
    toast.success(`🎉 ¡Recompensa reclamada! +${challenge.recompensaXP} XP`);
  };

  const completeOnboarding = () => {
    setUser(prev => ({ ...prev, onboardingCompletado: true }));
  };

  const resetAllProgress = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setSessions([]);
    setFavoriteQuestionIds([]);
    setMistakes([]);
    setClaimedChallengeIds([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    toast.info('Se han restablecido todos los datos de práctica');
  };

  // Helper: Get statistics for a specific course
  const getCourseProgress = (courseId: CourseId) => {
    const courseSessions = sessions.filter(s => s.courseId === courseId);
    if (courseSessions.length === 0) {
      return { accuracy: 0, questionsAnswered: 0, masteryPercent: 0, completedTopicsCount: 0 };
    }

    const totalQuestions = courseSessions.reduce((acc, s) => acc + s.totalPreguntas, 0);
    const totalCorrect = courseSessions.reduce((acc, s) => acc + s.correctas, 0);
    const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

    // Estimate completed topics (distinct topics practiced with >= 70% accuracy)
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

  // Helper: Get topic specific stats
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

  // Helper: Get 7 days activity array
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

  // Helper: Overall global statistics
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

  // Helper: Recommended topic based on lowest accuracy with at least 1 attempt or unstarted
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

    // Look for topics practiced with lower accuracy
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

    // If all practiced topics are high accuracy, pick the first unpracticed topic
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

  // Helper: Calculate challenge progress
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
      const uniqueCourses = new Set(relevantSessions.map(s => s.courseId));
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
        sessions,
        favoriteQuestionIds,
        mistakes,
        allQuestions,
        achievements,
        claimedChallengeIds,
        recordSession,
        toggleFavorite,
        isFavorite,
        updateUserPreferences,
        updateUserName,
        claimChallengeReward,
        resetAllProgress,
        completeOnboarding,
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