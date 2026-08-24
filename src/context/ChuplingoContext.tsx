"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  PlanId, 
  SubscriptionRequest, 
  UserRole 
} from '../types/chuplingo';
import { COURSES, LEVEL_THRESHOLDS } from '../data/coursesData';
import { INITIAL_CHALLENGES } from '../data/challengesData';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { triggerConfetti } from '../utils/confetti';

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
  isLoadingQuestions: boolean;
  courseQuestionCounts: Record<string, number>;
  topicQuestionCounts: Record<string, number>;
  userPendingRequest: SubscriptionRequest | null;
  fetchQuestionsForSession: (params: {
    courseId?: CourseId;
    topicId?: string;
    mode: string;
    difficulty?: string;
    count?: number;
  }) => Promise<Question[]>;
  fetchQuestionsFromSupabase: () => Promise<void>;
  // Auth Operations
  registerUser: (data: { nombre: string; apellido: string; email: string; password: string }) => Promise<boolean>;
  loginUser: (data: { email: string; password: string }) => Promise<boolean>;
  verifyUserEmail: (email?: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetUserPassword: (email: string, newPassword: string) => Promise<boolean>;
  updateUserEmail: (newEmail: string) => Promise<boolean>;
  updateUserPassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  exportUserDataJSON: () => string;
  // Session & Practice
  recordSession: (sessionData: Omit<PracticeSession, 'id' | 'userId' | 'fecha' | 'xpGanado'>) => Promise<PracticeSession>;
  toggleFavorite: (questionId: string) => boolean;
  isFavorite: (questionId: string) => boolean;
  // Preferences & Plans
  updateUserPreferences: (prefs: Partial<UserProfile['preferencias']>) => void;
  updateUserName: (name: string, lastName?: string) => void;
  changeUserPlan: (planId: PlanId) => void;
  // Subscription Requests System (Yape manual + Storage)
  submitSubscriptionRequest: (params: {
    planId: 'FAN' | 'LOVER' | 'VIP';
    price: number;
    operationNumber?: string;
    phoneNumber?: string;
    proofFile?: File | null;
  }) => Promise<boolean>;
  fetchAdminSubscriptionRequests: () => Promise<SubscriptionRequest[]>;
  approveSubscriptionRequest: (requestId: string, targetUserId: string, plan: string, price: number) => Promise<boolean>;
  rejectSubscriptionRequest: (requestId: string, reason?: string) => Promise<boolean>;
  claimChallengeReward: (challengeId: string) => void;
  resetAllProgress: () => void;
  completeOnboarding: (prefs?: { metaDiaria?: number; horarioEstudio?: string; cursosFavoritos?: CourseId[] }) => void;
  // Admin Operations
  addQuestionToBank: (newQ: Omit<Question, 'id'>) => Promise<Question | null>;
  deleteQuestionFromBank: (id: string) => Promise<boolean>;
  importQuestionsBatch: (questions: any[]) => Promise<number>;
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
  USER_STATS: 'chuplingo_user_stats_v2.0',
  SESSIONS: 'chuplingo_sessions_v2.0',
  FAVORITES: 'chuplingo_favorites_v2.0',
  MISTAKES: 'chuplingo_mistakes_v2.0',
  ACHIEVEMENTS: 'chuplingo_achievements_v2.0',
  CLAIMED_CHALLENGES: 'chuplingo_claimed_challenges_v2.0',
  NOTIFICATIONS: 'chuplingo_notifications_v2.0',
  PENDING_REQUEST: 'chuplingo_pending_req_v2.0'
};

const isValidUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
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

const normalizeCourseId = (val: string): CourseId => {
  const clean = (val || '').toLowerCase().trim().replace(/_/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (clean.includes('literatura')) return 'literatura';
  if (clean.includes('psicolog')) return 'psicologia';
  if (clean.includes('geograf')) return 'geografia';
  if (clean.includes('razonamiento') || clean.includes('verbal')) return 'razonamiento-verbal';
  if (clean.includes('civic')) return 'civica';
  if (clean.includes('filosof')) return 'filosofia';
  if (clean.includes('ingl') || clean.includes('english')) return 'ingles';
  if (clean.includes('biolog')) return 'biologia';
  return 'literatura';
};

function shuffleList<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
  rol: 'student'
};

const ChuplingoContext = createContext<ChuplingoContextType | undefined>(undefined);

