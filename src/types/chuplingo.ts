export type CourseId = 
  | 'literatura' 
  | 'psicologia' 
  | 'geografia' 
  | 'razonamiento-verbal' 
  | 'civica' 
  | 'filosofia' 
  | 'ingles' 
  | 'biologia';

export type UniversityTarget = 
  | 'todas' 
  | 'unmsm' 
  | 'uni' 
  | 'unsa' 
  | 'unfv' 
  | 'unsaac' 
  | 'unac' 
  | 'pucp';

export type PracticeMode = 'rapida' | 'estandar' | 'intensiva' | 'errores' | 'favoritos' | 'simulacro' | 'tema';

export type QuestionDifficulty = 'basico' | 'intermedio' | 'avanzado';

export type PlanId = 'gratis' | 'fan' | 'lover' | 'vip';

export type UserRole = 'student' | 'admin';

export type AvatarId = 
  | 'parrot-classic' 
  | 'parrot-scholar' 
  | 'parrot-champion' 
  | 'parrot-scientist' 
  | 'parrot-cool' 
  | 'parrot-vip' 
  | 'parrot-explorer' 
  | 'parrot-artist';

export interface Alternative {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface Question {
  id: string;
  courseId: CourseId;
  topicId?: string | null;
  topicName?: string;
  subtopic?: string | null;
  pregunta: string;
  alternativas: Alternative[];
  respuestaCorrecta: 'A' | 'B' | 'C' | 'D' | 'E';
  explicacion: string;
  fuente?: string | null;
  sourceDocument?: string | null;
  sourcePage?: string | null;
  origin?: string | null;
  officialExamQuestion?: boolean;
  questionType?: string;
  dificultad: QuestionDifficulty;
  universityTag?: string;
  active?: boolean;
  tags?: string[];
}

export interface Topic {
  id: string;
  courseId: CourseId;
  numero: number;
  nombre: string;
  descripcion: string;
  totalPreguntas: number;
}

export interface Course {
  id: CourseId;
  nombre: string;
  descripcion: string;
  icono: string;
  colorHex: string;
  bgGradient: string;
  accentColor: string;
  temas: Topic[];
}

export interface QuestionAttempt {
  questionId: string;
  courseId?: CourseId;
  topicId?: string;
  respuestaSeleccionada: 'A' | 'B' | 'C' | 'D' | 'E';
  esCorrecta: boolean;
  tiempoSegundos: number;
  fecha: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  courseId?: CourseId;
  courseName: string;
  topicId?: string;
  topicName?: string;
  mode: PracticeMode;
  fecha: string;
  duracionSegundos: number;
  totalPreguntas: number;
  correctas: number;
  incorrectas: number;
  porcentaje: number;
  xpGanado: number;
  isSimulacro?: boolean;
  attempts: QuestionAttempt[];
}

export interface MistakeRecord {
  questionId: string;
  courseId?: CourseId;
  topicId?: string;
  fallosConsecutivos: number;
  vecesAcertadaDespues: number;
  dominada: boolean;
  ultimoIntento: string;
}

export type ChallengeType = 'tests_completed' | 'questions_answered' | 'accuracy_target' | 'courses_practiced' | 'streak_days';

export interface Challenge {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  tipo: ChallengeType;
  meta: number;
  recompensaXP: number;
  periodo: 'diario' | 'semanal';
  reclamado?: boolean;
}

export interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: 'racha' | 'preguntas' | 'precision' | 'cursos' | 'especial';
  requisitoValor: number;
  desbloqueadoEn?: string;
}

export interface NotificationItem {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'racha' | 'desafio' | 'logro' | 'sistema' | 'suscripcion';
  leido: boolean;
  fecha: string;
  actionUrl?: string;
}

export interface UserPreferences {
  metaDiaria: number;
  horarioEstudio: string;
  cursosFavoritos: CourseId[];
  sonido: boolean;
  vibracion: boolean;
  recordatorios: boolean;
  temaOscuro: boolean;
  notificaciones: {
    metaDiaria: boolean;
    rachaEnRiesgo: boolean;
    desafios: boolean;
    logros: boolean;
    resumenSemanal: boolean;
    promocionales: boolean;
  };
}

export interface SubscriptionInfo {
  planId: PlanId;
  estado: 'activa' | 'cancelada' | 'pendiente';
  fechaInicio: string;
  fechaRenovacion: string;
  proveedor?: string;
  transaccionId?: string;
}

export interface SubscriptionRequest {
  id: string;
  userId: string;
  plan: 'GRATIS' | 'FAN' | 'LOVER' | 'VIP';
  price: number;
  operationNumber?: string;
  phoneNumber?: string;
  paymentProofUrl?: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  userEmail?: string;
  userName?: string;
}

export interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  emailVerificado: boolean;
  avatar: string;
  creadoEn: string;
  suscripcion: SubscriptionInfo;
  xp: number;
  nivel: number;
  tituloNivel: string;
  rachaActual: number;
  mejorRacha: number;
  ultimaFechaRacha: string;
  preguntasRespondidasHoy: number;
  fechaPreguntasHoy: string;
  metaDiariaCumplidaHoy: boolean;
  preferencias: UserPreferences;
  onboardingCompletado: boolean;
  rol: UserRole;
}

export interface PlanConfig {
  id: PlanId;
  nombre: string;
  subtitulo: string;
  precio: number;
  periodo: string;
  colorHex: string;
  badge?: string;
  beneficios: string[];
  destacado?: boolean;
}