export const ChuplingoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
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
      console.error('Error loading user stats from localStorage', e);
    }
    return INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [courseQuestionCounts, setCourseQuestionCounts] = useState<Record<string, number>>({});
  const [topicQuestionCounts, setTopicQuestionCounts] = useState<Record<string, number>>({});
  const [userPendingRequest, setUserPendingRequest] = useState<SubscriptionRequest | null>(null);

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

  // Map database row from Supabase public.questions to Question format
  const mapDbQuestion = useCallback((dbQ: any): Question => {
    const normalizedCourse = normalizeCourseId(dbQ.course_id);
    const course = COURSES.find(c => c.id === normalizedCourse);

    const rawTopic = (dbQ.topic_id || '').toString().trim();
    const topic = course?.temas.find(t => 
      t.id.toLowerCase() === rawTopic.toLowerCase() ||
      t.nombre.toLowerCase() === rawTopic.toLowerCase() ||
      rawTopic.toLowerCase().includes(t.nombre.toLowerCase()) ||
      t.nombre.toLowerCase().includes(rawTopic.toLowerCase()) ||
      String(t.numero) === rawTopic
    );

    const topicId = topic?.id || dbQ.topic_id || undefined;
    const topicName = topic?.nombre || dbQ.topic_id || 'Tema General';

    const rawCorrect = (dbQ.correct_answer || 'A').toString().toUpperCase().trim().replace(/[^A-E]/g, '') || 'A';
    const cleanCorrect = (['A', 'B', 'C', 'D', 'E'].includes(rawCorrect) ? rawCorrect : 'A') as 'A' | 'B' | 'C' | 'D' | 'E';

    return {
      id: String(dbQ.id),
      courseId: normalizedCourse,
      topicId: topicId,
      topicName: topicName,
      subtopic: dbQ.subtopic || undefined,
      pregunta: dbQ.question || '',
      alternativas: [
        { id: 'A', text: dbQ.option_a || '' },
        { id: 'B', text: dbQ.option_b || '' },
        { id: 'C', text: dbQ.option_c || '' },
        { id: 'D', text: dbQ.option_d || '' },
        { id: 'E', text: dbQ.option_e || '' },
      ],
      respuestaCorrecta: cleanCorrect,
      explicacion: dbQ.explanation || '',
      fuente: dbQ.origin || dbQ.source_document || 'Admisión Universitaria',
      sourceDocument: dbQ.source_document || undefined,
      sourcePage: dbQ.source_page || undefined,
      origin: dbQ.origin || undefined,
      officialExamQuestion: dbQ.official_exam_question || false,
      questionType: dbQ.question_type || 'multiple_choice',
      dificultad: (dbQ.difficulty?.toLowerCase() || 'intermedio') as any,
      active: dbQ.active !== false
    };
  }, []);

  // Fetch count and initial question stats from Supabase
  const fetchQuestionsFromSupabase = useCallback(async () => {
    try {
      setIsLoadingQuestions(true);

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('active', true)
        .limit(200);

      if (error) {
        console.error('[Supabase questions fetch error]', error);
        return;
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapDbQuestion);
        setAllQuestions(mapped);
      }

      // Compute question counts per course
      const counts: Record<string, number> = {};
      const tCounts: Record<string, number> = {};

      for (const course of COURSES) {
        const { count } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .ilike('course_id', `%${course.id}%`)
          .eq('active', true);
        counts[course.id] = count || 1000;

        for (const topic of course.temas) {
          const { count: topCount } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .ilike('course_id', `%${course.id}%`)
            .or(`topic_id.ilike.%${topic.id}%,topic_id.ilike.%${topic.nombre}%`)
            .eq('active', true);
          tCounts[topic.id] = topCount || 100;
        }
      }
      setCourseQuestionCounts(counts);
      setTopicQuestionCounts(tCounts);
    } catch (err: any) {
      console.error('[Supabase connection exception]', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [mapDbQuestion]);

  // Dynamic question fetcher for practice sessions
  const fetchQuestionsForSession = useCallback(async (params: {
    courseId?: CourseId;
    topicId?: string;
    mode: string;
    difficulty?: string;
    count?: number;
  }): Promise<Question[]> => {
    const targetCount = params.count || 10;

    // Special Mode: Errores
    if (params.mode === 'errores') {
      const mistakeIds = mistakes.filter(m => !m.dominada).map(m => m.questionId);
      if (mistakeIds.length === 0) return [];
      
      const { data } = await supabase
        .from('questions')
        .select('*')
        .in('id', mistakeIds)
        .limit(targetCount);

      if (data && data.length > 0) {
        return shuffleList(data.map(mapDbQuestion));
      }
      return [];
    }

    // Special Mode: Favoritos
    if (params.mode === 'favoritos') {
      if (favoriteQuestionIds.length === 0) return [];

      const { data } = await supabase
        .from('questions')
        .select('*')
        .in('id', favoriteQuestionIds)
        .limit(targetCount);

      if (data && data.length > 0) {
        return shuffleList(data.map(mapDbQuestion));
      }
      return [];
    }

    // Mode: Simulacro (multi-course)
    if (params.mode === 'simulacro') {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('active', true)
        .limit(Math.max(50, targetCount * 2));

      if (data && data.length > 0) {
        return shuffleList(data.map(mapDbQuestion)).slice(0, targetCount);
      }
      return allQuestions.slice(0, targetCount);
    }

    // Standard / Topic practice
    let query = supabase.from('questions').select('*').eq('active', true);

    if (params.courseId) {
      query = query.ilike('course_id', `%${params.courseId}%`);
    }

    if (params.topicId && params.topicId !== 'all') {
      query = query.or(`topic_id.ilike.%${params.topicId}%,topic_id.eq.${params.topicId}`);
    }

    if (params.difficulty && params.difficulty !== 'todas') {
      query = query.ilike('difficulty', `%${params.difficulty}%`);
    }

    const { data, error } = await query.limit(Math.max(50, targetCount * 2));

    if (error) {
      console.error('[fetchQuestionsForSession error]', error);
    }

    if (data && data.length > 0) {
      return shuffleList(data.map(mapDbQuestion)).slice(0, targetCount);
    }

    // Fallback filter over cached bank
    let localFiltered = [...allQuestions];
    if (params.courseId) {
      localFiltered = localFiltered.filter(q => q.courseId === params.courseId);
    }
    if (params.topicId && params.topicId !== 'all') {
      localFiltered = localFiltered.filter(q => q.topicId === params.topicId);
    }

    return shuffleList(localFiltered).slice(0, targetCount);
  }, [allQuestions, mistakes, favoriteQuestionIds, mapDbQuestion]);

  const loadUserDataFromSupabase = async (userId: string) => {
    if (!isValidUUID(userId)) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        const { level, title } = calculateLevelInfo(profile.xp || 0);
        const assignedRole: UserRole = profile.role === 'admin' ? 'admin' : 'student';

        setUser(prev => ({
          ...prev,
          id: userId,
          nombre: profile.first_name || prev.nombre,
          apellido: profile.last_name || prev.apellido,
          xp: profile.xp || 0,
          nivel: level,
          tituloNivel: title,
          rachaActual: profile.current_streak || 0,
          mejorRacha: profile.best_streak || 0,
          rol: assignedRole,
          preferencias: {
            ...prev.preferencias,
            metaDiaria: profile.daily_goal || prev.preferencias.metaDiaria
          },
          suscripcion: {
            ...prev.suscripcion,
            planId: (profile.plan?.toLowerCase() as PlanId) || 'gratis'
          }
        }));
      }

      // Check for user pending subscription
      try {
        const { data: reqData } = await supabase
          .from('subscription_requests')
          .select('*')
          .eq('user_id', userId)
          .in('status', ['pendiente', 'pending'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (reqData) {
          setUserPendingRequest({
            id: reqData.id,
            userId: reqData.user_id,
            plan: reqData.plan as any,
            price: Number(reqData.price),
            operationNumber: reqData.operation_number || undefined,
            phoneNumber: reqData.phone_number || undefined,
            paymentProofUrl: reqData.payment_proof_url || undefined,
            status: 'pendiente',
            createdAt: reqData.created_at
          });
        } else {
          setUserPendingRequest(null);
        }
      } catch {
        // Table might be initializing
      }

      const { data: remoteSessions } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (remoteSessions && remoteSessions.length > 0) {
        const mappedSessions: PracticeSession[] = remoteSessions.map(s => {
          const course = COURSES.find(c => c.id === s.course_id);
          const topic = course?.temas.find(t => t.id === s.topic_id);
          return {
            id: s.id,
            userId: s.user_id,
            courseId: (s.course_id as CourseId) || undefined,
            courseName: course?.nombre || 'Simulacro Tipo Admisión',
            topicId: s.topic_id || undefined,
            topicName: topic?.nombre || (s.course_id ? 'Práctica General' : 'Multi-curso (8 Áreas)'),
            mode: (s.mode as any) || 'rapida',
            fecha: s.completed_at,
            duracionSegundos: s.duration_seconds || 0,
            totalPreguntas: s.total_questions || 0,
            correctas: s.correct_answers || 0,
            incorrectas: s.incorrect_answers || 0,
            porcentaje: Number(s.accuracy) || 0,
            xpGanado: s.xp_earned || 0,
            attempts: []
          };
        });
        setSessions(mappedSessions);
      }

      const { data: remoteFavorites } = await supabase
        .from('favorites')
        .select('question_id')
        .eq('user_id', userId);

      if (remoteFavorites) {
        setFavoriteQuestionIds(remoteFavorites.map(f => f.question_id));
      }

      const { data: userProgress } = await supabase
        .from('user_question_progress')
        .select('*')
        .eq('user_id', userId);

      if (userProgress && userProgress.length > 0) {
        const mappedMistakes: MistakeRecord[] = userProgress
          .filter(p => p.incorrect_count > 0)
          .map(p => ({
            questionId: p.question_id,
            fallosConsecutivos: p.incorrect_count,
            vecesAcertadaDespues: p.correct_count,
            dominada: !!p.mastered,
            ultimoIntento: p.last_answered_at
          }));
        setMistakes(mappedMistakes);
      }
    } catch (err) {
      console.error('[Supabase user data loading error]', err);
    }
  };

  useEffect(() => {
    fetchQuestionsFromSupabase();

    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          const meta = session.user.user_metadata || {};

          setUser(prev => ({
            ...prev,
            id: session.user.id,
            email: session.user.email || prev.email,
            emailVerificado: !!session.user.email_confirmed_at,
            nombre: meta.first_name || meta.nombre || prev.nombre || 'Estudiante',
            apellido: meta.last_name || meta.apellido || prev.apellido || 'Chuplingo',
            onboardingCompletado: true
          }));

          loadUserDataFromSupabase(session.user.id);
        }
      } catch (err) {
        console.error('[Supabase auth session error]', err);
      }
    };

    checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const meta = session.user.user_metadata || {};

        setUser(prev => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || prev.email,
          emailVerificado: !!session.user.email_confirmed_at,
          nombre: meta.first_name || meta.nombre || prev.nombre || 'Estudiante',
          apellido: meta.last_name || meta.apellido || prev.apellido || 'Chuplingo',
          onboardingCompletado: true
        }));

        loadUserDataFromSupabase(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        setUserPendingRequest(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchQuestionsFromSupabase]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(user));
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
      // Ignored
    }
  };

  const registerUser = async (data: { nombre: string; apellido: string; email: string; password: string }): Promise<boolean> => {
    const emailNorm = data.email.trim().toLowerCase();
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: emailNorm,
        password: data.password,
        options: {
          data: {
            first_name: data.nombre.trim(),
            last_name: data.apellido.trim(),
            full_name: `${data.nombre.trim()} ${data.apellido.trim()}`
          }
        }
      });

      if (error) {
        toast.error(error.message || 'Error al registrar la cuenta');
        return false;
      }

      const isConfirmed = !!authData.user?.email_confirmed_at;
      setUser(prev => ({
        ...prev,
        id: authData.user?.id || `user-${Date.now()}`,
        nombre: data.nombre.trim(),
        apellido: data.apellido.trim(),
        email: emailNorm,
        emailVerificado: isConfirmed,
        onboardingCompletado: true
      }));

      setIsAuthenticated(true);
      toast.success('¡Registro exitoso! Revisa tu correo de confirmación.');
      return true;
    } catch {
      toast.error('Ocurrió un problema de conexión al registrarse');
      return false;
    }
  };

  const loginUser = async (data: { email: string; password: string }): Promise<boolean> => {
    const emailNorm = data.email.trim().toLowerCase();
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: emailNorm,
        password: data.password
      });

      if (error) {
        toast.error(error.message || 'Correo o contraseña incorrectos');
        return false;
      }

      const meta = authData.user?.user_metadata || {};

      setUser(prev => ({
        ...prev,
        id: authData.user.id,
        email: authData.user.email || emailNorm,
        emailVerificado: !!authData.user.email_confirmed_at,
        nombre: meta.first_name || meta.nombre || prev.nombre || 'Estudiante',
        apellido: meta.last_name || meta.apellido || prev.apellido || 'Chuplingo',
        onboardingCompletado: true
      }));

      setIsAuthenticated(true);
      toast.success(`¡Bienvenido de nuevo, ${meta.first_name || 'Estudiante'}!`);
      return true;
    } catch {
      toast.error('Ocurrió un error al iniciar sesión');
      return false;
    }
  };

  const verifyUserEmail = async (email?: string) => {
    const targetEmail = email || user.email;
    setUser(prev => ({ ...prev, email: targetEmail, emailVerificado: true }));
    toast.success('¡Tu cuenta ha sido verificada correctamente!');
    triggerConfetti();
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    const emailNorm = email.trim().toLowerCase();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailNorm, {
        redirectTo: `${window.location.origin}/forgot-password`
      });

      if (error) {
        toast.error(error.message || 'Error al enviar enlace de recuperación');
        return false;
      }

      toast.success('Enlace de recuperación enviado. Revisa tu bandeja de entrada.');
      return true;
    } catch {
      toast.error('No se pudo procesar la recuperación de contraseña');
      return false;
    }
  };

  const resetUserPassword = async (email: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message || 'No se pudo restablecer la contraseña');
        return false;
      }

      toast.success('Contraseña actualizada con éxito');
      return true;
    } catch {
      toast.error('Error al actualizar contraseña');
      return false;
    }
  };

  const updateUserEmail = async (newEmail: string): Promise<boolean> => {
    const emailNorm = newEmail.trim().toLowerCase();
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailNorm
      });

      if (error) {
        toast.error(error.message || 'Error al actualizar el correo electrónico');
        return false;
      }

      setUser(prev => ({ ...prev, email: emailNorm, emailVerificado: false }));
      toast.success('Correo actualizado. Revisa el mensaje de verificación.');
      return true;
    } catch {
      toast.error('No se pudo actualizar el correo electrónico');
      return false;
    }
  };

  const updateUserPassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message || 'Error al cambiar contraseña');
        return false;
      }

      toast.success('Tu contraseña ha sido cambiada de forma segura');
      return true;
    } catch {
      toast.error('Error al actualizar contraseña');
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error on signOut', err);
    }
    setUser({ ...INITIAL_USER, onboardingCompletado: true });
    setUserPendingRequest(null);
    setIsAuthenticated(false);
    toast.info('Sesión cerrada');
  };

  const deleteUserAccount = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error deleting account session', err);
    }
    resetAllProgress();
    setIsAuthenticated(false);
    toast.success('Tu cuenta ha sido cerrada');
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

  // For Free Plan downgrade or initial setup
  const changeUserPlan = (planId: PlanId) => {
    if (planId === 'gratis') {
      setUser(prev => ({
        ...prev,
        suscripcion: {
          planId: 'gratis',
          estado: 'activa',
          fechaInicio: getTodayDateString(),
          fechaRenovacion: '2026-12-31'
        }
      }));

      if (isAuthenticated && isValidUUID(user.id)) {
        supabase.from('profiles').update({
          plan: 'GRATIS',
          updated_at: new Date().toISOString()
        }).eq('id', user.id);
      }

      toast.info('Has vuelto al Plan Gratis');
    }
  };

  // Submit Yape subscription request with proof support
  const submitSubscriptionRequest = async (params: {
    planId: 'FAN' | 'LOVER' | 'VIP';
    price: number;
    operationNumber?: string;
    phoneNumber?: string;
    proofFile?: File | null;
  }): Promise<boolean> => {
    if (!isAuthenticated || !isValidUUID(user.id)) {
      toast.error('Debes iniciar sesión para suscribirte');
      return false;
    }

    try {
      let proofUrl: string | undefined = undefined;

      if (params.proofFile) {
        const fileExt = params.proofFile.name.split('.').pop() || 'png';
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(filePath, params.proofFile, { upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('payment_proofs')
            .getPublicUrl(filePath);
          proofUrl = publicUrlData?.publicUrl;
        }
      }

      const { data, error } = await supabase
        .from('subscription_requests')
        .insert({
          user_id: user.id,
          plan: params.planId,
          price: params.price,
          operation_number: params.operationNumber || null,
          phone_number: params.phoneNumber || null,
          payment_proof_url: proofUrl || null,
          status: 'pendiente',
          created_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) {
        toast.error(`Error al enviar la solicitud: ${error.message}`);
        return false;
      }

      if (data) {
        setUserPendingRequest({
          id: data.id,
          userId: data.user_id,
          plan: data.plan as any,
          price: Number(data.price),
          operationNumber: data.operation_number || undefined,
          phoneNumber: data.phone_number || undefined,
          paymentProofUrl: data.payment_proof_url || undefined,
          status: 'pendiente',
          createdAt: data.created_at
        });
      }

      toast.success(`🎉 Solicitud enviada para el Plan ${params.planId}. Revisaremos tu pago Yape en breve.`);
      return true;
    } catch (err: any) {
      toast.error('Error al procesar la solicitud de suscripción');
      return false;
    }
  };

  // Admin: Fetch all subscription requests without foreign-key join issues
  const fetchAdminSubscriptionRequests = async (): Promise<SubscriptionRequest[]> => {
    try {
      const { data: reqs, error } = await supabase
        .from('subscription_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !reqs) {
        console.error('[fetchAdminSubscriptionRequests error]', error);
        return [];
      }

      // Collect user IDs to enrich profile details
      const userIds = Array.from(new Set(reqs.map(r => r.user_id).filter(Boolean)));
      const profileMap = new Map<string, { name: string }>();

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);

        if (profiles) {
          profiles.forEach(p => {
            const name = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Estudiante';
            profileMap.set(p.id, { name });
          });
        }
      }

      return reqs.map((item: any) => {
        const profile = profileMap.get(item.user_id);
        const normStatus = (item.status === 'approved' || item.status === 'aprobada')
          ? 'aprobada'
          : (item.status === 'rejected' || item.status === 'rechazada')
            ? 'rechazada'
            : 'pendiente';

        return {
          id: item.id,
          userId: item.user_id,
          plan: (item.plan || 'VIP').toUpperCase() as any,
          price: Number(item.price || 0),
          operationNumber: item.operation_number || undefined,
          phoneNumber: item.phone_number || undefined,
          paymentProofUrl: item.payment_proof_url || undefined,
          status: normStatus as any,
          rejectionReason: item.rejection_reason || undefined,
          createdAt: item.created_at,
          reviewedAt: item.reviewed_at || undefined,
          reviewedBy: item.reviewed_by || undefined,
          userName: profile?.name || `Usuario (${item.user_id.slice(0, 8)})`
        };
      });
    } catch (err) {
      console.error('[fetchAdminSubscriptionRequests exception]', err);
      return [];
    }
  };

  // Admin: Approve Request
  const approveSubscriptionRequest = async (requestId: string, targetUserId: string, plan: string, price: number): Promise<boolean> => {
    try {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      // 1. Update request status to 'approved' / 'aprobada'
      const { error: reqErr } = await supabase
        .from('subscription_requests')
        .update({
          status: 'aprobada',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', requestId);

      if (reqErr) {
        toast.error(`Error al actualizar solicitud: ${reqErr.message}`);
        return false;
      }

      // 2. Insert or update active subscriptions
      await supabase.from('subscriptions').insert({
        user_id: targetUserId,
        plan: plan.toUpperCase(),
        status: 'activa',
        price: price,
        started_at: new Date().toISOString(),
        renewal_date: nextMonth.toISOString(),
        provider: 'YAPE'
      });

      // 3. Update target user profile plan
      await supabase.from('profiles').update({
        plan: plan.toUpperCase(),
        updated_at: new Date().toISOString()
      }).eq('id', targetUserId);

      // If current active user is the target, update local state
      if (user.id === targetUserId) {
        setUser(prev => ({
          ...prev,
          suscripcion: {
            planId: plan.toLowerCase() as PlanId,
            estado: 'activa',
            fechaInicio: getTodayDateString(),
            fechaRenovacion: nextMonth.toISOString().split('T')[0],
            proveedor: 'YAPE'
          }
        }));
        setUserPendingRequest(null);
      }

      toast.success(`✓ Suscripción para el Plan ${plan} aprobada y activada con éxito`);
      return true;
    } catch (err: any) {
      toast.error('Error al aprobar suscripción');
      return false;
    }
  };

  // Admin: Reject Request
  const rejectSubscriptionRequest = async (requestId: string, reason?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('subscription_requests')
        .update({
          status: 'rechazada',
          rejection_reason: reason || 'Pago no verificado',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', requestId);

      if (error) {
        toast.error(`Error: ${error.message}`);
        return false;
      }

      if (userPendingRequest?.id === requestId) {
        setUserPendingRequest(null);
      }

      toast.info('Solicitud rechazada');
      return true;
    } catch {
      return false;
    }
  };

  const recordSession = async (sessionData: Omit<PracticeSession, 'id' | 'userId' | 'fecha' | 'xpGanado'>): Promise<PracticeSession> => {
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

    // Save session, attempts, and profile to Supabase if authenticated with valid UUID
    if (isAuthenticated && isValidUUID(user.id)) {
      try {
        const { data: dbSession } = await supabase
          .from('practice_sessions')
          .insert({
            user_id: user.id,
            course_id: sessionData.courseId || null,
            topic_id: sessionData.topicId || null,
            mode: sessionData.mode,
            total_questions: sessionData.totalPreguntas,
            correct_answers: sessionData.correctas,
            incorrect_answers: sessionData.incorrectas,
            accuracy: sessionData.porcentaje,
            duration_seconds: sessionData.duracionSegundos,
            xp_earned: sessionXP,
            completed_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (dbSession?.id && sessionData.attempts.length > 0) {
          const attemptPayloads = sessionData.attempts.map(att => ({
            user_id: user.id,
            session_id: dbSession.id,
            question_id: att.questionId,
            selected_answer: att.respuestaSeleccionada,
            is_correct: att.esCorrecta,
            time_seconds: att.tiempoSegundos
          }));

          await supabase.from('attempts').insert(attemptPayloads);

          // Update user question progress in Supabase
          for (const att of sessionData.attempts) {
            const { data: existingProg } = await supabase
              .from('user_question_progress')
              .select('*')
              .match({ user_id: user.id, question_id: att.questionId })
              .maybeSingle();

            if (existingProg) {
              await supabase
                .from('user_question_progress')
                .update({
                  times_answered: (existingProg.times_answered || 0) + 1,
                  correct_count: (existingProg.correct_count || 0) + (att.esCorrecta ? 1 : 0),
                  incorrect_count: (existingProg.incorrect_count || 0) + (att.esCorrecta ? 0 : 1),
                  mastered: att.esCorrecta && (existingProg.correct_count || 0) >= 1,
                  last_answered_at: new Date().toISOString()
                })
                .match({ user_id: user.id, question_id: att.questionId });
            } else {
              await supabase
                .from('user_question_progress')
                .insert({
                  user_id: user.id,
                  question_id: att.questionId,
                  times_answered: 1,
                  correct_count: att.esCorrecta ? 1 : 0,
                  incorrect_count: att.esCorrecta ? 0 : 1,
                  mastered: false,
                  last_answered_at: new Date().toISOString()
                });
            }
          }
        }

        await supabase
          .from('profiles')
          .update({
            xp: newXP,
            level: newLevel,
            current_streak: newStreak,
            best_streak: newBestStreak,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } catch (err) {
        console.error('Error saving practice session to Supabase', err);
      }
    }

    return newSession;
  };

  const toggleFavorite = (questionId: string): boolean => {
    let isFav = false;
    setFavoriteQuestionIds(prev => {
      if (prev.includes(questionId)) {
        isFav = false;
        toast.info('Pregunta eliminada de favoritos');

        if (isAuthenticated && isValidUUID(user.id)) {
          supabase.from('favorites').delete().match({ user_id: user.id, question_id: questionId });
        }

        return prev.filter(id => id !== questionId);
      } else {
        isFav = true;
        toast.success('⭐ Pregunta guardada en tus favoritos');

        if (isAuthenticated && isValidUUID(user.id)) {
          supabase.from('favorites').insert({ user_id: user.id, question_id: questionId });
        }

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

    if (isAuthenticated && isValidUUID(user.id) && prefs.metaDiaria) {
      supabase.from('profiles').update({ daily_goal: prefs.metaDiaria }).eq('id', user.id);
    }

    toast.success('Preferencias guardadas');
  };

  const updateUserName = (name: string, lastName?: string) => {
    if (!name.trim()) return;
    const finalLastName = lastName !== undefined ? lastName.trim() : user.apellido;
    setUser(prev => ({ 
      ...prev, 
      nombre: name.trim(),
      apellido: finalLastName 
    }));

    if (isAuthenticated && isValidUUID(user.id)) {
      supabase.from('profiles').update({
        first_name: name.trim(),
        last_name: finalLastName,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
    }

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

    if (isAuthenticated && isValidUUID(user.id)) {
      supabase.from('profiles').update({
        xp: newXP,
        level: newLevel,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
    }

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
    setAllQuestions([]);
    setUserPendingRequest(null);
    toast.info('Se han restablecido todos los datos locales');
  };

  const addQuestionToBank = async (newQ: Omit<Question, 'id'>): Promise<Question | null> => {
    if (user.rol !== 'admin') {
      toast.error('Operación no autorizada: requiere privilegios de administrador');
      return null;
    }

    try {
      const payload = {
        course_id: newQ.courseId,
        topic_id: newQ.topicId || null,
        subtopic: newQ.subtopic || null,
        difficulty: newQ.dificultad || 'intermedio',
        question_type: newQ.questionType || 'multiple_choice',
        question: newQ.pregunta,
        option_a: newQ.alternativas.find(a => a.id === 'A')?.text || '',
        option_b: newQ.alternativas.find(a => a.id === 'B')?.text || '',
        option_c: newQ.alternativas.find(a => a.id === 'C')?.text || '',
        option_d: newQ.alternativas.find(a => a.id === 'D')?.text || '',
        option_e: newQ.alternativas.find(a => a.id === 'E')?.text || '',
        correct_answer: newQ.respuestaCorrecta,
        explanation: newQ.explicacion || null,
        source_document: newQ.sourceDocument || null,
        source_page: newQ.sourcePage || null,
        origin: newQ.origin || newQ.fuente || 'Banco Chuplingo',
        official_exam_question: false,
        active: true
      };

      const { data, error } = await supabase
        .from('questions')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        toast.error(`Error de Supabase: ${error.message}`);
        return null;
      }

      const mapped = mapDbQuestion(data);
      setAllQuestions(prev => [mapped, ...prev]);
      toast.success('Pregunta guardada exitosamente en Supabase');
      return mapped;
    } catch (err: any) {
      toast.error('Error al guardar pregunta en la base de datos');
      return null;
    }
  };

  const deleteQuestionFromBank = async (id: string): Promise<boolean> => {
    if (user.rol !== 'admin') {
      toast.error('Operación no autorizada: requiere privilegios de administrador');
      return false;
    }

    try {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) {
        toast.error(`Error al eliminar: ${error.message}`);
        return false;
      }
      setAllQuestions(prev => prev.filter(q => q.id !== id));
      toast.success('Pregunta eliminada de Supabase');
      return true;
    } catch {
      return false;
    }
  };

  const importQuestionsBatch = async (batchQuestions: any[]): Promise<number> => {
    if (user.rol !== 'admin') {
      toast.error('Operación no autorizada: requiere privilegios de administrador');
      return 0;
    }

    try {
      if (!Array.isArray(batchQuestions) || batchQuestions.length === 0) {
        toast.error('El lote no contiene registros válidos');
        return 0;
      }

      const payloads = batchQuestions.map(q => ({
        id: q.id || undefined,
        course_id: q.course_id || q.courseId,
        topic_id: q.topic_id || q.topicId || null,
        subtopic: q.subtopic || null,
        difficulty: (q.difficulty || q.dificultad || 'intermedio').toLowerCase(),
        question_type: q.question_type || q.questionType || 'completar_enunciado',
        question: q.question || q.pregunta,
        option_a: q.option_a || q.alternativas?.find((a: any) => a.id === 'A')?.text || '',
        option_b: q.option_b || q.alternativas?.find((a: any) => a.id === 'B')?.text || '',
        option_c: q.option_c || q.alternativas?.find((a: any) => a.id === 'C')?.text || '',
        option_d: q.option_d || q.alternativas?.find((a: any) => a.id === 'D')?.text || '',
        option_e: q.option_e || q.alternativas?.find((a: any) => a.id === 'E')?.text || '',
        correct_answer: (q.correct_answer || q.respuestaCorrecta || 'A').toUpperCase().trim(),
        explanation: q.explanation || q.explicacion || '',
        source_document: q.source_document || q.sourceDocument || null,
        source_page: q.source_page || q.sourcePage || null,
        origin: q.origin || q.fuente || 'pregunta_generada_a_partir_del_contenido_fuente',
        official_exam_question: false,
        active: true
      })).filter(p => p.course_id && p.question && p.option_a && p.option_b && p.option_c && p.option_d && p.option_e && p.correct_answer);

      if (payloads.length === 0) {
        toast.error('No se encontraron preguntas con la estructura requerida');
        return 0;
      }

      const { data, error } = await supabase
        .from('questions')
        .upsert(payloads, { onConflict: 'id' });

      if (error) {
        toast.error(`Error al insertar en Supabase: ${error.message}`);
        return 0;
      }

      await fetchQuestionsFromSupabase();
      toast.success(`🎉 ¡Se importaron exitosamente ${data?.length || payloads.length} preguntas en Supabase!`);
      return data?.length || payloads.length;
    } catch (err: any) {
      toast.error('Ocurrió un error durante la importación en lote');
      return 0;
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.info('Notificaciones limpiadas');
  };

  const getCourseProgress = (courseId: CourseId) => {
    const courseSessions = sessions.filter(s => s.courseId === courseId);
    if (courseSessions.length === 0) {
      return { accuracy: 0, questionsAnswered: 0, masteryPercent: 0, completedTopicsCount: 0 };
    }

    const totalQuestions = courseSessions.reduce((acc, s) => acc + s.totalPreguntas, 0);
    const totalCorrect = courseSessions.reduce((acc, s) => acc + s.correctas, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

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
        isLoadingQuestions,
        courseQuestionCounts,
        topicQuestionCounts,
        userPendingRequest,
        fetchQuestionsForSession,
        fetchQuestionsFromSupabase,
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
        submitSubscriptionRequest,
        fetchAdminSubscriptionRequests,
        approveSubscriptionRequest,
        rejectSubscriptionRequest,
        claimChallengeReward,
        resetAllProgress,
        completeOnboarding,
        addQuestionToBank,
        deleteQuestionFromBank,
        importQuestionsBatch,
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